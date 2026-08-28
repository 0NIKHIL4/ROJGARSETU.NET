using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RojgarSetu.Api.Data;

namespace RojgarSetu.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LabourersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LabourersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLabourers(
            [FromQuery] string? skill,
            [FromQuery] string? location,
            [FromQuery] bool? available)
        {
            var query = _context.Users
                .Include(u => u.Skills)
                .Where(u => u.Role == "labourer")
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(skill))
            {
                query = query.Where(u => u.Skills.Any(s => s.SkillName.ToLower() == skill.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                query = query.Where(u => u.Location.ToLower().Contains(location.ToLower()));
            }

            if (available.HasValue)
            {
                query = query.Where(u => u.Available == available.Value);
            }

            var labourers = await query
                .Select(u => new
                {
                    id = u.Id,
                    name = u.Name,
                    phone = u.Phone,
                    location = u.Location,
                    available = u.Available,
                    rating = u.Rating,
                    completedJobs = u.CompletedJobs,
                    skills = u.Skills.Select(s => s.SkillName).ToList()
                })
                .ToListAsync();

            return Ok(labourers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLabourerById(string id)
        {
            var user = await _context.Users
                .Include(u => u.Skills)
                .FirstOrDefaultAsync(u => u.Id == id && u.Role == "labourer");

            if (user == null)
            {
                return NotFound(new { message = "Labourer not found" });
            }

            return Ok(new
            {
                id = user.Id,
                name = user.Name,
                phone = user.Phone,
                location = user.Location,
                available = user.Available,
                rating = user.Rating,
                completedJobs = user.CompletedJobs,
                skills = user.Skills.Select(s => s.SkillName).ToList()
            });
        }

        [HttpPut("{id}/availability")]
        public async Task<IActionResult> ToggleAvailability(string id, [FromBody] bool available)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Labourer not found" });
            }

            user.Available = available;
            await _context.SaveChangesAsync();

            return Ok(new { id = user.Id, available = user.Available });
        }
    }
}
