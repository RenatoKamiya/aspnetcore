using Microsoft.Extensions.Configuration;
using System.IO;

namespace FGV.PISA.Web.Helpers
{
    public class Config
    {
        private static IConfigurationRoot _Configuration { get; set; }
        public static string S3BucketName
        {
            get
            {
                var builder = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json");

                //Obtem Serializa o json
                _Configuration = builder.Build();

                //Obtem a propriedade configurada
                return _Configuration["S3:bucketName"].ToString();
            }
        }
    }
}
