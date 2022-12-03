using System.Net.Mime;
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
using WebEnterprise_mssql.Api.Dtos;
using WebEnterprise_mssql.Api.Models;
using WebEnterprise_mssql.Api.Repository;
using WebEnterprise_mssql.Api.Services;
using Microsoft.Extensions.Logging;

namespace WebEnterprise_mssql.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // api/Topics
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class TopicsController : ControllerBase 
    {
        private readonly IMapper mapper;
        private readonly IRepositoryWrapper repo;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly ISendMailService mailService;
        private readonly ILogger<TopicsController> logger;

        public TopicsController(
            IMapper mapper,
            IRepositoryWrapper repo, 
            UserManager<ApplicationUser> userManager, 
            RoleManager<IdentityRole> roleManager,
            ISendMailService mailService,
            ILogger<TopicsController> logger)
        {
            this.mapper = mapper;
            this.repo = repo;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.mailService = mailService;
            this.logger = logger;
        }

        //GET get all post of this topic
        [HttpGet]
        [Route("GetAllPostFromTopic")]
        public async Task<IActionResult> GetListPostsFromThisTopicAsync(TopicIdDto dto) {
            var listPosts = await repo.Posts
                .FindByCondition(x => x.TopicId.Equals(Guid.Parse(dto.TopicId)))
                .ToListAsync();
            var topic = await repo.Topics
                .FindByCondition(x => x.TopicId.Equals(Guid.Parse(dto.TopicId)))
                .FirstOrDefaultAsync();
            if (listPosts.Count().Equals(0))
            {
                return NotFound($"No Post Available in Topic {topic.TopicName}");
            }
            var listPostsDto = new List<PostDetailDto>();
            foreach (var post in listPosts)
            {
                var newPostDto = mapper.Map<PostDetailDto>(post);
                newPostDto.ListCategoryName = GetListCategoriesName(post);
            }
            return Ok(listPostsDto);
        }

        //GET get all Topic 
        [HttpGet]
        [Route("GetAllTopic")]
        public async Task<IActionResult> GetListTopicAsync() {
            var listTopics = await repo.Topics
                .FindAll()
                .ToListAsync();
            if (listTopics.Count().Equals(0))
            {
                return Ok("No Topic available");
            }
            return Ok(listTopics);
        }

        //GET get Topic Details
        [HttpGet]
        [Route("GetTopicById")]
        public async Task<IActionResult> GetTopicDetailAsync(TopicIdDto dto) {
            var topic = await repo.Topics
                .FindByCondition(x => x.TopicId.Equals(dto.TopicId))
                .FirstOrDefaultAsync();
            if (topic is null)
            {
                return NotFound();
            }
            return Ok(topic);
        }

        //POST create Toptc
        [HttpPost]
        [Route("CreateTopic")]
        [Authorize(Roles = "admin, staff, qac, qam")]
        public async Task<IActionResult> CreateTopicAsync(CreateTopicDto dto, [FromHeader] string Authorization) {
            ApplicationUser user = new();
            try
            {
                user = await DecodeToken(Authorization);
            }
            catch (System.Exception ex)
            {
                logger.LogInformation($"Decode Token Error: {ex}");
            }
            if (dto.FinalClosureDate <= dto.ClosureDate)
            {
                return BadRequest($"Final Closure Date must be after Date: {dto.ClosureDate}");
            }
            var existingTopic = await repo.Topics
                .FindByCondition(x => x.TopicName.ToLower().Equals(dto.TopicName.ToLower()))
                .FirstOrDefaultAsync();
            if (existingTopic is null)
            {
                var newTopic = mapper.Map<Topics>(dto);
                if (ModelState.IsValid)
                {
                    repo.Topics.Create(newTopic);
                    await repo.Save();
                }

                //Send Mail to All Employee
                await SendNotiThroughMail(dto.TopicName, user.UserName);

                return Ok($"Topic {dto.TopicName} has been created!");
            }
            return BadRequest($"Topic name {dto.TopicName} has already exist");
        }

        //DELETE remove Topic
        [HttpDelete]
        [Route("RemoveTopic")]
        public async Task<IActionResult> RemoveTopicAsync(RemoveTopicDto removeTopicDto) {
            var listPosts = await repo.Posts
                .FindByCondition(x => x.TopicId.Equals(removeTopicDto.TopicId))
                .ToListAsync();
            var Topic = await repo.Topics
                .FindByCondition(x => x.TopicId.Equals(Guid.Parse(removeTopicDto.TopicId)))
                .FirstOrDefaultAsync();
            if (listPosts.Count().Equals(0))
            {
                repo.Topics.Delete(Topic);
                await repo.Save();
                return Ok($"Topic {Topic.TopicName} has been deleted");
            }
            return BadRequest($"All post inside Topic {Topic.TopicName} must be removed before Atempting to remove this Topic");
        }

        //PUT update Topic
        [HttpPut]
        [Route("UpdateTopic")]
        public async Task<IActionResult> UpdateTopicAsync(UpdateTopicDto dto) {
            var existingTopic = await repo.Topics
                .FindByCondition(x => x.TopicId.Equals(Guid.Parse(dto.TopicId)))
                .FirstOrDefaultAsync();
            if (existingTopic is null)
            {
                return NotFound($"Topic with ID: {dto.TopicId} not found");
            }
            var newTopic = mapper.Map<Topics>(dto);
            if (ModelState.IsValid)
            {
                repo.Topics.Update(newTopic);
                await repo.Save();
                return Ok($"Topic {newTopic.TopicName} has been updated");
            }
            return BadRequest($"Error in updating Topic {dto.TopicName}");
        }

        private List<string> GetListCategoriesName(Posts post) {
            var listCateName = new List<string>();
            foreach (var cate in post.categories)
            {
                listCateName.Add(cate.CategoryName);
            }
            return listCateName;
        }

        private async Task SendNotiThroughMail(string title, string author) {
            var allUser = await repo.Users.FindAll().ToListAsync();
            MailContent mailContent = new();

            var today = DateTimeOffset.UtcNow;    
            mailContent.Subject = $"New Topic created on {today}";
            mailContent.Body = $"A new Topic created with title: {title} by Admin {author}";

            foreach (var user in allUser)
            {
                mailContent.To = user.Email;
                await mailService.SendMail(mailContent);
            }
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