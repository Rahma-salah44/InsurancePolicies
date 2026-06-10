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
    public class PolicyRepository : BaseRepository<Policy>, IPolicyRepository
    {
        public PolicyRepository(AppDbContext context) : base(context) { }

        public async Task<Policy?> GetByIdWithClaimsAsync(int id) =>
            await _dbSet
                .Include(p => p.Claims)
                .Include(p => p.Client)
                .FirstOrDefaultAsync(p => p.Id == id);

        public async Task<IEnumerable<Policy>> GetByClientIdAsync(int clientId) =>
            await _dbSet
                .Where(p => p.ClientId == clientId)
                .Include(p => p.Claims)
                .ToListAsync();

        public async Task<IEnumerable<Policy>> GetByStatusAsync(PolicyStatus status) =>
            await _dbSet
                .Where(p => p.Status == status)
                .Include(p => p.Client)
                .ToListAsync();

        public async Task<bool> DeleteAsync(int id)
        {
            var policy = await _dbSet.FindAsync(id);
            if (policy != null)
            {
                _dbSet.Remove(policy);
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }
    }
}
