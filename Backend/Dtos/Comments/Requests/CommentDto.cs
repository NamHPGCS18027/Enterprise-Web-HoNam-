using System.ComponentModel.DataAnnotations;
using System;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class CommentDto
    {
        [Required]
        public string PostId { get; set; }
        [Required]
        public string Content { get; set; }
        [Required]
        public bool IsAnonymous { get; set; }

        //if comment replying any other comment
        [Required]
        public bool IsChild { get; set; }
        // public string PreviousCommentId { get; set; }
        public string ParentId { get; set; }
    }
}