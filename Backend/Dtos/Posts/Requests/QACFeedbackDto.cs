using System;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class QACFeedbackDto
    {
        [Required]
        public Guid postId { get; set; }
        public string feedback { get; set; }
        [Required]
        public bool IsApproved { get; set; }
    }
}