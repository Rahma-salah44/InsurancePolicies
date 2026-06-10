using InsurancePolicies.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsurancePolicies.Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IClientRepository Clients { get; }
        public IPolicyRepository Policies { get; }
        public IClaimRepository Claims { get; }

        public UnitOfWork(AppDbContext context,
            IClientRepository clients,
            IPolicyRepository policies,
            IClaimRepository claims)
        {
            _context = context;
            Clients = clients;
            Policies = policies;
            Claims = claims;
        }

        public async Task<int> SaveChangesAsync() =>
            await _context.SaveChangesAsync();

        public void Dispose() =>
            _context.Dispose();
    }
}
