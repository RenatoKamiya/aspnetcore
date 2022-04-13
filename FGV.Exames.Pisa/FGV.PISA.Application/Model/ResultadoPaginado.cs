using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FGV.PISA.Application.Model
{
    public class ResultadoPaginado<TModel> where TModel : BaseModel
    {
        public ResultadoPaginado()
        {
            ListRegistros = new List<TModel>();
        }

        public int PaginaAtual { get; set; }
        public int TotalRegistrosFiltrados { get; set; }
        public int TotalRegistrosPorPagina { get; set; }
        public int TotalRegistrosRetornados { get; set; }

        public List<TModel> ListRegistros { get; set; }

    }
}
