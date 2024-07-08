import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MessageService } from '../../Services/message.service';
import { UserService } from '../../Services/user.service';
import { LoginService } from '../../Services/login.service';
import { User } from '../../Models/user.model';
import { SignalRService } from '../../Services/signalR.service';
import { GroupService } from '../../Services/group.service';
import { Group } from '../../Models/group.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [FormsModule,MatIconModule,MatDialogModule,MatFormFieldModule,MatInputModule, MatButtonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  Me !:User;
  messagesSent: any;
  messagesReceived: any;
  users: any;
  selectedUser: any;
  newMessage: string = '';
  messages : any;
  groups !: Group[];

  groupName !: string;
  @ViewChild('dialogGroup', { static: false }) eventDialog!: TemplateRef<any>;

  constructor(
    private messageService: MessageService,
    private userService : UserService,
    private loginService : LoginService,
    private signalRService: SignalRService,
    private groupService : GroupService,
    private dialog: MatDialog,
  ){
    this.getUserConnected();
  }

  ngOnInit(): void {
    
    this.loadMessages();
    this.getAllUsers();
    this.getAllGroups();

    //SignalR
    this.signalRService.startConnection();
    this.signalRService.messageReceived$.subscribe((data: { user: string, message: string }) => {
      this.loadMessages(); // Recharger les messages quand un nouveau message est reçu
    });
  }

  selectUser(user: any): void {
    this.selectedUser = user;
  }

  getConversationWithUserr(user: any): any[] {
    return [
      ...this.messages.filter((msg: any) => msg.toUserId === user.id || msg.fromUserId === user.id ),
      ...this.messagesReceived.filter((msg: any) => msg.fromUserId === user.id)
    ].sort((a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime());
  }

  getConversationWithUser(user: any): any[] {
    if (!this.messages) return [];
    return [
      ...this.messages.filter((msg: any) => 
        (msg.toUserId === user.id && msg.fromUserId === this.Me.id) || 
        (msg.fromUserId === user.id && msg.toUserId === this.Me.id)
      )
    ].sort((a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime());
  }
  

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedUser) {
      const messageToAddDB={message : this.newMessage.trim(), fromUserId : this.Me.id , toUserId : this.selectedUser.id}
      this.messageService.addMessage(messageToAddDB)
      .then(data=>{
        console.log("Adding user :", data);
        this.signalRService.sendMessage(this.Me.username, this.newMessage.trim()); // Envoyer le message via SignalR
        this.newMessage = '';
      })
      .catch(error =>{
        console.log(error)
      })
      
    }
  }

  loadMessages(): void {
    this.messageService.getAllMessages().then((messages)=>{
        this.messages = messages
        console.log("messages : ", this.messages)
    })
    .catch(error=>{
      console.log(error);
    })
  }

  getUserConnected(){
    const user = this.loginService.getUserLogged();
    if(user){
      this.Me=user;
    }else{
      this.loginService.logout();
    }
  }

  getAllUsers(){
    this.userService.getAllUsers()
    .then(users=>{
      this.users=users;
      this.getFirstSelectedUser();
      console.log("Users :", users)
    })
    .catch(error =>{
      console.log("Messages Component :",error)
    })
  }

  getFirstSelectedUser(): void {
    if (!this.selectedUser) {
      for (const user of this.users) {
        if (user.id !== this.Me.id) {
          this.selectedUser = user;
          break; 
        }
      }
    }
  }

  formatDate(date: any): string {
    // Vérifiez si 'date' est déjà une instance de Date, sinon, convertissez-la.
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois sont indexés à partir de 0
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  getAllGroups(){
    this.groupService.getAllGroups()
    .then(groups=>{
      this.groups=groups;
    })
    .catch(err=>{
      console.log(err.message);
    })
  }

  createGroup(){
    if(this.groupName && this.groupName.length >= 2){
      console.log(" creating group");
      
      const group ={
        name : this.groupName,
        creatorId : this.Me.id,
        membersIds : [ this.Me.id]
      }
      console.log(" group : ", group);
      
      this.groupService.addGroup(group).
      then(data=>{
        this.getAllGroups();
      })
      .catch(err=>{
        console.log(err.message);
      })
    }
  }

  openDialogWithRef(ref: TemplateRef<any>) {
    const dialogRef = this.dialog.open(ref);
  }
}
