using InsurancePolicies.Domain.Enums;

namespace InsurancePolicies.Domain.Entities
{
    public class Policy
    {
        public int Id { get; set; }
        public string PolicyNumber { get; set; } = string.Empty;
        public PolicyType Type { get; set; }
        public PolicyStatus Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int ClientId { get; set; }
        public Client Client { get; set; } = null!;

        public ICollection<Claim> Claims { get; set; } = new List<Claim>();
    }
}
