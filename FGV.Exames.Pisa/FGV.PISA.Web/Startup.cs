using Elastic.Apm.NetCoreAll;
using FGV.PISA.Application.Common;
using FGV.PISA.Application.DAL;
using FGV.PISA.Application.Services;
using FGV.PISA.Web.Helpers;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Globalization;
using Application = FGV.PISA.Application.Helpers;
namespace FGV.PISA.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            
            Application.Helpers.Config.AzureStorageAccountName = Configuration["Azure:StorageAccountName"].ToString();
            Application.Helpers.Config.AzureStorageAccountKey = Configuration["Azure:StorageAccountKey"].ToString();
            Application.Helpers.Config.AzureBlobStorageContainer = Configuration["Azure:BlobStorageContainer"].ToString();

            int timeSessionExpiration = Convert.ToInt32(Configuration["Session:ExpirationTimeFromMinutes"].ToString());

            services.Configure<RequestLocalizationOptions>(options =>
            {
                var defaultCulture = "pt-BR";
                options.DefaultRequestCulture = new RequestCulture(culture: defaultCulture, uiCulture: defaultCulture);
            });

            services.AddSession(options =>
            {
                // Set a short timeout for easy testing.
                options.IdleTimeout = TimeSpan.FromMinutes(timeSessionExpiration);
                options.Cookie.HttpOnly = false;
            });

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
            {
                options.LoginPath = "/";
               // options.Cookie.Expiration = TimeSpan.FromMinutes(timeSessionExpiration);
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.Strict;
                options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(timeSessionExpiration);
            });

            services.ConfigureApplicationCookie(options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromMinutes(timeSessionExpiration);
            });

            services.AddControllersWithViews().AddRazorRuntimeCompilation();
            services.AddTransient<IAluno, DALAluno>();
            services.AddTransient<IArquivos, DALArquivos>();
            services.AddTransient<IEscola, DALEscola>();
            services.AddTransient<IExames_pisa, DALExames_pisa>();
            services.AddTransient<IFuncoes, DALFuncoes>();
            services.AddTransient<IFuncoes_menu, DALFuncoes_menu>();
            services.AddTransient<IMenu, DALMenu>();
            services.AddTransient<IResultado, DALResultado>();
            services.AddTransient<ITurno, DALTurno>();
            services.AddTransient<IUsuario, DALUsuario>();
            services.AddTransient<IUsuarios_funcoes, DALUsuarios_funcoes>();
            services.AddTransient<IUsuarioService, UsuarioService>();
            services.AddTransient<IValorAtributo, DALValorAtributo>();

            services.AddSingleton<ICloudStorage, GoogleCloudStorage>();

            services.Configure<IISOptions>(options =>
            {
                options.ForwardClientCertificate = false;
                options.AutomaticAuthentication = false;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            var defaultDateCulture = "pt-BR";
            var ci = new CultureInfo(defaultDateCulture);
            ci.NumberFormat.NumberDecimalSeparator = ".";
            ci.NumberFormat.CurrencyDecimalSeparator = ".";

            app.UseAllElasticApm(Configuration);

            if (env.IsDevelopment())
            {
                
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
               
            }
            app.UseAuthentication();
            app.UseStaticFiles();
            app.UseSession();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Login}/{action=Index}/{id?}");
            });
        }
    }
}
