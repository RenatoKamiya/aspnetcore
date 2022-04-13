using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FGV.PISA.Application.Model
{
    public class RelResultadoExames: BaseModel
    {
        public int? id_usuario { get; set; }

        public int? id_aluno { get; set; }

        public int exames_pisa_id { get; set; }

        public DateTime Data_Envio { get; set; }

        public string Aluno { get; set; }

        public string Escola { get; set; }

        public string Usuario { get; set; }

        public string NomeArquivo { get; set; }

        public int Total { get; set; }
    }
}
