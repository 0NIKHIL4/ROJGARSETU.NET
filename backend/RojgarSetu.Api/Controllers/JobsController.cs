using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RojgarSetu.Api.Data;
using RojgarSetu.Api.DTOs;
using RojgarSetu.Api.Models;

namespace RojgarSetu.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetJobs(
            [FromQuery] string? customerId,
            [FromQuery] string? skill,
            [FromQuery] string? location,
            [FromQuery] string? status)
        {
            var query = _context.Jobs.AsQueryable();

            if (!string.IsNullOrWhiteSpace(customerId))
            {
                query = query.Where(j => j.CustomerId == customerId);
            }

            if (!string.IsNullOrWhiteSpace(skill))
            {
                query = query.Where(j => j.SkillRequired.ToLower() == skill.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                query = query.Where(j => j.Location.ToLower().Contains(location.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(j => j.Status.ToLower() == status.ToLower());
            }

            var jobs = await query
                .OrderByDescending(j => j.PostedAt)
                .ToListAsync();

            return Ok(jobs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobById(string id)
        {
            var job = await _context.Jobs
                .Include(j => j.Applications)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
            {
                return NotFound(new { message = "Job not found" });
            }

            return Ok(job);
        }

        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.SkillRequired) || dto.Wage <= 0)
            {
                return BadRequest(new { message = "Please provide valid job details" });
            }

            var job = new Job
            {
                Title = dto.Title,
                Description = dto.Description,
                SkillRequired = dto.SkillRequired,
                Wage = dto.Wage,
                Date = dto.Date,
                Location = dto.Location,
                CustomerId = dto.CustomerId,
                CustomerName = dto.CustomerName,
                CustomerPhone = dto.CustomerPhone,
                Status = "open",
                PostedAt = DateTime.UtcNow
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, job);
        }

        [HttpPost("{id}/assign")]
        public async Task<IActionResult> AssignJob(string id, [FromBody] AssignJobDto dto)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound(new { message = "Job not found" });
            }

            job.Status = "assigned";
            job.AssignedTo = dto.LabourerId;
            job.AssignedLabourerName = dto.LabourerName;

            await _context.SaveChangesAsync();

            return Ok(job);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateJobStatus(string id, [FromBody] UpdateJobStatusDto dto)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound(new { message = "Job not found" });
            }

            job.Status = dto.Status.ToLower();

            // If job is completed, increment completed jobs count for assigned labourer
            if (job.Status == "completed" && !string.IsNullOrEmpty(job.AssignedTo))
            {
                var worker = await _context.Users.FindAsync(job.AssignedTo);
                if (worker != null)
                {
                    worker.CompletedJobs += 1;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(job);
        }

        [HttpPost("{id}/apply")]
        public async Task<IActionResult> ApplyForJob(string id, [FromBody] ApplyJobDto dto)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound(new { message = "Job not found" });
            }

            var existingApp = await _context.JobApplications
                .FirstOrDefaultAsync(a => a.JobId == id && a.LabourerId == dto.LabourerId);

            if (existingApp != null)
            {
                return BadRequest(new { message = "You have already applied for this job." });
            }

            var application = new JobApplication
            {
                JobId = id,
                LabourerId = dto.LabourerId,
                LabourerName = dto.LabourerName,
                LabourerPhone = dto.LabourerPhone,
                Status = "pending",
                AppliedAt = DateTime.UtcNow
            };

            _context.JobApplications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(application);
        }

        [HttpGet("{id}/applications")]
        public async Task<IActionResult> GetJobApplications(string id)
        {
            var applications = await _context.JobApplications
                .Where(a => a.JobId == id)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

            return Ok(applications);
        }

        [HttpPut("applications/{applicationId}/status")]
        public async Task<IActionResult> UpdateApplicationStatus(string applicationId, [FromBody] UpdateJobStatusDto dto)
        {
            var app = await _context.JobApplications.Include(a => a.Job).FirstOrDefaultAsync(a => a.Id == applicationId);
            if (app == null)
            {
                return NotFound(new { message = "Application not found" });
            }

            app.Status = dto.Status.ToLower();

            if (app.Status == "accepted" && app.Job != null)
            {
                app.Job.Status = "assigned";
                app.Job.AssignedTo = app.LabourerId;
                app.Job.AssignedLabourerName = app.LabourerName;
            }

            await _context.SaveChangesAsync();

            return Ok(app);
        }
    }
}
