import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';


import { MessageService } from '../../Services/message.service';
import { UserService } from '../../Services/user.service';
import { LoginService } from '../../Services/login.service';
import { User } from '../../Models/user.model';
import { SignalRService } from '../../Services/signalR.service';
import { GroupService } from '../../Services/group.service';
import { Group } from '../../Models/group.model';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [FormsModule,MatIconModule,MatDialogModule,MatFormFieldModule,MatInputModule, MatButtonModule,MatMenuModule, MatSelectModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  Me !:User;
  messagesConversation:any;
  users: any;
  selectedUserOrGroup: any;
  isUserSelected =true;
  newMessage: string = '';
  messages : any;
  groups !: Group[];


  groupName !: string;
  userToAddInGroupId!:number
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
    this.getMyGroups();

    //SignalR
    this.signalRService.startConnection();
    this.signalRService.messageReceived$.subscribe((data: { user: string, message: string }) => {
      this.loadMessages(); // Recharger les messages quand un nouveau message est reçu
    });
  }

  selectUser(user: any): void {
    this.isUserSelected=true;
    this.selectedUserOrGroup = user;
  }

  selectGroup(group : Group){
    this.isUserSelected=false;
    this.selectedUserOrGroup=group;
  }


  getConversationWithUserr(user: any): any[] {
    if(this.isUserSelected==true){
      console.log("Users")
      return [
        ...this.messages.filter((msg: any) => msg.toUserId === user.id || msg.fromUserId === user.id )
      ].sort((a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime());
    }else{
      console.log("Group :")
      return [
        ...this.messages.filter((msg: any) => msg.toGroupId === user.id)
      ].sort((a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime());
    }
  }

  getConversationWithUser(user: any): any[] {
    if (!this.messages) return [];
    if(this.isUserSelected==true){
      return [
        ...this.messages.filter((msg: any) => 
          (msg.toUserId === user.id && msg.fromUserId === this.Me.id) || 
          (msg.fromUserId === user.id && msg.toUserId === this.Me.id)
        )
      ].sort((a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime());
    }else{
      return [
        ...this.messages.filter((msg: any) => 
          (msg.toGroupId === user.id) 
        )
      ].sort((a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime());
    }
  }
  

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedUserOrGroup) {
      let messageToAddDB !:any
      if(this.isUserSelected){
        messageToAddDB={message : this.newMessage.trim(), fromUserId : this.Me.id , toUserId : this.selectedUserOrGroup.id, isForGroup : false, toGroupId : null}
      }else{
        messageToAddDB={message : this.newMessage.trim(), fromUserId : this.Me.id , toUserId : null, isForGroup : true, toGroupId : this.selectedUserOrGroup.id}
      }
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
    if (!this.selectedUserOrGroup) {
      for (const user of this.users) {
        if (user.id !== this.Me.id) {
          this.selectedUserOrGroup = user;
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

  getMyGroups(){
    this.groupService.getGroupsByUserId(this.Me.id)
    .then(groups=>{
      this.groups=groups;
    })
    .catch(err=>{
      console.log(err.message);
    })
  }

  createGroup(){
    if(this.groupName && this.groupName.length >= 2){
      
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

  getUserById(userId :number) : any{
    for (const user of this.users) {
      if (user.id == userId) {
        return user; 
      }
    }
    
    return {"username" : "Unknowm"}
  }

  addUserInGroup(){
    this.groupService.addUserInGroup(this.selectedUserOrGroup.id, this.userToAddInGroupId)
    .then(data=>{
      
    })
    .catch(err=>{
      console.log(err.message)
    })
  }

}
