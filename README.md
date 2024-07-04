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
