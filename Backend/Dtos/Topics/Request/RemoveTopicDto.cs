using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class RemoveTopicDto
    {
        [Required]
        public string TopicId { get; set; }
    }
}