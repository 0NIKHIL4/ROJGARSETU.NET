using System.Text.Json.Serialization;

namespace RojgarSetu.Api.Models
{
    public class User
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Role { get; set; } = "customer"; // "customer" or "labourer"
        public string Location { get; set; } = string.Empty;
        public bool Available { get; set; } = true;
        public double Rating { get; set; } = 5.0;
        public int CompletedJobs { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public List<UserSkill> Skills { get; set; } = new();
        [JsonIgnore]
        public List<Job> PostedJobs { get; set; } = new();
        [JsonIgnore]
        public List<Job> AssignedJobs { get; set; } = new();
        [JsonIgnore]
        public List<JobApplication> Applications { get; set; } = new();
        [JsonIgnore]
        public List<Review> ReviewsReceived { get; set; } = new();
    }
}
