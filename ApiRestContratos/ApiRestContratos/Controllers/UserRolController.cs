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
    public class UserRolController : ControllerBase
    {
        private readonly MyDBContext _context;

        public UserRolController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/UserRol
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserRol_View>>> GetUserRol()
        {
            return await _context.SG_UsuariosViews.ToListAsync();
        }

        // GET: api/UserRol/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserRol>> GetUserRol(int id)
        {
            var userRol = await _context.AC_UserRol.FindAsync(id);

            if (userRol == null)
            {
                return NotFound();
            }

            return userRol;
        }

        // POST: api/UserRol/GetAllUsers
        [HttpPost("{GetAllUsers}")]
        public IEnumerable<User> GetAllUsers()
        {
            return _context.AC_Users;
        }

        // PUT: api/UserRol/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserRol(int id, UserRol userRol)
        {
            if (id != userRol.userID)
            {
                return BadRequest();
            }

            _context.Entry(userRol).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserRolExists(id))
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

        // POST: api/UserRol
        public async Task<ActionResult<UserRol>> PostUserRol(UserRol userRol)
        {
            _context.AC_UserRol.Add(userRol);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserRolExists(userRol.userID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserRol", new { id = userRol.userID }, userRol);
        }

        // DELETE: api/UserRol/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserRol>> DeleteUserRol(int id)
        {
            var userRol = await _context.AC_UserRol.FindAsync(id);
            if (userRol == null)
            {
                return NotFound();
            }

            _context.AC_UserRol.Remove(userRol);
            await _context.SaveChangesAsync();

            return userRol;
        }

        private bool UserRolExists(int id)
        {
            return _context.AC_UserRol.Any(e => e.userID == id);
        }
    }
}
