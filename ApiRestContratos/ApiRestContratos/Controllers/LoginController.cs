using ApiRestContratos.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ApiRestContratos.Controllers
{
    [EnableCors("CorsPolicy")]
    [Route("api/login")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<LoginController> _logger;
        private readonly MyDBContext _context;

        public LoginController(IConfiguration configuration, ILogger<LoginController> logger, MyDBContext context)
        {
            _configuration = configuration;
            _logger = logger;
            _context = context;
        }

        [AllowAnonymous]
        [Route("login")]
        public async Task Login(string returnUrl)
        {
            returnUrl = _configuration["returnURL"];
            var props = new AuthenticationProperties { RedirectUri = returnUrl };
            await HttpContext.ChallengeAsync("CAS", props);
        }

        [HttpGet]
        [Route("getUser")]
        public IActionResult GetUser()
        {
            Dictionary<string, object> info = new Dictionary<string, object>();

            if (this.User.Identity.IsAuthenticated)
            {
                //SELECT * FROM "CONTRATOS"."AC_Users" WHERE "txt_username"='mefuente';
                var usuario1 = _context.AC_Users.Where(x => x.txt_username == this.User.Identity.Name).ToList();
                var usuario2 = _context.SG_UsuariosViews.Where(x => x.Usuario == this.User.Identity.Name).FirstOrDefault();
                var token = GetToken(this.User.Identity.Name);

                if (usuario2 != null)
                {
                    info.Add("usuario", usuario2);
                    info.Add("rol", usuario2.NombreRol);
                }
                else
                {
                    info.Add("usuario", usuario1);
                    info.Add("rol", "Administrador-Contrato");
                }
                info.Add("username", this.User.Identity.Name);
                info.Add("token", token);
                info.Add("ultimoAcceso", DateTime.Now);

                return Ok(info);
            }
            return NotFound();
        }


        [HttpPost]
        [Route("getToken")]
        public IActionResult GetToken(string userName)
        {
            try
            {
                var token = GenerarToken(userName);

                return Ok(new
                {
                    response = new JwtSecurityTokenHandler().WriteToken(token)
                });
            }
            catch (Exception e)
            {
                _logger.LogError("Login: " + e.Message, e);
                return StatusCode((int)System.Net.HttpStatusCode.InternalServerError, e.Message);
            }
        }

        private JwtSecurityToken GenerarToken(string userName)
        {
            string ValidIssuer = _configuration["ApiAuth:Issuer"];
            string ValidAudience = _configuration["ApiAuth:Audience"];
            SymmetricSecurityKey IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["ApiAuth:SecretKey"]));

            //La fecha de expiracion sera el mismo dia a las 12 de la noche
            DateTime dtFechaExpiraToken;
            DateTime now = DateTime.Now;
            dtFechaExpiraToken = new DateTime(now.Year, now.Month, now.Day, 23, 59, 59, 999);

            //Agregamos los claim nuestros
            var claims = new[]
            {
                new Claim(Constantes.JWT_CLAIM_USUARIO, userName)
            };

            return new JwtSecurityToken
            (
                issuer: ValidIssuer,
                audience: ValidAudience,
                claims: claims,
                expires: dtFechaExpiraToken,
                notBefore: now,
                signingCredentials: new SigningCredentials(IssuerSigningKey, SecurityAlgorithms.HmacSha256)
            );
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            //await HttpContext.SignOutAsync();
            return Redirect($"{_configuration["CasBaseUrl"]}/logout");
        }
    }
}