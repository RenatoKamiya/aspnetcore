using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Helpers
{
    public interface ICloudStorage
    {
        string UploadFileAsync(IFormFile imageFile, string fileNameForStorage);
        Task DeleteFileAsync(string fileNameForStorage);
    }
}
