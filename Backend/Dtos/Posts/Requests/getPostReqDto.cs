using System;
namespace WebEnterprise_mssql.Api.Dtos
{
    public class getPostReqDto
    {
        public Guid postId { get; set; }
        public string userId { get; set; }
        public string username { get; set; }
    }
}