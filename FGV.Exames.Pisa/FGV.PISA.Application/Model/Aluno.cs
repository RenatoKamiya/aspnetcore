//------------------------------------------------------------------------------
// <auto-generated>
//     Este código foi gerado via T4.
//
//     Alterações feitas neste arquivo podem ser perdidas
//     caso o código seja regerado. 
// </auto-generated>
//------------------------------------------------------------------------------
#region [ Diretivas de Using ]
using FGV.PISA.Application.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
#endregion

namespace  FGV.PISA.Application.Model
{
	///<summary>Tabela Aluno</summary>
	public partial class Aluno :  BaseModel
	{
		
		public string Codigo { get; set; }

		public string Nome { get; set; }

		public int id_escola { get; set; }

		public bool? Presente { get; set; }

		public virtual Escola Escola { get; set; }

		public virtual ICollection<Resultado> Resultado { get; set; } = Enumerable.Empty<Resultado>().ToList();

	}

}
