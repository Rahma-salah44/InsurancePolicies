using InsurancePolicies.Domain.DTOs.Claim;
using InsurancePolicies.Domain.Enums;

namespace InsurancePolicies.Domain.Interfaces
{
    public interface IClaimService
    {
        Task<IEnumerable<ClaimDto>> GetAllAsync();
        Task<ClaimDto?> GetByIdAsync(int id);
        Task<IEnumerable<ClaimDto>> GetByPolicyIdAsync(int policyId);
        Task<IEnumerable<ClaimDto>> GetByStatusAsync(ClaimStatus status);
        Task<ClaimDto?> CreateAsync(CreateClaimDto dto);
        Task<ClaimDto?> UpdateStatusAsync(int id, UpdateClaimStatusDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
