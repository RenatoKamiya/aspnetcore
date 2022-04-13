using FGV.PISA.Application.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Models
{
    public class MenuViewModel : BaseViewModel
    {
        public MenuViewModel()
        { }

        public MenuViewModel(Menu menu)
        {
            if (menu != null)
            {
                this.Id = menu.Id;
                this.Code = menu.code;
                this.Nome = menu.nome;
                this.NomeExibicao = menu.nome_exibicao;
                this.Pai_id = menu.pai_id;
                this.Posicao = menu.posicao;
                this.Icone = menu.icone;
                this.Ativo = menu.Ativo;
                this.Action = (menu.action == null) ? string.Empty : menu.action;
                this.Controller = menu.controller;
                this.Url = menu.url;
                this.DataInicioVigencia = menu.DataInicioVigencia;
                this.DataFinVigencia = menu.DataFinVigencia;
                this.DataViraSoLeitura = menu.DataViraSoLeitura;
                this.EstaVigente = menu.EstaVigente;
                this.DataCriacao = menu.dataCriacao;
                this.DataAtualizacao = menu.dataAtualizacao;
                

            }
        }

       
        public string Code { get; set; }
        public string Nome { get; set; }
        public string NomeExibicao { get; set; }
        public int Pai_id { get; set; }
        public int Posicao { get; set; }
        public string Icone { get; set; }        
        public string Action { get; set; }
        public string Controller { get; set; }
        public string Url { get; set; }
        public DateTime? DataInicioVigencia { get; set; }
        public DateTime? DataFinVigencia { get; set; }
        public DateTime? DataViraSoLeitura { get; set; }
        public bool EstaVigente { get; set; }        
    }
}
