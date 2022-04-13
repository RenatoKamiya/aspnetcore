using FGV.PISA.Application.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
		
namespace FGV.PISA.Application.Common
{
	public interface IExames_pisa
	{
		Task<int> Create(Exames_pisa exames_pisa);
	
		void Update(Exames_pisa exames_pisa);
	
		void Delete(int Id);
	
		Task<Exames_pisa> GetById(int Id);

		Task<List<Exames_pisa>> GetALL();

	}

}
