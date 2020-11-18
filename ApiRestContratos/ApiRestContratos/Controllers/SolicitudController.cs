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

    //[Authorize]
    [EnableCors("CorsPolicy")]
    public class SolicitudController : ControllerBase
    {
        private readonly MyDBContext _context;

        public SolicitudController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/Solicitud
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Solicitud>>> GetAC_Solicitudes()
        {
            return await _context.AC_Solicitudes.ToListAsync();
        }

        // GET: api/Solicitud/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Solicitud>> GetSolicitud(int id)
        {
            var solicitud = await _context.AC_Solicitudes.FindAsync(id);

            if (solicitud == null)
            {
                return NotFound();
            }

            return solicitud;
        }

        // POST: api/Solicitud/GetSolicitudesByAdmin/5
        [HttpPost("{GetSolicitudesByAdmin}/{id?}")]
        public IEnumerable<Solicitud> GetSolicitudesByAdmin(int id)
        {
            return _context.AC_Solicitudes.Where(c => c.qn_idEmisor == id);
        }

        // POST: api/Solicitud/GetSolicitudesByUASAdmin/5
        [HttpPost("{GetSolicitudesByUASAdmin}/{id?}")]
        public IEnumerable<Solicitud> GetSolicitudesByUASAdmin(int id)
        {
            return _context.AC_Solicitudes.Where(c => c.qn_idReceptor == id);
        }

        // PUT: api/Solicitud/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSolicitud(int id, Solicitud solicitud)
        {
            if (id != solicitud.ID)
            {
                return BadRequest();
            }

            _context.Entry(solicitud).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SolicitudExists(id))
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

        // POST: api/Solicitud
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Solicitud>> PostSolicitud(Solicitud solicitud)
        {
            _context.AC_Solicitudes.Add(solicitud);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSolicitud", new { id = solicitud.ID }, solicitud);
        }

        // DELETE: api/Solicitud/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Solicitud>> DeleteSolicitud(int id)
        {
            var solicitud = await _context.AC_Solicitudes.FindAsync(id);
            if (solicitud == null)
            {
                return NotFound();
            }

            _context.AC_Solicitudes.Remove(solicitud);
            await _context.SaveChangesAsync();

            return solicitud;
        }

        private bool SolicitudExists(int id)
        {
            return _context.AC_Solicitudes.Any(e => e.ID == id);
        }
    }
}
