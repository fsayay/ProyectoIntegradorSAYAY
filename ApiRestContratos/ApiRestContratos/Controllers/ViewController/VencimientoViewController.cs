using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    public class VencimientoViewController : ControllerBase
    {
        private readonly MyDBContext _context;

        public VencimientoViewController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/VencimientoView/5
        [HttpGet("{id}")]
        public IEnumerable<Vencimiento_View> GetVencimientoView(int id)
        {
            return _context.SG_VencimientoViews.Where(c => c.contratoID == id);
        }

        // POST: api/VencimientoView
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Vencimiento>> PostVencimientoView(Vencimiento vencimiento)
        {
            _context.AC_Vencimientos.Add(vencimiento);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }
    }
}