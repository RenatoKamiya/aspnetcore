using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.IO;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Helpers
{
    public class UploadFileAzure : IUploadFile
    {
        public string Carregar(string arquivoOrigem, string pastaDestino, string nomeArquivoDestino, string bucketName, bool publico)
        {
            string ret = string.Empty;
            try
            {
                var filename = pastaDestino + "_" + nomeArquivoDestino;

                var storageAccount = new CloudStorageAccount(new StorageCredentials(PISA.Application.Helpers.Config.AzureStorageAccountName, PISA.Application.Helpers.Config.AzureStorageAccountKey), true);
                var blobClient = storageAccount.CreateCloudBlobClient();
                var container = blobClient.GetContainerReference(PISA.Application.Helpers.Config.AzureBlobStorageContainer);
                container.CreateIfNotExistsAsync();
                container.SetPermissionsAsync(new BlobContainerPermissions
                {
                    PublicAccess = BlobContainerPublicAccessType.Blob
                });

                FileInfo jp = new FileInfo(arquivoOrigem);
                FileStream fs = jp.Open(FileMode.OpenOrCreate, FileAccess.Read);

                var blob = container.GetAppendBlobReference(filename);
                blob.UploadFromStreamAsync(fs);



                ret = blob.Uri.AbsoluteUri;
            }
            catch (Exception)
            {
                ret = string.Empty;
            }

            return ret;
        }

        public string Carregar(MemoryStream fileStreamOrigem, string pastaDestino, string nomeArquivoDestino, string bucketName, bool publico)
        {
            string ret = "";
            try
            {
                var filename = pastaDestino + "_" + nomeArquivoDestino;
                var storageAccount = new CloudStorageAccount(new StorageCredentials(PISA.Application.Helpers.Config.AzureStorageAccountName, PISA.Application.Helpers.Config.AzureStorageAccountKey), true);
                var blobClient = storageAccount.CreateCloudBlobClient();
                var container = blobClient.GetContainerReference(PISA.Application.Helpers.Config.AzureBlobStorageContainer);
                container.CreateIfNotExistsAsync();
                container.SetPermissionsAsync(new BlobContainerPermissions
                {
                    PublicAccess = BlobContainerPublicAccessType.Blob
                });


                var fileBytes = fileStreamOrigem.ToArray();

                var blob = container.GetAppendBlobReference(filename);
                blob.UploadFromByteArrayAsync(fileBytes, 0, fileBytes.Length);

                ret = blob.Uri.AbsoluteUri;
            }
            catch (Exception ex)
            {
                ret = ex.Message;
            }

            return ret;
        }

        public async Task<string> CarregarAsync(MemoryStream fileStreamOrigem, string pastaDestino, string nomeArquivoDestino, string bucketName, bool publico)
        {
            string ret = string.Empty;
            try
            {
                var filename = pastaDestino + "_" + nomeArquivoDestino;
                var storageAccount = new CloudStorageAccount(new StorageCredentials(PISA.Application.Helpers.Config.AzureStorageAccountName, PISA.Application.Helpers.Config.AzureStorageAccountKey), true);
                var blobClient = storageAccount.CreateCloudBlobClient();
                var container = blobClient.GetContainerReference(PISA.Application.Helpers.Config.AzureBlobStorageContainer);
                await container.CreateIfNotExistsAsync();
                await container.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });

                var fileBytes = fileStreamOrigem.ToArray();

                var blob = container.GetAppendBlobReference(filename);
                await blob.UploadFromByteArrayAsync(fileBytes, 0, fileBytes.Length);

                ret = blob.Uri.AbsoluteUri;
            }
            catch (Exception ex)
            {
                ret = ex.Message;
            }

            return ret;
        }

        private byte[] ConverteStreamToByteArray2(Stream stream)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                stream.CopyTo(ms);
                return ms.ToArray();
            }
        }

        public async Task<string> GetBlobUrl(string blobName)
        {
            try
            {
                var storageAccount = new CloudStorageAccount(new StorageCredentials(PISA.Application.Helpers.Config.AzureStorageAccountName, PISA.Application.Helpers.Config.AzureStorageAccountKey), true);

                Uri blobUri = new Uri(blobName);
                CloudBlob blob = new CloudBlob(blobUri, storageAccount.Credentials);
                await blob.FetchAttributesAsync();
                byte[] arr = new byte[blob.Properties.Length];
                await blob.DownloadToByteArrayAsync(arr, 0);
                var fileBase64 = Convert.ToBase64String(arr);
                return fileBase64;

            }
            catch (Exception ex) {
                return ex.Message;
            }
        }
    }
}

