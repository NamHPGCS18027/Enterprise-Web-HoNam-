using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Models 
{
    public record Posts
    {   
        [KeyAttribute]
        public Guid PostId { get; set; }
        public string title { get; set; }
        public string Desc { get; set; }
        public string content { get; set; }
        public string username { get; set; }
        public bool isAnonymous { get; set; }
        
        //QAC Section
        public int Status { get; set; }
        public string feedback { get; set; }
        public bool IsAssigned { get; set; }
        public string QACUserId { get; set; }

        //Topic Section
        [Required]
        public Guid? TopicId { get; set; }
        public virtual Topics Topics { get; set; }

        public DateTimeOffset createdDate { get; set; }
        public DateTimeOffset LastModifiedDate { get; set; }
        //public List<string> ViewsCount { get; set; } 

        
        
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        [InverseProperty("Posts")]
        public virtual ApplicationUser ApplicationUser { get; set; }

        public Guid? SubmissionsId { get; set; }
        public virtual Submissions Submissions { get; set; }

        
        public Posts()
        {
            this.categories = new HashSet<Categories>();
        }
        //Collection of foreign objects
        public virtual ICollection<Categories> categories { get; set; }
        public ICollection<Views> Views { get; set; }
        public ICollection<Comments> Comments { get; set; }
        public ICollection<FilesPath> filesPaths { get; set; }
    }
}

    // ID_IDEA int,
    // TITLE NVARCHAR(100),
    // DESCRIPTION NVARCHAR(100),
    // CONTENT NVARCHAR(100),
    // CREATED_DATE NVARCHAR(100),
    // LAST_MODIFIED_DATE DATETIME,
    // VIEW_COUNT INT,
    // USER_ID INT,
    // CATEGORY_ID INT,
    // SUBMISSION_ID INT