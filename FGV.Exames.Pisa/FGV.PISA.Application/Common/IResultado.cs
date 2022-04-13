using FGV.PISA.Application.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
		
namespace FGV.PISA.Application.Common
{
	public interface IResultado
	{
		Task<int> Create(Resultado resultado);
	
		void Update(Resultado resultado);
	
		void Delete(int Id);
	
		Task<Resultado> GetById(int Id);
	
		Task<List<Resultado>> GetByAluno (int IdAluno);
	
		Task<List<Resultado>> GetByExames_pisa (int IdExames_pisa);
	
		Task<List<Resultado>> GetByUsuario (int IdUsuario);
	
		Task<Resultado> GetHierarchy(int Id);

		Task<ResultadoPaginado<RelResultadoExames>> GetResultadosExames(int exames_pisa_id, int id_usuario, int id_escola, int id_aluno, DateTime? DataInicial, DateTime? DataFinal);


	}

}
