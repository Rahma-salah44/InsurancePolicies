using AutoMapper;
using InsurancePolicies.Domain.DTOs.Claim;
using InsurancePolicies.Domain.Entities;
using InsurancePolicies.Domain.Enums;
using InsurancePolicies.Domain.Interfaces;

namespace InsurancePolicies.Domain.Services
{
    public class ClaimService : IClaimService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ClaimService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ClaimDto>> GetAllAsync()
        {
            var claims = await _unitOfWork.Claims.GetAllAsync();
            return _mapper.Map<IEnumerable<ClaimDto>>(claims);
        }

        public async Task<ClaimDto?> GetByIdAsync(int id)
        {
            var claim = await _unitOfWork.Claims.GetByIdAsync(id);
            return claim is null ? null : _mapper.Map<ClaimDto>(claim);
        }

        public async Task<IEnumerable<ClaimDto>> GetByPolicyIdAsync(int policyId)
        {
            var claims = await _unitOfWork.Claims.GetByPolicyIdAsync(policyId);
            return _mapper.Map<IEnumerable<ClaimDto>>(claims);
        }

        public async Task<IEnumerable<ClaimDto>> GetByStatusAsync(ClaimStatus status)
        {
            var claims = await _unitOfWork.Claims.GetByStatusAsync(status);
            return _mapper.Map<IEnumerable<ClaimDto>>(claims);
        }

        public async Task<ClaimDto?> CreateAsync(CreateClaimDto dto)
        {
            var policy = await _unitOfWork.Policies.GetByIdAsync(dto.PolicyId);
            if (policy is null)
                return null;

            if (policy.Status != PolicyStatus.Active)
                throw new InvalidOperationException("Claims can only be filed against active policies.");

            var claim = _mapper.Map<Claim>(dto);
            claim.Status = ClaimStatus.Pending;
            claim.CreatedAt = DateTime.UtcNow;

            await _unitOfWork.Claims.AddAsync(claim);
            await _unitOfWork.SaveChangesAsync();

            claim.Policy = policy;
            return _mapper.Map<ClaimDto>(claim);
        }

        public async Task<ClaimDto?> UpdateStatusAsync(int id, UpdateClaimStatusDto dto)
        {
            var claim = await _unitOfWork.Claims.GetByIdAsync(id);
            if (claim is null)
                return null;

            claim.Status = dto.Status;
            await _unitOfWork.Claims.UpdateAsync(claim);
            return _mapper.Map<ClaimDto>(claim);
        }

        public async Task<bool> DeleteAsync(int id) =>
            await _unitOfWork.Claims.DeleteAsync(id);
    }
}
