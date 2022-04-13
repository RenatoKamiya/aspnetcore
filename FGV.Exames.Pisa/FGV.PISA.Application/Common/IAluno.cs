using FGV.PISA.Application.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
		
namespace FGV.PISA.Application.Common
{
	public interface IAluno
	{
		Task<int> Create(Aluno aluno);
	
		void Update(Aluno aluno);
	
		void Delete(int Id);
	
		Task<Aluno> GetById(int Id);
	
		Task<List<Aluno>> GetByEscola (int IdEscola);
	
		Task<Aluno> GetHierarchy(int Id);

		Task<Aluno> GetByCodigoEscola(string codigo, int IdEscola);

		List<Aluno> BuscarTodosAlunos();

		bool InserirPresenca(List<Aluno> alunos);

		Task<List<Aluno>> GetByEscolaListaPresenca(int IdEscola);
	}

}
