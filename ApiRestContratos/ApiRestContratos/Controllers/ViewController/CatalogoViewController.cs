using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiRestContratos.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace ApiRestContratos.Controllers.ViewController
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatalogoViewController : ControllerBase
    {
        private readonly MyDBContext _context;

        public CatalogoViewController(MyDBContext context)
        {
            _context = context;
        }

        //GET: api/CatalogoView
       [HttpGet]
        public  IEnumerable<Catalogo_View> GetCatalogoViews()
        {
            return _context.SG_CatalogoViews.FromSqlRaw("SELECT * FROM \"CONTRATOS\".\"SG_CatalogoViews\"");
        }


        // GET: api/CatalogoView/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Catalogo_View>> GetCatalogoView(int id)
        {
            var catalogo = await _context.SG_CatalogoViews.FindAsync(id);

            if (catalogo == null)
            {
                return NotFound();
            }

            return catalogo;
        }
    }
}