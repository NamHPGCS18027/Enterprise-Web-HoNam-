namespace WebEnterprise_mssql.Api.Dtos
{
    public class IndividualVoteResponse
    {
        public bool UpVote { get; set; }
        public bool DownVote { get; set; }
        public string Error { get; set; }
    }
}