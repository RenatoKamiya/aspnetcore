using FGV.PISA.Application.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
		
namespace FGV.PISA.Application.Common
{
	public interface IMenu
	{
		Task<int> Create(Menu menu);
	
		void Update(Menu menu);
	
		void Delete(int Id);
	
		Task<Menu> GetById(int Id);

		IEnumerable<Menu> GetMenus(int idExame, int idFuncao);


	}

}
