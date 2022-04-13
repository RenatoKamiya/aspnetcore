using FGV.PISA.Application.Common;
using FGV.PISA.Application.Model;
using FGV.PISA.CrossCutting.Common;
using FGV.PISA.Web.Helpers;
using FGV.PISA.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Text;

namespace FGV.PISA.Web.Controllers
{
    public class EnviarExamesController : BaseController
    {
        private readonly IResultado _resultadoExame;
        private readonly IAluno _alunoData;
        private readonly IValorAtributo _valorAtributo;
        private readonly IArquivos _arquivos;
        private readonly IEscola _escola;
        private readonly ICloudStorage _cloudStorage;
        public EnviarExamesController(IConfiguration configuration,
            IResultado resultado,
            IAluno alunoData,
            IArquivos arquivos,
            IEscola escola,
            IValorAtributo valorAtributo,
            ICloudStorage cloudStorage) : base(configuration)
        {
            _resultadoExame = resultado;
            _alunoData = alunoData;
            _valorAtributo = valorAtributo;
            _arquivos = arquivos;
            _escola = escola;
            _cloudStorage = cloudStorage;
        }
        public IActionResult Index()
        {
            var ChaveValor = _valorAtributo.GetByChave("RegexFilename").GetAwaiter().GetResult();
            ResultadosViewModel resultado = new ResultadosViewModel();
            resultado.id_usuario = base.UsuarioLogado.Usuario.Id.ToString();
            ViewBag.NomeUsuario = base.UsuarioLogado.Usuario.Nome;
            ViewBag.RegexFile = ChaveValor.Valor;
            base.PreencherDropDownExames().Wait();
            return View(resultado);
        }

        public IActionResult ListaPresenca()
        {
            base.PreencherDropDownExames().Wait();
            base.PreencherDropEscola().Wait();
            ViewBag.UsuarioId = base.UsuarioLogado.Usuario.Id.ToString();
            ViewBag.NomeUsuario = base.UsuarioLogado.Usuario.Nome;
            return View();
        }

        [HttpPost]
        public IActionResult GravarResultados(UploadArquivosAlunosViewModel uploadView)
        {
            if (uploadView.Files == null)
                return Json(new { error = true, message = $"Upload de arquivos é obrigatório." });

            var alunosArquivo = ExtrairAlunoDoArquivo(uploadView.Files);
            var alunosListaPresencaPresente = ExtrairAlunoListaPresencaComoPresente(uploadView.Alunos);
            var alunosListaPresencaAusente = ExtrairAlunoListaPresencaComoAusente(uploadView.Alunos);
            var msg = ValidarPresentes(alunosListaPresencaPresente, alunosArquivo);
            var msg2 = ValidarAusentes(alunosListaPresencaAusente, alunosArquivo);

            if (msg != "" || msg2 != "")
                return Json(new { error = true, message = $"{msg} {msg2}" });

            StringBuilder sb = new StringBuilder();
            var ChaveValor = _valorAtributo.GetByChaveList(new List<string> { "RegexFilename", "FieldsCampo" }).GetAwaiter().GetResult();
            var data = JsonConvert.DeserializeObject<ResultadosViewModel>(Request.Form["resultadosViewModel"]);
            CamposArquivo extrairDados = JsonConvert.DeserializeObject<CamposArquivo>(ChaveValor["FieldsCampo"]);
            foreach (var arquivo in uploadView.Files)
            {
                try
                {
                    using (var ms = new MemoryStream())
                    {
                        arquivo.CopyTo(ms);
                        var upload = new UploadFile();
                        NameValueCollection fieldsArquivo = new NameValueCollection();
                        var nomeArquivo = Path.GetFileName(arquivo.FileName);

                        if (!string.IsNullOrEmpty(ChaveValor["FieldsCampo"]))
                        {
                            if (extrairDados.Estudante != null)
                                extrairDados.Estudante.Valor = nomeArquivo.Substring(extrairDados.Estudante.Start, extrairDados.Estudante.End);
                            if (extrairDados.Pais != null)
                                extrairDados.Pais.Valor = nomeArquivo.Substring(extrairDados.Pais.Start, extrairDados.Pais.End);
                            if (extrairDados.Escola != null)
                                extrairDados.Escola.Valor = nomeArquivo.Substring(extrairDados.Escola.Start, extrairDados.Escola.End);
                            if (extrairDados.Caderno != null)
                                extrairDados.Caderno.Valor = nomeArquivo.Substring(extrairDados.Caderno.Start, extrairDados.Caderno.End);
                            if (extrairDados.Session != null)
                                extrairDados.Session.Valor = nomeArquivo.Substring(extrairDados.Session.Start, extrairDados.Session.End);
                        }

                        //var retorno = upload.CarregarAsync(ms, null, nomeArquivo, Config.S3BucketName, true).GetAwaiter().GetResult();
                        string urlFileUploaded = _cloudStorage.UploadFileAsync(arquivo, nomeArquivo);
                        var dadoEscola = _escola.GetByCodigo(extrairDados.Escola.Valor).GetAwaiter().GetResult();

                        Resultado novo = new Resultado();
                        novo.id_usuario = Convert.ToInt32(data.id_usuario);
                        novo.exames_pisa_id = Convert.ToInt32(data.exames_pisa_id);
                        novo.Data_Envio = DateTimeBrasilia.Now();
                        novo.Data_Avaliacao = DateTimeBrasilia.Now();
                        if (dadoEscola != null)
                        {
                            var dadoAluno = _alunoData.GetByCodigoEscola(extrairDados.Estudante.Valor, dadoEscola.Id);
                            if (dadoAluno != null)
                                novo.id_aluno = dadoAluno.Id;
                        }

                        int idResultado = _resultadoExame.Create(novo).GetAwaiter().GetResult();

                        Arquivos newArquivo = new Arquivos();
                        newArquivo.id_Resultado = idResultado;
                        newArquivo.NomeArquivo = nomeArquivo;
                        newArquivo.URLArquivo = urlFileUploaded;//urlFileUploaded;//retorno;

                        newArquivo.Pais = extrairDados.Pais != null ? extrairDados.Pais.Valor : null;
                        newArquivo.Escola = extrairDados.Escola != null ? extrairDados.Escola.Valor : null;
                        newArquivo.Estrato = extrairDados.Caderno != null ? extrairDados.Caderno.Valor : null;
                        newArquivo.Estudante = extrairDados.Estudante != null ? extrairDados.Estudante.Valor : null;
                        _arquivos.Create(newArquivo);
                    }
                }
                catch (Exception ex)
                {
                    if (sb.Length == 0)
                        sb.Append("O(s) arquivos não foram importado(s):");

                    sb.AppendLine(string.Format("{0}", Path.GetFileName(arquivo.FileName)));

                    return Json(new { error = true, message = $"{sb.ToString()} - {ex.Message}" });
                }
            }

            try
            {
                var listaInserted = _alunoData.InserirPresenca(alunosListaPresencaPresente);
                var erroInserted = listaInserted ? "ERRO AO INSERIR LISTA PRESENÇA" : "";

                if (listaInserted != true)
                    return Json(new { error = true, message = $"Ocorreu um erro no upload dos arquivos. {erroInserted}" });
                else
                    return Json(new { error = false, message = "" });
            }
            catch (Exception ex)
            {
                return Json(new { error = true, message = $"ERRO AO INSERIR LISTA PRESENÇA - {ex.Message}" });
            }
        }
        private List<Aluno> ExtrairAlunoDoArquivo(List<IFormFile> arquivos)
        {
            var ChaveValor = _valorAtributo.GetByChaveList(new List<string> { "RegexFilename", "FieldsCampo" }).GetAwaiter().GetResult();
            CamposArquivo extrairDados = JsonConvert.DeserializeObject<CamposArquivo>(ChaveValor["FieldsCampo"]);
            var alunos = new List<Aluno>();
            var alunosBd = _alunoData.BuscarTodosAlunos();

            foreach (var arquivo in arquivos)
            {
                var nomeArquivo = Path.GetFileName(arquivo.FileName);

                if (!string.IsNullOrEmpty(ChaveValor["FieldsCampo"]))
                {
                    if (extrairDados.Estudante != null)
                    {
                        extrairDados.Estudante.Valor = nomeArquivo.Substring(extrairDados.Estudante.Start, extrairDados.Estudante.End);
                        var aluno = alunosBd.Where(t => t.Codigo.Trim().ToLower().Equals(extrairDados.Estudante.Valor.Trim().ToLower())).FirstOrDefault();
                        if (aluno != null)
                            alunos.Add(aluno);

                    }
                }

            }
            return alunos.Distinct().ToList();
        }

