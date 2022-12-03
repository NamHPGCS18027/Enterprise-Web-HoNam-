using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebEnterprise_mssql.Api.Data;
using WebEnterprise_mssql.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace WebEnterprise_mssql.Api.Repository
{
    public class FilesPathRepository : Repository<FilesPath>, IFilesPathRepository
    {
        public FilesPathRepository(ApiDbContext context) : base(context)
        {
        }

        public async Task<List<FilesPath>> GetListObj(string postId)
        {
            var list = await FindByCondition(x => x.PostId.Equals(postId))
                .ToListAsync();
            return list;
        }

        public async Task<List<string>> GetListStringFilesPath(string postId)
        {
            var list = await FindByCondition(x => x.PostId.Equals(postId))
                .Select(x => x.filePath)
                .ToListAsync();
            return list;
        }

        public void RemoveListOfFilesPaths(IEnumerable<FilesPath> filesPaths)
        {
            DeleteRange(filesPaths);
        }
    }
}