using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ApiRestContratos.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace ApiRestContratos.Controllers.ViewController
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    [EnableCors("CorsPolicy")]
    public class EntregableViewController : ControllerBase
    {
        private readonly MyDBContext _context;
        public EntregableViewController(MyDBContext context)
        {
            _context = context;
        }
        // GET: api/EntregableView/5
        [HttpGet("{id?}")]
        public IEnumerable<Entregable_View> GetEntregableView(int id)
        {
            return _context.SG_EntregableViews.Where(c => c.contratoID == id);
        }
    }
}