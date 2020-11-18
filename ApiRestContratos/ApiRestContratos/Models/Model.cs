using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System;
using System.Collections.Generic;

namespace ApiRestContratos.Models
{
    public class UserRol
    {
        public int userID { get; set; }
        public User user { get; set; }

        public int rolID { get; set; }
        public Rol rol { get; set; }
    }
    public class User
    {
        public int ID { get; set; }
        public string txt_username { get; set; }
        public string txt_nombre { get; set; }
        public string txt_apellido { get; set; }
    }
    public class Rol
    {
        public int ID { get; set; }
        public string txt_rolName { get; set; }
        public string txt_rolDetaile { get; set; }
        public ICollection<UserRol> userRol { get; set; }
    }

    public class Notificacion
    {
       public int ID { get; set;}
	   public string txt_mensajeNotificacion { get; set;}
       public int qn_emisorNotificacion { get; set;}
       public int qn_receptorNotificacion { get; set;}
	   public DateTime dt_fechaUltimoCambio { get; set;}
    }

    public class Proveedor
    {
        public int ID { get; set; }
	    public string txt_nombreProveedor { get;set;}
        public string txt_rucProveedor { get;set;}
	    public string txt_descripcionProveedor { get;set;}
	    public DateTime dt_fechaUltimoCambio { get;set;}
    }

    public class UnidadConsolidadora
    {
        public int ID { get; set; }
        public string txt_nombreUnidad { get; set; }
        public string txt_descripcionUnidad { get; set; }
        public string txt_correoUnidad { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
    }
    public class Contrato
    {
        public int ID { get; set; }
        public string txt_codigoContrato { get; set; }
        public int? qn_tipoContrato { get; set; }
        public string txt_numProceso { get; set; }
        public int? qn_tipoProceso { get; set; }
        public int qn_vigenciaContrato { get; set; }
        public DateTime dt_fechaSuscripcion { get; set; }
        public DateTime? dt_fechaInicio { get; set; }
        public DateTime? dt_fechaFin { get; set; }
        public double vm_montoAdjudicado { get; set; }
        public bool bol_recurrencia { get; set; }
        public string txt_nombreProveedor { get; set; }
        public string txt_rucProveedor { get; set; }
        public string txt_objetoContratacion { get; set; }
        public int? qn_unidadConsolidadora { get; set; }
        public string txt_nombreDelegado { get; set; }
        public int? userID { get; set; }
        public string txt_nombreTecnicoExterno { get; set; }
        public string txt_detalleFormaPago { get; set; }
        public string txt_detalleGarantias { get; set; }
        public string txt_archivoContrato { get; set; }
        public int? qn_estadoContrato { get; set; }
        public int? qn_estadoTransferencia { get; set; }
        public int? qn_diasProrroga { get; set; }
        public int? vm_montoAdicional { get; set; }
        public int? solicitudID { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public ICollection<Garantia> garantias { get; set; }
        public FormaPago formaPago { get; set; }
        public ICollection<Historial> historial { get; set; }
        public ICollection<Multa> multas { get; set; }
        public ICollection<Informe> informes { get; set; }
        public ICollection<Acta> actas { get; set; }
        public ICollection<Entregable> entregables { get; set; }
        public ICollection<Modificacion> modificaciones { get; set; }
        public ICollection<Vencimiento> vencimientos { get; set; }

    }

    public class Solicitud
    {
        public int ID { get; set; }
        public string txt_codigoSolicitud { get; set; }
        public int qn_cantContratos { get; set; }
        public string txt_motivoSolicitud { get; set; }
        public string txt_admRecomendado { get; set; }
        public int qn_estadoSolicitud { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public int qn_idEmisor { get; set; }
        public int qn_idReceptor { get; set; }
    }

    public class Garantia
    {
        public int ID { get; set; }
        public int qn_tipoGarantia { get; set; }
        public Double vm_valorGarantia { get; set; }
        public string txt_codigoGarantia { get; set; }
        public string txt_proveedorGarantia { get; set; }
        public DateTime dt_inicioGarantia { get; set; }
        public DateTime dt_finGarantia { get; set; }
        public string txt_archivoGarantia { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public int contratoID { get; set; }
    }

