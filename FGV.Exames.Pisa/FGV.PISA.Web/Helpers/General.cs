using System.Globalization;

namespace FGV.PISA.Web.Helpers
{
    public static class General
    {
        public static CultureInfo CulturaBrasil = new CultureInfo("pt-BR");
               
        
        public static string GetCPFWithOutFormat(string cpf)
        {
            cpf = cpf.Replace(".", "").Replace("-", "").Replace(" ", "").Trim();
            cpf = cpf.PadLeft(11, '0');
            
            return cpf;
        }
    }
}
