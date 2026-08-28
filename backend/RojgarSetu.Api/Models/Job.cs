using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RojgarSetu.Api.Models
{
    public class Job
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string SkillRequired { get; set; } = string.Empty;
        [Column(TypeName = "decimal(18,2)")]
        public decimal Wage { get; set; }
        public string Date { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string? AssignedTo { get; set; }
        public string? AssignedLabourerName { get; set; }
        public string Status { get; set; } = "open"; // open, assigned, completed, cancelled
        public DateTime PostedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public User? Customer { get; set; }
        [JsonIgnore]
        public User? AssignedLabourer { get; set; }
        [JsonIgnore]
        public List<JobApplication> Applications { get; set; } = new();
        [JsonIgnore]
        public List<Review> Reviews { get; set; } = new();
    }
}
