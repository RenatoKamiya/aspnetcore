using System.Globalization;

namespace FGV.PISA.Application.Helpers
{
    public static class Config
    {
        static Config()
        {
            CultureBrasil = new CultureInfo("pt-BR");
        }

        public static string ConnectionString { get; set; }
        public static CultureInfo CultureBrasil { get; set; }
        public static string AzureStorageAccountName { get; set; }
        public static string AzureStorageAccountKey { get; set; }
        public static string AzureBlobStorageContainer { get; set; }
    }
}
