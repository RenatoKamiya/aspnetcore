using FGV.PISA.Application.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
		
namespace FGV.PISA.Application.Common
{
	public interface IFuncoes_menu
	{
		Task<int> Create(Funcoes_menu funcoes_menu);
	
		void Update(Funcoes_menu funcoes_menu);
	
		void Delete(int Id);
	
		Task<Funcoes_menu> GetById(int Id);
	
		Task<List<Funcoes_menu>> GetByExames_pisa (int IdExames_pisa);
	
		Task<List<Funcoes_menu>> GetByFuncoes (int IdFuncoes);
	
		Task<List<Funcoes_menu>> GetByMenu (int IdMenu);
	
		Task<Funcoes_menu> GetHierarchy(int Id);
	
	}

}
