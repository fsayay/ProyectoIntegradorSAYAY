using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiRestContratos.Models
{
    public class PgDBContext: DbContext
    {
        public PgDBContext(DbContextOptions<PgDBContext> options) : base(options) { }

        public DbSet<Unidad> unidad { get; set; }
        public DbSet<ContratoPgDB> contratosuas { get; set; }

    }
}
