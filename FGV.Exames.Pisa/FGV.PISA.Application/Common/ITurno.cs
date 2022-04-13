using FGV.PISA.Application.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
		
namespace FGV.PISA.Application.Common
{
	public interface ITurno
	{
		Task<Turno> GetById(int Id);
	
	}

}
