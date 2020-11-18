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
    public class GarantiaViewController : ControllerBase
    {
        private readonly MyDBContext _context;

        public GarantiaViewController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/GarantiaView/5
        [HttpGet("{id}")]
        public IEnumerable<Garantia_View> GetGarantias(int id)
        {
            return _context.SG_GarantiaViews.Where(c => c.contratoID == id);
        }
    }
}