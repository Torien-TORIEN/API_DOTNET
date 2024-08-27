using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt; // Pour manipuler les JWT
using System.Security.Claims; // Pour les revendications des tokens
using System.Security.Cryptography; // Pour les fonctionnalités de cryptographie
using System.Text; // Pour les opérations de codage de texte
using Microsoft.IdentityModel.Tokens; // Pour les fonctionnalités de validation des tokens
using api.Models; // Pour accéder aux modèles définis dans le projet

namespace api.Services
{
    public class TokenService
    {
        private readonly IConfiguration _configuration; // Champ privé pour stocker les paramètres de configuration

        // Constructeur qui reçoit une instance d'IConfiguration pour accéder aux paramètres de configuration
        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration; // Assigne l'instance de configuration au champ privé
        }

        // Méthode pour générer un token d'accès pour un utilisateur donné
        public string GenerateAccessToken(User user)
        {
            // Crée un tableau de revendications (claims) pour le token
            var claims = new[]
            {
                // Représente le sujet du token, ici le nom d'utilisateur
                new Claim(JwtRegisteredClaimNames.Sub, user.username),
                // Identifiant unique du token
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                // Ajouter d'autres revendications ici selon les besoins
            };

            // Crée une clé de sécurité symétrique à partir de la clé secrète spécifiée dans la configuration
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            
            // Crée des informations d'identification de signature avec la clé de sécurité
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Crée le token JWT avec les revendications, l'émetteur, l'audience, la date d'expiration, et les informations de signature
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"], // L'émetteur du token
                audience: _configuration["Jwt:Audience"], // L'audience du token
                claims: claims, // Les revendications incluses dans le token
                expires: DateTime.Now.AddHours(1), // La durée de validité du token
                signingCredentials: creds); // Les informations de signature du token

            // Convertit le token JWT en une chaîne de caractères
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Méthode pour générer un token de rafraîchissement
        public RefreshToken GenerateRefreshToken(string ipAddress)
        {
            // Utilise RNGCryptoServiceProvider pour générer des nombres aléatoires cryptographiquement sécurisés
            using (var rng = new RNGCryptoServiceProvider())
            {
                var randomBytes = new byte[64]; // Crée un tableau de bytes pour stocker les données aléatoires
                rng.GetBytes(randomBytes); // Remplit le tableau de bytes avec des données aléatoires
                return new RefreshToken
                {
                    // Convertit les bytes aléatoires en une chaîne Base64 pour le token de rafraîchissement
                    Token = Convert.ToBase64String(randomBytes),
                    ExpirationDate = DateTime.UtcNow.AddDays(7), // La date d'expiration du token de rafraîchissement
                    CreatedDate = DateTime.UtcNow, // La date de création du token de rafraîchissement
                    IpAddress = ipAddress // Adresse IP associée au token de rafraîchissement
                };
            }
        }

        // Méthode pour obtenir les informations de l'utilisateur à partir d'un token expiré
        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            // Définit les paramètres de validation pour le token
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false, // Ne valide pas l'audience du token
                ValidateIssuer = false, // Ne valide pas l'émetteur du token
                ValidateIssuerSigningKey = true, // Valide la clé de signature du token
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])), // La clé de signature utilisée pour valider le token
                ValidateLifetime = false // Permet de valider les tokens expirés
            };

            // Crée un gestionnaire de token JWT pour valider le token
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

            // Vérifie que le token est un JWT et que l'algorithme de signature est correct
            if (securityToken is not JwtSecurityToken jwtSecurityToken || 
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token"); // Lance une exception si le token est invalide
            }

            // Retourne le principal des revendications du token
            return principal;
        }
    }
}
