import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Injecter le AuthService

  // Ajouter le token d'accès si disponible
  const token = authService.getAccessToken();
  const authReq = token ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }) : req;

  //console.log(" Interceptor");
  

  // Passer la requête au gestionnaire suivant
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si l'erreur est une 401 (non autorisée), essayer de rafraîchir le token
      if (error.status === 401 && authService.isAuthenticated()) {
        const refreshToken = authService.getRefreshToken();
        console.log("Token espiré!")
        if(refreshToken!==null){
          return authService.refreshToken(refreshToken).pipe(
            switchMap((newTokenData) => {
              // Sauvegarder les nouveaux tokens
              authService.saveTokensToCookies(newTokenData.accessToken, newTokenData.refreshToken);
  
              // Recréer la requête avec le nouveau token d'accès
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newTokenData.accessToken}`
                }
              });
  
              // Réessayer la requête avec le nouveau token
              return next(retryReq);
            }),
            catchError(err => {
              // Si le renouvellement du token échoue, effectuer une déconnexion
              authService.logout();
              return throwError(err);
            })
          );
        }
      }else if(error.status==401 && !authService.isAuthenticated()){
        authService.logout();
      }
      
      // Passer l'erreur au gestionnaire d'erreurs global
      return throwError(error);
    })
  );
};
