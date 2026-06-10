namespace InsurancePolicies.Domain.DTOs.Claim
{
    public class CreateClaimDto
    {
        public string ClaimNumber { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int PolicyId { get; set; }
    }
}
