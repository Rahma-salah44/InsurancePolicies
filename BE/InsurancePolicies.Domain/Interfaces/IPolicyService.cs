using InsurancePolicies.Domain.DTOs.Policy;

namespace InsurancePolicies.Domain.Interfaces
{
    public interface IPolicyService
    {
        Task<IEnumerable<PolicyDto>> GetAllAsync();
        Task<PolicyDto?> GetByIdAsync(int id);
        Task<PolicyDetailDto?> GetByIdWithClaimsAsync(int id);
        Task<IEnumerable<PolicyDto>> GetByClientIdAsync(int clientId);
        Task<PolicyDto?> CreateAsync(CreatePolicyDto dto);
        Task<PolicyDto?> UpdateAsync(int id, UpdatePolicyDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
