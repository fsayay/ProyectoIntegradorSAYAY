using ApiRestContratos.Models;
using Microsoft.AspNetCore.Builder;
using Newtonsoft.Json;
using Npgsql;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Data;
using System.Net.Mail;
using System.Threading.Tasks;

namespace ApiRestContratos.Services
{
    static class PostgreSQLBrokerExtension
    {
        public static async Task UsePostgreSQLBroker(this IApplicationBuilder builder)
        {
            var broker = new PostgreSQLBroker();
            broker.BrokerConfig();
        }
    }
    internal class PostgreSQLBroker
    {
        public async Task BrokerConfig()
        {
            string connectionString = "User ID=postgres; Password = admin; Server=localhost;Port=5432;Database=Contratos;Integrated Security=true; Pooling=true;";      //  Dev
            // string connectionString = "User ID=siscontrato; Password = $i$contrato; Server=192.168.1.121;Port=5432;Database=adquisicionesdb_pruebas;Integrated Security=true; Pooling=true;";      //  Prod


            await using var con = new NpgsqlConnection(connectionString);
            await con.OpenAsync();
            con.Notification += LogNotificationHelper;
            await using (var cmd = new NpgsqlCommand())
            {
                cmd.CommandText = "LISTEN logchange;";
                cmd.CommandType = CommandType.Text;
                cmd.Connection = con;
                cmd.ExecuteNonQuery();
            }

            while (true)
            {
                con.Wait();
            }
        }

        private void LogNotificationHelper(object sender, NpgsqlNotificationEventArgs e)
        {
            var dataPayload = JsonConvert.DeserializeObject<tblInfo>(e.Payload);
            DateTime now = DateTime.Now;

            string connString = "User Id=CONTRATOS; Password=admin; Data Source=localhost/xe;";                             //  Dev
            //string connString = "User Id=sgcontratos; Password=sgcontratos; Data Source=192.168.254.36/espol;";           //  Prod

            OracleConnection con = new OracleConnection(connString);

            con.Open();
            
            try
            {
                //  Dev
                string sql = "INSERT INTO \"CONTRATOS\".\"AC_Contratos\" (\"txt_codigoContrato\",\"qn_tipoContrato\",\"txt_numProceso\",\"qn_tipoProceso\",\"qn_vigenciaContrato\",\"dt_fechaSuscripcion\",\"dt_fechaInicio\",\"dt_fechaFin\",\"vm_montoAdjudicado\",\"bol_recurrencia\",\"txt_objetoContratacion\",\"qn_unidadConsolidadora\",\"txt_nombreDelegado\",\"userID\",\"txt_nombreTecnicoExterno\",\"txt_detalleFormaPago\",\"txt_detalleGarantias\",\"txt_archivoContrato\",\"qn_estadoContrato\",\"qn_estadoTransferencia\",\"solicitudID\",\"dt_fechaUltimoCambio\",\"txt_nombreProveedor\",\"txt_rucProveedor\",\"qn_diasProrroga\",\"vm_montoAdicional\") "
                                                 + " VALUES (:txt_codigoContrato,:qn_tipoContrato,:txt_numProceso,:qn_tipoProceso,:qn_vigenciaContrato,:dt_fechaSuscripcion,:dt_fechaInicio,:dt_fechaFin,:vm_montoAdjudicado,:bol_recurrencia,:txt_objetoContratacion,:qn_unidadConsolidadora,:txt_nombreDelegado,:userID,:txt_nombreTecnicoExterno,:txt_detalleFormaPago,:txt_detalleGarantias,:txt_archivoContrato,:qn_estadoContrato,:qn_estadoTransferencia,:solicitudID,:dt_fechaUltimoCambio,:txt_nombreProveedor,:txt_rucProveedor,:qn_diasProrroga,:vm_montoAdicional) ";

                //  Prod
                //string sql = "INSERT INTO \"SGCONTRATOS\".\"AC_Contratos\" (\"txt_codigoContrato\",\"qn_tipoContrato\",\"txt_numProceso\",\"qn_tipoProceso\",\"qn_vigenciaContrato\",\"dt_fechaSuscripcion\",\"dt_fechaInicio\",\"dt_fechaFin\",\"vm_montoAdjudicado\",\"bol_recurrencia\",\"txt_objetoContratacion\",\"qn_unidadConsolidadora\",\"txt_nombreDelegado\",\"userID\",\"txt_nombreTecnicoExterno\",\"txt_detalleFormaPago\",\"txt_detalleGarantias\",\"txt_archivoContrato\",\"qn_estadoContrato\",\"qn_estadoTransferencia\",\"solicitudID\",\"dt_fechaUltimoCambio\",\"txt_nombreProveedor\",\"txt_rucProveedor\",\"qn_diasProrroga\",\"vm_montoAdicional\") "
                //                                 + " VALUES (:txt_codigoContrato,:qn_tipoContrato,:txt_numProceso,:qn_tipoProceso,:qn_vigenciaContrato,:dt_fechaSuscripcion,:dt_fechaInicio,:dt_fechaFin,:vm_montoAdjudicado,:bol_recurrencia,:txt_objetoContratacion,:qn_unidadConsolidadora,:txt_nombreDelegado,:userID,:txt_nombreTecnicoExterno,:txt_detalleFormaPago,:txt_detalleGarantias,:txt_archivoContrato,:qn_estadoContrato,:qn_estadoTransferencia,:solicitudID,:dt_fechaUltimoCambio,:txt_nombreProveedor,:txt_rucProveedor,:qn_diasProrroga,:vm_montoAdicional) ";




                OracleCommand cmd = con.CreateCommand();
                cmd.CommandText = sql;

                cmd.Parameters.Add("txt_codigoContrato", OracleDbType.NVarchar2).Value = dataPayload.data.numerodecontrato;
                cmd.Parameters.Add("qn_tipoContrato", OracleDbType.Int32).Value = 0;
                cmd.Parameters.Add("txt_numProceso", OracleDbType.NVarchar2).Value = dataPayload.data.codigo_proceso;
                cmd.Parameters.Add("qn_tipoProceso", OracleDbType.Int32).Value = 0;
                cmd.Parameters.Add("qn_vigenciaContrato", OracleDbType.Int32).Value = dataPayload.data.plazo_contrato;
                cmd.Parameters.Add("dt_fechaSuscripcion", OracleDbType.TimeStamp).Value = dataPayload.data.fecha_suscripcion_contrato;
                cmd.Parameters.Add("dt_fechaInicio", OracleDbType.TimeStamp).Value = null;
                cmd.Parameters.Add("dt_fechaFin", OracleDbType.TimeStamp).Value = null;
                cmd.Parameters.Add("vm_montoAdjudicado", OracleDbType.Double).Value = dataPayload.data.monto;
                cmd.Parameters.Add("bol_recurrencia", OracleDbType.Int16).Value = 0;
                cmd.Parameters.Add("txt_objetoContratacion", OracleDbType.NVarchar2).Value = null;
                cmd.Parameters.Add("qn_unidadConsolidadora", OracleDbType.Int32).Value = 0;
                cmd.Parameters.Add("txt_nombreDelegado", OracleDbType.NVarchar2).Value = dataPayload.data.nombre_completo_delegado;
                //cmd.Parameters.Add("userID", OracleDbType.Int32).Value = GetIdAdministrador(dataPayload.data.nombre_administrador_contrato);
                //cmd.Parameters.Add("txt_nombreTecnicoExterno", OracleDbType.NVarchar2).Value = dataPayload.data.nombre_tecnico_contrato;
                cmd.Parameters.Add("txt_detalleFormaPago", OracleDbType.NVarchar2).Value = null;
                cmd.Parameters.Add("txt_detalleGarantias", OracleDbType.NVarchar2).Value = null;
                cmd.Parameters.Add("txt_archivoContrato", OracleDbType.NVarchar2).Value = null;
                cmd.Parameters.Add("qn_estadoContrato", OracleDbType.Int32).Value = 22;
                cmd.Parameters.Add("qn_estadoTransferencia", OracleDbType.Int32).Value = 0;
                cmd.Parameters.Add("solicitudID", OracleDbType.Int32).Value = null;
                cmd.Parameters.Add("dt_fechaUltimoCambio", OracleDbType.TimeStamp).Value = now;
                //cmd.Parameters.Add("txt_nombreProveedor", OracleDbType.NVarchar2).Value = dataPayload.data.proveedor;
                //cmd.Parameters.Add("txt_rucProveedor", OracleDbType.NVarchar2).Value = dataPayload.data.ruc;
                cmd.Parameters.Add("qn_diasProrroga", OracleDbType.Int32).Value = 0;
                cmd.Parameters.Add("vm_montoAdicional", OracleDbType.Double).Value = 0;

                int rowCount = cmd.ExecuteNonQuery();
                //Console.WriteLine("Row Count affected = " + rowCount); 
            }
            catch (Exception err)
            {
                Console.WriteLine("Error: " + err);
                Console.WriteLine(err.StackTrace);
            }
            finally
            {
                con.Close();
                con.Dispose();
            }

        }

