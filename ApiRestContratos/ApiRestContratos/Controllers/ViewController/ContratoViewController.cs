using ApiRestContratos.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiRestContratos.Controllers.ViewController
{
    
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    [EnableCors("CorsPolicy")]
    public class ContratoViewController : ControllerBase
    {
        private readonly MyDBContext _context;

        public ContratoViewController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/ContratoView
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contrato_View>>> GetContratoViews()
        {
            return await _context.SG_ContratoViews.ToListAsync();
        }

        // GET: api/ContratoView/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contrato_View>> GetContratoView(int id)
        {
            var contrato = await _context.SG_ContratoViews.FindAsync(id);

            if (contrato == null)
            {
                return NotFound();
            }

            return contrato;
        }

        // POST: api/Contrato/GetContratosByAdmin/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.

        [HttpPost("{GetContratosByAdmin}/{id?}")]
        public IEnumerable<Contrato_View> GetContratosByAdmin(int id)
        {
            return _context.SG_ContratoViews.Where(c => c.userID == id);
        }


        // PUT: api/ContratoView
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.

        [HttpPut]
        public async Task<IActionResult> PutContratoView([FromBody] ICollection<Contrato> contratos)
        {

            _context.AC_Contratos.UpdateRange(contratos);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}