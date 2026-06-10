using InsurancePolicies.Domain.DTOs.Policy;
using InsurancePolicies.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsurancePolicies.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PoliciesController : ControllerBase
    {
        private readonly IPolicyService _policyService;

        public PoliciesController(IPolicyService policyService)
        {
            _policyService = policyService;
        }


        [HttpGet("health")]
        public IActionResult HelathCheck()
        { 
            return Ok("working fine");
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var policies = await _policyService.GetAllAsync();
            return Ok(policies);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var policy = await _policyService.GetByIdAsync(id);
            return policy is null ? NotFound() : Ok(policy);
        }

        [HttpGet("{id:int}/with-claims")]
        public async Task<IActionResult> GetByIdWithClaims(int id)
        {
            var policy = await _policyService.GetByIdWithClaimsAsync(id);
            return policy is null ? NotFound() : Ok(policy);
        }

        [HttpGet("by-client/{clientId:int}")]
        public async Task<IActionResult> GetByClientId(int clientId)
        {
            var policies = await _policyService.GetByClientIdAsync(clientId);
            return Ok(policies);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePolicyDto dto)
        {
            var created = await _policyService.CreateAsync(dto);
            return created is null ? BadRequest("Client not found.") : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePolicyDto dto)
        {
            var updated = await _policyService.UpdateAsync(id, dto);
            return updated is null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _policyService.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
