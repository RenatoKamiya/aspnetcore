using FGV.PISA.Application.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
		
namespace FGV.PISA.Application.Common
{
	public interface IFuncoes
	{
		Task<int> Create(Funcoes funcoes);
	
		void Update(Funcoes funcoes);
	
		void Delete(int Id);
	
		Task<Funcoes> GetById(int Id);
	
	}

}
