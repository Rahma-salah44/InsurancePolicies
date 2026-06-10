using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsurancePolicies.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IClientRepository Clients { get; }
        IPolicyRepository Policies { get; }
        IClaimRepository Claims { get; }
        Task<int> SaveChangesAsync();
    }
}
