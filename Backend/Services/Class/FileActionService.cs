using System.Net;
using System.IO;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using OfficeOpenXml;

namespace WebEnterprise_mssql.Api.Services
{
    public class FileActionService<T> : IFileActionService<T> where T : class
    {
        private readonly IConfiguration configuration;

        public FileActionService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
        public void DeleteIfExist(FileInfo file)
        {
            if (file.Exists)
            {
                file.Delete();
            }
        }

        public string GetRootDirectory(string filePath)
        {
            var rootPath = configuration["FileConfig:SumUpFilePath"];
            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }

            var newFilePath = Path.Combine(rootPath, filePath);
            return newFilePath;
        }

        public async Task<string> SaveExcelFileAsync(IEnumerable<T> listObject, string fileName, string worksheetName)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            var newFileInfo = GetRootDirectory(fileName);
            var file = new FileInfo(newFileInfo);
            DeleteIfExist(file);

            using var package = new ExcelPackage(file);
            var worksheet = package.Workbook.Worksheets.Add(worksheetName);
            var range = worksheet.Cells["B2"].LoadFromCollection(listObject, true);
            await package.SaveAsync();

            return file.Name;
        }
    }
}