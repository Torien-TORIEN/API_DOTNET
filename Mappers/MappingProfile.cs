using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using api.Dtos;
using api.Models;

namespace api.Mappers
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // Mapping entre User et UserResponseDto
            CreateMap<User, UserResponseDto>();

            // Mapping entre Profile et ProfileResponseDto
            CreateMap<Models.Profile, ProfileResponseDto>();

            // Mapping entre Menu et MenuResponseDto
            CreateMap<Menu, MenuResponseDto>();

            // Mapping entre Group et GroupResponseDto
            CreateMap<Group, GroupResponseDto>();

            // Mapping entre Message et MessageResponseDto
            CreateMap<Message, MessageResponseDto>();

            // Mapping entre Post et PostResponseDto
            CreateMap<Post, PostResponseDto>();

            // Nouveau mapping entre User et UserSimpleResponseDto
            CreateMap<User, UserSimpleResponseDto>()
                .ForMember(dest => dest.ProfileId, opt => opt.MapFrom(src => src.profileId))
                .ForMember(dest => dest.ProfileName, opt => opt.MapFrom(src => src.profile != null ? src.profile.label : string.Empty)); // Utilisation de 'label' comme nom de profil
            
            // Nouveau mapping entre Group et GroupSimpleResponseDto
            CreateMap<Group, GroupSimpleResponseDto>()
                .ForMember(dest => dest.CreatorId, opt => opt.MapFrom(src => src.creatorId))
                .ForMember(dest => dest.CreatorUserName, opt => opt.MapFrom(src => src.creator != null ? src.creator.username : string.Empty)); // Utilisation de 'username' comme nom de créateur
        }
    }
}
