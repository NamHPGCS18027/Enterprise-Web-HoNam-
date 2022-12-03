using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Models
{
    public class Topics
    {
        [KeyAttribute]
        public Guid TopicId { get; set; }
        public string TopicName { get; set; }
        public string TopicDesc { get; set; }
        public DateTimeOffset ClosureDate { get; set; }
        public DateTimeOffset FinalClosureDate { get; set; }

        public ICollection<Posts> posts { get; set; }
        
    }
}