using System;
using System.Linq;
using System.Net.Mail;
using System.Threading;
using ApiRestContratos.Models;
using ApiRestContratos.NotificationServices;
using ApiRestContratos.TimerFeatures;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Syncfusion.EJ2.Linq;

namespace ApiRestContratos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private Timer timer;
        private readonly IHubContext<NotificationHub> _hub;
        private readonly MyDBContext _context;

        public NotificationController(IHubContext<NotificationHub> hub, MyDBContext context)
        {
            _hub = hub;
            _context = context;
        }
       
        // GET: api/Chart/5
        [HttpGet("{id}")]
        public IActionResult Get([FromRoute] int id)
        {
            DateTime now = DateTime.Now;
            string date = now.GetDateTimeFormats('d')[0];

            Console.WriteLine("id " + id);
            
            var vencimientos = _context.SG_VencimientoViews.Where(x => x.userID == id);

            vencimientos.ForEach(x =>
            {
                // CONTRATO
                if (x.FechaFinContrato != null)
                {
                    DateTime fechaVencimiento = DateTime.Parse(x.FechaFinContrato.ToString());
                    string dateCompare = fechaVencimiento.GetDateTimeFormats('d')[0];

                    if (now <= fechaVencimiento)
                    {
                        int diasAnticipacion = x.qn_diasAnticipacion;
                        DateTime fechaInicio = fechaVencimiento.AddDays(diasAnticipacion);
                        if (fechaInicio <= now)
                        {
                            int i = 0;
                            int frecuencia = x.qn_frecuenciaAnticipacion;
                            DateTime fechaNotificar = fechaInicio.AddDays(frecuencia * i);
                            while (fechaNotificar <= now)
                            {
                                string fechaANotificar = fechaNotificar.GetDateTimeFormats('d')[0];
                                if (fechaANotificar == date)
                                {
                                    var messageContrato = "El contrato con cod:" + x.txt_codigoContrato + " esta por expirar";
                                    Console.WriteLine("contrato " + x);
                                    var timerManager = new TimerManager(() => _hub.Clients.All.SendAsync("SendNotification", messageContrato, x.userID));
                                    break;
                                }
                                else
                                {
                                    i++;
                                    fechaNotificar = fechaInicio.AddDays(frecuencia * i);
                                }

                            }
                        }
                    }
                }

                // GARANTIA
                if (x.FechaFinGarantia != null)
                {
                    DateTime fechaVencimiento = DateTime.Parse(x.FechaFinGarantia.ToString());
                    string dateCompare = fechaVencimiento.GetDateTimeFormats('d')[0];

                    if (now <= fechaVencimiento)
                    {
                        int diasAnticipacion = x.qn_diasAnticipacion;
                        DateTime fechaInicio = fechaVencimiento.AddDays(diasAnticipacion);
                        if (fechaInicio <= now)
                        {
                            int i = 0;
                            int frecuencia = x.qn_frecuenciaAnticipacion;
                            DateTime fechaNotificar = fechaInicio.AddDays(frecuencia * i);
                            while (fechaNotificar <= now)
                            {
                                string fechaANotificar = fechaNotificar.GetDateTimeFormats('d')[0];
                                if (fechaANotificar == date)
                                {
                                    var messageGarantia = "La garantia " + x.TipoGarantia + " del contrato con cod:" + x.txt_codigoContrato + " esta por expirar ! ";
                                    var timerManager = new TimerManager(() => _hub.Clients.All.SendAsync("SendNotification", messageGarantia));
                                    break;
                                }
                                else
                                {
                                    i++;
                                    fechaNotificar = fechaInicio.AddDays(frecuencia * i);
                                }

                            }
                        }
                    }

                }

                // PAGO
                if (x.FechaTentativaPago != null)
                {
                    DateTime fechaVencimiento = DateTime.Parse(x.FechaTentativaPago.ToString());
                    string dateCompare = fechaVencimiento.GetDateTimeFormats('d')[0];

                    if (now <= fechaVencimiento)
                    {
                        int diasAnticipacion = x.qn_diasAnticipacion;
                        DateTime fechaInicio = fechaVencimiento.AddDays(diasAnticipacion);
                        if (fechaInicio <= now)
                        {
                            int i = 0;
                            int frecuencia = x.qn_frecuenciaAnticipacion;
                            DateTime fechaNotificar = fechaInicio.AddDays(frecuencia * i);
                            while (fechaNotificar <= now)
                            {
                                string fechaANotificar = fechaNotificar.GetDateTimeFormats('d')[0];
                                if (fechaANotificar == date)
                                {
                                    var messagePago = "El pago " + x.TipoPago + " del contrato con cod:" + x.txt_codigoContrato + " esta por expirar !";
                                    var timerManager = new TimerManager(() => _hub.Clients.All.SendAsync("SendNotification", messagePago));
                                    break;
                                }
                                else
                                {
                                    i++;
                                    fechaNotificar = fechaInicio.AddDays(frecuencia * i);
                                }

                            }
                        }
                    }
                }
                
                // ENTREGABLE
                if (x.FechaEntregable != null)
                {
                    DateTime fechaVencimiento = DateTime.Parse(x.FechaEntregable.ToString());
                    string dateCompare = fechaVencimiento.GetDateTimeFormats('d')[0];

                    if (now <= fechaVencimiento)
                    {
                        int diasAnticipacion = x.qn_diasAnticipacion;
                        DateTime fechaInicio = fechaVencimiento.AddDays(diasAnticipacion);
                        if (fechaInicio <= now)
                        {
                            int i = 0;
                            int frecuencia = x.qn_frecuenciaAnticipacion;
                            DateTime fechaNotificar = fechaInicio.AddDays(frecuencia * i);
                            while (fechaNotificar <= now)
                            {
                                string fechaANotificar = fechaNotificar.GetDateTimeFormats('d')[0];
                                if (fechaANotificar == date)
                                {
                                    var messageEntregable = "El entregable " + x.TipoGarantia + " del contrato con cod:" + x.txt_codigoContrato + " esta por llegar !";
                                    var timerManager = new TimerManager(() => _hub.Clients.All.SendAsync("SendNotification", messageEntregable));
                                    break;
                                }
                                else
                                {
                                    i++;
                                    fechaNotificar = fechaInicio.AddDays(frecuencia * i);
                                }

                            }
                        }
                    }
                }                
            });


            return Ok(new { Message = "Request Completed" });
        }

    }


    
}


