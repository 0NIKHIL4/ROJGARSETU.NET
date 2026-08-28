using System.Text.Json.Serialization;

namespace RojgarSetu.Api.Models
{
    public class JobApplication
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string JobId { get; set; } = string.Empty;
        public string LabourerId { get; set; } = string.Empty;
        public string LabourerName { get; set; } = string.Empty;
        public string LabourerPhone { get; set; } = string.Empty;
        public string Status { get; set; } = "pending"; // pending, accepted, rejected
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public Job? Job { get; set; }
        [JsonIgnore]
        public User? Labourer { get; set; }
    }
}
