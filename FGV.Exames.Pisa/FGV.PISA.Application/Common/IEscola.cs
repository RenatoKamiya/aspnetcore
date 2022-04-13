using FGV.PISA.Application.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
		
namespace FGV.PISA.Application.Common
{
	public interface IEscola
	{
		Task<int> Create(Escola escola);
	
		void Update(Escola escola);
	
		void Delete(int Id);
	
		Task<Escola> GetById(int Id);

		Task<List<Escola>> GetALL();

		Task<Escola> GetByCodigo(string Codigo);

	}

}
