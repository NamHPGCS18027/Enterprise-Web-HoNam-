using System.Linq;
using AutoMapper;
using WebEnterprise_mssql.Api.Dtos;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Profiles
{
    public class CommentsProfile : Profile
    {
        public CommentsProfile()
        {
            CreateMap<Comments, CommentDto>();
            CreateMap<Comments, CommentDto>().ReverseMap();
            CreateMap<Comments, ParentItemDto>();
            CreateMap<Comments, ChildItemDto>();
        }
    }
}