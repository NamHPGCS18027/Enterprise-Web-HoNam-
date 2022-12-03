using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebEnterprise_mssql.Api.Models;
using System.Collections.Generic;
using WebEnterprise_mssql.Api.Dtos;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using AutoMapper;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using System.IO;
using WebEnterprise_mssql.Api.Repository;
using Microsoft.EntityFrameworkCore;
using WebEnterprise_mssql.Api.Services;
using Microsoft.Extensions.Logging;

namespace WebEnterprise_mssql.Api.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "staff")]
    public class PostsController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IRepositoryWrapper repo;
        private readonly ISendMailService mailService;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly ILogger<PostsController> logger;
        private readonly IMapper mapper;
        private readonly UserManager<ApplicationUser> userManager;
        public PostsController(
            IMapper mapper,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            IRepositoryWrapper repo,
            ISendMailService mailService,
            RoleManager<IdentityRole> roleManager,
            ILogger<PostsController> logger)
        {
            this.configuration = configuration;
            this.repo = repo;
            this.mailService = mailService;
            this.roleManager = roleManager;
            this.logger = logger;
            this.userManager = userManager;
            this.mapper = mapper;
        }

        //QAC Sections
        [HttpGet]
        [Route("QACListPost")]
        [Authorize(Roles = "qac, qam")]
        public async Task<IActionResult> GetAllUnAssignedPosts()
        {
            var listPosts = await repo.Posts
                .FindAll()
                .ToListAsync();
            var listPostsDto = new List<PostDto>();
            foreach (var post in listPosts)
            {
                if (post.Status.Equals(0) /*Status = 0 (in progress)*/ && post.IsAssigned.Equals(false))
                {
                    var newPostDto = mapper.Map<PostDto>(post);
                    listPostsDto.Add(newPostDto);
                }
            }
            return Ok(listPostsDto);
        }

        [HttpPost]
        [Route("AssignToQAC")]
        [Authorize(Roles = "qac")]
        public async Task<IActionResult> AssignedPostToQAC(PostQACDto dto)
        {
            var post = await repo.Posts
                .FindByCondition(x => x.PostId.Equals(dto.postId))
                .FirstOrDefaultAsync();
            var QAC = await userManager.FindByIdAsync(dto.QACId.ToString());

            post.QACUserId = QAC.Id;
            post.IsAssigned = true;

            repo.Posts.Update(post);
            await repo.Save();

            var postDto = mapper.Map<PostDto>(post);
            return RedirectToAction(nameof(GetPostByIDAsync), postDto);
        }

        [HttpPost]
        [Route("QACfeedback")]
        [Authorize(Roles = "qac, qam")]
        public async Task<IActionResult> GetFeedbackFromQAC(QACFeedbackDto dto)
        {
            var post = await repo.Posts
                .FindByCondition(x => x.PostId.Equals(dto.postId))
                .FirstOrDefaultAsync();
            mapper.Map(dto, post);

            switch (dto.IsApproved)
            {
                case true: post.Status = 1; break; //Status = 1 (approved)
                case false: post.Status = 2; break; //Status = 2 (rejected)
            }

            if(ModelState.IsValid)
            {
                repo.Posts.Update(post);
                await repo.Save();
            }
            
            //Send Notification to Author
            var today = DateTime.UtcNow;
            var topic = await repo.Topics
                .FindByCondition(x => x.TopicId.Equals(post.TopicId))
                .FirstOrDefaultAsync();
            var adminEmail = await repo.Users
                .FindByCondition(x => x.RoleName.RoleName.Equals("admin"))
                .Select(x => x.Email)
                .FirstOrDefaultAsync();
            MailContent mailContent = new();
            var author = await userManager.FindByIdAsync(post.UserId);
            mailContent.To = author.Email;
            mailContent.Subject = $"Your Post {post.title} has been reviewed";
            switch (dto.IsApproved)
            {
                case true:
                    mailContent.Body = $"Your Idea on Topic '{topic.TopicName}' has been approved by a QAC on {today}";
                    break;

                case false:
                    mailContent.Body = $"Your Idea on Topic '{topic.TopicName}' has been rejected on {today}";
                    break;
            }

            await mailService.SendMail(mailContent);
            await SendNotiToEmail(adminEmail, mailContent);
            return new JsonResult("Feedback Received!!!") { StatusCode = 200 };
        }

        //Staff Section
        [HttpGet]
        [Route("PostFeedSortByCreatedDate")]
        public async Task<IActionResult> GetAllPostsSortedByCreatedDateAsync([FromHeader] string Authorization)
        {
            var user = await DecodeToken(Authorization);
            var listPost = await GetAllPostsAsync(user);
            if(listPost is null)
            {
                return new JsonResult("No Posts Available") { StatusCode = 204 };
            }
            return Ok(listPost.OrderByDescending(x => x.createdDate).ToList());
        }

        [HttpGet]
        [Route("GetAllPostsSortedByView")]
        public async Task<IActionResult> GetAllPostsSortedByViewAsync([FromHeader] string Authorization)
        {
            var user = await DecodeToken(Authorization);
            var listPost = await GetAllPostsAsync(user);
            if(listPost is null)
            {
                return new JsonResult("No Posts Available") { StatusCode = 204 };
            }
            return Ok(listPost.OrderByDescending(x => x.ViewsCount).ToList());
        }

        [HttpGet]
        [Route("GetAllPostsSortedByCommentsCount")]
        public async Task<IActionResult> GetAllPostsSortedByCommentsCountAsync([FromHeader] string Authorization)
        {
            var user = await DecodeToken(Authorization);
            var listPost = await GetAllPostsAsync(user);
            if (listPost is null)
            {
                return new JsonResult("No Posts Available") { StatusCode = 204 };
            }
            var listItem = new List<dynamic>();
            foreach(var post in listPost)
            {
                var listComments = await repo.Comments.FindByCondition(x => x.PostId.Equals(post.PostId.ToString())).ToListAsync();
                var item = new
                {
                    post,
                    commentCount = listComments.Count()
                };
                listItem.Add(item);
            }
            try
            {
                var sortedResult = listItem.OrderByDescending(x => x.commentCount).Select(x => x.post).ToList();
                return Ok(sortedResult);
            }
            catch(Exception ex)
            {
                logger.LogInformation($"Error Sorted Result: {ex}");
                return new JsonResult("Server Exception Error!!!") { StatusCode = 500 };
            }
        }
        
        private async Task<List<PostDetailDto>> GetAllPostsAsync(ApplicationUser user)
        {
            var listPosts = await repo.Posts
                .FindAll()
                .Include(x => x.categories)
                .ToListAsync();
            var listTopic = await repo.Topics
                .FindAll().ToListAsync();
            var allApprovedPosts = new List<PostDetailDto>();
            foreach (var post in listPosts)
            {
                if (post.Status.Equals(1)) //Status = 1 (approved)
                {
                    var result = mapper.Map<PostDetailDto>(post);
                    result.FilesPaths = await GetFilePaths(post.PostId);
                    List<string> listCateId = new();
                    foreach (var cate in post.categories)
                    {
                        listCateId.Add(cate.CategoryId.ToString());
                    }
                    result.TopicName = listTopic.Where(x => x.TopicId.Equals(post.TopicId))
                        .Select(x => x.TopicName)
                        .FirstOrDefault();
                    result.ListCategoryName = await GetListCategoriesNameAsync(listCateId);
                    result.ViewsCount = await CheckViewCount(user.UserName, post.PostId);
                    allApprovedPosts.Add(result);
                }
            }
            //var postsDto = mapper.Map<List<PostDto>>(listPosts);
            if (allApprovedPosts.Count().Equals(0))
            {
                return null;
            }
            return allApprovedPosts;
        }

        [HttpGet]
        [Route("MyPost")]
        public async Task<IActionResult> GetAllPostsFromUserIDAsync([FromHeader] string Authorization)
        {
            var user = await DecodeToken(Authorization);

            var listPosts = await repo.Posts
                .FindByCondition(x => x.UserId.Equals(user.Id))
                .ToListAsync();
            var sortedListPosts = listPosts.OrderBy(x => x.Status).ToList();

            var listPostsDto = new List<PostDetailDto>();
            foreach (var post in sortedListPosts)
            {
                var result = mapper.Map<PostDetailDto>(post);
                result.StatusMessage = GetStatusMessageAsync(post.Status);

                List<string> listCateId = new();
                foreach (var cate in post.categories)
                {
                    listCateId.Add(cate.CategoryId.ToString());
                }

                result.ListCategoryName = await GetListCategoriesNameAsync(listCateId);
                result.ViewsCount = await CheckViewCount(user.UserName, post.PostId);
                listPostsDto.Add(result);
            }

            return Ok(listPostsDto);
        }

        [HttpGet]
        [Route("PostDetail")]
        public async Task<IActionResult> GetPostByIDAsync(string postId, [FromHeader] string Authorization)
        {
            var user = await DecodeToken(Authorization);
            // //Check if username is correct
            // if (!getPostReqDto.username.Equals(user.UserName))
            // {
            //     return BadRequest(new AccountsResult()
            //     {
            //         Errors = new List<string>() {
            //             "username is NOT match with token!!!"
            //         },
            //         Success = false
            //     });
            // }

            var post = await repo.Posts.GetPostByIDAsync(Guid.Parse(postId));
            if (post is null)
            {
                return NotFound();
            }
            var result = new PostDetailDto();
            mapper.Map(post, result);

            var listCateIdOfThisPost = new List<string>();
            foreach (var cate in post.categories)
            {
                listCateIdOfThisPost.Add(cate.CategoryId.ToString());
            }

            var topicName = await repo.Topics
                .FindByCondition(x => x.TopicId.Equals(post.TopicId))
                .Select(x => x.TopicName)
                .FirstOrDefaultAsync();
            if (topicName is not null)
            {
                result.TopicName = topicName;
            }

            result.ListCategoryName = await GetListCategoriesNameAsync(listCateIdOfThisPost);
            result.ViewsCount = await CheckViewCount(user.UserName, post.PostId);
            result.FilesPaths = await GetFilePaths(post.PostId);

            return Ok(result);
        }

        [HttpPost]
        [Route("CreatePost")]
        public async Task<IActionResult> CreatePostAsync([FromForm] CreatePostDto dto, [FromHeader] string Authorization, [FromForm] List<IFormFile> files)
        {
            var check = await CheckValidTopic(dto.TopicId);
            dto.Status = 0; //Set to 0 by default (In progress)
            if (check is not null)
            {
                return BadRequest($"{check}");
            }

            if (Authorization is null)
            {
                return BadRequest(new
                {
                    error = "the Authorization params is NOT exist!!!"
                });
            }

            var user = await DecodeToken(Authorization);
            if (user.DepartmentId is null)
            {
                return BadRequest($"User {user.UserName} is not assigned to any Department!!!");
            }

            if (ModelState.IsValid)
            {
                var newPost = mapper.Map<Posts>(dto);
                newPost.createdDate = DateTimeOffset.UtcNow;
                newPost.UserId = user.Id;
                newPost.username = user.UserName;

                //Add Cate Tag To Post
                newPost.categories = await GetListObjCateAsync(dto.listCategoryId);

                CheckEntityEntry(newPost);

                repo.Posts.CreatePostAsync(newPost);
                await repo.Save();

                var qacEmail = await repo.Users
                    .FindByCondition(x => x.RoleName.RoleName.Equals("qac"))
                    .Select(x => x.Email)
                    .FirstOrDefaultAsync();
                var qamEmail = await repo.Users
                    .FindByCondition(x => x.DepartmentId.Equals(Guid.Parse(user.DepartmentId)))
                    .Select(x => x.Email)
                    .FirstOrDefaultAsync();
                MailContent mailContent = new();
                mailContent.Subject = $"New Idea Submission!";
                mailContent.Body = $"User {user.UserName} has submitted an Idea on {DateTimeOffset.UtcNow}";
                await SendNotiToEmail(qacEmail, mailContent);
                await SendNotiToEmail(qamEmail, mailContent);

                var newPostDto = mapper.Map<PostDetailDto>(newPost);

                newPostDto.ListCategoryName = await GetListCategoriesNameAsync(dto.listCategoryId);
                newPostDto.FilesPaths = await UploadFiles(files, user.UserName, newPost.PostId);

                return Ok(newPostDto);
                // return Ok($"Post {newPost.PostId} created!");
            }
            return new JsonResult("Error in creating Post") { StatusCode = 500 };
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePostsAsync(UpdatedPostDto dto)
        {
            var topic = await repo.Topics
                .FindByCondition(x => x.TopicId.Equals(dto.TopicId))
                .FirstOrDefaultAsync();
            if (topic.ClosureDate <= DateTime.UtcNow)
            {
                return Forbid($"Post cannot be updated for Topic {topic.TopicName} after Date: {topic.ClosureDate.UtcDateTime}");
            }

            // var existingPost = await context.Posts.FirstOrDefaultAsync(x => x.PostId == updatedPostDto.postId);
            var existingPost = await repo.Posts.GetPostAsync(dto.postId.ToString());
            if (existingPost is null)
            {
                return NotFound();
            }

            //update new value to var existingPost
            mapper.Map(dto, existingPost);
            existingPost.LastModifiedDate = DateTimeOffset.UtcNow;
            existingPost.Status = 0; //Set status back to 0 (in progress)

            // context.Posts.Update(existingPost);
            // await context.SaveChangesAsync();
            repo.Posts.Update(existingPost);
            await repo.Save();

            //Get all QAC role users
            var listUser = await userManager.Users.ToListAsync();
            var listQac = listUser.Where(x => x.RoleName.RoleName.Equals("qac")).ToList();

            foreach (var qac in listQac)
            {
                MailContent mailContent = new();
                mailContent.To = qac.Email;

                mailContent.Subject = $"User {existingPost.username} has update an Idea";

                var today = DateTime.UtcNow;
                mailContent.Body = $"Idea {existingPost.title} under Topic {topic.TopicName} has been updated on {today} and waiting for review";

                await mailService.SendMail(mailContent);
            }

            var newPostDto = mapper.Map<PostDto>(existingPost);
            newPostDto.FilesPaths = await UploadFiles(dto.files, existingPost.username, existingPost.PostId);

            return CreatedAtAction(nameof(GetPostByIDAsync), newPostDto);
        }

        [HttpDelete]
        [Route("Deletepost")]
        public async Task<IActionResult> DeletePostAsync(RemovePostDto dto)
        {
            var topic = await repo.Topics
                .FindByCondition(x => x.TopicId.Equals(Guid.Parse(dto.TopicId)))
                .FirstOrDefaultAsync();
            if (topic.ClosureDate <= DateTime.UtcNow)
            {
                return Forbid($"Post cannot be removed for Topic {topic.TopicName} after Date: {topic.ClosureDate.UtcDateTime}");
            }

            var existingPost = await repo.Posts
                .FindByCondition(x => x.PostId.Equals(dto.PostId))
                .FirstOrDefaultAsync();
            if (existingPost is null)
            {
                return NotFound();
            }
            try
            {
                repo.Posts.Delete(existingPost);
                await repo.Save();
            }
            catch (System.Exception ex)
            {
                return new JsonResult($"Error Message: {ex}") { StatusCode = 500 };
            }

            //Delete Files in directory
            DeleteFiles(existingPost.PostId, existingPost.username);

            return new JsonResult($"Post {dto.PostId} had been deleted successfully!") { StatusCode = 200 };
        }

        //=================================================================================================================================
        //=================================================================================================================================
        //INTERAL STATIC METHODS
        //=================================================================================================================================
        //=================================================================================================================================
        private string GetStatusMessageAsync(int StatusCode)
        {
            switch (StatusCode)
            {
                case 0: return "Pending";
                case 1: return "Approved";
                case 2: return "Rejected";
                default: return "N/A";
            }
        }
        private async Task SendNotiToEmail(string email, MailContent mailContent)
        {
            try
            {
                mailContent.To = email;
                await mailService.SendMail(mailContent);
            }
            catch (System.Exception ex)
            {
                logger.LogInformation($"Send Mail to {email} Error: {ex}");
            }
        }

        private async Task<string> CheckValidTopic(string TopicId)
        {
            var topic = await repo.Topics
                .FindByCondition(x => x.TopicId.Equals(Guid.Parse(TopicId)))
                .FirstOrDefaultAsync();
            if (TopicId is null)
            {
                return "Post must create under a Topic";
            }
            if (topic is null)
            {
                return $"No Topic with ID {TopicId} is available";
            }
            if (topic.ClosureDate <= DateTimeOffset.UtcNow)
            {
                return $"no more Post can be created for Topic {topic.TopicName} after Date {topic.ClosureDate.UtcDateTime}";
            }
            return null;
        }

        private void CheckEntityEntry(Posts post)
        {
            foreach (var cate in post.categories)
            {
                var cateEntry = repo.Categories.GetEntityEntry(cate);
                if (cateEntry.State == EntityState.Detached)
                {
                    //context.[Model].Attach(cate);
                    repo.Categories.AttachEntity(cate);
                }
            }
        }

        private async Task<ICollection<Categories>> GetListObjCateAsync(List<string> listCateId)
        {
            var ListObjCate = new List<Categories>();
            foreach (var cateId in listCateId)
            {
                var cate = await repo.Categories
                    .FindByCondition(x => x.CategoryId.Equals(Guid.Parse(cateId)))
                    .FirstOrDefaultAsync();
                ListObjCate.Add(cate);
            }
            return ListObjCate;
        }

        private async Task<List<string>> GetListCategoriesNameAsync(List<string> listCateId)
        {
            var listCateName = new List<string>();
            foreach (var cateId in listCateId)
            {
                var cateName = await repo.Categories
                    .FindByCondition(x => x.CategoryId.Equals(Guid.Parse(cateId)))
                    .Select(x => x.CategoryName)
                    .FirstOrDefaultAsync();
                listCateName.Add(cateName);
            }
            return listCateName;
        }

        private async void DeleteFiles(Guid postId, string username)
        {
            string rootPath = configuration["FileConfig:filePath"];
            var userRootPath = Path.Combine(rootPath, username, postId.ToString());
            if (Directory.Exists(userRootPath))
            {
                while (!Directory.GetFiles(userRootPath).Count().Equals(0))
                {
                    var files = Directory.GetFiles(userRootPath);
                    foreach (var fileItem in files)
                    {
                        System.IO.File.Delete(fileItem);

                        var filePathsArray = await repo.FilesPaths.GetListObj(postId.ToString());
                        repo.FilesPaths.RemoveListOfFilesPaths(filePathsArray);
                        await repo.Save();

                        Console.WriteLine($"file {fileItem} deleted!");
                    }
                }

                var postRootPath = Path.Combine(rootPath, username);
                if (!Directory.Exists(postRootPath))
                {
                    Console.WriteLine("can't get postRootPath");
                }
                else
                {
                    foreach (var path in Directory.GetDirectories(postRootPath))
                    {
                        if (path.Equals(userRootPath))
                        {
                            try
                            {
                                Console.WriteLine($"path : {path}");
                                Directory.Delete(path);
                            }
                            catch (System.Exception ex)
                            {
                                Console.WriteLine(ex);
                            }
                        }
                    }
                }

            }
            else
            {
                Console.WriteLine("path doesn't exist!!!");
            }
        }
        private async Task<List<string>> UploadFiles( //upload files to table FilePaths and return list of string of file paths
            List<IFormFile> files,
            string username,
            Guid postId)
        {

            string rootPath = configuration["FileConfig:filePath"];

            var listOfPaths = new List<string>();
            //Check if there is files or not
            if (!files.Count().Equals(0))
            {
                foreach (var formFile in files)
                {
                    if (!IsValidFileType(formFile))
                    {
                        listOfPaths.Add($"the file {formFile.FileName} is not accepted!!!");
                    }

                    var newFilePathObj = new FilesPath();
                    if (formFile.Length > 0)
                    {
                        var newRootPath = Path.Combine(rootPath, username, postId.ToString());
                        if (!Directory.Exists(newRootPath))
                        {
                            Directory.CreateDirectory(newRootPath);
                        }

                        //Config final File Paths that has username and post ID as parents folders directory
                        var finalFilePath = Path.Combine(newRootPath, MakeValidFileName(formFile.FileName));

                        newFilePathObj.PostId = postId;
                        newFilePathObj.filePath = finalFilePath;

                        repo.FilesPaths.Create(newFilePathObj);
                        await repo.Save();

                        listOfPaths.Add(finalFilePath);

                        using (var fileStream = new FileStream(finalFilePath, FileMode.OpenOrCreate))
                        {
                            await formFile.CopyToAsync(fileStream);
                        }
                    }
                }
            }
            return listOfPaths;
        }

        private IActionResult GetImageAsync(string filePath)
        {
            byte[] b = System.IO.File.ReadAllBytes(filePath);
            return File(b, "image/jpeg");
        }
        private async Task<List<string>> GetFilePaths(Guid postId)
        {

            var listFilePaths = await repo.FilesPaths
                .FindByCondition(x => x.PostId.Equals(postId))
                .Select(x => x.filePath)
                .ToListAsync();

            if (!listFilePaths.Count().Equals(0))
            {
                return listFilePaths;
            }
            else
            {
                return new List<string>() {
                    "No File Attached!!!"
                };
            }
        }

        private async Task<int> CheckViewCount(string username, Guid postId)
        {
            // //check if the params are null
            // if (username is null)
            // {
            //     return "username cannot be null!!!";
            // }

            //check if user existed in view count of post
            var listViewCount = await repo.Views.GetListUserIdString(postId);

            //get userID
            var user = await userManager.FindByNameAsync(username);
            var userID = user.Id.ToString();

            var postAuthor = await repo.Posts.GetPostAuthorAsync(postId.ToString());
            if (username.Equals(postAuthor))
            {
                return listViewCount.Count();
            }



            if (ModelState.IsValid)
            {
                if (listViewCount.Count().Equals(0))
                {
                    var newView = new Views()
                    {
                        ViewId = Guid.NewGuid(),
                        LastVistedDate = DateTimeOffset.UtcNow,
                        userId = userID,
                        postId = postId
                    };

                    repo.Views.Create(newView);
                    await repo.Save();
                }
                else
                {

                    if (listViewCount.Contains(userID))
                    {
                        return listViewCount.Count();
                    }
                    else
                    {
                        var newView = new Views()
                        {
                            ViewId = Guid.NewGuid(),
                            LastVistedDate = DateTimeOffset.UtcNow,
                            userId = userID,
                            postId = postId
                        };
                        repo.Views.Create(newView);
                        await repo.Save();
                    }
                }
            }


            await repo.Save();
            return listViewCount.Count();
        }

        private static bool IsValidFileType(IFormFile file)
        {
            string fileExtension = Path.GetExtension(file.FileName).ToLower();
            switch (fileExtension)
            {
                case ".doc": case ".docx": return true;
                case ".xls": case ".xlsx": return true;
                case ".jpg": case ".png": case ".jpeg": return true;
                default: return false;
            }
        }
        private static string MakeValidFileName(string name)
        {

            string invalidChars = System.Text.RegularExpressions.Regex.Escape(new string(System.IO.Path.GetInvalidFileNameChars()));
            string invalidRegStr = string.Format(@"([{0}]*\.+$)|([{0}]+) ", invalidChars);
            var newString = System.Text.RegularExpressions.Regex.Replace(name, invalidRegStr, "_").ToString();
            return newString;
        }

        private async Task<ApplicationUser> DecodeToken(string Authorization)
        {

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
    }
}