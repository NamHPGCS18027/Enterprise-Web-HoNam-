using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Repository
{
    public interface IViewsRepository : IRepository<Views>
    {
        Task<List<string>> GetListUserIdString(Guid postId);
    }
}