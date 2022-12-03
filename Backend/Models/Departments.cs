using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Models
{
    public class Departments
    {
        [KeyAttribute]
        public Guid DepartmentId { get; set; }
        public string DepartmentName { get; set; }


        public virtual ICollection<ApplicationUser> ApplicationUser { get; set; }
    }
}