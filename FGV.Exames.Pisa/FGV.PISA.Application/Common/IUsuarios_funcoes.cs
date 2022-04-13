using FGV.PISA.Application.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
		
namespace FGV.PISA.Application.Common
{
	public interface IUsuarios_funcoes
	{
		Task<int> Create(Usuarios_funcoes usuarios_funcoes);
	
		void Update(Usuarios_funcoes usuarios_funcoes);
	
		void Delete(int Id);
	
		Task<Usuarios_funcoes> GetById(int Id);

		Task<Usuarios_funcoes> GetByIdUsuario(int IdUsuario);
	}

}
