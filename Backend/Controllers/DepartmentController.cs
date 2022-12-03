using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebEnterprise_mssql.Api.Models;
using WebEnterprise_mssql.Api.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using WebEnterprise_mssql.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Logging;

namespace WebEnterprise_mssql.Api.Controllers
{
    [ApiController]
    [Route("/api/[controller]")] // /api/department
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "qam")]
    public class DepartmentController : ControllerBase
    {
        private readonly IRepositoryWrapper repo;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ILogger<DepartmentController> logger;

        public DepartmentController(IRepositoryWrapper repo, UserManager<ApplicationUser> userManager, ILogger<DepartmentController> logger)
        {
            this.repo = repo;
            this.userManager = userManager;
            this.logger = logger;
        }

        //POST Assign to user 
        [HttpPost]
        [Route("AssignUserToDepartment")]
        public async Task<IActionResult> AssignDepartmentToUserAsync(NewDepartmentUserDto dto) {
            var user = await userManager.FindByIdAsync(dto.UserId.ToString());
            var department = await repo.Departments.FindByCondition(x => x.DepartmentId.Equals(dto.DepartmentId)).FirstOrDefaultAsync();
            user.DepartmentId = dto.DepartmentId.ToString();
            repo.Users.Update(user);
            await repo.Save();

            return new JsonResult($"User {user.UserName} has been assigned to Department {department.DepartmentName}") {StatusCode = 200};
        }

        //GET get all user in specific department
        [HttpGet]
        [Route("GetAllUserFromDepartment")]
        public async Task<IActionResult> GetAllUserFromDepartment(string departmentId) {
            var listUser = await repo.Users.FindByCondition(x => x.DepartmentId.Equals(departmentId)).ToListAsync();
            return Ok(listUser);
        }

        //GET get all
        [HttpGet]
        [Route("GetAllDepartment")]
        public async Task<IActionResult> GetListDepartmentAsync() {
            var list = await repo.Departments.FindAll().ToListAsync();
            return Ok(list);
        }

        //POST create Department
        [HttpPost]
        [Route("createDepartment")]
        public async Task<IActionResult> CreateDepartmentAsync(string DepartmentName) {
            var existingDepartment = await repo.Departments.FindByCondition(x => x.DepartmentName.Equals(DepartmentName)).FirstOrDefaultAsync();
            if (existingDepartment is not null) {
                return BadRequest($"{DepartmentName} already exist!");
            }
            var newDepartment = new Departments() {
                DepartmentId = Guid.NewGuid(),
                DepartmentName = DepartmentName
             };
            if (ModelState.IsValid)
            {
                try
                {
                    repo.Departments.Create(newDepartment);
                    await repo.Save();
                }
                catch (Exception ex)
                {
                    logger.LogInformation($"Saving Department Error: {ex}");
                }                
            }
            return Ok($"Department {DepartmentName} created successfully");
        }
    }
}