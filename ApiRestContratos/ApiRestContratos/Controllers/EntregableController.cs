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
    public class EntregableController : ControllerBase
    {
        private readonly MyDBContext _context;

        public EntregableController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/Entregable
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entregable>>> GetAC_Entregables()
        {
            return await _context.AC_Entregables.ToListAsync();
        }

        // GET: api/Entregable/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Entregable>> GetEntregable(int id)
        {
            var entregable = await _context.AC_Entregables.FindAsync(id);

            if (entregable == null)
            {
                return NotFound();
            }

            return entregable;
        }

        // PUT: api/Entregable/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEntregable(int id, Entregable entregable)
        {
            if (id != entregable.ID)
            {
                return BadRequest();
            }

            _context.Entry(entregable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EntregableExists(id))
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

        // POST: api/Entregable
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Entregable>> PostEntregable(Entregable entregable)
        {
            _context.AC_Entregables.Add(entregable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEntregable", new { id = entregable.ID }, entregable);
        }

        // DELETE: api/Entregable/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Entregable>> DeleteEntregable(int id)
        {
            var entregable = await _context.AC_Entregables.FindAsync(id);
            if (entregable == null)
            {
                return NotFound();
            }

            _context.AC_Entregables.Remove(entregable);

            var vencimiento = await _context.AC_Vencimientos.SingleOrDefaultAsync(v => v.entregableID == id);

            if(vencimiento != null)
            {
                _context.AC_Vencimientos.Remove(vencimiento);
            }
            
            await _context.SaveChangesAsync();

            return entregable;
        }

        private bool EntregableExists(int id)
        {
            return _context.AC_Entregables.Any(e => e.ID == id);
        }
    }
}
