import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Menu } from '../Models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private API_URL="http://localhost:5096/api/menus";
  constructor(private http: HttpClient) { }

  getAllMenus(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any[]>((resolve, reject)=>{
      this.http.get<Menu[]>(this.API_URL, {headers}).subscribe({
        next :(data : Menu[])=>{
          resolve(data);
        },
        error: (err : any) =>{
          reject("Error while fetching all menus :"+ err.message)
        }
      })
    })
  }

  addMenus(menu: string){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.post<Menu>(`${this.API_URL}/add`, menu,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while adding a menu :"+ err.message)
        }
      })
    })
  }

  deleteMenu(id: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.delete<any>(`${this.API_URL}/${id}`,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while deleting a menu :"+ err.message)
        }
      })
    })
  }

  updateMenu(id: number, menu : any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.put<any>(`${this.API_URL}/${id}`,menu,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while updating a profile :"+ err.message)
        }
      })
    })
  }

}
