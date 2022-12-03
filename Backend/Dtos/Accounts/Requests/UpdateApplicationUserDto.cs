using System;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class UpdateApplicationUserDto
    {
        [Required]
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Address { get; set; }
        public string fullname { get; set; }
        public DateTime? DOB { get; set; }

    }
}