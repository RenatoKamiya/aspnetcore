using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Models
{
    public class EscolaViewModel: BaseViewModel
    {
        public string Codigo { get; set; }

        public string Nome { get; set; }

        public string CodigoNome
        {
            get
            {
                return string.Format("{0} - {1}", Codigo, Nome.ToString());
            }
        }
    }
}
