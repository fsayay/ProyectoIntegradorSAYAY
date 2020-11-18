using ApiRestContratos.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiRestContratos.Controllers
{    
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    [EnableCors("CorsPolicy")]
    public class ActaController : ControllerBase
    {
        private readonly MyDBContext _context;

        public ActaController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/Acta
        [HttpGet]
        public IEnumerable<Acta> GetAC_Acta()
        {
            return _context.AC_Actas;
        }

        // GET: api/Acta/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Acta>> GetActa(int id)
        {
            var acta = await _context.AC_Actas.FindAsync(id);

            if (acta == null)
            {
                return NotFound();
            }

            return acta;
        }

        // PUT: api/Acta/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutActa([FromRoute] int id, [FromBody] Acta acta)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != acta.ID)
            {
                return BadRequest();
            }

            _context.Entry(acta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(acta);
        }
        // POST: api/Acta
        [HttpPost]
        public async Task<IActionResult> PostActa([FromBody] Acta acta)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.AC_Actas.Add(acta);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetActa", new { id = acta.ID }, acta);
        }

        // DELETE: api/Acta/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Acta>> DeleteActa(int id)
        {
            var acta = await _context.AC_Actas.FindAsync(id);
            if (acta == null)
            {
                return NotFound(); 
            }

            _context.AC_Actas.Remove(acta);
            await _context.SaveChangesAsync();

            return acta;
        }


        private bool ActaExists(int id)
        {
            return _context.AC_Actas.Any(e => e.ID == id);
        }
    }
}