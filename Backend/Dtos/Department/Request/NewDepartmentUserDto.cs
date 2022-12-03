using System;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class NewDepartmentUserDto
    {
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public Guid DepartmentId { get; set; }
    }
}