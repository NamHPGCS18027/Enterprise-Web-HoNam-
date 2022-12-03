using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class UsersRegistrationDto
    {
        [Required]
        public string Fullname { get; set; }
        [Required]
        public string EmployeeId { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}