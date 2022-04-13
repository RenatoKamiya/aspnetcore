using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Models
{
    public class AlunoModel: BaseViewModel
    {
		public string Codigo { get; set; }

		public string Nome { get; set; }

		public int id_escola { get; set; }

		public bool? Presente { get; set; }

		public  EscolaViewModel Escola { get; set; }

		public List<ResultadosViewModel> Resultado { get; set; }

		public AlunoModel()
        {
			Resultado = new List<ResultadosViewModel>();

		}

		public string CodigoNome { get; set; }
	}
}
