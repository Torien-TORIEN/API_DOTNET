import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../Models/message.model'; // Créez ce modèle pour correspondre à votre API

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private API_URL = 'http://localhost:5096/api/messages'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) { }



  getMessageById(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.API_URL}/${id}`);
  }

  addMessage(message: any){
    //return this.http.post<Message>(`${this.apiUrl}/add`, message);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.post<Message>(`${this.API_URL}/add`, message,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while adding a message :"+ err.message)
        }
      })
    })
  }

  getAllMessages(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<Array<Message>>((resolve, reject)=>{
      this.http.get<Message[]>(this.API_URL, {headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while fetching all message :"+ err.message)
        }
      })
    })
  }

  getMessagesByUserId(userId : number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<Array<Message> >((resolve, reject)=>{
      this.http.get<Message[]>(`${this.API_URL}/user/${userId}`, {headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while fetching all message by User :"+ err.message)
        }
      })
    })
  }

  deleteMessage(id: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.delete<any>(`${this.API_URL}/${id}`,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while deleting a message :"+ err.message)
        }
      })
    })
  }
  
}
