using AutoMapper;
using InsurancePolicies.Domain.Interfaces;
using InsurancePolicies.Domain.Mapping;
using InsurancePolicies.Domain.Services;
using Microsoft.Extensions.DependencyInjection;

namespace InsurancePolicies.Domain
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddAppDomainServices(this IServiceCollection services)
        {
            var mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });

            services.AddSingleton<IMapper>(mapperConfig.CreateMapper());

            services.AddScoped<IClientService, ClientService>();
            services.AddScoped<IPolicyService, PolicyService>();
            services.AddScoped<IClaimService, ClaimService>();

            return services;
        }
    }
}
