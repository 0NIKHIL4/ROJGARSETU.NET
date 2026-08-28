using System.Text.Json.Serialization;

namespace RojgarSetu.Api.Models
{
    public class UserSkill
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string SkillName { get; set; } = string.Empty;

        [JsonIgnore]
        public User? User { get; set; }
    }
}
