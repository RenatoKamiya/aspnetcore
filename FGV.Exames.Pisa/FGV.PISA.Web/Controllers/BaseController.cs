using FGV.PISA.Application.Common;
using FGV.PISA.Application.DAL;
using FGV.PISA.Application.Model;
using FGV.PISA.Web.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Controllers
{
    public class BaseController : Controller
    {
        private readonly IConfiguration _configuration;
        
        protected BaseController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            ViewBag.SoftwareVersion = _configuration["Software:Version"].ToString();

            base.OnActionExecuting(context);
        }


        public override void OnActionExecuted(ActionExecutedContext context)
        {
            ViewBag.NomeUsuario = this.UsuarioLogado.Usuario.Nome;
            //ViewBag.NomeFuncao = this.UsuarioLogado.FuncaoSelecionada.DescricaoSocial;
            ViewBag.Menus = this.UsuarioLogado.Menus;
            base.OnActionExecuted(context);

        }

        protected async Task SetUserLogged(UsuarioLogadoModel usuario_model)
        {
            HttpContext.Session.SetString("UsuarioLogado", JsonConvert.SerializeObject(usuario_model));
            var claims = new List<Claim>() { new Claim(ClaimTypes.Name, usuario_model.Usuario.Cpf), new Claim(ClaimTypes.PrimarySid, usuario_model.Usuario.Id.ToString()) };

            var userIdentity = new ClaimsIdentity(claims, "login");
            ClaimsPrincipal principal = new ClaimsPrincipal(userIdentity);

            var authProperties = new AuthenticationProperties
            {
                AllowRefresh = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(60),
                IsPersistent = true,
                IssuedUtc = DateTimeOffset.Now
            };

            await HttpContext.SignInAsync(principal, authProperties);
        }

        protected async Task Signout()
        {
            await HttpContext.SignOutAsync();
            HttpContext.Session.Clear();
            HttpContext.Session.Remove("UsuarioLogado");
           
        }

        protected UsuarioLogadoModel UsuarioLogado
        {
            get
            {
                string content = HttpContext.Session.GetString("UsuarioLogado");
                if(!string.IsNullOrEmpty(content))
                {                    
                    return JsonConvert.DeserializeObject<UsuarioLogadoModel>(content);
                }
                else
                {
                    return new UsuarioLogadoModel();
                }
            }
        }

        protected async Task PreencherDropDownExames()
        {
            DALExames_pisa service = new DALExames_pisa(_configuration);
            var listExames = await service.GetALL();
            var resultadoTratado = listExames.Select(s => new ExamePisaModel { Id = s.Id, Descricao = s.Descricao, Ano = s.Ano }).ToList();
            var dropDownExames = new SelectList(resultadoTratado, "Id", "DescricaoAno");
            ViewBag.DropDownExames = dropDownExames;
        }

        protected async Task PreencherDropEscola()
        {
            DALEscola dALEscola = new DALEscola(_configuration);
            var listEscolas = await dALEscola.GetALL();
            var resultadoTratado = listEscolas.Select(s => new EscolaViewModel { Id = s.Id, Nome = s.Nome, Codigo = s.Codigo }).ToList();
            var dropDownEscola = new SelectList(resultadoTratado, "Id", "CodigoNome");
            ViewBag.DropDownEscola = dropDownEscola;
        }
    }
}
