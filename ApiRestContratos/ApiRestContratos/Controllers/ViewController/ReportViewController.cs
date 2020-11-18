using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiRestContratos.Models;

namespace ApiRestContratos.Controllers.ViewController
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportViewController : ControllerBase
    {
        private readonly MyDBContext _context;

        public ReportViewController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/ReportView
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Report_View>>> GetSG_ReportViews()
        //{
        //    return await _context.SG_ReportViews.ToListAsync();
        //}

        //GET: api/ReportView
        [HttpGet]
        public IEnumerable<Report_View> GetSG_ReportViews()
        {
            return _context.SG_ReportViews.Where(c => c.Estado != "Nuevo");
        }

        // GET: api/ReportView/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Report_View>> GetReport_View(int id)
        {
            var report_View = await _context.SG_ReportViews.FindAsync(id);

            if (report_View == null)
            {
                return NotFound();
            }

            return report_View;
        }

        // PUT: api/ReportView/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReport_View(int id, Report_View report_View)
        {
            if (id != report_View.ID)
            {
                return BadRequest();
            }

            _context.Entry(report_View).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Report_ViewExists(id))
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

        // POST: api/ReportView
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Report_View>> PostReport_View(Report_View report_View)
        {
            _context.SG_ReportViews.Add(report_View);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReport_View", new { id = report_View.ID }, report_View);
        }

        // DELETE: api/ReportView/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Report_View>> DeleteReport_View(int id)
        {
            var report_View = await _context.SG_ReportViews.FindAsync(id);
            if (report_View == null)
            {
                return NotFound();
            }

            _context.SG_ReportViews.Remove(report_View);
            await _context.SaveChangesAsync();

            return report_View;
        }

        private bool Report_ViewExists(int id)
        {
            return _context.SG_ReportViews.Any(e => e.ID == id);
        }
    }
}
