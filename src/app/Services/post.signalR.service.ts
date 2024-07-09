// src/app/services/signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostSignalRService {
  private hubConnection: signalR.HubConnection | undefined;
  private messageReceivedSubject = new Subject<{ user: string, message: string }>();

  postReceived$ = this.messageReceivedSubject.asObservable();

  constructor() { }

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5096/postHub')
      .build();

    this.hubConnection.start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));

    this.hubConnection.on('receivedPost', (user, message) => {
      this.messageReceivedSubject.next({ user, message });
    });
  }

  public sendPost(user: string, message: string): void {
    if (this.hubConnection) {
      this.hubConnection.send('SendPost', user, message)
        .catch(err => console.error(err));
    }
  }
}