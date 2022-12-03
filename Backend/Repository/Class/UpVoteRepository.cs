using WebEnterprise_mssql.Api.Data;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Repository
{
    public class UpVoteRepository : Repository<UpVote>, IUpVoteRepository
    {
        public UpVoteRepository(ApiDbContext context) : base(context)
        {
        }               
    }
}