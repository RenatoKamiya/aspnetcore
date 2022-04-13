using FGV.PISA.Application.Common;
using FGV.PISA.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Controllers
{

    public class LoginController : BaseController
    {
        private readonly IConfiguration _configuration;
        private readonly IUsuarioService _usuarioService;


        public LoginController(IConfiguration configuration, IUsuarioService usuarioService) : base(configuration)
        {
            _configuration = configuration;
            _usuarioService = usuarioService;
        }

        [AllowAnonymous]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<ActionResult> Index(UsuarioModel usuario)
        {
            var retorno = await _usuarioService.Login(usuario.Cpf, usuario.Senha);

            UsuarioLogadoModel usuarioModel = new UsuarioLogadoModel(retorno);

            if (usuarioModel.Usuario != null
                    && usuarioModel.Usuario.Id > 0
                    && usuarioModel.Usuario.Ativo != false)
            {
                await base.SetUserLogged(usuarioModel);
                ViewBag.ErrorLogin = "";
                return RedirectToAction("Index", "Home");
            }
               
            ViewBag.ErrorLogin =  "Usuário não encontrado ou senha não confere.";
            Response.StatusCode = (int)HttpStatusCode.Forbidden;
            return View();
        }

        public async Task<ActionResult> Logout()
        {
            await base.Signout();
            return RedirectToAction("Index", "Login");
        }
    }
}
