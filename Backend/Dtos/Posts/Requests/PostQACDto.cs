using System.ComponentModel.DataAnnotations;
using System;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class PostQACDto
    {
        [Required]
        public Guid postId { get; set; }
        [Required]
        public Guid QACId { get; set; }
    }
}