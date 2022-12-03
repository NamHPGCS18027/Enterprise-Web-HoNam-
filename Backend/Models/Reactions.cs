using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Models
{
    public class Reactions
    {
        [KeyAttribute]
        public Guid ReactionId { get; set; }
        public string ReactionType { get; set; }
        public string CreatedDate { get; set; }

        [ForeignKey("Users")]

        public virtual ICollection<ApplicationUser> ApplicationUser { get; set; }
    }
}