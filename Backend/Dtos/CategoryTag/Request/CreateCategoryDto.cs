using System.ComponentModel.DataAnnotations;

namespace WebEnterprise_mssql.Api.Dtos
{
    public class CreateCategoryDto
    {
        [Required]
        public string CategoryName { get; set; }
        [Required]
        public string Desc { get; set; }
    }
}