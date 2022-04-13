using FGV.PISA.Application.Common;
using FGV.PISA.Application.Model;
using FGV.PISA.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace FGV.PISA.Web.Controllers
{
    public class ConsultarExamesController : BaseController
    {
        private readonly IResultado _buscaresultado;
        private readonly IAluno _aluno;
        public ConsultarExamesController(IConfiguration configuration, IResultado buscaresultado, IAluno aluno) : base(configuration) 
        {
            _buscaresultado = buscaresultado;
            _aluno = aluno;
        }
        public IActionResult Index()
        {
            base.PreencherDropDownExames().Wait();
            base.PreencherDropEscola().Wait();
            List<AlunoModel> alunoModels = new List<AlunoModel>();
            var listAlunos = new SelectList(alunoModels, "Id", "Nome");
            ViewBag.DropDownAlunos = listAlunos;
            return View();
        }

        [HttpPost]
        public ActionResult GetResultadoConsulta(FiltroConsultarExamesModel filtros)
        {
            if (filtros != null)
            {

                var resultado = _buscaresultado.GetResultadosExames(filtros.IdExame, 0, filtros.IdEscola, filtros.IdAluno, 
                                    string.IsNullOrEmpty(filtros.DataInicial) ? null : Convert.ToDateTime(filtros.DataInicial, new CultureInfo("pt-BR")),
                                    string.IsNullOrEmpty(filtros.DataFinal) ? null : Convert.ToDateTime(filtros.DataFinal,new CultureInfo("pt-BR"))).GetAwaiter().GetResult();

                PaginacaoModel paginacaoModel = new PaginacaoModel();
                if (resultado != null)
                {
                    paginacaoModel.RecordsFiltered = resultado.TotalRegistrosRetornados;
                    paginacaoModel.RecordsTotal = resultado.TotalRegistrosRetornados;
                    paginacaoModel.Data = resultado.ListRegistros;
                }
                else
                {
                    paginacaoModel.Data = new List<RelResultadoExames>();
                }

                return Json(paginacaoModel);
            }
            else
                return Json(new PaginacaoModel());

        }

        [HttpGet]
        public JsonResult GetAlunosEscola(int idEscola)
        {
            List<AlunoModel> ListAlunos = _aluno.GetByEscola(idEscola).GetAwaiter().GetResult().Select(s=> new AlunoModel { Id = s.Id, Nome = s.Nome, Codigo = s.Codigo, CodigoNome = string.Format("{0} - {1}", s.Codigo, s.Nome), Presente = s.Presente }).ToList();
            return Json(ListAlunos.OrderBy(s=>s.CodigoNome).ToList());
        }

        [HttpGet]
        public JsonResult GetAlunosEscolaListaPresenca(int idEscola)
        {
            List<AlunoModel> ListAlunos = _aluno.GetByEscolaListaPresenca(idEscola).GetAwaiter().GetResult().Select(s => new AlunoModel { Id = s.Id, Nome = s.Nome, Codigo = s.Codigo, CodigoNome = string.Format("{0} - {1}", s.Codigo, s.Nome), Presente = s.Presente.HasValue ? s.Presente : false }).ToList();
            return Json(ListAlunos.OrderBy(s => s.CodigoNome).ToList());
        }
    }
}
