using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebEnterprise_mssql.Api.Models
{
    public class Views
    {
        [KeyAttribute]
        public Guid ViewId { get; set; }
        public DateTimeOffset LastVistedDate { get; set; }

        public string userId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }

        public Guid postId { get; set; }
        public virtual Posts Posts { get; set; }
    }
}