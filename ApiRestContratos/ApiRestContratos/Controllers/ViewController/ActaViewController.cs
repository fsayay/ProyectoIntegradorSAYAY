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
    public class ActaViewController : ControllerBase
    {
        private readonly MyDBContext _context;

        public ActaViewController(MyDBContext context)
        {
            _context = context;
        }

        //GET: api/ActaView/5
        [HttpGet("{id}")]
        public IEnumerable<Acta_View> GetActaView([FromRoute] int id)
        {
            return _context.SG_ActaViews.Where(c => c.contratoID == id);
        }

    }
}