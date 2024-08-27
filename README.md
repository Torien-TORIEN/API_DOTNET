# Commandes pour c# :
    dotnet new webapi -o ProjectName
    dotnet watch run 

# Extensions
    C#
    C# Dev Kit
    .NET Extention Pack
    .NET Install Tool
    Nuget Gallery
    Prettier
    Extention Pack Joskreativ
    C# IDE Extentions for VSCode

# Dependancies : avec dotnet add package package-name
    Microsoft.EntityFrameworkCore.SqlServer
    Microsoft.EntityFrameworkCore.Tools
    Microsoft.EntityFrameworkCore.Design
    Microsoft.AspNetCore.SignalR

# Migration : dotnet tool install --global dotnet-ef --version 8.*
    dotnet ef migrations add init  => generate code to create database <= dotnet ef migrations remove
    dotnet ef database update       => Create database
    dotnet ef migrations remove => Annule dotnet ef migrations add init lorsqu'on a pas encore fait update
        => Sinon `dotnet ef database update 0` PUIS => `dotnet ef migrations remove`
    
    Après la modification des models :
    ` dotnet ef migrations add AddNewEntity ` et `dotnet ef database update` 

# Parfois, les fichiers intermédiaires du compilateur peuvent causer des problèmes. Essayez de nettoyer et de reconstruire le projet :
    dotnet clean
    dotnet build


# TOKEN
## Installation des librairies :
    dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

## Créer les models de Refresh Token si vous allez utiliser la base de données
`
public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty; // The actual refresh token value
        public DateTime ExpirationDate { get; set; } // When the token expires
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow; // When the token was issued
        public string IpAddress { get; set; } = string.Empty; // Optionally store IP address for security
        public bool IsRevoked { get; set; } = false; // To mark if the token has been revoked
        public DateTime? RevokedDate { get; set; } // When the token was revoked

        public int UserId { get; set; } // Foreign key to the User
        public User User { get; set; } // Navigation property to the User
    }
`

## Créer un service de token pour : GetPrincipalFromExpiredToken, GenerateRefreshToken, GenerateAccessToken

## Configurer les paramètres de tokens dans appsettings.json : 
`
"Jwt": {
    "Key": "UneCléSuperSecrètePourLeTokenJWT",
    "Issuer": "http://localhost:5096", // Fournisseur de token(serveur domain ou Ip)
    "Audience": "http://localhost:4200" // Le public visé (frontend : domain ou Ip)
  }
`

## Developper AuthController pour login, RefreshToken, RevokeRefreshToken

## Générer le MidelWare pour vérifier le acces token jwt dans Program.cs
`
/... Autres
/ Configurer l'authentification JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

//... Autres

var app = builder.Build();

//... Autres

// Ajouter le middleware d'authentification
app.UseAuthentication();
app.UseAuthorization();

`

## Mettre [AllowAnonymous] pour les methodes sans protection de jwt et [Authorize] pour les méthodes securisées par JWT
`
[HttpPost("login")]
[AllowAnonymous]
public IActionResult Login([FromBody] LoginDto loginDto){}

[HttpGet]
[Authorize]
public IActionResult GetAll(int page = 1, int pageSize = 10){}
`