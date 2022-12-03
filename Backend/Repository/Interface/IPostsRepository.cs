using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Repository
{
    public interface IPostsRepository : IRepository<Posts>
    {
        Task<string> GetPostAuthorAsync(string postId);
        Task<Posts> GetPostAsync(string postId);
        Task<List<Posts>> GetAllPostsAsync();
        Task<List<Posts>> GetAllPostsFromUserIDAsync(string userId);
        Task<Posts> GetPostByIDAsync(Guid postId);
        void CreatePostAsync(Posts post);
        void UpdatePostsAsync(Posts post);
        void DeletePostAsync(Posts post);
    }
}