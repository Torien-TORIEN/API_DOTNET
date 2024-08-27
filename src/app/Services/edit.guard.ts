import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EditGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    // Récupérer l'URL de menu passée en paramètre au Guard
    const requiredMenuUrl = route.data['requiredMenuUrl'];

    // Récupérer les menus accessibles par l'utilisateur depuis le localStorage via le service d'authentification
    const userMenus = this.authService.getUserMenus();

    // Vérifier si l'utilisateur a le menu requis et que isReadOnly est false
    const hasAccess = userMenus.some(menu => menu.path === requiredMenuUrl && menu.isReadOnly === false);

    if (hasAccess) {
      return true;  // Autoriser l'accès
    } else {
      // Rediriger vers une page d'erreur ou la page d'accueil si l'utilisateur n'a pas l'accès
      this.router.navigate(['/access-denied']);
      return false;
    }
  }
}
