using System;
using System.Collections.Generic;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class ApplicationUserDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public int? Age { get; set; }
        public string Address { get; set; }
        public string Fullname { get; set; }
        public DateTime? DOB { get; set; }
        public List<string> Roles { get; set; }

        //Foreign Key
        public virtual ICollection<Posts> Posts { get; set; }
    }
}