
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const MenuGuard: CanActivateFn = (route, state) => {

  const authService :AuthService = inject(AuthService) ;
  const router : Router = inject(Router);

  // Récupérer les menus accessibles par l'utilisateur depuis le localStorage via le service d'authentification
  const userMenus = authService.getUserMenusPath();

  // Extraire le chemin de base de l'URL sans les paramètres de requête
  const baseUrl = state.url.split('?')[0];

  // Vérifier si le chemin de la route actuelle est dans la liste des menus de l'utilisateur
  if (userMenus.includes(baseUrl)) {
    return true;  // Autoriser l'accès
  } else {
    // Rediriger vers une page d'erreur ou la page d'accueil si l'utilisateur n'a pas l'accès
    router.navigate(['/access-denied']);
    return false;
  }
};



/* import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {

    // Récupérer les menus accessibles par l'utilisateur depuis le localStorage via le service d'authentification
    const userMenus = this.authService.getUserMenusPath();

    // Extraire le chemin de base de l'URL sans les paramètres de requête
    const baseUrl = state.url.split('?')[0];

    //console.log("user menus :", userMenus,"base url:",baseUrl);

    // Vérifier si le chemin de la route actuelle est dans la liste des menus de l'utilisateur
    if (userMenus.includes(baseUrl)) {
      return true;  // Autoriser l'accès
    } else {
      // Rediriger vers une page d'erreur ou la page d'accueil si l'utilisateur n'a pas l'accès
      this.router.navigate(['/access-denied']);
      return false;
    }
  }
} */
