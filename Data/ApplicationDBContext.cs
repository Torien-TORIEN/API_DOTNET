using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Many-to-Many relationship between User and Group
            modelBuilder.Entity<Group>()
                .HasMany(g => g.Members)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "UserGroup",
                    j => j.HasOne<User>().WithMany().HasForeignKey("UserId"),
                    j => j.HasOne<Group>().WithMany().HasForeignKey("GroupId")
                );

            // Configure One-to-Many relationship for Group.Creator
            modelBuilder.Entity<Group>()
                .HasOne(g => g.creator)
                .WithMany()
                .HasForeignKey(g => g.creatorId)
                .OnDelete(DeleteBehavior.Restrict); // Optional: Define delete behavior
            
            // Make the Name field unique
            modelBuilder.Entity<Group>()
                .HasIndex(g => g.name)
                .IsUnique();
        }
    }
}
