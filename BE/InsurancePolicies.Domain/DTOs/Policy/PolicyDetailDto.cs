using InsurancePolicies.Domain.DTOs.Claim;

namespace InsurancePolicies.Domain.DTOs.Policy
{
    public class PolicyDetailDto : PolicyDto
    {
        public IEnumerable<ClaimDto> Claims { get; set; } = [];
    }
}
