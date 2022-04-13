using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FGV.PISA.Application.Model
{
    public class UsuarioLogado
    {
        public virtual Usuario Usuario {get;set;}

        public virtual Usuarios_funcoes Usuarios_Funcoes { get; set; }

        public virtual List<Menu> Menus { get; set; } = new List<Menu>();

    }
}
