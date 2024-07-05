using api.Data;
using Microsoft.EntityFrameworkCore;

//[SignalR]
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Ajout des services dans le conteneur DI
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
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
            .WithOrigins("http://localhost:53737")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

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
app.UseAuthorization();

// Mapping des endpoints pour les contrôleurs
app.MapControllers();

// [SignalR] Mapping des endpoints pour SignalR
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<MessageHub>("/messageHub"); // Endpoint pour le hub SignalR
    endpoints.MapControllers();
});

app.Run();
