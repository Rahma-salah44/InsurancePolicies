using InsurancePolicies.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsurancePolicies.Domain.Interfaces
{
    public interface IPolicyRepository
    {
        Task<IEnumerable<Policy>> GetAllAsync();
        Task<Policy?> GetByIdAsync(int id);
        Task<Policy?> GetByIdWithClaimsAsync(int id);
        Task<IEnumerable<Policy>> GetByClientIdAsync(int clientId);
        Task AddAsync(Policy policy);
        Task UpdateAsync(Policy policy);
        Task<bool> DeleteAsync(int id);
    }
}
