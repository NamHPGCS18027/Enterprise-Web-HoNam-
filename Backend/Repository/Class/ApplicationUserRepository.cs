using WebEnterprise_mssql.Api.Data;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Repository
{
    public class ApplicationUserRepository : Repository<ApplicationUser>, IApplicationUserRepository
    {
        public ApplicationUserRepository(ApiDbContext context) : base(context)
        {
            
        }
    }
}