using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Repository
{
    public interface IFilesPathRepository : IRepository<FilesPath>
    {
        Task<List<FilesPath>> GetListObj(string postId);
        Task<List<string>> GetListStringFilesPath(string postId);
        void RemoveListOfFilesPaths(IEnumerable<FilesPath> filesPaths);
    }
}