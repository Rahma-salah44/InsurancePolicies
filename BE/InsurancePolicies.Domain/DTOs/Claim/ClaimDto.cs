using InsurancePolicies.Domain.Enums;

namespace InsurancePolicies.Domain.DTOs.Claim
{
    public class ClaimDto
    {
        public int Id { get; set; }
        public string ClaimNumber { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ClaimStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public int PolicyId { get; set; }
        public string? PolicyNumber { get; set; }
    }
}
