using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Models
{
    public class PaginacaoModel
    {
        public int Draw { get; set; } = 0;
        public int RecordsTotal { get; set; } = 0;
        public int RecordsFiltered { get; set; } = 0;
        public object Data { get; set; }
    }
}
