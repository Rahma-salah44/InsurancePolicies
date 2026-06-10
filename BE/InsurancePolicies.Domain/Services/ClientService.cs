using AutoMapper;
using InsurancePolicies.Domain.DTOs.Client;
using InsurancePolicies.Domain.Entities;
using InsurancePolicies.Domain.Interfaces;

namespace InsurancePolicies.Domain.Services
{
    public class ClientService : IClientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ClientService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ClientDto>> GetAllAsync()
        {
            var clients = await _unitOfWork.Clients.GetAllAsync();
            return _mapper.Map<IEnumerable<ClientDto>>(clients);
        }

        public async Task<ClientDto?> GetByIdAsync(int id)
        {
            var client = await _unitOfWork.Clients.GetByIdAsync(id);
            return client is null ? null : _mapper.Map<ClientDto>(client);
        }

        public async Task<ClientDetailDto?> GetByIdWithPoliciesAsync(int id)
        {
            var client = await _unitOfWork.Clients.GetByIdWithPoliciesAsync(id);
            return client is null ? null : _mapper.Map<ClientDetailDto>(client);
        }

        public async Task<ClientDto> CreateAsync(CreateClientDto dto, string createdBy)
        {
            var client = _mapper.Map<Client>(dto);
            client.CreatedBy = createdBy;
            await _unitOfWork.Clients.AddAsync(client);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ClientDto>(client);
        }

        public async Task<ClientDto?> UpdateAsync(int id, UpdateClientDto dto)
        {
            var client = await _unitOfWork.Clients.GetByIdAsync(id);
            if (client is null)
                return null;

            _mapper.Map(dto, client);
            await _unitOfWork.Clients.UpdateAsync(client);
            return _mapper.Map<ClientDto>(client);
        }

        public async Task<bool> DeleteAsync(int id) =>
            await _unitOfWork.Clients.DeleteAsync(id);
    }
}
