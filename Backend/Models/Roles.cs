using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Models
{
    public class Roles
    {
        [KeyAttribute]
        public Guid RoleId { get; set; }
        public string RoleName { get; set; }

        public virtual ICollection<ApplicationUser> ApplicationUser { get; set; }
    }
}