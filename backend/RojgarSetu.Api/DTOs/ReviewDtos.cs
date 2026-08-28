namespace RojgarSetu.Api.DTOs
{
    public class CreateReviewDto
    {
        public string JobId { get; set; } = string.Empty;
        public string ReviewerId { get; set; } = string.Empty;
        public string ReviewerName { get; set; } = string.Empty;
        public string TargetUserId { get; set; } = string.Empty;
        public int Rating { get; set; } = 5;
        public string Comment { get; set; } = string.Empty;
    }
}
