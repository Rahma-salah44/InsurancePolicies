using InsurancePolicies.Domain.Enums;

namespace InsurancePolicies.Domain.DTOs.Claim
{
    public class UpdateClaimStatusDto
    {
        public ClaimStatus Status { get; set; }
    }
}
