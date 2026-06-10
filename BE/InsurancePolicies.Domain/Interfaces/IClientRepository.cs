using InsurancePolicies.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsurancePolicies.Domain.Interfaces
{
    public interface IClientRepository
    {
        Task<IEnumerable<Client>> GetAllAsync();
        Task<Client?> GetByIdAsync(int id);
        Task<Client?> GetByIdWithPoliciesAsync(int id);
        Task AddAsync(Client client);
        Task UpdateAsync(Client client);
        Task<bool> DeleteAsync(int id);
    }
}