    public class FormaPago
    {
        public int ID { get; set; }
        public int qn_tipoPago { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public ICollection<Pago> pagos { get; set; }
        public int contratoID { get; set; }
    }

    public class Pago
    {
        public int ID { get; set; }
        public float qn_porcentajePago { get; set; }
        public Boolean bol_esAnticipo { get; set; }
        public Double vm_montoPago { get; set; }
        public DateTime dt_tentativaPago { get; set; }
        public DateTime? dt_realPago { get; set; }
        public string txt_comprobantePago { get; set; }
        public string txt_archivoPago { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public int formaPagoID { get; set; }
    }

    public class Multa
    {
        public int ID { get; set; }
        public int qn_tipoMulta { get; set; }
        public Double vm_montoMulta { get; set; }
        public string txt_motivoMulta { get; set; }
        public DateTime dt_fechaMulta { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public string txt_codigoInforme { get; set; }
        public int contratoID { get; set; }
    }

    public class Informe
    {
        public int ID { get; set; }
        public int qn_tipoInforme { get; set; }
        public string txt_codigoInforme { get; set; }
        public DateTime dt_fechaInforme { get; set; }
        public string txt_archivoInforme { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public int contratoID { get; set; }
    }

    public class Acta
    {
        public int ID { get; set; }
        public int qn_tipoActa { get; set; }
        public string txt_codigoActa { get; set; }
        public DateTime dt_fechaActa { get; set; }
        public string txt_archivoActa { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public int contratoID { get; set; }
    }

    public class Entregable
    {
        public int ID { get; set; }
        public int qn_tipoEntregable { get; set; }
        public int qn_cantidadEntregable { get; set; }
        public DateTime dt_fechaEntregable { get; set; }
        public DateTime dt_fechaRealEntregable { get; set; }
        public string txt_archivoEntregable { get; set; }
        public string txt_descripcionEntregable { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public int contratoID { get; set; }
    }

    public class Modificacion
    {
        public int ID { get; set; }
        public int qn_tipoModificacion { get; set; }
        public string txt_motivoModificacion { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public string txt_detalleModificacion { get; set; }
        public string txt_archivoModificacion { get; set; }
        public int contratoID { get; set; }
    }

    public class Vencimiento
    {
        public int ID { get; set; }
        public string txt_nombreSeccion { get; set; }
        public int qn_diasAnticipacion { get; set; }
        public int qn_frecuenciaAnticipacion { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public int contratoID { get; set; }
        public int garantiaID { get; set; }
        public int entregableID { get; set; }
        public int pagoID { get; set; }
    }

    public class Tipo
    {
        public int tipoID { get; set; }
        public string txt_nombreTipo { get; set; }
        public string txt_detalleTipo { get; set; }
        public int seccionID { get; set; }

    }

    public class Seccion
    {
        public int seccionID { get; set; }
        public string txt_nombreSeccion { get; set; }
        public string txt_detalleSeccion { get; set; }
        public Boolean bol_estadoSeccion { get; set; }
        public List<Tipo> tipos { get; set; }

    }

    public class Historial
    {
        public int ID { get; set; }
        public string txt_seccionHistorial { get; set; }
        public string txt_accionHistorial { get; set; }
        public DateTime dt_fechaUltimoCambio { get; set; }
        public int contratoID { get; set; }
    }

    public class ChartModel
    {
        public List<int> Data { get; set; }
        public string Label { get; set; }
        public ChartModel()
        {
            Data = new List<int>();
        }
    }

    public class Unidad
    {
        public int unidadid { get; set; }
        public string nombreunidad { get; set; }
        public string descripcion { get; set; }
        public string email { get; set; }
    }

