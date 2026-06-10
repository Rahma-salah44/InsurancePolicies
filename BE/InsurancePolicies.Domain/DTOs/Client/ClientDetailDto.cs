using InsurancePolicies.Domain.DTOs.Policy;

namespace InsurancePolicies.Domain.DTOs.Client
{
    public class ClientDetailDto : ClientDto
    {
        public IEnumerable<PolicySummaryDto> Policies { get; set; } = [];
    }
}
