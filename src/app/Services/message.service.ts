import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../Models/message.model'; // Créez ce modèle pour correspondre à votre API

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private apiUrl = 'http://localhost:5096/api/messages'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) { }



  getMessageById(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/${id}`);
  }

  addMessage(message: any){
    //return this.http.post<Message>(`${this.apiUrl}/add`, message);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.post<Message>(`${this.apiUrl}/add`, message,{headers}).subscribe({
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
    return new Promise<Array<{}> | null>((resolve, reject)=>{
      this.http.get<Message[]>(this.apiUrl, {headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while fetching all message :"+ err.message)
        }
      })
    })
  }

  
}