        private List<Aluno> ExtrairAlunoListaPresencaComoPresente(List<AlunosViewModel> vm)
        {
            var listaAlunos = new List<Aluno>();
            if (vm == null)
                return listaAlunos;

            var alunosBd = _alunoData.BuscarTodosAlunos();

            foreach (var item in vm.Where(t => t.Presente.Equals(true)))
            {
                var aluno = alunosBd.Where(t => t.Id == item.Id).FirstOrDefault();
                if (aluno != null)
                    listaAlunos.Add(aluno);
            }
            return listaAlunos;
        }

        private List<Aluno> ExtrairAlunoListaPresencaComoAusente(List<AlunosViewModel> vm)
        {
            var listaAlunos = new List<Aluno>();
            if (vm == null)
                return listaAlunos;

            var alunosBd = _alunoData.BuscarTodosAlunos();

            foreach (var item in vm.Where(t => t.Presente.Equals(false)))
            {
                var aluno = alunosBd.Where(t => t.Id == item.Id).FirstOrDefault();
                if (aluno != null)
                    listaAlunos.Add(aluno);
            }
            return listaAlunos;
        }

        private string ValidarPresentes(List<Aluno> alunosMarcadosPresente, List<Aluno> alunosArquivoUpload)
        {
            var msg = "";
            var msgPadrao = "Alunos marcados como presentes mas não constam nos arquivos do upload: ";
            foreach (var item in alunosMarcadosPresente)
            {
                var aluno = alunosArquivoUpload.FirstOrDefault(t => t.Codigo == item.Codigo);
                if (aluno == null)
                    msg = msg + $"[{item.Nome}]; ";
            }

            if (msg != "")
                msg = msgPadrao + msg;

            return msg;
        }

        private string ValidarAusentes(List<Aluno> alunosMarcadosAusentes, List<Aluno> alunosArquivoUpload)
        {
            var msg = "";
            var msgPadrao = "Alunos marcados como ausentes mas constam nos arquivos do upload: ";
            foreach (var item in alunosMarcadosAusentes)
            {
                var aluno = alunosArquivoUpload.FirstOrDefault(t => t.Codigo == item.Codigo);
                if (aluno != null)
                    msg = msg + $"[{item.Nome}]; ";
            }

            if (msg != "")
                msg = msgPadrao + msg;

            return msg;
        }
    }
}
