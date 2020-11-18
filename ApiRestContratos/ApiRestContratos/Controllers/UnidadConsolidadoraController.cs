using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiRestContratos.Models;

namespace ApiRestContratos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnidadConsolidadoraController : ControllerBase
    {
        private readonly MyDBContext _context;

        public UnidadConsolidadoraController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/UnidadConsolidadora
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UnidadConsolidadora>>> GetAC_UnidadConsolidadora()
        {
            return await _context.AC_UnidadConsolidadora.ToListAsync();
        }

        // GET: api/UnidadConsolidadora/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UnidadConsolidadora>> GetUnidadConsolidadora(int id)
        {
            var unidadConsolidadora = await _context.AC_UnidadConsolidadora.FindAsync(id);

            if (unidadConsolidadora == null)
            {
                return NotFound();
            }

            return unidadConsolidadora;
        }

        // PUT: api/UnidadConsolidadora/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUnidadConsolidadora(int id, UnidadConsolidadora unidadConsolidadora)
        {
            if (id != unidadConsolidadora.ID)
            {
                return BadRequest();
            }

            _context.Entry(unidadConsolidadora).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UnidadConsolidadoraExists(id))
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

        // POST: api/UnidadConsolidadora
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<UnidadConsolidadora>> PostUnidadConsolidadora(UnidadConsolidadora unidadConsolidadora)
        {
            _context.AC_UnidadConsolidadora.Add(unidadConsolidadora);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUnidadConsolidadora", new { id = unidadConsolidadora.ID }, unidadConsolidadora);
        }

        // DELETE: api/UnidadConsolidadora/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UnidadConsolidadora>> DeleteUnidadConsolidadora(int id)
        {
            var unidadConsolidadora = await _context.AC_UnidadConsolidadora.FindAsync(id);
            if (unidadConsolidadora == null)
            {
                return NotFound();
            }

            _context.AC_UnidadConsolidadora.Remove(unidadConsolidadora);
            await _context.SaveChangesAsync();

            return unidadConsolidadora;
        }

        private bool UnidadConsolidadoraExists(int id)
        {
            return _context.AC_UnidadConsolidadora.Any(e => e.ID == id);
        }
    }
}
