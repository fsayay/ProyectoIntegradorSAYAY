using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiRestContratos.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace ApiRestContratos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    [EnableCors("CorsPolicy")]
    public class GarantiaController : ControllerBase
    {
        private readonly MyDBContext _context;

        public GarantiaController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/Garantia
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Garantia>>> GetAC_Garantias()
        {
            return await _context.AC_Garantias.ToListAsync();
        }

        // GET: api/Garantia/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Garantia>> GetGarantia(int id)
        {
            var garantia = await _context.AC_Garantias.FindAsync(id);

            if (garantia == null)
            {
                return NotFound();
            }

            return garantia;
        }

        // PUT: api/Garantia/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGarantia(int id, Garantia garantia)
        {
            if (id != garantia.ID)
            {
                return BadRequest();
            }

            _context.Entry(garantia).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GarantiaExists(id))
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

        // POST: api/Garantia
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Garantia>> PostGarantia(Garantia garantia)
        {
            _context.AC_Garantias.Add(garantia);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGarantia", new { id = garantia.ID }, garantia);
        }


        // DELETE: api/Garantia/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Garantia>> DeleteGarantia(int id)
        {
            var garantia = await _context.AC_Garantias.FindAsync(id);
            if (garantia == null)
            {
                return NotFound();
            }

            _context.AC_Garantias.Remove(garantia);

            var vencimiento = await _context.AC_Vencimientos.SingleOrDefaultAsync(v => v.garantiaID == id);
            _context.AC_Vencimientos.Remove(vencimiento);
            
            await _context.SaveChangesAsync();

            return garantia;
        }


        private bool GarantiaExists(int id)
        {
            return _context.AC_Garantias.Any(e => e.ID == id);
        }
    }
}
