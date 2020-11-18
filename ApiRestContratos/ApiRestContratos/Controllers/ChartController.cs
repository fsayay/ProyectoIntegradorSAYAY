using System;
using System.Linq;
using ApiRestContratos.DataStorage;
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
    //[Authorize]
    public class ChartController : ControllerBase
    {
        private readonly IHubContext<ChartHub> _hub;
        private readonly MyDBContext _context;

        public ChartController(IHubContext<ChartHub> hub, MyDBContext context)
        {
            _hub = hub;
            _context = context;
        }
        public IActionResult Get()
        {
            var timerManager = new TimerManager(() => _hub.Clients.All.SendAsync("transferchartdata", DataManager.GetData()));
            return Ok(new { Message = "Request Completed" });
        }        
    }
}