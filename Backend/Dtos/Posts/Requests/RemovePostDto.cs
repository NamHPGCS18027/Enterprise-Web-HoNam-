using System;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class RemovePostDto
    {
        [Required]
        public Guid PostId { get; set; }
        [Required]
        public string TopicId { get; set; }
    }
}