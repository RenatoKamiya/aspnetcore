using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace FGV.PISA.Application.Model
{
    public class BaseModel
    {
        DateTime? _DataCriacao;

        [Key]
        public int Id { get; set; }

        public DateTime? DataCriacao
        {
            get { return !_DataCriacao.HasValue ? DateTime.Now : _DataCriacao; }
            set { _DataCriacao = value; }
        }

        public DateTime? DataAtualizacao { get; set; }
        public bool Ativo { get; set; }
    }
}
