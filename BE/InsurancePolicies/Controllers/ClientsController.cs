using System.Security.Claims;
using InsurancePolicies.Domain.DTOs.Client;
using InsurancePolicies.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsurancePolicies.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientsController(IClientService clientService)
        {
            _clientService = clientService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clients = await _clientService.GetAllAsync();
            return Ok(clients);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var client = await _clientService.GetByIdAsync(id);
            return client is null ? NotFound() : Ok(client);
        }

        [HttpGet("{id:int}/with-policies")]
        public async Task<IActionResult> GetByIdWithPolicies(int id)
        {
            var client = await _clientService.GetByIdWithPoliciesAsync(id);
            return client is null ? NotFound() : Ok(client);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClientDto dto)
        {
            var createdBy = User.FindFirst("preferred_username")?.Value
                         ?? User.FindFirst(ClaimTypes.Email)?.Value
                         ?? User.FindFirst(ClaimTypes.Upn)?.Value
                         ?? User.Identity?.Name
                         ?? string.Empty;

            var created = await _clientService.CreateAsync(dto, createdBy);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateClientDto dto)
        {
            var updated = await _clientService.UpdateAsync(id, dto);
            return updated is null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _clientService.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
