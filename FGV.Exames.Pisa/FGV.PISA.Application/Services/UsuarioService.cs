using FGV.PISA.Application.Common;
using FGV.PISA.Application.Model;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FGV.PISA.Application.Services
{
    
    public class UsuarioService: IUsuarioService
    {
        private readonly IUsuario _usuario;
        private readonly IUsuarios_funcoes _usuarios_Funcoes;
        private readonly IFuncoes _funcao;
        private readonly IExames_pisa _exame;
        private readonly  IConfiguration _configuration;
        private readonly IMenu _menu;
        public UsuarioService(IUsuario usuario, IUsuarios_funcoes usuarios_Funcoes, IMenu menu, IFuncoes funcao, IExames_pisa exame, IConfiguration configuration)
        {
            _usuario = usuario;
            _configuration = configuration;
            _usuarios_Funcoes = usuarios_Funcoes;
            _menu = menu;
            _funcao = funcao;
            _exame = exame;
        }

        public async Task<UsuarioLogado> Login(string cpf, string senha)
        {
            UsuarioLogado usuarioLogado = new UsuarioLogado();
            var user = await _usuario.LoginEnem(cpf, senha);
            if (user == null)
                return usuarioLogado;

            user.Ativo = true;

            if (user != null)
            {
                usuarioLogado.Usuario = user;
                var funcao = await _funcao.GetById(1);
                var exame = await _exame.GetById(1);
                var usuarioFuncao = new Usuarios_funcoes
                {
                    Ativo = true,
                    DataAtualizacao = user.DataAtualizacao,
                    DataCriacao = user.DataCriacao,
                    exames_pisa_id = exame.Id,
                    Exames_Pisa = exame,
                    Funcao = funcao,
                    funcao_id = funcao.Id,
                    Id = user.Id,
                    usuario_id = user.Id,
                    Usuario = new Usuario
                    {
                        Ativo = true,
                        Cpf = user.Cpf,
                        DataAtualizacao = user.DataAtualizacao,
                        DataCriacao = user.DataCriacao,
                        Email = user.Email,
                        Id = user.Id,
                        Nome = user.Nome,
                        Senha = user.Senha,
                        Telefone = user.Telefone,
                        Escola = new Escola(),
                        id_escola = 0,
                        Resultado = new List<Resultado>()
                    }
                };

                var func = usuarioFuncao;
                if (func != null)
                {
                    usuarioLogado.Usuarios_Funcoes = func;
                    var menus = _menu.GetMenus(func.exames_pisa_id, func.funcao_id);
                    if(menus != null)
                    {
                        usuarioLogado.Menus = menus.ToList();
                    }
                }
            }

            return usuarioLogado;
        }

    }
}
