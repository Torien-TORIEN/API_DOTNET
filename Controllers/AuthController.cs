using Microsoft.AspNetCore.Mvc;
using api.Data;
using api.Dtos;
using api.Models;
using api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly TokenService _tokenService;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthController(ApplicationDBContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            var user = _context.Users
                .Include(u=> u.profile)
                    .ThenInclude(p=> p.Menus)
                //.Include(u => u.RefreshTokens)
                .SingleOrDefault(u => u.username == loginDto.Username);

            if (user == null || 
                _passwordHasher.VerifyHashedPassword(user, user.password, loginDto.Password) == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            // Générer les tokens
            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken(HttpContext.Connection.RemoteIpAddress?.ToString());
            Console.WriteLine("IP Adresse :", HttpContext.Connection.RemoteIpAddress?.ToString());
            
            // Ajouter le refresh token à l'utilisateur
            user.RefreshTokens.Add(refreshToken);
            _context.SaveChanges();

            // Retourne une réponse avec le token d'accès, le token de rafraîchissement, et les informations de l'utilisateur
            return Ok(new 
            { 
                AccessToken = accessToken, 
                RefreshToken = refreshToken.Token,
                User = new 
                {
                    user.Id,
                    user.username,
                    user.profile // Inclure les informations de profil si nécessaire
                }
            });
        }

        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public IActionResult RefreshToken([FromBody] RefreshTokenDto tokenDto)
        {
            var user = _context.Users
                .Include(u => u.RefreshTokens)
                .SingleOrDefault(u => u.RefreshTokens.Any(rt => rt.Token == tokenDto.Token));

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid refresh token" });
            }

            var refreshToken = user.RefreshTokens.Single(rt => rt.Token == tokenDto.Token);

            if (refreshToken.IsRevoked || refreshToken.ExpirationDate <= DateTime.UtcNow)
            {
                return Unauthorized(new { message = "Invalid or expired refresh token" });
            }

            // Générer un nouveau token d'accès
            var accessToken = _tokenService.GenerateAccessToken(user);
            return Ok(new TokenDto { AccessToken = accessToken, RefreshToken = refreshToken.Token });
        }

        [HttpPost("revoke-refresh-token")]
        [Authorize]
        public IActionResult RevokeRefreshToken([FromBody] RefreshTokenDto tokenDto)
        {
            var user = _context.Users
                .Include(u => u.RefreshTokens)
                .SingleOrDefault(u => u.RefreshTokens.Any(rt => rt.Token == tokenDto.Token));

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid refresh token" });
            }

            var refreshToken = user.RefreshTokens.Single(rt => rt.Token == tokenDto.Token);
            refreshToken.IsRevoked = true;
            refreshToken.RevokedDate = DateTime.UtcNow;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost("get-principal-from-expired-token")]
        [AllowAnonymous]
        public IActionResult GetPrincipalFromExpiredToken([FromBody] RefreshTokenDto tokenDto)
        {
            try
            {
                var principal = _tokenService.GetPrincipalFromExpiredToken(tokenDto.Token);

                Console.WriteLine("principal :", principal);

                if (principal == null)
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                // Afficher toutes les revendications présentes pour débogage
                // foreach (var claim in principal.Claims)
                // {
                //     Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
                // }

                // Extraire les informations du principal, telles que le nom d'utilisateur et d'autres claims
                var usernameClaim = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                var username = usernameClaim?.Value;

                // Vous pouvez extraire d'autres revendications (claims) si nécessaire
                var jtiClaim = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti);
                var jti = jtiClaim?.Value;

                // Récupère les informations de l'utilisateur depuis les revendications (claims)
                var user = _context.Users
                    .Include(u => u.profile)
                        .ThenInclude(p => p.Menus)
                    .SingleOrDefault(u => u.username == username);

                if (user == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                // Retourne les informations utilisateur obtenues à partir du token
                return Ok(new
                {
                    user.Id,
                    user.username,
                    user.profile
                });
            }
            catch (SecurityTokenException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

    }
}
