using FGV.PISA.Application.Model;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Threading.Tasks;
		
namespace FGV.PISA.Application.Common
{
	public interface IValorAtributo	
	{	
	
		Task<ValorAtributo> GetByChave(string Chave);
		Task<NameValueCollection> GetByChaveList(List<string> Chave);
	}

}
