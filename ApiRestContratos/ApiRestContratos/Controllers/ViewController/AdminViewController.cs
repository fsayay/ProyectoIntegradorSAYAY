using System.Collections.Generic;
using System.Threading.Tasks;
using ApiRestContratos.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiRestContratos.Controllers.ViewController
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    [EnableCors("CorsPolicy")]
    public class AdminViewController : ControllerBase
    {
        private readonly MyDBContext _context;

        public AdminViewController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/AdminView
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Admin_View>>> GetAdminViews()
        {
            return await _context.SG_AdminViews.ToListAsync();
        }
    }
}