using AutoMapper;
using WebEnterprise_mssql.Api.Dtos;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Profiles
{
    public class ApplicationUserProfile : Profile
    {
        public ApplicationUserProfile()
        {
            CreateMap<UpdateApplicationUserDto, ApplicationUser>();
            CreateMap<ApplicationUserDto, ApplicationUser>().ReverseMap();
            CreateMap<ApplicationUser, UserProfileResponseDto>();
            CreateMap<UserProfileResponseDto, ApplicationUser>().ReverseMap();
            CreateMap<UsersRegistrationDto, ApplicationUser>().ReverseMap();
            CreateMap<UsersRegistrationDto, ApplicationUser>();
        }
    }
}