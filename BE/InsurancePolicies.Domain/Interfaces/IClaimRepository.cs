using InsurancePolicies.Domain.Entities;
using InsurancePolicies.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsurancePolicies.Domain.Interfaces
{
    public interface IClaimRepository
    {
        Task<IEnumerable<Claim>> GetAllAsync();
        Task<Claim?> GetByIdAsync(int id);
        Task<IEnumerable<Claim>> GetByPolicyIdAsync(int policyId);
        Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status);
        Task AddAsync(Claim claim);
        Task UpdateAsync(Claim claim);
        Task<bool> DeleteAsync(int id);
    }
}
