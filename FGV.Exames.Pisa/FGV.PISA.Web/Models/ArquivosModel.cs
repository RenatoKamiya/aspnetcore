using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Models
{
    public class ArquivosModel
    {
		public int id { get; set; }

		public int id_Resultado { get; set; }

		public string NomeArquivo { get; set; }

		public string URLArquivo { get; set; }

		public int Pais { get; set; }

		public int Regiao { get; set; }

		public int Estrato { get; set; }

		public int Escola { get; set; }

		public int Estudante { get; set; }
	}
}
