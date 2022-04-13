using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Models
{
    public class ResultadosViewModel: BaseViewModel
    {
		public DateTime Data_Envio { get; set; }

		public DateTime Data_Avaliacao { get; set; }

		public int Turno { get; set; }

		public string id_usuario { get; set; }

		public int id_aluno { get; set; }

		public string exames_pisa_id { get; set; }

		public string pastaZip { get; set; }

		public List<ArquivosModel> Arquivos { get; set; }
	}
}
