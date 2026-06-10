using InsurancePolicies.Domain.Enums;

namespace InsurancePolicies.Domain.DTOs.Policy
{
    public class PolicySummaryDto
    {
        public int Id { get; set; }
        public string PolicyNumber { get; set; } = string.Empty;
        public PolicyType Type { get; set; }
        public PolicyStatus Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
