using System.Threading.Tasks;
using WebEnterprise_mssql.Api.Data;
using WebEnterprise_mssql.FileActionService.Class;
using WebEnterprise_mssql.FileActionService.Interface;

namespace WebEnterprise_mssql.Api.Repository
{
    public class RepositoryWrapper : IRepositoryWrapper
    {
        private ApiDbContext context;
        private IPostsRepository _post;
        private IFilesPathRepository _filesPath;
        private IViewsRepository _view;
        private ICommentsRepository _comment;
        private IDepartmentRepository _Department;
        private IUserRepository _User;
        private ITopicRepository _Topic;
        private ICategoryRepository _Category;
        private IApplicationUserRepository _ApplicationUser;
        private IUpVoteRepository _UpVote;
        private IDownVoteRepository _DownVote;

        //===================================================
        public IPostsRepository Posts
        {
            get
            {
                if (_post == null)
                {
                    _post = new PostsRepository(context);
                }
                return _post;
            }
        }

        public IFilesPathRepository FilesPaths
        {
            get
            {
                if (_filesPath == null)
                {
                    _filesPath = new FilesPathRepository(context);
                }
                return _filesPath;
            }
        }

        public IViewsRepository Views
        {
            get
            {
                if (_view is null)
                {
                    _view = new ViewsRepository(context);
                }
                return _view;
            }
        }

        public ICommentsRepository Comments {
            get
            {
                if (_comment is null)
                {
                    _comment = new CommentsRepository(context);
                }
                return _comment;
            }
        }

        public IDepartmentRepository Departments {
            get
            {
                if (_Department is null)
                {
                    _Department = new DepartmentRepository(context);
                }
                return _Department;
            }
        }

        public IUserRepository Users {
            get
            {
                if (_User is null)
                {
                    _User = new UserRepository(context);
                }
                return _User;
            }
        }

        public ITopicRepository Topics {
            get
            {
                if (_Topic is null)
                {
                    _Topic = new TopicRepository(context);
                }
                return _Topic;
            }
        }

        public ICategoryRepository Categories {
            get
            {
                if (_Category is null)
                {
                    _Category = new CategoryRepository(context);
                }
                return _Category;
            }
        }

        public IApplicationUserRepository applicationUsers {
            get {
                if (_ApplicationUser is null)
                {
                    _ApplicationUser = new ApplicationUserRepository(context);
                }
                return _ApplicationUser;
            }
        }

        public IUpVoteRepository UpVotes 
        {
            get
            {
                if (_UpVote is null)
                {
                    _UpVote = new UpVoteRepository(context);
                }
                return _UpVote;
            }
        }

        public IDownVoteRepository DownVote
        {
            get
            {
                if (_DownVote is null)
                {
                    _DownVote = new DownVoteRepository(context);
                }
                return _DownVote;
            }
        }

        public RepositoryWrapper(ApiDbContext context)
        {
            this.context = context;
        }

        public async Task Save()
        {
            await context.SaveChangesAsync();
        }
    }
}