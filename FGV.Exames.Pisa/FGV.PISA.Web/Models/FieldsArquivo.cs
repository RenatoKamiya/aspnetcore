namespace FGV.PISA.Web.Models
{
    public class FieldsArquivo
    {
        public int Start { get; set; }
        public int End { get; set; }
        public string Valor { get; set; }
    }

    public class CamposArquivo
    {
        public FieldsArquivo Estudante { get; set; }
        public FieldsArquivo Pais { get; set; }
        public FieldsArquivo Escola { get; set; }
        public FieldsArquivo Caderno { get; set; }
        public FieldsArquivo Session { get; set; }

    }


}
