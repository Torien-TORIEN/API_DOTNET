using api.Data;
using api.Services; // Ajoutez cette ligne pour inclure le namespace de TokenService
using Microsoft.EntityFrameworkCore;

//[SignalR]
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using api.Hubs;
using System.Text.Json.Serialization;

//Token
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;
using api.Models;
using api.Mappers;

var builder = WebApplication.CreateBuilder(args);

//Ajout de mappeur
builder.Services.AddAutoMapper(typeof(MappingProfile));


// Ajout des services dans le conteneur DI
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
/* .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        options.JsonSerializerOptions.MaxDepth = 2; // Augmenter la profondeur maximale si nécessaire
    }); */

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuration du DbContext pour Entity Framework Core avec SQL Server
builder.Services.AddDbContext<ApplicationDBContext>(options =>{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//[SignalR] Ajout de SignalR
builder.Services.AddSignalR();

// Ajout des services CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        builder => builder
            .WithOrigins("http://localhost:4300")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

// Configurer l'authentification JWT
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

// Enregistrement du TokenService pour l'injection de dépendance
builder.Services.AddScoped<TokenService>(); // Ajoutez cette ligne pour enregistrer TokenService

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{   
    // Activation de Swagger pour la documentation API
    app.UseSwagger();
    app.UseSwaggerUI();

    
    app.UseHttpsRedirection();
}

//Permet de gérer les requêtes HTTPS en développement
app.UseHttpsRedirection();

// Ajout de la gestion des routes
app.UseRouting();

// Ajout du middleware CORS
app.UseCors("AllowAngularApp");

// Ajouter le middleware d'authentification
app.UseAuthentication();
app.UseAuthorization();

// Mapping des endpoints pour les contrôleurs
app.MapControllers();

// [SignalR] Mapping des endpoints pour SignalR
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<MessageHub>("/messageHub"); // Endpoint pour le hub SignalR
    endpoints.MapHub<PostHub>("/postHub"); // Endpoint pour le hub SignalR
    endpoints.MapControllers();
});

app.Run();
