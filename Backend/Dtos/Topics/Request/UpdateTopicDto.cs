using System;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class UpdateTopicDto
    {
        [Required]
        public string TopicId { get; set; }
        public string TopicName { get; set; }
        
        public DateTimeOffset ClosureDate { get; set; }
        
        public DateTimeOffset FinalClosureDate { get; set; }
    }
}