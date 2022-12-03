using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Data
{
    public class ApiDbContext : IdentityDbContext<ApplicationUser>
    {
        public virtual DbSet<Posts> Posts { get; set; }
        public virtual DbSet<FilesPath> FilesPath { get; set; }
        public virtual DbSet<Views> Views { get; set; }
        public virtual DbSet<UpVote> UpVotes { get; set; }
        public virtual DbSet<DownVote> DownVotes { get; set; }
        public virtual DbSet<Comments> Comments { get; set; }
        public virtual DbSet<RefreshToken> RefreshTokens { get; set; }
        public virtual DbSet<Departments> Department { get; set; }
        public virtual DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public virtual DbSet<Topics> Topics { get; set; }
        public virtual DbSet<Categories> Categories { get; set; }
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
        {
        }
        // protected override void OnModelCreating(ModelBuilder modelBuilder)
        // {
        //     // modelBuilder.Entity<Posts>()
        //     //     .HasMany<Categories>(s => s.categories)
        //     //     .WithMany(c => c.posts)
        //     //     .UsingEntity<Dictionary<string, object>>(
        //     //         "CateGoryPost",
        //     //         x => x.HasOne<Categories>().WithMany().OnDelete(DeleteBehavior.SetNull),
        //     //         x => x.HasOne<Posts>().WithMany().OnDelete(DeleteBehavior.ClientSetNull)
        //     //     );
        // }
    }
}