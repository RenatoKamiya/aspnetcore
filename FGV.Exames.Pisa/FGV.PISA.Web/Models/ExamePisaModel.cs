using FGV.PISA.Application.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Models
{
    public class ExamePisaModel: BaseViewModel
    {
        public string Descricao { get; set; }

        public int Ano { get; set; }

        public string DescricaoAno { 
            get
            {
                return string.Format("{0} - {1}", Descricao, Ano.ToString());
            } 
        }

        public ExamePisaModel() { }

        public ExamePisaModel(Exames_pisa data) {
            if (data == null) return;
            this.Id = data.Id;
            this.DataCriacao = data.DataCriacao;
            this.DataAtualizacao = data.DataAtualizacao;
            this.Ativo = data.Ativo;
            this.Descricao = data.Descricao;
            this.Ano = data.Ano;
        }
    }
}
