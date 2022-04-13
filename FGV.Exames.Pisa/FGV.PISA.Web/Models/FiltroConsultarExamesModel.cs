using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Models
{
    public class FiltroConsultarExamesModel
    {
        public int IdExame { get; set; }
        public string DataInicial { get; set; }

        public string DataFinal { get; set; }

        public int IdEscola { get; set; }

        public int IdAluno { get; set; }
    }
}
