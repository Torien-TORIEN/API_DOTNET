import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/user.model';
import { Group } from '../Models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private API_URL="http://localhost:5096/api/groups";
  constructor(private http: HttpClient) { }

  getAllGroups(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<Array<Group>>((resolve, reject)=>{
      this.http.get<Group[]>(this.API_URL, {headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while fetching all groups :"+ err.message)
        }
      })
    })
  }

  getGroupById(groupId :number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<Group>((resolve, reject)=>{
      this.http.get<Group>(`${this.API_URL}/${groupId}`, {headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while fetching all groups :"+ err.message)
        }
      })
    })
  }

  getGroupsByUserId(userId : number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<Array<Group>>((resolve, reject)=>{
      this.http.get<Group[]>(`${this.API_URL}/user/${userId}/groups`, {headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while fetching groups by user Id :"+ err.message)
        }
      })
    })
  }

  getUsersByGroupId(groupId : number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<Array<User>>((resolve, reject)=>{
      this.http.get<User[]>(`${this.API_URL}/${groupId}/users`, {headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while fetching users by group Id :"+ err.message)
        }
      })
    })
  }


  addGroup(group: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.post<Group>(`${this.API_URL}/add`, group,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while adding a group :"+ err.message)
        }
      })
    })
  }

  addUserInGroup(groupId:number, userId :number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.post<Group>(`${this.API_URL}/${groupId}/users/${userId}`, {},{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while adding a user in group :"+ err.message)
        }
      })
    })
  }

  deleteUserFromGroup(groupId:number, userId :number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.delete<any>(`${this.API_URL}/${groupId}/users/${userId}`,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while deleting an user from a group :"+ err.message)
        }
      })
    })
  }

  deleteGroup(id: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.delete<any>(`${this.API_URL}/${id}`,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while deleting a group :"+ err.message)
        }
      })
    })
  }

  updateGroup(id: number, group : any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.put<any>(`${this.API_URL}/${id}`,group,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while updating a group :"+ err.message)
        }
      })
    })
  }
}
