using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiRestContratos.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRestContratos.Controllers.ViewController
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    [EnableCors("CorsPolicy")]
    public class ModificacionViewController : ControllerBase
    {
        private readonly MyDBContext _context;

        public ModificacionViewController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/ModificacionView/5
        [HttpGet("{id}")]
        public IEnumerable<Modificaciones_View> GetModificacionView(int id)
        {
            return _context.SG_ModificacionesViews.Where(c => c.contratoID == id);
        }

    }
}