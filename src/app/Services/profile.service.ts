import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from '../Models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private API_URL="http://localhost:5096/api/profiles";
  constructor(private http: HttpClient) { }

  getAllProfiles(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any[]>((resolve, reject)=>{
      this.http.get<Profile[]>(this.API_URL, {headers}).subscribe({
        next :(data :Profile[])=>{
          resolve(data);
        },
        error: (err : any) =>{
          reject("Error while fetching all profiles :"+ err.message)
        }
      })
    })
  }

  getProfileById(id : number){
    console.log("id :", id)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
        this.http.get<Profile>(`${this.API_URL}/${id}`, {headers}).subscribe({
          next :(data :Profile)=>{
            resolve(data);
          },
          error: (err : any) =>{
            reject("Error while fetching profile by id :"+ err.message)
          }
        })
      })
  }

  addProfile(profile: string){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.post<Profile>(`${this.API_URL}/add`, {label :profile},{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while adding a profile :"+ err.message)
        }
      })
    })
  }

  deleteProfile(id: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.delete<any>(`${this.API_URL}/${id}`,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while deleting a profile :"+ err.message)
        }
      })
    })
  }

  updateProfile(id: number, profile : string){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.put<any>(`${this.API_URL}/${id}`,{label : profile},{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while updating a profile :"+ err.message)
        }
      })
    })
  }

  updateProfileMenus(id: number, profile : any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.put<any>(`${this.API_URL}/menus/${id}`,profile,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while updating a profile with profile :"+ err.message)
        }
      })
    })
  }

  
}
