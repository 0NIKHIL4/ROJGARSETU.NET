namespace RojgarSetu.Api.DTOs
{
    public class SendOtpDto
    {
        public string Phone { get; set; } = string.Empty;
    }

    public class VerifyOtpDto
    {
        public string Phone { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Phone { get; set; } = string.Empty;
        public string Role { get; set; } = "customer";
    }

    public class RegisterDto
    {
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Role { get; set; } = "customer";
        public string Location { get; set; } = string.Empty;
        public List<string> Skills { get; set; } = new();
    }

    public class UpdateProfileDto
    {
        public string? Name { get; set; }
        public string? Location { get; set; }
        public bool? Available { get; set; }
        public List<string>? Skills { get; set; }
    }
}
