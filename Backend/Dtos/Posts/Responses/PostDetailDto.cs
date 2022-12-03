using System;
using System.Collections.Generic;

namespace WebEnterprise_mssql.Api.Dtos
{
    public record PostDetailDto
    {
        public Guid PostId { get; set; }
        public string title { get; set; }
        public string Desc { get; set; }
        public string content { get; set; }
        public string feedback { get; set; }
        public DateTimeOffset createdDate { get; set; }
        public DateTimeOffset LastModifiedDate { get; set; }
        public bool isAnonymous { get; set; }
        public int ViewsCount { get; set; } 
        public string UserId { get; set; }
        public string username { get; set; }
        public List<string> ListCategoryName { get; set; }
        public string TopicName { get; set; }
        public string StatusMessage { get; set; }
        public List<string> FilesPaths { get; set; }
        public List<string> Message { get; set; }
    }
}