    /*
     *  Tablas en postgresql
     */
    // public class ContratoPgDB
    //{
    //    public int oid { get; set; }
    //    public string numeroDeContrato { get; set; }
    //    public Boolean? activo { get; set; }
    //    public DateTime? fecha_creacion { get; set; }
    //    public DateTime? fecha_actualizacion { get; set; }
    //    public DateTime? fecha_elaboracioncontrato { get; set; }
    //    public DateTime? fecha_aprobacion { get; set; }
    //    public string estado_aprobacion_juridico { get; set; }
    //    public DateTime? ec_fechaAdjudicacion { get; set; }
    //    public float ec_montoAdjudicacionSinIva { get; set; }
    //    public string ec_tipoAdjudicacion { get; set; }
    //    public int ec_plazoEntrega { get; set; }
    //    public Boolean ec_renunciaAnticipo { get; set; }
    //    public int ec_porcentajeAnticipo { get; set; }
    //    public DateTime? ec_fechaSuscripcionContrato { get; set; }
    //    public DateTime? ec_fechaNotificacionAnticipo { get; set; }
    //    public DateTime? ec_fechaCondicionNaturaleza { get; set; }
    //    public string ec_contratoIniciaEn { get; set; }
    //    public DateTime? ec_fechaPrevistaTerminacionCon { get; set; }
    //    public Boolean ec_contratoEntregaParciales { get; set; }
    //    public int ec_numeroEntregas { get; set; }
    //    public DateTime? ec_fechaRealEntrega { get; set; }
    //    public string representante_legal { get; set; }
    //    public string valor_garantia_fiel_cumplimiento { get; set; }
    //    public string valor_garantia_del_buen_uso_anticipo { get; set; }
    //    public DateTime? fecha_verificacioncontrato { get; set; }
    //    public int oid_usuario_verificador_contrato { get; set; }
    //    public string plazo_contrato { get; set; }
    //    public string estado { get; set; }
    //    public string fecha_suscripcion_contrato { get; set; }
    //    public string fecha_envio_rectorado { get; set; }
    //    public string fecha_retorno_rectorado_firmado { get; set; }
    //    public string fecha_recepcion_garantia { get; set; }
    //    public string fecha_inicio_garantia_buen_uso_anticipo { get; set; }
    //    public string fecha_fin_garantia_buen_uso_anticipo { get; set; }
    //    public string fecha_inicio_garantia_fiel_cumplimiento { get; set; }
    //    public string fecha_fin_garantia_fiel_cumplimiento { get; set; }
    //    public string fecha_despacho_garantia_firma_rectorado { get; set; }
    //    public string fecha_recepcion_garantia_firma_rectorado { get; set; }
    //    public Boolean atendido_asistente_ejecutivo { get; set; }
    //    public string fase_contrato { get; set; }
    //    public string fase_garantia { get; set; }
    //    public string nombre_completo_delegado { get; set; }
    //    public string plazo { get; set; }
    //    public string tipo_plazo { get; set; }
    //    public string recordatorio { get; set; }
    //}

    /*
     *  Tablas en postgresql
     */
    public class ContratoPgDB
    {
        //numerodecontrato codigo_proceso  fecha_suscripcion_contrato plazo_contrato  monto fecha_aprobacioncontrato    proveedor ruc objeto de contratacion formapago   fecha_recepcion_garantia inicio garantia de buen uso del anticipo    fin garantia de buen uso del anticipo inicio garantia de fiel cumplimiento    fin garantia de fiel cumplimiento Unidad Consolidadadora correo asistente consolidador   nombre asistente consolidador nombre_completo_delegado    valor_garantia_fiel_cumplimien valor_garantia_del_buen_uso_an  contratofirmado nombre tecnico contrato nombre administrador contrato
        public string numerodecontrato { get; set; }
        public string codigo_proceso {get;set;}
        public string fecha_suscripcion_contrato {get;set;} 
        public string plazo_contrato {get;set;}  
        public string monto {get;set;} 
        public string fecha_aprobacioncontrato {get;set;}    
        public string proveedor {get;set;} 
        public string ruc {get;set;} 
        public string formapago {get;set;}   
        public string fecha_recepcion_garantia {get;set;} 
        public string nombre_completo_delegado {get;set;}    
        public string valor_garantia_fiel_cumplimien {get;set;} 
        public string valor_garantia_del_buen_uso_an {get;set;}  
        public string contratofirmado {get;set;}
    }
}
