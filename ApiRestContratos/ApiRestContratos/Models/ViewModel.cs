using System;

namespace ApiRestContratos.Models
{
    public class ViewModel
    {
    }
    public class UserRol_View
    {
        public int ID { get; set; }
        public int rolID { get; set; }
        public string NombreRol { get; set; }
        public string Usuario { get; set; }
        public string Apellido { get; set; }
        public string Nombre { get; set; }
    }
    public class Contrato_View
    {
        public int ID { get; set; }
        public int userID { get; set; }
        public string txt_codigoContrato { get; set; }
        public int? qn_tipoContrato { get; set; }
        public string tipoContrato { get; set; }
        public string txt_numProceso { get; set; }
        public int? qn_tipoProceso { get; set; }
        public string tipoProceso { get; set; }
        public int qn_vigenciaContrato { get; set; }
        public DateTime? dt_fechaSuscripcion { get; set; }
        public DateTime? dt_fechaInicio { get; set; }
        public DateTime? dt_fechaFin { get; set; }
        public DateTime? dt_fechaUltimoCambio { get; set; }
        public double vm_montoAdjudicado { get; set; }
        public bool bol_recurrencia { get; set; }
        public string txt_nombreProveedor { get; set; }
        public string txt_rucProveedor { get; set; }
        public string txt_objetoContratacion { get; set; }
        public int? qn_unidadConsolidadora { get; set; }
        public string txt_nombreUnidad { get; set; }
        public string txt_descripcionUnidad { get; set; }
        public string txt_correoUnidad { get; set; }
        public string txt_nombreDelegado { get; set; }
        public string Administrador { get; set; }
        public string txt_nombreTecnicoExterno { get; set; }
        public string txt_detalleFormaPago { get; set; }
        public string txt_detalleGarantias { get; set; }
        public string txt_archivoContrato { get; set; }
        public int? qn_estadoContrato { get; set; }
        public string estadoContrato { get; set; }
        public int? solicitudID { get; set; }
        public int? qn_estadoTransferencia { get; set; }
        public DateTime? fechaFinReal { get; set; }
        public double montoActual { get; set; }
        public int qn_diasProrroga { get; set; }
        public double vm_montoAdicional { get; set; }
        public string estadoTransferencia { get; set; }
    }

    public class Report_View
    {
       public int ID { get; set; }
       public string Nombre_del_Administrador {get; set; }
       public string Codigo_del_Contrato {get; set; }
       public string Codigo_de_Proceso {get; set; }
       public int Año {get; set; }
       public string Descripcion {get; set; }
       public string Tipo_de_Contrato {get; set; }
       public string Nombre_del_Contratista {get; set; }
       public string Ruc {get; set; }
       public DateTime Fecha_de_Suscripcion {get; set; }
       public DateTime Fecha_de_Inicio_del_Contrato {get; set; }
       public DateTime Fecha_de_Finalizacion_del_Contrato {get; set; }
       public DateTime Fecha_Real_de_Finalizacion {get; set; }
       public double Monto_Inicial {get; set; }
       public double Monto_Real {get; set; }
       public double Complementarios {get; set; }
       public double Total {get; set; }
       public double Porcentaje_Complementarios {get; set; }
       public string Estado {get; set; }
    }

    public class Solicitud_View
    {
        public int ID { get; set; }
        public string txt_codigoSolicitud { get; set; }
        public int qn_cantContratos { get; set; }
        public string txt_motivoSolicitud { get; set; }
        public string txt_admRecomendado { get; set; }
        public string estadoSolicitud { get; set; }
        public int qn_estadoSolicitud { get; set; }
        public string Emisor { get; set; }
        public int qn_idEmisor { get; set; }
        public string Receptor { get; set; }
        public int qn_idReceptor { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
    }

    public class Garantia_View
    {
        public int ID { get; set; }
        public string tipoGarantia { get; set; }
        public int qn_tipoGarantia { get; set; }
        public Double vm_valorGarantia { get; set; }
        public string txt_codigoGarantia { get; set; }
        public string txt_proveedorGarantia { get; set; }
        public DateTime dt_inicioGarantia { get; set; }
        public DateTime dt_finGarantia { get; set; }
        public string txt_archivoGarantia { get; set; }
        public int contratoID { get; set; }
    }

