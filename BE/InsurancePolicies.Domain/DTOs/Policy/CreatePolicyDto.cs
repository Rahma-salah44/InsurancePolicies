using InsurancePolicies.Domain.Enums;

namespace InsurancePolicies.Domain.DTOs.Policy
{
    public class CreatePolicyDto
    {
        public string PolicyNumber { get; set; } = string.Empty;
        public PolicyType Type { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int ClientId { get; set; }
    }
}
