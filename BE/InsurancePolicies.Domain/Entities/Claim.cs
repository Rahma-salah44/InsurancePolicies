using InsurancePolicies.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsurancePolicies.Domain.Entities
{
    public class Claim
    {
        public int Id { get; set; }
        public string ClaimNumber { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ClaimStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }

        public int PolicyId { get; set; }
        public Policy Policy { get; set; } = null!;
    }
}
