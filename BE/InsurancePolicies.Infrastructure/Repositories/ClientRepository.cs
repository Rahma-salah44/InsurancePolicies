using InsurancePolicies.Domain.Entities;
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
    public class ClientRepository : BaseRepository<Client>, IClientRepository
    {
        public ClientRepository(AppDbContext context) : base(context) { }

        public async Task<bool> DeleteAsync(int id)
        {
            var client = await _dbSet.FindAsync(id);
            if (client != null)
            {
                _dbSet.Remove(client);
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }

        public async Task<Client?> GetByIdWithPoliciesAsync(int id) =>
            await _dbSet
                .Include(c => c.Policies)
                .FirstOrDefaultAsync(c => c.Id == id);

        public async Task<IEnumerable<Client>> SearchAsync(string keyword) =>
            await _dbSet
                .Where(c => c.FullName.Contains(keyword) || c.NationalId.Contains(keyword))
                .ToListAsync();

    }
}
