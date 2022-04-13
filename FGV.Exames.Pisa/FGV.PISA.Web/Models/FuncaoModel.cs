using FGV.PISA.Application.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Models
{
    public class FuncaoModel : BaseViewModel
    {
        public string nome { get; set; }

        public string descricao { get; set; }

        public FuncaoModel() { }

        public FuncaoModel(Funcoes data)
        { 
            if (data == null) return;
            this.Id = data.Id;
            this.DataCriacao = data.DataCriacao;
            this.DataAtualizacao = data.DataAtualizacao;
            this.Ativo = data.Ativo;
            this.descricao = data.descricao;
            this.nome = data.nome;
        }
    }
}
