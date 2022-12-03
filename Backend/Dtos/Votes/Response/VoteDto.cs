using System.Collections.Generic;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class VoteDto
    {
        public int UpvoteCount { get; set; }
        public List<string> UpVoteUserList { get; set; }
        public int DownVoteCount { get; set; }
        public List<string> DownVoteUserList { get; set; }
    }
}