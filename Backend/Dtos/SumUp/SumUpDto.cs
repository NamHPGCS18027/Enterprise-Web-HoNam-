using System.Collections.Generic;

namespace WebEnterprise_mssql.Dtos.SumUp
{
    public class SumUpDto
    {
        public string title { get; set; }
        public string Desc { get; set; }
        public string content { get; set; }
        public int upVote { get; set; }
        public int downVote { get; set; }
        public string username { get; set; }
        public List<string> sumUpFilePath { get; set; }
        public SumUpDto()
        {
            sumUpFilePath = new List<string>();
        }
    }
}
