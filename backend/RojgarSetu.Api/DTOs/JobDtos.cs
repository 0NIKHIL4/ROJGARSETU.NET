namespace RojgarSetu.Api.DTOs
{
    public class CreateJobDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string SkillRequired { get; set; } = string.Empty;
        public decimal Wage { get; set; }
        public string Date { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
    }

    public class AssignJobDto
    {
        public string LabourerId { get; set; } = string.Empty;
        public string LabourerName { get; set; } = string.Empty;
    }

    public class UpdateJobStatusDto
    {
        public string Status { get; set; } = "open";
    }

    public class ApplyJobDto
    {
        public string LabourerId { get; set; } = string.Empty;
        public string LabourerName { get; set; } = string.Empty;
        public string LabourerPhone { get; set; } = string.Empty;
    }
}
