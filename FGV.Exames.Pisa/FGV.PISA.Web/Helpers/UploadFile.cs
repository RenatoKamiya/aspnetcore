using System.IO;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Helpers
{
    public class UploadFile
    {
        private readonly IUploadFile _uploadFile;

        public UploadFile()
        {
            _uploadFile = InicializarUploadAzure();
        }
        private IUploadFile InicializarUploadAzure()
        {
            return new UploadFileAzure();
        }
        public string Carregar(string arquivoOrigem, string pastaDestino, string nomeArquivoDestino, string bucketName, bool publico)
        {
            return _uploadFile.Carregar(arquivoOrigem, pastaDestino, nomeArquivoDestino, bucketName, publico);
        }
        public string Carregar(MemoryStream fileStreamOrigem, string pastaDestino, string nomeArquivoDestino, string bucketName, bool publico)
        {
            return _uploadFile.Carregar(fileStreamOrigem, pastaDestino, nomeArquivoDestino, bucketName, publico);
        }
        public async Task<string> CarregarAsync(MemoryStream fileStreamOrigem, string pastaDestino, string nomeArquivoDestino, string bucketName, bool publico)
        {
            return await _uploadFile.CarregarAsync(fileStreamOrigem, pastaDestino, nomeArquivoDestino, bucketName, publico);
        }
        public Task<string> GetBlobUrl(string blobName)
        {
            return _uploadFile.GetBlobUrl(blobName);
        }
    }
}
