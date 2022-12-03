using System.Collections.Generic;
namespace WebEnterprise_mssql.Api.Dtos
{
    public class UserProfileResponseDto
    {
        public string EmployeeId { get; set; }
        public string username { get; set; }
        public string Fullname { get; set; }
        public string Department { get; set; }
        public string email { get; set; }
        public List<string> role { get; set; }
        public string message { get; set; }
        public UserProfileResponseDto()
        {
            role = new List<string>();
        }
    }
}