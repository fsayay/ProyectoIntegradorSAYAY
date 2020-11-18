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
    public class MultaController : ControllerBase
    {
        private readonly MyDBContext _context;

        public MultaController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/Multa
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Multa>>> GetAC_Multas()
        {
            return await _context.AC_Multas.ToListAsync();
        }

        // GET: api/Multa/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Multa>> GetMulta(int id)
        {
            var multa = await _context.AC_Multas.FindAsync(id);

            if (multa == null)
            {
                return NotFound();
            }

            return multa;
        }

        // PUT: api/Multa/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMulta(int id, Multa multa)
        {
            if (id != multa.ID)
            {
                return BadRequest();
            }

            _context.Entry(multa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MultaExists(id))
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

        // POST: api/Multa
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Multa>> PostMulta(Multa multa)
        {
            _context.AC_Multas.Add(multa);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMulta", new { id = multa.ID }, multa);
        }

        private bool MultaExists(int id)
        {
            return _context.AC_Multas.Any(e => e.ID == id);
        }
    }
}
