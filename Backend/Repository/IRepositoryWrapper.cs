using System.Threading.Tasks;
using WebEnterprise_mssql.FileActionService.Interface;

namespace WebEnterprise_mssql.Api.Repository
{
    public interface IRepositoryWrapper
    {
        IPostsRepository Posts { get; }
        IFilesPathRepository FilesPaths { get; }
        IViewsRepository Views { get; }
        ICommentsRepository Comments { get; }
        IDepartmentRepository Departments { get; }
        IUserRepository Users { get; }
        ITopicRepository Topics { get; }
        ICategoryRepository Categories { get; }
        IApplicationUserRepository applicationUsers { get; }
        IUpVoteRepository UpVotes { get; }
        IDownVoteRepository DownVote { get; }
        Task Save();
    }
}