using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Models
{
    public class Submissions
    {
        [KeyAttribute]
        public Guid SubmissionId { get; set; }
        public string SubmissionName { get; set; }
        public string DescriptionSubmission { get; set; }
        public string ClosureDate { get; set; }
        public string FinalClosureDate { get; set; }

        public virtual ICollection<Posts> Posts { get; set; }
    }
}