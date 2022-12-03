using AutoMapper;
using WebEnterprise_mssql.Api.Dtos;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Profiles
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<Categories, CreateCategoryDto>();
            CreateMap<Categories, CreateCategoryDto>().ReverseMap();
        }
    }
}