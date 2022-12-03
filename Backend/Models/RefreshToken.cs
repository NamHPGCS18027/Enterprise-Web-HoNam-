using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace WebEnterprise_mssql.Api.Models
{
    public class RefreshToken 
    {
        public int id { get; set; }
        public string UserId { get; set; }
        public string Token { get; set; }
        public string JwtId { get; set; }
        public bool IsUsed { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime AddedDate { get; set; }
        public DateTime ExpiryDate { get; set; }

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set;}
    }
}