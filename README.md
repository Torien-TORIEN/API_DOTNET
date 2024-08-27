# Web Socket : SignalR

## Installation :
    npm install @microsoft/signalr

## Service Signalr


## Generator d'API :
### Installer du coté du front
    npm install -g @openapitools/openapi-generator-cli

### Installer Java sur votre poste
    https://www.oracle.com/java/technologies/downloads/#java11

    Mettre le path dans la variables d'environnement système
    Créer une variable    JAVA_HOME = C:\Program Files\Java\jdk-22
    et Dands le path= %JAVA_HOME%\bin


### Mettre ce scrip dans le package.json
    "generate:api": "openapi-generator-cli generate -g typescript-angular -i http://localhost:5096/swagger/v1/swagger.json -o ./openapi/build",

    


































# FrontAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
