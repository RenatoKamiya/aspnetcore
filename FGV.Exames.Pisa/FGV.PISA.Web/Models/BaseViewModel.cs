using System;
using System.Globalization;

namespace FGV.PISA.Web.Models
{
    public class BaseViewModel
    {
        private DateTime? _DataCriacao;
        private DateTime? _DataAtualizacao;

        public int Id { get; set; }

        public DateTime? DataCriacao
        {
            get { return !_DataCriacao.HasValue ? DateTime.Now : _DataCriacao; }
            set { _DataCriacao = Convert.ToDateTime(value, new CultureInfo("pt-BR")); }
        }

        public DateTime? DataAtualizacao {
            get { return _DataAtualizacao; }
            set { _DataAtualizacao = Convert.ToDateTime(value, new CultureInfo("pt-BR")); }
        }
        public bool Ativo { get; set; }
    }
}
