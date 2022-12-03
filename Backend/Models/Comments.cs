using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebEnterprise_mssql.Api.Models
{
    public class Comments
    {
        [KeyAttribute]
        public Guid CommentId { get; set; }
        public string Content { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset LastModifiedDate { get; set; }
        [Required]
        public bool IsChild { get; set; }
        public bool IsAnonymous { get; set; }
        public string ParentId { get; set; }

        public string userId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }
        public string PostId { get; set; }
        public virtual Posts Posts { get; set; }
    }
}