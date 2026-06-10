using InsurancePolicies.Domain.DTOs.Claim;
using InsurancePolicies.Domain.Enums;
using InsurancePolicies.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsurancePolicies.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimsController : ControllerBase
    {
        private readonly IClaimService _claimService;

        public ClaimsController(IClaimService claimService)
        {
            _claimService = claimService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var claims = await _claimService.GetAllAsync();
            return Ok(claims);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var claim = await _claimService.GetByIdAsync(id);
            return claim is null ? NotFound() : Ok(claim);
        }

        [HttpGet("by-policy/{policyId:int}")]
        public async Task<IActionResult> GetByPolicyId(int policyId)
        {
            var claims = await _claimService.GetByPolicyIdAsync(policyId);
            return Ok(claims);
        }

        [HttpGet("by-status/{status}")]
        public async Task<IActionResult> GetByStatus(ClaimStatus status)
        {
            var claims = await _claimService.GetByStatusAsync(status);
            return Ok(claims);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClaimDto dto)
        {
            var created = await _claimService.CreateAsync(dto);
            return created is null ? BadRequest("Policy not found.") : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateClaimStatusDto dto)
        {
            var updated = await _claimService.UpdateStatusAsync(id, dto);
            return updated is null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _claimService.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
