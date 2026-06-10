using InsurancePolicies.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsurancePolicies.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Client> Clients => Set<Client>();
        public DbSet<Policy> Policies => Set<Policy>();
        public DbSet<Claim> Claims => Set<Claim>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Client>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.FullName).IsRequired().HasMaxLength(100);
                e.Property(x => x.NationalId).IsRequired().HasMaxLength(20);
                e.HasMany(x => x.Policies)
                 .WithOne(x => x.Client)
                 .HasForeignKey(x => x.ClientId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<Policy>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.PolicyNumber).IsRequired().HasMaxLength(20);
                e.Property(x => x.Type).HasConversion<string>();
                e.Property(x => x.Status).HasConversion<string>();
                e.HasMany(x => x.Claims)
                 .WithOne(x => x.Policy)
                 .HasForeignKey(x => x.PolicyId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<Claim>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.ClaimNumber).IsRequired().HasMaxLength(20);
                e.Property(x => x.Status).HasConversion<string>();
            });
        }
    }
}
