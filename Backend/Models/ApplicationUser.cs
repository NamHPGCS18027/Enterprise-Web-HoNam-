using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace WebEnterprise_mssql.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        //public int? Age { get; set; }

        public string EmployeeId { get; set; }
        public string Fullname { get; set; }
        public DateTime? DOB { get; set; }
        public string Address { get; set; }

        //
        public string DepartmentId { get; set; }
        public virtual Departments Departments { get; set; }
        public string RoleId { get; set; }
        public virtual Roles RoleName { get; set; }

        //Foreign Key
        public virtual ICollection<Posts> Posts { get; set; }
        public virtual ICollection<Views> Views { get; set; }
        public virtual ICollection<Comments> Comments { get; set; }
        public virtual ICollection<Votes> Votes { get; set; }
    }
}


//Age = Now - DOB
//Position = Role
//Department