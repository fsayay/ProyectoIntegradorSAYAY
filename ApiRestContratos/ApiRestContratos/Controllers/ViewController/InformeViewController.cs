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
    public class InformeViewController : ControllerBase
    {
        private readonly MyDBContext _context;

        public InformeViewController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/InformeView/5
        [HttpGet("{id}")]
        public IEnumerable<Informe_View> GetInformeView(int id)
        {
            return _context.SG_InformeViews.Where(c => c.contratoID == id);
        }

    }
}