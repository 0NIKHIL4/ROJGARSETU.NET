using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RojgarSetu.Api.Data;
using RojgarSetu.Api.DTOs;
using RojgarSetu.Api.Models;

namespace RojgarSetu.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
            {
                return BadRequest(new { message = "Rating must be between 1 and 5 stars" });
            }

            var review = new Review
            {
                JobId = dto.JobId,
                ReviewerId = dto.ReviewerId,
                ReviewerName = dto.ReviewerName,
                TargetUserId = dto.TargetUserId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);

            // Update average rating of target user
            var targetUser = await _context.Users.FindAsync(dto.TargetUserId);
            if (targetUser != null)
            {
                var existingReviews = await _context.Reviews
                    .Where(r => r.TargetUserId == dto.TargetUserId)
                    .Select(r => r.Rating)
                    .ToListAsync();

                existingReviews.Add(dto.Rating);
                targetUser.Rating = Math.Round(existingReviews.Average(), 1);
            }

            await _context.SaveChangesAsync();

            return Ok(review);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserReviews(string userId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.TargetUserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews);
        }
    }
}
