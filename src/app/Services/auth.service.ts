import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Menu } from '../Models/menu.model';
import { User } from '../Models/user.model';
import { error } from 'console';

// DTOs
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: any; // Définir correctement le type pour 'user' selon vos besoins
}

interface TokenDto {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:5096/api/auth'; // URL de votre API

  private userKey = 'currentUser';
  private tokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private cookieService: CookieService
  ) {}

  // Récupérer l'utilisateur actuel depuis le localStorage
  private getUserFromLocalStorage(): any {
    const localStorage = this.document.defaultView?.localStorage;
    const user = localStorage?.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Enregistrer les informations de l'utilisateur dans le localStorage
  private saveUserToLocalStorage(user: any): void {
    const localStorage = this.document.defaultView?.localStorage;
    localStorage?.setItem(this.userKey, JSON.stringify(user));
  }

  // Supprimer les informations de l'utilisateur du localStorage
  private clearUserFromLocalStorage(): void {
    const localStorage = this.document.defaultView?.localStorage;
    localStorage?.removeItem(this.userKey);
  }

  // Enregistrer les tokens dans les cookies
  public saveTokensAndUser(loginData: LoginResponse): void {
    this.saveTokensToCookies(loginData.accessToken,loginData.refreshToken);
    this.saveUserToLocalStorage(loginData.user); // Enregistrer les informations utilisateur dans le localStorage
  }

  // Enregistrer les tokens dans les cookies
  public saveTokensToCookies(accessToken: string , refreshToken: string): void {
    this.cookieService.set(this.tokenKey, accessToken, 1, '/', undefined, true, 'Strict'); // Expire dans 1 jour & 15 minutes = 15/1440 jours
    this.cookieService.set(this.refreshTokenKey, refreshToken, 7, '/', undefined, true, 'Strict'); // Expire dans 7 jours
  }

  // Récupérer le token d'accès depuis les cookies
  public getAccessToken(): string | null {
    return this.cookieService.get(this.tokenKey);
  }

  //Recuperer le refresh token depuis les cookies
  public getRefreshToken(): string | null {
    return this.cookieService.get(this.refreshTokenKey);
  }  

  // Connexion de l'utilisateur
  public login(username: string, password: string): Promise<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject) => {
      this.http.post<LoginResponse>(`${this.API_URL}/login`, { username, password }, { headers })
        .subscribe({
          next: (data: LoginResponse) => {
            this.saveTokensAndUser(data);
            resolve(data);
          },
          error: err => {
            if (err.status === 500) {
              reject('Login or password incorrect!');
            } else if (err.status === 401) {
              reject(err.error.message);
            } else {
              reject('Server error!');
            }
          }
        });
    });
  }

  // Déconnexion de l'utilisateur
  public logout(): void {
    const refreshToken = this.cookieService.get(this.refreshTokenKey);
    if (refreshToken) {
      this.revokeRefreshToken(refreshToken).subscribe({
        next: () => this.finalizeLogout(),
        error: () => this.finalizeLogout() // Even on error, clear local storage and cookies
      });
    } else {
      this.finalizeLogout();
    }
  }

  // Suprimer les ctokens et user authentifié
  private finalizeLogout(): void {
    this.clearUserFromLocalStorage();
    this.cookieService.delete(this.tokenKey, '/');
    this.cookieService.delete(this.refreshTokenKey, '/');
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Méthode pour actualiser le token
  public refreshToken(refreshToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/refresh-token`, { token: refreshToken });
  }

  // Configurer l'en-tête de la requête avec le token d'accès
  public getHttpHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Vérifier si l'utilisateur est authentifié
  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  //Invalider le refresh token pour que ce ne soit plus utilisable
  private revokeRefreshToken(refreshToken: string) {
    return this.http.post(`${this.API_URL}/revoke-refresh-token`, { token: refreshToken });
  }

  // Récupérer les menus de l'utilisateur depuis le localStorage
  public getUserMenusPath(): string[] {
    const user = this.getUserLogged();
    return user?.profile?.menus?.map((menu: Menu) => menu.path) || [];
  }

  // Récupérer les menus de l'utilisateur depuis le localStorage
  public getUserMenus(): Menu[] {
    const user = this.getUserLogged();
    return user?.profile?.menus || [];
  }

  // Recupérer les informations de l'utilisateur connecté
  private getUserLoggedInfos(accessToken : string){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.post<any>(`${this.API_URL}/get-principal-from-expired-token`, { token: accessToken },{headers}).subscribe({
        next :(data : any)=>{
          resolve(data);
        },
        error: (err : any) =>{
          reject("Account not found :"+err.message);
        }
      })
    })
  }

  public getUserLogged(){
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();
    if(this.isAuthenticated() && refreshToken && accessToken){
      const user : User =this.getUserFromLocalStorage();
      if(!user){
        this.getUserLoggedInfos(accessToken)
          .then((data : any)=>{
            this.saveUserToLocalStorage(data);
            return user;
          })
          .catch(error=>{
            console.error(error);
            this.logout();
            return;
          })
      }
      return user;
    }else{
      this.logout();
      return ;
    }
  }
}
