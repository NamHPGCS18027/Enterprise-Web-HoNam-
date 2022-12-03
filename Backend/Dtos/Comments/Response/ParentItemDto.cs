using System;
using System.Collections.Generic;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class ParentItemDto
    {
        public Guid CommentId { get; set; }
        public string PostId { get; set; }
        public string Username { get; set; }
        public bool IsAnonymous { get; set; }
        public string Content { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset LastModifiedDate { get; set; }
        public List<ChildItemDto> childItems { get; set; }
    }
}