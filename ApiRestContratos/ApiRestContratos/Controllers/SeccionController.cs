using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiRestContratos.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace ApiRestContratos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   // [Authorize]
    [EnableCors("CorsPolicy")]
    public class SeccionController : ControllerBase
    {
        private readonly MyDBContext _context;

        public SeccionController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/Seccion
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Seccion>>> GetAC_Secciones()
        {
            return await _context.AC_Secciones.Include(t => t.tipos).ToListAsync();
        }

        // GET: api/Seccion/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Seccion>> GetSeccion(int id)
        {
            //var seccion = await _context.AC_Secciones.FindAsync(id);
            var seccion = await _context.AC_Secciones.Include(t => t.tipos).SingleOrDefaultAsync(s => s.seccionID == id);

            if (seccion == null)
            {
                return NotFound();
            }

            return seccion;
        }

        // PUT: api/Seccion/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSeccion(int id, Seccion seccion)
        {
            if (id != seccion.seccionID)
            {
                return BadRequest();
            }

            _context.Entry(seccion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeccionExists(id))
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

        // POST: api/Seccion
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Seccion>> PostSeccion(Seccion seccion)
        {
            _context.AC_Secciones.Add(seccion);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSeccion", new { id = seccion.seccionID }, seccion);
        }

        // DELETE: api/Seccion/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Seccion>> DeleteSeccion(int id)
        {
            var seccion = await _context.AC_Secciones.FindAsync(id);
            if (seccion == null)
            {
                return NotFound();
            }

            _context.AC_Secciones.Remove(seccion);
            await _context.SaveChangesAsync();

            return seccion;
        }

        private bool SeccionExists(int id)
        {
            return _context.AC_Secciones.Any(e => e.seccionID == id);
        }
    }
}
