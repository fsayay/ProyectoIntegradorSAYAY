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
    public class ModificacionController : ControllerBase
    {
        private readonly MyDBContext _context;

        public ModificacionController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/Modificacion
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Modificacion>>> GetAC_Modificaciones()
        {
            return await _context.AC_Modificaciones.ToListAsync();
        }

        // GET: api/Modificacion/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Modificacion>> GetModificacion(int id)
        {
            var modificacion = await _context.AC_Modificaciones.FindAsync(id);

            if (modificacion == null)
            {
                return NotFound();
            }

            return modificacion;
        }

        // PUT: api/Modificacion/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutModificacion(int id, Modificacion modificacion)
        {
            if (id != modificacion.ID)
            {
                return BadRequest();
            }

            _context.Entry(modificacion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ModificacionExists(id))
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

        // POST: api/Modificacion
        [HttpPost]
        public async Task<ActionResult<Modificacion>> PostModificacion(Modificacion modificacion)
        {
            _context.AC_Modificaciones.Add(modificacion);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetModificacion", new { id = modificacion.ID }, modificacion);
        }

        private bool ModificacionExists(int id)
        {
            return _context.AC_Modificaciones.Any(e => e.ID == id);
        }
    }
}
