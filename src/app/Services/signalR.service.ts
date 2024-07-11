// src/app/services/signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | undefined;
  private messageReceivedSubject = new Subject<{ user: string, message: string }>();
  private isConnected = false;
  private groupsToAdd: string[] = [];  // Liste pour stocker les groupes à ajouter
  

  messageReceived$ = this.messageReceivedSubject.asObservable();

  constructor() { }

  /* public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5096/messageHub')
      .build();

    this.hubConnection.start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveMessage', (user, message) => {
      this.messageReceivedSubject.next({ user, message });
    });
  } */

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5096/messageHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('Connection started');
        this.isConnected = true;
        this.addPendingGroups();  // Ajouter les groupes après la connexion
      })
      .catch(err => console.log('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveMessage', (user, message) => {
      this.messageReceivedSubject.next({ user, message });
    });

    this.hubConnection.onclose(() => {
      console.log('Connection closed');
      this.isConnected = false;
    });

    this.hubConnection.onreconnecting(() => {
      console.log('Reconnecting...');
      this.isConnected = false;
    });

    this.hubConnection.onreconnected(() => {
      console.log('Reconnected');
      this.isConnected = true;
      this.addPendingGroups();  // Ajouter les groupes après la connexion
    });
  }

  public sendMessage(user: string, message: string): void {
    if (this.hubConnection && this.isConnected) {
      this.hubConnection.send('SendMessage', user, message)
        .catch(err => console.error(err));
    } else {
      console.error('Connection is not in the Connected state.');
    }
  }

  public sendMessageToGroup(groupName: string, user: string, message: string): void {
    if (this.hubConnection && this.isConnected) {
      this.hubConnection.send('SendMessageToGroup', groupName, user, message)
        .catch(err => console.error(err));
    } else {
      console.error('Connection is not in the Connected state.');
    }
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => {
          console.log('Connection stopped');
          this.isConnected = false;
        })
        .catch(err => console.log('Error while stopping connection: ' + err));
    }
  }

  public addToGroup(groupName: string): void {
    if (!this.groupsToAdd.includes(groupName)) {
      this.groupsToAdd.push(groupName);  // Ajouter le groupe à la liste des groupes à ajouter
    }
    if (this.hubConnection && this.isConnected) {
      this.hubConnection.send('AddToGroup', groupName)
        .then(() => console.log(`Added to group ${groupName}`))
        .catch(err => console.error(`Error adding to group ${groupName}:`, err));
    } else {
      console.log('Connection is not in the Connected state when trying to add group.');
    }
  }
  
  public removeFromGroup(groupName: string): void {
    if (this.groupsToAdd.includes(groupName)) {
      this.groupsToAdd = this.groupsToAdd.filter(group => group !== groupName);  // Retirer le groupe de la liste des groupes à ajouter
    }
    if (this.hubConnection && this.isConnected) {
      this.hubConnection.send('RemoveFromGroup', groupName)
        .then(() => console.log(`Removed from group ${groupName}`))
        .catch(err => console.error(`Error removing from group ${groupName}:`, err));
    } else {
      console.error('Connection is not in the Connected state.');
    }
  }

  private addPendingGroups(): void {
    this.groupsToAdd.forEach(groupName => {
      this.addToGroup(groupName);
    });
  }
}
