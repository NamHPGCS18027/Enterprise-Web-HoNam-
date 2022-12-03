using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebEnterprise_mssql.Api.Data;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Repository
{
    public class CommentsRepository : Repository<Comments>, ICommentsRepository
    {
        public CommentsRepository(ApiDbContext context) : base(context)
        {
        }


        public void DeleteListChildren(List<Comments> ListChildren)
        {
            DeleteRange(ListChildren);
        }

        

        public async Task<Comments> GetComments(Guid commentId)
        {
            var GetComments = await FindByCondition(x => x.CommentId.Equals(commentId)).FirstOrDefaultAsync();
            return GetComments;
        }

    

        public async Task<List<Comments>> GetListChildrenByParentIdAsync(Guid parentId)
        {
            var GetListChildrent = await FindByCondition(x => x.ParentId.Equals(parentId.ToString())).ToListAsync();
            return GetListChildrent;
        }

        public async Task<List<Comments>> GetListParentAsync(string PostId)
        {
            var listParent = await FindByCondition(x => x.PostId.Equals(PostId)).ToListAsync();
            return listParent;
        }

        public async Task<Comments> GetParentByCommentIdAsync(string commentId)
        {
            var parent = await FindByCondition(x => x.CommentId.Equals(Guid.Parse(commentId))).FirstOrDefaultAsync();
            return parent;
        }

        
    }
}