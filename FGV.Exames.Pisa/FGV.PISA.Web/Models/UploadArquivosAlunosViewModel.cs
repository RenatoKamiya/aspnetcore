using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace FGV.PISA.Web.Models
{
    public class UploadArquivosAlunosViewModel
    {
        public List<IFormFile> Files { get; set; }
        public List<AlunosViewModel> Alunos { get; set; }
    }

    public class AlunosViewModel
    {
        public int Id { get; set; }
        public bool Presente { get; set; }
    }
}
