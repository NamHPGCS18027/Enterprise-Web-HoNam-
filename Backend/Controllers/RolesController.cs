using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using WebEnterprise_mssql.Api.Models;
using WebEnterprise_mssql.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace WebEnterprise_mssql.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // api/Roles
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class RolesController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly ILogger<RolesController> logger;
        public RolesController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogger<RolesController> logger)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.logger = logger;
        }

        [HttpGet]
        public IActionResult GetAllRolesAsync() {
            var roles = roleManager.Roles.ToList();
            return Ok(roles);
        }

        [HttpPost]
        [Route("CreateRole")]
        public async Task<IActionResult> CreateRoleAsync(CreateRoleNameDto dto) {
            var roleNameLower = dto.RoleName.ToLower();

            //Check if the Role is exist
            var existingRole = await roleManager.RoleExistsAsync(roleNameLower);

            if(!existingRole) //Check role exist status
            {
                //Check the Role is created success
                var roleResult = await roleManager.CreateAsync(new IdentityRole(roleNameLower));
                if(roleResult.Succeeded) {
                    logger.LogInformation($"the Role {roleNameLower} has been created successfully!!!");
                    return Ok(new {
                        result = $"the Role {roleNameLower} has been added successfully"
                    });
                } else {
                    logger.LogInformation($"the Role {roleNameLower} has NOT been created!!!");                    
                    return BadRequest(new {
                        error = $"the Role {roleNameLower} has NOT been added!!!"
                    });
                }
            }
            return BadRequest(new {
                Error = "Role already Exist!!!"
            });          
        }

        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<IActionResult> GetAllUsersAsync() {
            var users = await userManager.Users.ToListAsync();
            return Ok(users);
        }

        [HttpPost]
        [Route("AddUserToRole")]
        public async Task<IActionResult> AddUsertoRoleAsync(string email, string roleName) {
            
            // check if the user exist
            var user = await userManager.FindByEmailAsync(email);

            if(user is null) {
                logger.LogInformation($"The user with email: {email} does NOT exist!!!");
                return BadRequest(new {error = "User not found"});
            }
            //check if the rolename exist
            var role = await roleManager.RoleExistsAsync(roleName);
            
            if (!role)
            {
                logger.LogInformation($"the role name {roleName} does NOT exist!!!");
                return BadRequest(new {error = "Role NOT found!!!"});
            }

            //check if the user is  assigned to the role successfully
            var result = await userManager.AddToRoleAsync(user, roleName);
            if(!result.Succeeded){
                logger.LogInformation($"The User with email {email} was not assigned with Role {roleName}");
                return BadRequest(new {error = "The role was not abot to assigned to the user"});
            } else {
                return Ok(new {
                    result = $"the user with email {email} has been assigned with Role {roleName}"
                });
            }
        }

        [HttpGet] 
        [Route("GetUserRole")]
        public async Task<IActionResult> GetUserRoleAsync(string email) {
            //Check if email is null
            if (email is null)
            {
                return BadRequest("email param cannot be null!!!");
            }

            //Check if the email is exist
            var user = await userManager.FindByEmailAsync(email);

            if (user is null)
            {
                logger.LogInformation($"The User with email {email} does NOT exist!!!");
                return BadRequest(new {
                    error = "The user was NOT found!!!"
                });
            }
            
            //return the role
            var roles = await userManager.GetRolesAsync(user);

            return Ok(roles);
        }

        [HttpPost]
        [Route("RemoveUserRole")]
        public async Task<IActionResult> RemoveUserRoleAsync(string email, string roleName) {
            // check if the user exist
            var user = await userManager.FindByEmailAsync(email);

            if(user is null) {
                logger.LogInformation($"The user with email: {email} does NOT exist!!!");
                return BadRequest(new {error = "User not found"});
            }
            //check if the rolename exist
            var role = await roleManager.RoleExistsAsync(roleName);
            
            if (!role)
            {
                logger.LogInformation($"the role name {roleName} does NOT exist!!!");
                return BadRequest(new {error = "Role NOT found!!!"});
            }

            var result = await userManager.RemoveFromRoleAsync(user, roleName);

            if(!result.Succeeded) {
                logger.LogInformation($"the role name {roleName} was NOT removed!!!");
                return BadRequest(new {error = "Role was NOT removed!!!"});
            } else {
                logger.LogInformation($"the role name {roleName} was successfully removed from user with email {email}!!");
                return Ok(new {result = "Role was successfully removed from user"});
            }
        }
    }
}