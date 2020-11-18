using ApiRestContratos.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Net.Mail;
using System.Threading;
using System.Threading.Tasks;

namespace ApiRestContratos.Services
{
    public class EmailNotificationService : IHostedService, IDisposable
    {
        private Timer timer;
        private readonly IConfiguration _configuration;

        public EmailNotificationService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromDays(1)); // por dia
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            DateTime now = DateTime.Now;
            string today = now.GetDateTimeFormats('d')[0];

            OracleDataReader vencimientos = null;
            
            //  Dev
            string queryString = "SELECT * FROM \"CONTRATOS\".\"SG_VencimientoViews\"";
            //  Prod
            //string queryString = "SELECT * FROM \"SGCONTRATOS\".\"SG_VencimientoViews\"";

            string connString = @"User Id=" + _configuration["UserDatabase"] + ";Password=" + _configuration["PasswordDatabase"] + ";Data Source=" + _configuration["ServerDatabase"] + "/" + _configuration["SID"];

            OracleConnection con = new OracleConnection(connString);
            OracleCommand cmd = new OracleCommand();

            cmd.CommandText = queryString;

            cmd.Connection = con;
            con.Open();
            try
            {
                //Ejecutar el comando SQL
                vencimientos = cmd.ExecuteReader();
                int j = 0;
                //Mostrar los datos de la tabla
                while (vencimientos.Read())
                {
                    if (vencimientos["txt_nombreSeccion"].ToString() == "Contrato" && vencimientos["FechaFinContrato"].ToString() != null)
                    {
                        DateTime fechaVencimiento = DateTime.Parse(vencimientos["FechaFinContrato"].ToString());
                        string dateCompare = fechaVencimiento.GetDateTimeFormats('d')[0];

                        if (now <= fechaVencimiento)
                        {
                            string diasAnticipacion = vencimientos["qn_diasAnticipacion"].ToString();
                            DateTime fechaInicio = fechaVencimiento.AddDays(-Int32.Parse(diasAnticipacion));
                            if (fechaInicio <= now)
                            {
                                int i = 0;
                                string frecuencia = vencimientos["qn_frecuenciaAnticipacion"].ToString();
                                DateTime fechaNotificar = fechaInicio.AddDays((Int32.Parse(frecuencia) * i));
                                while (fechaNotificar <= now)
                                {
                                    string fechaANotificar = fechaNotificar.GetDateTimeFormats('d')[0];
                                    if (fechaANotificar == today)
                                    {
                                        var messageContrato = "El contrato con cod:" + vencimientos["txt_codigoContrato"].ToString() + " esta por expirar: ";
                                        SendMessageNotification(messageContrato + DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss"), vencimientos["username"].ToString());
                                        break;
                                    }
                                    else
                                    {
                                        i++;
                                        fechaNotificar = fechaInicio.AddDays((Int32.Parse(frecuencia) * i));
                                    }

                                }
                            }
                        }

                    }

                    if (vencimientos["txt_nombreSeccion"].ToString() == "Garantia" && vencimientos["FechaFinGarantia"].ToString() != null)
                    {
                        DateTime fechaVencimiento = DateTime.Parse(vencimientos["FechaFinGarantia"].ToString());
                        string dateCompare = fechaVencimiento.GetDateTimeFormats('d')[0];

                        if (now <= fechaVencimiento)
                        {
                            string diasAnticipacion = vencimientos["qn_diasAnticipacion"].ToString();
                            DateTime fechaInicio = fechaVencimiento.AddDays(-Int32.Parse(diasAnticipacion));
                            if (fechaInicio <= now)
                            {
                                int i = 0;
                                string frecuencia = vencimientos["qn_frecuenciaAnticipacion"].ToString();
                                DateTime fechaNotificar = fechaInicio.AddDays((Int32.Parse(frecuencia) * i));
                                while (fechaNotificar <= now)
                                {
                                    string fechaANotificar = fechaNotificar.GetDateTimeFormats('d')[0];
                                    if (fechaANotificar == today)
                                    {
                                        var messageGarantia = "La garantia " + vencimientos["TipoGarantia"].ToString() + " del contrato con cod:" + vencimientos["txt_codigoContrato"].ToString() + " esta por expirar: ";
                                        SendMessageNotification(messageGarantia + DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss"), vencimientos["username"].ToString());
                                        break;
                                    }
                                    else
                                    {
                                        i++;
                                        fechaNotificar = fechaInicio.AddDays((Int32.Parse(frecuencia) * i));
                                    }

                                }
                            }
                        }

                    }

                    if (vencimientos["txt_nombreSeccion"].ToString() == "Pago" && vencimientos["FechaTentativaPago"].ToString() != null)
                    {
                        DateTime fechaVencimiento = DateTime.Parse(vencimientos["FechaTentativaPago"].ToString());
                        string dateCompare = fechaVencimiento.GetDateTimeFormats('d')[0];

                        if (now <= fechaVencimiento)
                        {
                            string diasAnticipacion = vencimientos["qn_diasAnticipacion"].ToString();
                            DateTime fechaInicio = fechaVencimiento.AddDays(-Int32.Parse(diasAnticipacion));
                            if (fechaInicio <= now)
                            {
                                int i = 0;
                                string frecuencia = vencimientos["qn_frecuenciaAnticipacion"].ToString();
                                DateTime fechaNotificar = fechaInicio.AddDays((Int32.Parse(frecuencia) * i));
                                while (fechaNotificar <= now)
                                {
                                    string fechaANotificar = fechaNotificar.GetDateTimeFormats('d')[0];
                                    if (fechaANotificar == today)
                                    {
                                        var messagePago = "El pago " + vencimientos["TipoPago"].ToString() + " del contrato con cod:" + vencimientos["txt_codigoContrato"].ToString() + " esta por expirar: ";
                                        SendMessageNotification(messagePago + DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss"), vencimientos["username"].ToString());
                                        break;
                                    }
                                    else
                                    {
                                        i++;
                                        fechaNotificar = fechaInicio.AddDays((Int32.Parse(frecuencia) * i));
                                    }

                                }
                            }
                        }
                    }

                    if (vencimientos["txt_nombreSeccion"].ToString() == "Entregable" && vencimientos["FechaEntregable"].ToString() != null)
                    {
                        DateTime fechaVencimiento = DateTime.Parse(vencimientos["FechaEntregable"].ToString());
                        string dateCompare = fechaVencimiento.GetDateTimeFormats('d')[0];

                        if (now <= fechaVencimiento)
                        {
                            string diasAnticipacion = vencimientos["qn_diasAnticipacion"].ToString();
                            DateTime fechaInicio = fechaVencimiento.AddDays(-Int32.Parse(diasAnticipacion));
                            if (fechaInicio <= now)
                            {
                                int i = 0;
                                string frecuencia = vencimientos["qn_frecuenciaAnticipacion"].ToString();
                                DateTime fechaNotificar = fechaInicio.AddDays((Int32.Parse(frecuencia) * i));
                                while (fechaNotificar <= now)
                                {
                                    string fechaANotificar = fechaNotificar.GetDateTimeFormats('d')[0];
                                    if (fechaANotificar == today)
                                    {
                                        var messageEntregable = "El entregable " + vencimientos["TipoEntregable"].ToString() + " del contrato con cod:" + vencimientos["txt_codigoContrato"].ToString() + " esta por llegar: ";
                                        SendMessageNotification(messageEntregable + DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss"), vencimientos["username"].ToString());
                                        break;
                                    }
                                    else
                                    {
                                        i++;
                                        fechaNotificar = fechaInicio.AddDays((Int32.Parse(frecuencia) * i));
                                    }

                                }
                            }
                        }
                    }
                }
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

        public Task StopAsync(CancellationToken cancellationToken)
        {
            timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
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

        public void Dispose()
        {
            timer?.Dispose();
        }
    }
}
