using System.Linq;
using AutoMapper;
using WebEnterprise_mssql.Api.Dtos;
using WebEnterprise_mssql.Api.Models;
using WebEnterprise_mssql.Dtos.SumUp;

namespace WebEnterprise_mssql.Api.Profiles
{
    public class PostsProfile : Profile
    {
        public PostsProfile()
        {
            CreateMap<Posts, PostDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId));
            CreateMap<Posts, PostDto>().ReverseMap();
            CreateMap<Posts, CreatePostDto>().ReverseMap();
            CreateMap<Posts, CreatePostDto>();
            CreateMap<Posts, UpdatedPostDto>().ReverseMap();
            CreateMap<Posts, QACFeedbackDto>().ReverseMap();
            CreateMap<Posts, PostDetailDto>().ReverseMap();
            CreateMap<Posts, SumUpDto>();
            CreateMap<Posts, SumUpDto>().ReverseMap();
        }
    }
}