using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebEnterprise_mssql.Api.Data;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Repository
{
    public class ViewsRepository : Repository<Views>, IViewsRepository
    {
        public ViewsRepository(ApiDbContext context) : base(context)
        {
        }

        public async Task<List<string>> GetListUserIdString(Guid postId)
        {
            var list = await FindByCondition(x => x.postId.Equals(postId))
                .Select(x => x.userId)
                .ToListAsync();

            return list;
        }
    }
}