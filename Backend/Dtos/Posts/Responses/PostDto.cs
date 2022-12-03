using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Dtos
{
    public record PostDto
    {
        public Guid PostId { get; set; }
        [Required]
        public string title { get; set; }
        public string Desc { get; set; }
        [Required]
        public string content { get; set; }
        public DateTimeOffset createdDate { get; set; }
        public DateTimeOffset LastModifiedDate { get; set; }
        public bool isAnonymous { get; set; }
        public int ViewsCount { get; set; } 
        public string UserId { get; set; }
        public string username { get; set; }
        public Guid CategoryId { get; set; }
        public Guid SubmissionId { get; set; }
        public List<string> FilesPaths { get; set; }
        public List<string> Message { get; set; }
    }
}