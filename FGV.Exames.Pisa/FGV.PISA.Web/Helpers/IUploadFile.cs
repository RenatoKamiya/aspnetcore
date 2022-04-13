using System.IO;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Helpers
{
    internal interface IUploadFile
    {
        string Carregar(string arquivoOrigem, string pastaDestino, string nomeArquivoDestino, string bucketName, bool publico);
        string Carregar(MemoryStream fileStreamOrigem, string pastaDestino, string nomeArquivoDestino, string bucketName, bool publico);
        Task<string> CarregarAsync(MemoryStream fileStreamOrigem, string pastaDestino, string nomeArquivoDestino, string bucketName, bool publico);
        Task<string> GetBlobUrl(string blobName);
    }
}
