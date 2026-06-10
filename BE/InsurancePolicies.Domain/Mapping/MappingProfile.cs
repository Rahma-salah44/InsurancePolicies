using AutoMapper;
using InsurancePolicies.Domain.DTOs.Claim;
using InsurancePolicies.Domain.DTOs.Client;
using InsurancePolicies.Domain.DTOs.Policy;
using InsurancePolicies.Domain.Entities;

namespace InsurancePolicies.Domain.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Client mappings
            CreateMap<Client, ClientDto>();
            CreateMap<Client, ClientDetailDto>()
                .ForMember(dest => dest.Policies, opt => opt.MapFrom(src => src.Policies));
            CreateMap<CreateClientDto, Client>()
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore());
            CreateMap<UpdateClientDto, Client>();

            // Policy mappings
            CreateMap<Policy, PolicyDto>()
                .ForMember(dest => dest.ClientName, opt => opt.MapFrom(src => src.Client != null ? src.Client.FullName : null));
            CreateMap<Policy, PolicySummaryDto>();
            CreateMap<Policy, PolicyDetailDto>()
                .ForMember(dest => dest.ClientName, opt => opt.MapFrom(src => src.Client != null ? src.Client.FullName : null))
                .ForMember(dest => dest.Claims, opt => opt.MapFrom(src => src.Claims));
            CreateMap<CreatePolicyDto, Policy>();
            CreateMap<UpdatePolicyDto, Policy>();

            // Claim mappings
            CreateMap<Claim, ClaimDto>()
                .ForMember(dest => dest.PolicyNumber, opt => opt.MapFrom(src => src.Policy != null ? src.Policy.PolicyNumber : null));
            CreateMap<CreateClaimDto, Claim>();
        }
    }
}
