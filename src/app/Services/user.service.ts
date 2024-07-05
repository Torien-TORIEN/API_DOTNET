import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL="http://localhost:5096/api/user";
  constructor(private http: HttpClient) { }

  getAllUsers(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<Array<User>>((resolve, reject)=>{
      this.http.get<User[]>(this.API_URL, {headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while fetching all users :"+ err.message)
        }
      })
    })
  }

  addUser(user: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.post<User>(`${this.API_URL}/add`, user,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while adding a message :"+ err.message)
        }
      })
    })
  }

  deleteUser(id: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.delete<any>(`${this.API_URL}/${id}`,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while deleting a user :"+ err.message)
        }
      })
    })
  }

  updateUser(id: number, user : any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.put<any>(`${this.API_URL}/${id}`,user,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while updating a user :"+ err.message)
        }
      })
    })
  }
}
