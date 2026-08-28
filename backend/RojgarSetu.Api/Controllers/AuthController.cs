using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RojgarSetu.Api.Data;
using RojgarSetu.Api.DTOs;
using RojgarSetu.Api.Models;

namespace RojgarSetu.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("send-otp")]
        public IActionResult SendOtp([FromBody] SendOtpDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Phone))
            {
                return BadRequest(new { message = "Phone number is required" });
            }

            // Demo OTP: 123456
            return Ok(new { success = true, message = "OTP sent successfully (Demo OTP: 123456)" });
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpDto dto)
        {
            if (dto.Otp == "123456")
            {
                return Ok(new { success = true, message = "OTP verified" });
            }

            return BadRequest(new { success = false, message = "Invalid OTP. Use 123456 for demo." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Skills)
                .FirstOrDefaultAsync(u => u.Phone == dto.Phone && u.Role == dto.Role);

            if (user == null)
            {
                return NotFound(new { message = "User not found. Please register first." });
            }

            return Ok(new
            {
                id = user.Id,
                name = user.Name,
                phone = user.Phone,
                role = user.Role,
                location = user.Location,
                available = user.Available,
                rating = user.Rating,
                completedJobs = user.CompletedJobs,
                skills = user.Skills.Select(s => s.SkillName).ToList()
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Phone == dto.Phone && u.Role == dto.Role);

            if (existingUser != null)
            {
                return BadRequest(new { message = "User already registered with this phone and role." });
            }

            var newUser = new User
            {
                Name = dto.Name,
                Phone = dto.Phone,
                Role = dto.Role,
                Location = dto.Location,
                Available = dto.Role == "labourer"
            };

            if (dto.Skills != null && dto.Skills.Any())
            {
                newUser.Skills = dto.Skills.Select(s => new UserSkill { SkillName = s }).ToList();
            }

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = newUser.Id,
                name = newUser.Name,
                phone = newUser.Phone,
                role = newUser.Role,
                location = newUser.Location,
                available = newUser.Available,
                rating = newUser.Rating,
                completedJobs = newUser.CompletedJobs,
                skills = newUser.Skills.Select(s => s.SkillName).ToList()
            });
        }

        [HttpPut("profile/{id}")]
        public async Task<IActionResult> UpdateProfile(string id, [FromBody] UpdateProfileDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Skills)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (!string.IsNullOrWhiteSpace(dto.Name)) user.Name = dto.Name;
            if (!string.IsNullOrWhiteSpace(dto.Location)) user.Location = dto.Location;
            if (dto.Available.HasValue) user.Available = dto.Available.Value;

            if (dto.Skills != null)
            {
                _context.UserSkills.RemoveRange(user.Skills);
                user.Skills = dto.Skills.Select(s => new UserSkill { UserId = user.Id, SkillName = s }).ToList();
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = user.Id,
                name = user.Name,
                phone = user.Phone,
                role = user.Role,
                location = user.Location,
                available = user.Available,
                rating = user.Rating,
                completedJobs = user.CompletedJobs,
                skills = user.Skills.Select(s => s.SkillName).ToList()
            });
        }
    }
}
