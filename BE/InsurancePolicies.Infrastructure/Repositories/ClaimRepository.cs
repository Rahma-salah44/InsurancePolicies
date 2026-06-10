using InsurancePolicies.Domain.Entities;
using InsurancePolicies.Domain.Enums;
using InsurancePolicies.Domain.Interfaces;
using InsurancePolicies.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsurancePolicies.Infrastructure.Repositories
{
    public class ClaimRepository : BaseRepository<Claim>, IClaimRepository
    {
        public ClaimRepository(AppDbContext context) : base(context) { }

        public async Task<bool> DeleteAsync(int id)
        {
            var claim = await _dbSet.FindAsync(id);
            if (claim != null)
            {
                _dbSet.Remove(claim);
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }

        public async Task<IEnumerable<Claim>> GetByPolicyIdAsync(int policyId) =>
            await _dbSet
                .Where(c => c.PolicyId == policyId)
                .ToListAsync();

        public async Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status) =>
            await _dbSet
                .Where(c => c.Status == status)
                .Include(c => c.Policy)
                    .ThenInclude(p => p.Client)
                .ToListAsync();

     
    }
}
