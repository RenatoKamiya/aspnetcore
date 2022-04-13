using FGV.PISA.Application.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
		
namespace FGV.PISA.Application.Common
{
	public interface IUsuario
	{
		Task<int> Create(Usuario usuario);
	
		void Update(Usuario usuario);
	
		void Delete(int Id);
	
		Task<Usuario> GetById(int Id);
	
		Task<List<Usuario>> GetByEscola (int IdEscola);
	
		Task<Usuario> GetHierarchy(int Id);

		Task<Usuario> Login(string cpf, string senha);

		Task<Usuario> LoginEnem(string cpf, string senha);

	}

}