    public class FormaPago_View
    {
        public int ID { get; set; }
        public string tipoPago { get; set; }
        public int formaPagoID { get; set; }
        public int qn_tipoPago { get; set; }
        public int contratoID { get; set; }
        public float qn_porcentajePago { get; set; }
        public Boolean bol_esAnticipo { get; set; }
        public Double vm_montoPago { get; set; }
        public DateTime dt_tentativaPago { get; set; }
        public DateTime? dt_realPago { get; set; }
        public string txt_comprobantePago { get; set; }
        public string txt_archivoPago { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
    }
    public class Multa_View
    {
        public int ID { get; set; }
        public string tipoMulta { get; set; }
        public int qn_tipoMulta { get; set; }
        public Double vm_montoMulta { get; set; }
        public string txt_motivoMulta { get; set; }
        public DateTime dt_fechaMulta { get; set; }
        public string txt_codigoInforme { get; set; }
        public int contratoID { get; set; }
    }

    public class Informe_View
    {
        public int ID { get; set; }
        public string tipoInforme { get; set; }
        public int qn_tipoInforme { get; set; }
        public string txt_codigoInforme { get; set; }
        public DateTime dt_fechaInforme { get; set; }
        public string txt_archivoInforme { get; set; }
        public int contratoID { get; set; }
    }

    public class Modificaciones_View
    {
        public int ID { get; set; }
        public string tipoModificacion { get; set; }
        public int qn_tipoModificacion { get; set; }
        public string txt_motivoModificacion { get; set; }
        public string txt_detalleModificacion { get; set; }
        public string txt_archivoModificacion { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public int contratoID { get; set; }
    }

    public class Acta_View
    {
        public int ID { get; set; }
        public string tipoActa { get; set; }
        public int qn_tipoActa { get; set; }
        public string txt_codigoActa { get; set; }
        public DateTime dt_fechaActa { get; set; }
        public string txt_archivoActa { get; set; }
        public int contratoID { get; set; }
    }

    public class Vencimiento_View
    {
        public int ID { get; set; }
        public string txt_nombreSeccion { get; set; }
        public int qn_diasAnticipacion { get; set; }
        public int qn_frecuenciaAnticipacion { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public int contratoID { get; set; }
        public int userID { get; set; }
        public string txt_codigoContrato { get; set; }
        public string TipoContrato { get; set; }
        public DateTime? FechaFinContrato { get; set; }
        public int garantiaID { get; set; }
        public string TipoGarantia { get; set; }
        public DateTime? FechaFinGarantia { get; set; }
        public int pagoID { get; set; }
        public string TipoPago { get; set; }
        public DateTime? FechaTentativaPago { get; set; }
        public int entregableID { get; set; }
        public string TipoEntregable { get; set; }
        public DateTime? FechaEntregable { get; set; }
    }

    public class Entregable_View
    {
        public int ID { get; set; }
        public string tipoEntregable { get; set; }
        public int qn_tipoEntregable { get; set; }
        public int qn_cantidadEntregable { get; set; }
        public DateTime dt_fechaEntregable { get; set; }
        public DateTime dt_fechaRealEntregable { get; set; }
        public string txt_archivoEntregable { get; set; }
        public string txt_descripcionEntregable { get; set; }
        public int contratoID { get; set; }
    }

    public class Admin_View
    {
        public int ID { get; set; }
        public string usuario { get; set; }
        public string administrador { get; set; }        
    }

    public class Catalogo_View
    {
        public int? ID { get; set; }
        public int catalogoId { get; set; }
        public string txt_nombreCatalogo { get; set; }
        public string txt_detalleCatalogo { get; set; }
        public int? tipoId { get; set; }
        public string tipoCatalogo { get; set; }
        public string detalleSubTipo { get; set; }
    }
}
