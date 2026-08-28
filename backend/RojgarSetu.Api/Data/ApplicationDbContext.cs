using Microsoft.EntityFrameworkCore;
using RojgarSetu.Api.Models;

namespace RojgarSetu.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<UserSkill> UserSkills => Set<UserSkill>();
        public DbSet<Job> Jobs => Set<Job>();
        public DbSet<JobApplication> JobApplications => Set<JobApplication>();
        public DbSet<Review> Reviews => Set<Review>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User -> UserSkills (1-to-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Skills)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> PostedJobs (1-to-many)
            modelBuilder.Entity<Job>()
                .HasOne(j => j.Customer)
                .WithMany(u => u.PostedJobs)
                .HasForeignKey(j => j.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // User -> AssignedJobs (1-to-many, optional)
            modelBuilder.Entity<Job>()
                .HasOne(j => j.AssignedLabourer)
                .WithMany(u => u.AssignedJobs)
                .HasForeignKey(j => j.AssignedTo)
                .OnDelete(DeleteBehavior.SetNull);

            // Job -> Applications (1-to-many)
            modelBuilder.Entity<JobApplication>()
                .HasOne(a => a.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobId)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> Applications (1-to-many)
            modelBuilder.Entity<JobApplication>()
                .HasOne(a => a.Labourer)
                .WithMany(u => u.Applications)
                .HasForeignKey(a => a.LabourerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Review relationships
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Job)
                .WithMany(j => j.Reviews)
                .HasForeignKey(r => r.JobId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.TargetUser)
                .WithMany(u => u.ReviewsReceived)
                .HasForeignKey(r => r.TargetUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
