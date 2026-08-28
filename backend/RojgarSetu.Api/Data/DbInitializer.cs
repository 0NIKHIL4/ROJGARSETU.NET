using RojgarSetu.Api.Models;

namespace RojgarSetu.Api.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                return; // DB already seeded
            }

            var customer1 = new User
            {
                Id = "customer1",
                Name = "Rajesh Kumar",
                Phone = "9876543210",
                Role = "customer",
                Location = "Delhi",
                Available = true,
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            };

            var customer2 = new User
            {
                Id = "customer2",
                Name = "Priya Sharma",
                Phone = "9876543211",
                Role = "customer",
                Location = "Mumbai",
                Available = true,
                CreatedAt = DateTime.UtcNow.AddDays(-8)
            };

            var labourer1 = new User
            {
                Id = "labourer1",
                Name = "Ravi Kumar",
                Phone = "9876543220",
                Role = "labourer",
                Location = "Delhi",
                Available = true,
                Rating = 4.8,
                CompletedJobs = 25,
                CreatedAt = DateTime.UtcNow.AddDays(-30)
            };

            var labourer2 = new User
            {
                Id = "labourer2",
                Name = "Suresh Yadav",
                Phone = "9876543221",
                Role = "labourer",
                Location = "Mumbai",
                Available = true,
                Rating = 4.7,
                CompletedJobs = 18,
                CreatedAt = DateTime.UtcNow.AddDays(-20)
            };

            var labourer3 = new User
            {
                Id = "labourer3",
                Name = "Amit Singh",
                Phone = "9876543222",
                Role = "labourer",
                Location = "Delhi",
                Available = true,
                Rating = 4.9,
                CompletedJobs = 32,
                CreatedAt = DateTime.UtcNow.AddDays(-15)
            };

            context.Users.AddRange(customer1, customer2, labourer1, labourer2, labourer3);
            context.SaveChanges();

            // Add Skills
            var skills = new List<UserSkill>
            {
                new UserSkill { UserId = labourer1.Id, SkillName = "Painter" },
                new UserSkill { UserId = labourer1.Id, SkillName = "Helper" },
                new UserSkill { UserId = labourer2.Id, SkillName = "Plumber" },
                new UserSkill { UserId = labourer2.Id, SkillName = "Electrician" },
                new UserSkill { UserId = labourer3.Id, SkillName = "Carpenter" },
                new UserSkill { UserId = labourer3.Id, SkillName = "Painter" }
            };

            context.UserSkills.AddRange(skills);
            context.SaveChanges();

            // Add Initial Jobs
            var jobs = new List<Job>
            {
                new Job
                {
                    Id = "job1",
                    Title = "House Painting",
                    Description = "Need to paint 2 rooms in my house. High quality finish required.",
                    SkillRequired = "Painter",
                    Wage = 1500,
                    Date = DateTime.UtcNow.AddDays(2).ToString("yyyy-MM-dd"),
                    Location = "Delhi",
                    CustomerId = customer1.Id,
                    CustomerName = customer1.Name,
                    CustomerPhone = customer1.Phone,
                    Status = "open",
                    PostedAt = DateTime.UtcNow.AddDays(-2)
                },
                new Job
                {
                    Id = "job2",
                    Title = "Plumbing Repair",
                    Description = "Fix kitchen sink leak and bathroom shower pipe.",
                    SkillRequired = "Plumber",
                    Wage = 800,
                    Date = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd"),
                    Location = "Mumbai",
                    CustomerId = customer2.Id,
                    CustomerName = customer2.Name,
                    CustomerPhone = customer2.Phone,
                    Status = "open",
                    PostedAt = DateTime.UtcNow.AddDays(-1)
                },
                new Job
                {
                    Id = "job3",
                    Title = "Furniture Assembly & Repair",
                    Description = "Assemble new wooden wardrobe and fix study table leg.",
                    SkillRequired = "Carpenter",
                    Wage = 1200,
                    Date = DateTime.UtcNow.AddDays(3).ToString("yyyy-MM-dd"),
                    Location = "Delhi",
                    CustomerId = customer1.Id,
                    CustomerName = customer1.Name,
                    CustomerPhone = customer1.Phone,
                    Status = "assigned",
                    AssignedTo = labourer3.Id,
                    AssignedLabourerName = labourer3.Name,
                    PostedAt = DateTime.UtcNow.AddDays(-3)
                }
            };

            context.Jobs.AddRange(jobs);
            context.SaveChanges();
        }
    }
}
