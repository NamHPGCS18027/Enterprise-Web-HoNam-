using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebEnterprise_mssql.Api.Data;
using WebEnterprise_mssql.Api.Dtos;
using WebEnterprise_mssql.Api.Models;
using WebEnterprise_mssql.Api.Repository;

namespace WebEnterprise_mssql.Api.Controllers
{
    [ApiController]
    [Route("/api/[controller]")] // /api/vote
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class VotesController : ControllerBase
    {


        private readonly UserManager<ApplicationUser> userManager;
        private readonly IMapper mapper;
        private readonly IRepositoryWrapper repo;

        public VotesController(
            ApiDbContext context,
            UserManager<ApplicationUser> userManager,
            IMapper mapper,
            IRepositoryWrapper repo
        )
        {
            this.mapper = mapper;
            this.userManager = userManager;
            this.repo = repo;

        }

        [HttpGet]
        [Route("GetUserVoteStatus")]
        public async Task<IActionResult> GetUserVoteStatus([FromHeader] string Authorization, string postId)
        {
            if (Authorization is null)
            {
                return BadRequest("Param Authoorization is null");
            }
            var user = await DecodeToken(Authorization);

            if (postId is null)
            {
                return BadRequest("Cannot get chosen Idea ID");
            }
            var userVoteStatus = new userVoteStatusDto()
            {
                UpVote = false,
                DownVote = false
            };
            var upVote = await repo.UpVotes
                .FindByCondition(x => x.postId.Equals(postId))
                .Where(x => x.userId.Equals(user.Id))
                .FirstOrDefaultAsync();
            if(upVote is not null)
            {
                userVoteStatus.UpVote = true;
            }

            var downVote = await repo.DownVote
                .FindByCondition(x => x.postId.Equals(postId))
                .Where(x => x.userId.Equals(user.Id))
                .FirstOrDefaultAsync();

            if(downVote is not null)
            {
                userVoteStatus.DownVote = true;
            }
            return Ok(userVoteStatus);
            
        }

        [HttpGet]
        [Route("GetVoteStatusOfPost")]
        public async Task<IActionResult> GetVoteStatus(string postId)
        {
            var voteStatus = await GetVote(postId);
            return Ok(voteStatus);
        }

        [HttpPost]
        [Route("voteBtnClick")]
        public async Task<IActionResult> VoteBtnClick(VoteBtnRequestDto dto, [FromHeader] string Authorization)
        {
            if (Authorization is null)
            {
                return BadRequest("Authorization Param is null");
            }
            var user = await DecodeToken(Authorization);

            //var vote = await context.Votes.Where(x => x.postId.Equals(voteBtnRequestDto.postId)).ToListAsync();
            var existingUpVote = await repo.UpVotes.FindByCondition(x => x.postId.Equals(dto.postId)).Where(x => x.userId.Equals(user.Id)).FirstOrDefaultAsync();
            var existingDownVote = await repo.DownVote.FindByCondition(x => x.postId.Equals(dto.postId)).Where(x => x.userId.Equals(user.Id)).FirstOrDefaultAsync();
            if ((existingUpVote is null) && (existingDownVote is null))
            {
                await AddVoteAsync(dto.postId, user.Id, dto.VoteInput);
                switch(dto.VoteInput)
                {
                    case true: return Ok($"User {user.UserName} vote up");
                    case false: return Ok($"User {user.UserName} vote down");
                }
            }
            else if((existingDownVote is null) && (existingUpVote is not null))
            {
                if(dto.VoteInput)
                {
                    await removeVotes(dto.postId, user.Id, true);
                }
                else
                {
                    await SwitchVoteTo(false, dto.postId, user.Id);
                }
            }
            else if((existingDownVote is not null) && (existingUpVote is null))
            {
                if(dto.VoteInput)
                {
                    await SwitchVoteTo(true, dto.postId, user.Id);
                }
                else
                {
                    await removeVotes(dto.postId, user.Id, false);
                }
            }
            await repo.Save();
            return CreatedAtAction(nameof(GetVoteStatus), new { dto.postId });
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
        private async Task<VoteDto> GetVote(string postId)
        {
            //var vote = await context.Votes.Where(x => x.postId.Equals(postId)).ToListAsync();
            var listUpvote = await repo.UpVotes
                .FindByCondition(x => x.postId.Equals(postId))
                .ToListAsync();
            var listDownVote = await repo.DownVote
                .FindByCondition(x => x.postId.Equals(postId))
                .ToListAsync();

            var voteDto = new VoteDto()
            {
                UpvoteCount = listUpvote.Select(x => x.userId).ToList().Count(),
                DownVoteCount = listDownVote.Select(x => x.userId).ToList().Count()
            };
            return voteDto;
        }

        private async Task SwitchVoteTo(bool UpDown, string postId, string userId)
        {
            //var vote = await context.Votes.Where(x => x.postId.Equals(postId)).ToListAsync();
            
            switch (UpDown) //Up = true, Down = false
            {
                case true:
                    {
                        await removeVotes(postId, userId, false);
                        await AddVoteAsync(postId, userId, true);
                        break;
                    }
                case false:
                    {
                        await removeVotes(postId, userId, true);
                        await AddVoteAsync(postId, userId, false);
                        break;
                    }
            }
            await repo.Save();
        }
        private async Task removeVotes(string postId, string userId, bool UpDown)
        {
            //var vote = await context.Votes.Where(x => x.voteId.Equals(voteId)).ToListAsync();
            switch(UpDown)
            {
                case true:
                    {
                        var upvote = await repo.UpVotes.FindByCondition(x => x.postId.Equals(postId)).Where(x => x.userId.Equals(userId)).FirstOrDefaultAsync();
                        repo.UpVotes.Delete(upvote);
                        break;
                    }
                case false:
                    {
                        var downVote = await repo.DownVote.FindByCondition(x => x.postId.Equals(postId)).Where(x => x.userId.Equals(userId)).FirstOrDefaultAsync();
                        repo.DownVote.Delete(downVote);
                        break;
                    }
            }
            await repo.Save();
        }

        private async Task AddVoteAsync(string postId, string userId, bool UpDown)
        {
            switch (UpDown)
            {
                case true: 
                    var newUpVote = new UpVote();
                    newUpVote.userId = userId;
                    newUpVote.postId = postId; 
                    repo.UpVotes.Create(newUpVote);
                    break;
                case false: 
                    var newDownVote = new DownVote();
                    newDownVote.userId = userId;
                    newDownVote.postId = postId;
                    repo.DownVote.Create(newDownVote);
                    break;
            }
            await repo.Save();
        }
    }
}