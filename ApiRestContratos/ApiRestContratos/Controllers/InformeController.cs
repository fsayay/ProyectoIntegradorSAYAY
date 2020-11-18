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
    public class InformeController : ControllerBase
    {
        private readonly MyDBContext _context;

        public InformeController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/Informe
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Informe>>> GetAC_Informes()
        {
            return await _context.AC_Informes.ToListAsync();
        }

        // GET: api/Informe/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Informe>> GetInforme(int id)
        {
            var informe = await _context.AC_Informes.FindAsync(id);

            if (informe == null)
            {
                return NotFound();
            }

            return informe;
        }

        // PUT: api/Informe/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInforme(int id, Informe informe)
        {
            if (id != informe.ID)
            {
                return BadRequest();
            }

            _context.Entry(informe).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InformeExists(id))
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

        // POST: api/Informe
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Informe>> PostInforme(Informe informe)
        {
            _context.AC_Informes.Add(informe);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInforme", new { id = informe.ID }, informe);
        }

        // DELETE: api/Informe/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Informe>> DeleteInforme(int id)
        {
            var informe = await _context.AC_Informes.FindAsync(id);
            if (informe == null)
            {
                return NotFound();
            }

            _context.AC_Informes.Remove(informe);
            await _context.SaveChangesAsync();

            return informe;
        }

        private bool InformeExists(int id)
        {
            return _context.AC_Informes.Any(e => e.ID == id);
        }
    }
}
