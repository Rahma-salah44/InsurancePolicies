using AutoMapper;
using InsurancePolicies.Domain.DTOs.Policy;
using InsurancePolicies.Domain.Entities;
using InsurancePolicies.Domain.Enums;
using InsurancePolicies.Domain.Interfaces;

namespace InsurancePolicies.Domain.Services
{
    public class PolicyService : IPolicyService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PolicyService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PolicyDto>> GetAllAsync()
        {
            var policies = await _unitOfWork.Policies.GetAllAsync();
            return _mapper.Map<IEnumerable<PolicyDto>>(policies);
        }

        public async Task<PolicyDto?> GetByIdAsync(int id)
        {
            var policy = await _unitOfWork.Policies.GetByIdAsync(id);
            return policy is null ? null : _mapper.Map<PolicyDto>(policy);
        }

        public async Task<PolicyDetailDto?> GetByIdWithClaimsAsync(int id)
        {
            var policy = await _unitOfWork.Policies.GetByIdWithClaimsAsync(id);
            return policy is null ? null : _mapper.Map<PolicyDetailDto>(policy);
        }

        public async Task<IEnumerable<PolicyDto>> GetByClientIdAsync(int clientId)
        {
            var policies = await _unitOfWork.Policies.GetByClientIdAsync(clientId);
            return _mapper.Map<IEnumerable<PolicyDto>>(policies);
        }

        public async Task<PolicyDto?> CreateAsync(CreatePolicyDto dto)
        {
            if (dto.EndDate <= dto.StartDate)
                throw new ArgumentException("End date must be after start date.");

            var client = await _unitOfWork.Clients.GetByIdAsync(dto.ClientId);
            if (client is null)
                return null;

            var policy = _mapper.Map<Policy>(dto);
            policy.Status = PolicyStatus.Pending;

            await _unitOfWork.Policies.AddAsync(policy);
            await _unitOfWork.SaveChangesAsync();

            policy.Client = client;
            return _mapper.Map<PolicyDto>(policy);
        }

        public async Task<PolicyDto?> UpdateAsync(int id, UpdatePolicyDto dto)
        {
            if (dto.EndDate <= dto.StartDate)
                throw new ArgumentException("End date must be after start date.");

            var policy = await _unitOfWork.Policies.GetByIdAsync(id);
            if (policy is null)
                return null;

            _mapper.Map(dto, policy);
            await _unitOfWork.Policies.UpdateAsync(policy);
            return _mapper.Map<PolicyDto>(policy);
        }

        public async Task<bool> DeleteAsync(int id) =>
            await _unitOfWork.Policies.DeleteAsync(id);
    }
}
