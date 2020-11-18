using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

    public class ContratoController : ControllerBase
    {
        private readonly MyDBContext _context;

        public ContratoController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/Contrato
        [HttpGet]
        public IEnumerable<Contrato> GetContrato()
        {
            return _context.AC_Contratos;
        }

        // GET: api/Contrato/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetContrato([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Contrato contrato;
            contrato = await _context.AC_Contratos.SingleOrDefaultAsync(c => c.ID.Equals(id));

            if (contrato == null)
            {
                return NotFound();
            }

            return Ok(contrato);
        }

        // PUT: api/Contrato/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContrato([FromRoute] int id, [FromBody] Contrato contrato)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contrato.ID)
            {
                return BadRequest();
            }

            _context.Entry(contrato).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContratoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            //return Ok(contrato);
            return NoContent();
        }

        // POST: api/Contrato
        [HttpPost]
        public async Task<IActionResult> PostContrato([FromBody] Contrato contrato)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.AC_Contratos.Add(contrato);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContrato", new { id = contrato.ID }, contrato);
        }

        private bool ContratoExists(int id)
        {
            return _context.AC_Contratos.Any(e => e.ID == id);
        }
    }
}