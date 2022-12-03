using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class CreateTopicDto
    {
        [Required]
        public string TopicName { get; set; }
        [Required]
        public string TopicDesc { get; set; }
        [Required]
        public DateTime ClosureDate { get; set; }
        [Required]
        public DateTime FinalClosureDate { get; set; }
    }
}