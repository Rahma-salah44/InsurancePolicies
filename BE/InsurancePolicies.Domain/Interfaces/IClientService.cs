using InsurancePolicies.Domain.DTOs.Client;

namespace InsurancePolicies.Domain.Interfaces
{
    public interface IClientService
    {
        Task<IEnumerable<ClientDto>> GetAllAsync();
        Task<ClientDto?> GetByIdAsync(int id);
        Task<ClientDetailDto?> GetByIdWithPoliciesAsync(int id);
        Task<ClientDto> CreateAsync(CreateClientDto dto, string createdBy);
        Task<ClientDto?> UpdateAsync(int id, UpdateClientDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
