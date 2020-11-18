using Microsoft.EntityFrameworkCore;
using ApiRestContratos.Models;

namespace ApiRestContratos.Models
{
    public class MyDBContext : DbContext
    {
        public MyDBContext(DbContextOptions<MyDBContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRol>().HasKey(sc => new { sc.userID, sc.rolID });
            modelBuilder.Entity<Contrato_View>(entity => { entity.HasKey(e => e.ID); });
        }

        //Models
        public DbSet<Pago> AC_Pagos { get; set; }
        public DbSet<FormaPago> AC_FormaPago { get; set; }
        public DbSet<Contrato> AC_Contratos { get; set; }
        public DbSet<Acta> AC_Actas { get; set; }
        public DbSet<Garantia> AC_Garantias { get; set; }
        public DbSet<Informe> AC_Informes { get; set; }
        public DbSet<Entregable> AC_Entregables { get; set; }
        public DbSet<Multa> AC_Multas { get; set; }
        public DbSet<Modificacion> AC_Modificaciones { get; set; }
        public DbSet<Historial> AC_Historial { get; set; }
        public DbSet<Solicitud> AC_Solicitudes { get; set; }
        public DbSet<Vencimiento> AC_Vencimientos { get; set; }
        public DbSet<User> AC_Users { get; set; }
        public DbSet<Rol> AC_Rols { get; set; }
        public DbSet<UserRol> AC_UserRol { get; set; }
        public DbSet<Tipo> AC_Tipos { get; set; }
        public DbSet<Seccion> AC_Secciones { get; set; }
        public DbSet<Notificacion> AC_Notificaciones { get; set; }
        public DbSet<Proveedor>AC_Proveedor { get; set; }
        public DbSet<UnidadConsolidadora> AC_UnidadConsolidadora { get; set; }

        //Views
        public DbSet<UserRol_View> SG_UsuariosViews { get; set; }
        public DbSet<Contrato_View> SG_ContratoViews { get; set; }
        public DbSet<Garantia_View> SG_GarantiaViews { get; set; }
        public DbSet<FormaPago_View> SG_FormaPagoViews { get; set; }
        public DbSet<Entregable_View> SG_EntregableViews { get; set; }
        public DbSet<Informe_View> SG_InformeViews { get; set; }
        public DbSet<Modificaciones_View> SG_ModificacionesViews { get; set; }
        public DbSet<Multa_View> SG_MultaViews { get; set; }
        public DbSet<Solicitud_View> SG_SolicitudViews { get; set; }
        public DbSet<Acta_View> SG_ActaViews { get; set; }
        public DbSet<Vencimiento_View> SG_VencimientoViews { get; set; }
        public DbSet<Admin_View> SG_AdminViews { get; set; }
        public DbSet<Catalogo_View> SG_CatalogoViews { get; set; }
        public DbSet<Report_View> SG_ReportViews { get; set; }
    }
}
