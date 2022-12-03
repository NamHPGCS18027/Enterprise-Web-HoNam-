using WebEnterprise_mssql.Api.Data;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Repository
{
    public class TopicRepository : Repository<Topics>, ITopicRepository
    {
        public TopicRepository(ApiDbContext context) : base(context)
        {
        }

    }
}