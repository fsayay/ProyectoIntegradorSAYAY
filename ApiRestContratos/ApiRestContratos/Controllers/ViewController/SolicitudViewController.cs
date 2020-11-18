using System.Collections.Generic;
using System.Linq;
using ApiRestContratos.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace ApiRestContratos.Controllers.ViewController
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    [EnableCors("CorsPolicy")]
    public class SolicitudViewController : ControllerBase
    {
        private readonly MyDBContext _context;

        public SolicitudViewController(MyDBContext context)
        {
            _context = context;
        }

        //GET: api/SolicitudView/5
        [HttpGet("{id}")]
        public IEnumerable<Solicitud_View> GetSolicitudView([FromRoute] int id)
        {
            return _context.SG_SolicitudViews.Where(c => c.qn_idEmisor == id);
        }

        //POST: api/SolicitudView/getSolicitudByUAS/5
        [HttpPost("{GetSolicitudByUAS}/{id?}")]
        public IEnumerable<Solicitud_View> GetSolicitudByUAS([FromRoute] int id)
        {
            return _context.SG_SolicitudViews.Where(c => c.qn_idReceptor == id);
        }
    }
}