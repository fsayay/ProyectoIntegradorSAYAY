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
    public class FormaPagoController : ControllerBase
    {
        private readonly MyDBContext _context;

        public FormaPagoController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/FormaPago
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FormaPago>>> GetAC_FormaPago()
        {
            return await _context.AC_FormaPago.ToListAsync();
        }

        // GET: api/FormaPago/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FormaPago>> GetFormaPago(int id)
        {
            var formaPago = await _context.AC_FormaPago.FindAsync(id);

            if (formaPago == null)
            {
                return NotFound();
            }

            return formaPago;
        }

        // PUT: api/FormaPago/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFormaPago(int id, FormaPago formaPago)
        {
            if (id != formaPago.ID)
            {
                return BadRequest();
            }

            _context.Entry(formaPago).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FormaPagoExists(id))
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

        // POST: api/FormaPago
        [HttpPost]
        public async Task<ActionResult<FormaPago>> PostFormaPago([FromBody] FormaPago formaPago)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.AC_FormaPago.Add(formaPago);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFormaPago", new { id = formaPago.ID }, formaPago);
        }

        // DELETE: api/FormaPago/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FormaPago>> DeleteFormaPago(int id)
        {
            var formaPago = await _context.AC_FormaPago.FindAsync(id);
            if (formaPago == null)
            {
                return NotFound();
            }

            _context.AC_FormaPago.Remove(formaPago);
            await _context.SaveChangesAsync();

            return formaPago;
        }

        private bool FormaPagoExists(int id)
        {
            return _context.AC_FormaPago.Any(e => e.ID == id);
        }
    }
}