        public int GetIdAdministrador(string name)
        {
            //  Dev
            string connString = "User Id=CONTRATOS; Password=admin; Data Source=localhost/xe;";
            string sql = "SELECT * FROM \"CONTRATOS\".\"SG_Usuarios\"";

            //  Prod
            //string connString = "User Id=sgcontratos; Password=sgcontratos; Data Source=192.168.254.36/espol;";
            //string sql = "SELECT * FROM \"SGCONTRATOS\".\"SG_Usuarios\"";

            int idAdmin = 0;
            OracleDataReader admins = null;
            OracleConnection con = new OracleConnection(connString);
            OracleCommand cmd = con.CreateCommand();
            cmd.CommandText = sql;

            con.Open();

            try
            {
                admins = cmd.ExecuteReader();

                while( admins.Read())
                {
                    Console.WriteLine(admins["Administrador"].ToString());
                    if(admins["Administrador"].ToString().ToLower() == name.ToLower())
                    {
                        idAdmin = Int32.Parse(admins["ID"].ToString());
                        SendMessageNotification("Tiene un nuevo contrato para administrar !", admins["Usuario"].ToString());
                        break;
                    }
                }
                return idAdmin;
            }
            catch (Exception err)
            {
                Console.WriteLine("Error: " + err);
                Console.WriteLine(err.StackTrace);
                return idAdmin;
            }
            finally
            {
                con.Clone();                
            }
        }

        private void SendMessageNotification(string message, string emailDestino)
        {
            SmtpClient client = new SmtpClient("smtp-mail.outlook.com");
            client.Port = 587;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.Credentials = new System.Net.NetworkCredential("fsayay@espol.edu.ec", "Geovanny2185");
            client.EnableSsl = true;
            MailMessage mailMessage = new MailMessage("fsayay@espol.edu.ec", "fsayay@espol.edu.ec");
            //MailMessage mailMessage = new MailMessage("fsayay@espol.edu.ec", emailDestino.ToLower() + "@espol.edu.ec");
            mailMessage.Subject = "Prueba Notificaciones SGContratos";
            mailMessage.Body = $"{message}";
            client.Send(mailMessage);
        }

    }

    public class tblInfo
    {
        public string table { get; set; }
        public string action { get; set; }
        public ContratoPgDB data { get; set; }
    }
}
