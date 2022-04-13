using FGV.PISA.Application.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
		
namespace FGV.PISA.Application.Common
{
	public interface IArquivos
	{
		Task<int> Create(Arquivos arquivos);
	
		void Update(Arquivos arquivos);
	
		void Delete(int Id);
	
		Task<Arquivos> GetById(int Id);
	
		Task<List<Arquivos>> GetByResultado (int IdResultado);
	
		Task<Arquivos> GetHierarchy(int Id);
	
	}

}
