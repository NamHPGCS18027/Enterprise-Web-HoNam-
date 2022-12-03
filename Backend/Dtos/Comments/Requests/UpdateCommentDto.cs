namespace WebEnterprise_mssql.Api.Dtos
{
    public class UpdateCommentDto
    {
        public string commentId { get; set; }
        public string content { get; set; }
        public string postId { get; set; }
    }
}