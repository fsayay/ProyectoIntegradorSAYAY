using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiRestContratos.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRestContratos.Controllers.ViewController
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    [EnableCors("CorsPolicy")]
    public class FormaPagoViewController : ControllerBase
    {
        private readonly MyDBContext _context;

        public FormaPagoViewController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/FormaPagoView/5
        [HttpGet("{id}")]
        public IEnumerable<FormaPago_View> GetFormaPagoView(int id)
        {
            return _context.SG_FormaPagoViews.Where(c => c.contratoID == id);
        }
    }
}