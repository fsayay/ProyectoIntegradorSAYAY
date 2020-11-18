using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiRestContratos.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace ApiRestContratos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    [EnableCors("CorsPolicy")]
    public class VencimientoController : ControllerBase
    {
        private readonly MyDBContext _context;

        public VencimientoController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/Vencimiento/5
        [HttpGet("{id}")]
        public IEnumerable<Vencimiento> GetVencimientos(int id)
        {
            return _context.AC_Vencimientos.Where(c => c.contratoID == id);
        } 

        // PUT: api/Vencimiento/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVencimiento(int id, Vencimiento vencimiento)
        {
            if (id != vencimiento.ID)
            {
                return BadRequest();
            }

            _context.Entry(vencimiento).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VencimientoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Vencimiento
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Vencimiento>> PostVencimiento(ICollection<Vencimiento> vencimientos)
        {
            _context.AC_Vencimientos.AddRange(vencimientos);
            await _context.SaveChangesAsync();

            return NoContent();
        }



        // DELETE: api/Vencimiento/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Vencimiento>> DeleteVencimiento(int id)
        {
            var vencimiento = await _context.AC_Vencimientos.FindAsync(id);
            if (vencimiento == null)
            {
                return NotFound();
            }

            _context.AC_Vencimientos.Remove(vencimiento);
            await _context.SaveChangesAsync();

            return vencimiento;
        }

        private bool VencimientoExists(int id)
        {
            return _context.AC_Vencimientos.Any(e => e.ID == id);
        }
    }
}
