using FGV.PISA.Application.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Models
{
    public class UsuarioFuncaoModel : BaseViewModel
    {
        public int usuario_id { get; set; }

        public int funcao_id { get; set; }

        public int exames_pisa_id { get; set; }

        public FuncaoModel Funcao { get; set; }

        public UsuarioFuncaoModel() { }

        public UsuarioFuncaoModel(Usuarios_funcoes data)
        {
            if (data == null) return;
            this.Id = data.Id;
            this.DataCriacao = data.DataCriacao;
            this.DataAtualizacao = data.DataAtualizacao;
            this.Ativo = data.Ativo;
            this.exames_pisa_id = data.exames_pisa_id;
            this.funcao_id = data.funcao_id;
            this.usuario_id = data.usuario_id;
            this.Funcao = new FuncaoModel(data.Funcao);

        }
    } 
}


