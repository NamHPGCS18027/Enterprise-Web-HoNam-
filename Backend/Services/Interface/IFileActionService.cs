using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace WebEnterprise_mssql.Api.Services
{
    public interface IFileActionService<T> where T : class
    {
        Task<string> SaveExcelFileAsync(IEnumerable<T> listObject, string fileName, string worksheetName);
        string GetRootDirectory(string filePath);
        void DeleteIfExist(FileInfo file);
    }
}