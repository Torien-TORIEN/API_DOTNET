import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/user.model';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
export class LoginService {
    private API_URL="http://localhost:5096/api/user";
    private userLoggedIn !:User |null;
    key ="userLogged"
    constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document, private router : Router) {
        const sessionStorage = this.document.defaultView?.sessionStorage;
        if (sessionStorage) {
            const storedUser = sessionStorage.getItem(this.key);
            if (storedUser) {
                this.userLoggedIn=JSON.parse(storedUser);
            }
          }
    }



    login(username : string, password : string){
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return new Promise<any>((resolve, reject)=>{
            this.http.post<User>(`${this.API_URL}/login`,{username, password} ,{headers}).subscribe({
            next :(data)=>{
                this.userLoggedIn=data;
                this.setUserLogged(this.userLoggedIn);
                resolve(data);
            },
            error: err=>{
                reject("Error while logging in :"+ err.message)
            }
            })
        })
          
    }

    private setUserLogged(user :User){
        const sessionStorage = this.document.defaultView?.sessionStorage;
        if (sessionStorage) {
            sessionStorage.setItem(this.key,JSON.stringify(user));
        }
    }

    getUserLogged(){
        const sessionStorage = this.document.defaultView?.sessionStorage;
        if (sessionStorage) {
            const storedUser = sessionStorage.getItem(this.key);
            if (storedUser) return JSON.parse(storedUser);
            else return null;
        } else {
            return null;
        }
    }

    logout(){
        const sessionStorage = this.document.defaultView?.sessionStorage;
        if (sessionStorage) {
            sessionStorage.removeItem(this.key);
        }
        this.router.navigateByUrl("/login");
    }
}