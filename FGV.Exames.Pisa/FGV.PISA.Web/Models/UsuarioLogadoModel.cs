using FGV.PISA.Application.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Models
{
    public class UsuarioLogadoModel
    {
        public UsuarioModel Usuario { get; set; }
        public UsuarioFuncaoModel UsuarioFuncao { get; set; }

        public ExamePisaModel ExamePisa { get; set; }

        public List<MenuViewModel> Menus { get; set; } = new List<MenuViewModel>();


        public UsuarioLogadoModel() {
            Usuario = new UsuarioModel();
            UsuarioFuncao = new UsuarioFuncaoModel();
            ExamePisa = new ExamePisaModel();
            Menus = new List<MenuViewModel>();
        }

        public UsuarioLogadoModel(UsuarioLogado dados)
        {
            if (dados.Usuario != null)
            {
                this.Usuario = new UsuarioModel(dados.Usuario);
                this.ExamePisa = new ExamePisaModel(dados.Usuarios_Funcoes.Exames_Pisa);
                this.UsuarioFuncao = new UsuarioFuncaoModel(dados.Usuarios_Funcoes);
                this.Menus = new List<MenuViewModel>();
                foreach (var item in dados.Menus)
                {
                    MenuViewModel menuView = new MenuViewModel(item);
                    this.Menus.Add(menuView);
                }
            }
        }

    }
}
