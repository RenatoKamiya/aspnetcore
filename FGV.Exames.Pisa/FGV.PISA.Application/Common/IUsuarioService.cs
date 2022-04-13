using FGV.PISA.Application.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FGV.PISA.Application.Common
{
    public interface IUsuarioService
    {
		Task<UsuarioLogado> Login(string cpf, string senha);
	}
}
