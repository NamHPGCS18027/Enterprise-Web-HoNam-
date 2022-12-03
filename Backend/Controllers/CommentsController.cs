using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebEnterprise_mssql.Api.Dtos;
using WebEnterprise_mssql.Api.Models;
using WebEnterprise_mssql.Api.Repository;
using WebEnterprise_mssql.Api.Services;

//    DATE           NAME      TODO
//   4/1/2022        Ngoc      use Repo(update,delete,create,getlist) instead of linQ
//   
//=============================================================================================

namespace WebEnterprise_mssql.Api.Controllers
{
    [ApiController]
    [Route("/api/[controller]")] // /api/comments
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "staff")]
    public class CommentsController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ILogger<CommentsController> logger;
        private readonly IRepositoryWrapper repo;
        private readonly ISendMailService mailService;

        public CommentsController(
            IMapper mapper,
            UserManager<ApplicationUser> userManager,
            ILogger<CommentsController> logger,
            IRepositoryWrapper repo, 
            ISendMailService mailService
        )
        {
            this.userManager = userManager;
            this.logger = logger;
            this.repo = repo;
            this.mailService = mailService;
            this.mapper = mapper;
        }

        [HttpGet]
        [Route("AllComments")]
        public async Task<IActionResult> GetAllComment(string PostId)
        {
            // var listParent = await context.Comments
            //     .Where(x => x.PostId.Equals(PostId))
            //     .Where(x => x.IsChild.Equals(false))
            //     .ToListAsync();
            var listParent = await repo.Comments
                .FindByCondition(x => x.PostId.Equals(PostId)).Include(x => x.ApplicationUser)
                .ToListAsync();

            var resultList = new List<ParentItemDto>();
            foreach (var parent in listParent)
            {
                if (parent.IsChild.Equals(false))
                {
                    var newParent = await GetChildrenToParent(parent.CommentId.ToString());
                    //var user = await userManager.FindByIdAsync(parent.userId);
                    newParent.Username = parent.ApplicationUser.UserName;
                    resultList.Add(newParent);
                }
            }
            var sortedResultList = resultList.OrderBy(x => x.CreatedDate).ToList();

            return Ok(sortedResultList);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBtnClick(DeleteCommentDto dto)
        {
            if (await IsPassDeadline(dto.PostId))
            {
                return BadRequest("Cannot delete comments after final closure date");
            }
            var parent = await GetChildrenToParent(dto.commentId.ToString());

            if (parent.childItems.Count().Equals(0))
            {
                try
                {
                    DeleteComment(parent.CommentId);
                }
                catch (System.Exception ex)
                {
                    return new JsonResult($"Error Message: {ex}") {StatusCode = 500};
                }
            }
            else
            {
                try
                {
                    DeleteRangeComment(parent.CommentId);
                    DeleteComment(parent.CommentId);
                }
                catch (System.Exception ex)
                {
                    return new JsonResult($"Error Message: {ex}") {StatusCode = 500};
                }
            }

            return RedirectToAction(nameof(GetAllComment), new { dto.PostId });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateComment(UpdateCommentDto dto)
        {
            // var existingComment = await context.Comments
            //      .Where(x => x.CommentId == Guid.Parse(CommentDto.PreviousCommentId))
            //      .FirstOrDefaultAsync();
            var existingComment = await repo.Comments
                .FindByCondition(x => x.CommentId.Equals(Guid.Parse(dto.commentId)))
                .FirstOrDefaultAsync();

            existingComment = mapper.Map<Comments>(dto);
            existingComment.LastModifiedDate = DateTimeOffset.UtcNow;

            if (await IsPassDeadline(dto.postId))
            {
                return BadRequest("No more comment can be update to this post after final closure date");
            }
            else
            {
                try
                {
                    //context.Comments.Update(existingComment);
                    repo.Comments.Update(existingComment);
                    await repo.Save();
                    return RedirectToAction(nameof(GetAllComment), new { dto.postId });
                }
                catch (Exception ex)
                {
                    return new JsonResult($"Error Message: {ex}") {StatusCode = 500};
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddCommentAsync(CommentDto dto, [FromHeader] string Authorization)
        {
            if (Authorization is null)
            {
                return BadRequest($"Param Authorization is null");
            }
            var user = await DecodeToken(Authorization);

            if (dto.IsChild)
            {
                if (dto.ParentId is null)
                {
                    return BadRequest("ParentId cannot be null when IsChild is set to true");
                } 
                else
                {
                    await AddReplyCommentAsync(dto, user);
                    return RedirectToAction(nameof(GetAllComment), new { dto.PostId });
                }
            }
            
            var newComment = mapper.Map<Comments>(dto);
            newComment.CreatedDate = DateTimeOffset.UtcNow;
            newComment.ApplicationUser = user;

            if (await IsPassDeadline(dto.PostId))
            {
                return BadRequest("No more comment can be added to this post after final closure date");
            }
            else
            {
                try
                {
                    // await context.Comments.AddAsync(newComment);
                    if (ModelState.IsValid)
                    {
                        repo.Comments.Create(newComment);
                        await repo.Save();
                    }

                    var post = await repo.Posts
                        .FindByCondition(x => x.PostId.Equals(Guid.Parse(dto.PostId)))
                        .FirstOrDefaultAsync();
                    var author = await userManager.FindByIdAsync(post.UserId);
                    
                    if (!user.Id.Equals(author.Id))
                    {
                        MailContent mailContent = new();
                        mailContent.To = author.Email;

                        mailContent.Subject = $"New Comment on one of your Idea";
                        mailContent.Body = $"User {user.UserName} has commented on your Idea";

                        await mailService.SendMail(mailContent);
                    }


                    return RedirectToAction(nameof(GetAllComment), new { dto.PostId });
                }
                catch (Exception ex)
                {
                    return new JsonResult($"Error message: {ex}") {StatusCode = 500};
                }
            }
        }

        private async Task<ApplicationUser> DecodeToken(string Authorization)
        {
            if (Authorization is null)
            {
                return null;
            }

            string[] Collection = Authorization.Split(" ");

            //Decode the token
            var stream = Collection[1];
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(stream);
            var tokenS = jsonToken as JwtSecurityToken;

            //get the user
            var email = tokenS.Claims.First(claim => claim.Type == "email").Value;
            var user = await userManager.FindByEmailAsync(email);

            //return the user
            return user;
        }

        private async Task<bool> IsPassDeadline(string postId)
        {
            var topicId = await repo.Posts
                .FindByCondition(x => x.PostId.Equals(Guid.Parse(postId)))
                .Select(x => x.TopicId)
                .FirstOrDefaultAsync();
            var finalClosureDate = await repo.Topics
                .FindByCondition(x => x.TopicId.Equals(topicId))
                .Select(x => x.FinalClosureDate)
                .FirstOrDefaultAsync();
            if (DateTimeOffset.UtcNow >= finalClosureDate)
            {
                return true;
            }
            return false;
        }

        private async void DeleteRangeComment(Guid parentId)
        {
            // var childrenCommentArray = await context.Comments.Where(x => x.ParentId.Equals(parentId)).ToArrayAsync();
            var childrenCommentArray = await repo.Comments.GetListChildrenByParentIdAsync(parentId);

            // context.Comments.RemoveRange(childrenCommentArray);
            repo.Comments.DeleteListChildren(childrenCommentArray);
            await repo.Save();
        }
        private async void DeleteComment(Guid commentId)
        {
            // var existingComment = await context.Comments
            //     .Where(x => x.CommentId == commentId)
            //     .FirstOrDefaultAsync();
            var existingComment = await repo.Comments.GetComments(commentId);

            //context.Comments.Remove(existingComment);
            repo.Comments.Delete(existingComment);
            await repo.Save();
        }

        private async Task<ParentItemDto> GetChildrenToParent(string ParentId)
        {
            // var parent = await context.Comments
            //     .Where(x => x.CommentId.Equals(Guid.Parse(ParentId)))
            //     .FirstOrDefaultAsync();
            var parent = await repo.Comments.GetParentByCommentIdAsync(ParentId);

            var parentDto = mapper.Map<ParentItemDto>(parent);

            // var ListChildren = await context.Comments
            //     .Where(x => x.ParentId.Equals(Guid.Parse(ParentId)))
            //     .ToListAsync();
            var ListChildren = await repo.Comments
                .FindByCondition(x => x.ParentId.Equals(ParentId))
                .Include(x => x.ApplicationUser)
                .ToListAsync();

            var newListChildren = new List<ChildItemDto>();
            foreach (var child in ListChildren)
            {
                var newChild = mapper.Map<ChildItemDto>(child);
                var user = await userManager.FindByIdAsync(child.ApplicationUser.Id);
                newChild.Username = user.UserName;
                newListChildren.Add(newChild);
            }
            parentDto.childItems = newListChildren;
            return parentDto;
        }

        private async Task AddReplyCommentAsync(CommentDto dto, ApplicationUser user)
        {
            var post = await repo.Posts
                .FindByCondition(x => x.PostId.Equals(Guid.Parse(dto.PostId)))
                .FirstOrDefaultAsync();
            var newComment = mapper.Map<Comments>(dto);
            newComment.CreatedDate = DateTimeOffset.UtcNow;
            newComment.ApplicationUser = user;
            var parentCommentAuthor = await repo.Comments
                .FindByCondition(x => x.CommentId.Equals(Guid.Parse(dto.ParentId)))
                .Include(x => x.ApplicationUser)
                .Select(x => x.ApplicationUser)
                .FirstOrDefaultAsync();
            if (!parentCommentAuthor.Id.Equals(user.Id))
            {
                MailContent mailContent = new MailContent();
                mailContent.To = parentCommentAuthor.Email;
                mailContent.Subject = $"User {user.UserName} has reply to your comment";
                mailContent.Body = $"Your Comment on Idea {post.title} has been reply by User {user.UserName}";
                await mailService.SendMail(mailContent);
            }
            if (ModelState.IsValid)
            {
                repo.Comments.Create(newComment);
                await repo.Save();
            }
        }
    }
}