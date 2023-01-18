using Microsoft.EntityFrameworkCore;

namespace cs_backend.Models
{
    public class TenttiDBContext : DbContext
    {
        public TenttiDBContext(DbContextOptions<TenttiDBContext> options): base(options)
        {
        }

        public DbSet<Tentti> tentti { get; set; }
        public DbSet<Kysymys> kysymys { get; set; }
        public DbSet<Vastaus> vastaus { get; set; }
    }
}