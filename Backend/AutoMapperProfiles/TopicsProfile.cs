using System.Linq;
using AutoMapper;
using WebEnterprise_mssql.Api.Dtos;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Profiles
{
    public class TopicsProfile : Profile
    {
        public TopicsProfile()
        {
            CreateMap<Topics, CreateTopicDto>().ReverseMap();
            CreateMap<Topics, UpdateTopicDto>().ReverseMap();
        }
    }
}