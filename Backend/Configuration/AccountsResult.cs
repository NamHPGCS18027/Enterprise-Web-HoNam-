using System.Collections.Generic;

namespace WebEnterprise_mssql.Api.Configuration
{
    public class AccountsResult
    {
        public string Result { get; set; }
        public bool Success { get; set; }
        public List<string> Errors { get; set; }
    }
}