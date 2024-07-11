import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';

import { MessageService } from '../../Services/message.service';
import { UserService } from '../../Services/user.service';
import { LoginService } from '../../Services/login.service';
import { User } from '../../Models/user.model';
import { SignalRService } from '../../Services/signalR.service';
import { GroupService } from '../../Services/group.service';
import { Group } from '../../Models/group.model';
import { Message } from '../../Models/message.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [FormsModule,MatIconModule,MatDialogModule,MatFormFieldModule,MatInputModule, MatButtonModule,MatMenuModule, MatSelectModule,MatListModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  Me !:User;
  messagesConversation:any;
  users !: User[];
  usersInGroup !: User[];
  usersNotInGroup !: User[];
  selectedUserOrGroup: any;
  isUserSelected =true; // true if selectedUserOrGroup is User or false if selectedUserOrGroup is Group
  newMessage: string = '';
  messages !: Message[];
  groups !: Group[];
  selectedMessageId !: number; //Message id selected to delete or edit

  private destroy$ = new Subject<void>();
  groupsAddedInHub : Group[]=[];


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
    //SignalR
    // this.signalRService.startConnection();
    // this.signalRService.messageReceived$.subscribe((data: { user: string, message: string }) => {
    //   this.getMyMessages(); // Recharger les messages quand un nouveau message est reçu
    //   this.getMyGroups();
    // });

    // SignalR
    this.signalRService.startConnection();
    this.signalRService.messageReceived$
      .pipe(takeUntil(this.destroy$))//takeUntil(this.destroy$) signifie que l'abonnement à messageReceived$ continuera seulement jusqu'à ce que destroy$ émette une valeur (par exemple, lors de la destruction du composant). Cela permet de nettoyer automatiquement la souscription lorsque le composant est détruit.
      .subscribe((data: { user: string, message: string }) => {
        this.getMyMessages(); // Recharger les messages quand un nouveau message est reçu
        this.getMyGroups();
      });

      //this.loadMessages();
    this.loadMessages();
    this.getAllUsers();
    this.getMyGroups();
  }

  ngOnDestroy(): void {
    /*
    Dans ngOnDestroy, this.destroy$.next(); et this.destroy$.complete();
    sont utilisés pour notifier à tous les observables que le composant est en train d'être détruit.
    Cela entraîne la désinscription automatique de toutes les souscriptions gérées via takeUntil(this.destroy$).
    */
    this.destroy$.next();
    this.destroy$.complete();
    this.signalRService.stopConnection();
  }

  selectUser(user: any): void {
    this.isUserSelected=true;
    this.selectedUserOrGroup = user;
  }

  selectGroup(group : Group){
    this.isUserSelected=false;
    this.selectedUserOrGroup=group;
    this.getUsersByGroup(this.selectedUserOrGroup.id);
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
        this.messageService.addMessage(messageToAddDB)
        .then(data=>{
          console.log("Adding user :", data);
          this.signalRService.sendMessage(this.Me.username, this.newMessage.trim()); // Envoyer le message via SignalR
          this.newMessage = '';
        })
        .catch(error =>{
          console.log(error)
        })
      }else{
        messageToAddDB={message : this.newMessage.trim(), fromUserId : this.Me.id , toUserId : null, isForGroup : true, toGroupId : this.selectedUserOrGroup.id}
        this.messageService.addMessage(messageToAddDB)
        .then(data=>{
          console.log("Adding user :", data);
          this.signalRService.sendMessageToGroup(this.selectedUserOrGroup.name,this.Me.username, this.newMessage.trim()); // Envoyer le message via SignalR à tous les utilisateurs de groupe
          this.newMessage = '';
        })
        .catch(error =>{
          console.log(error)
        })
      }
      
      
    }
  }

  deleteMessage(){
    this.messageService.deleteMessage(this.selectedMessageId)
    .then(data=>{
      console.log("deleting a message ");
      this.signalRService.sendMessage(this.Me.username, "Deleting My message");
      
    })
    .catch(error=>{
      console.log(error);
    })
  }

  selectMessage(id :number){
    this.selectedMessageId=id;
  }

  loadMessages(): void {
    this.messageService.getAllMessages().then((messages : Message[])=>{
        this.messages = messages;
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
    })
    .catch(error =>{
      console.log("Messages Component :",error)
    })
  }

  getFirstSelectedUser(): void {
    if (!this.selectedUserOrGroup) {
      for (const user of this.users) {
        if ( this.Me && user.id !== this.Me.id) {
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

  formatDateWithoutTime(date: any): string {
    // Vérifiez si 'date' est déjà une instance de Date, sinon, convertissez-la.
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois sont indexés à partir de 0
    const year = date.getFullYear().toString();
  
    return `${day}/${month}/${year}`;
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
    if(! this.Me){
      return ;
    }
    this.groupService.getGroupsByUserId(this.Me.id)
    .then(groups=>{
      this.groups=groups;
      console.log("Get My  groupes:", this.groups);
      this.addInGroupHubs(this.groups);
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
        this.getMyGroups();
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
      console.log("Adding user in group : ", data)
      this.userToAddInGroupId=0;
      if(!this.isUserSelected) this.getUsersByGroup(this.selectedUserOrGroup.id);
      this.signalRService.sendMessage(this.Me.username, "Add user in a  group");
    })
    .catch(err=>{
      console.log(err.message)
    })
  }

  quitGroup(){
    this.groupService.deleteUserFromGroup(this.selectedUserOrGroup.id, this.Me.id)
    .then(data =>{
      console.log("quitting group");
      this.isUserSelected=true;
      this.selectedUserOrGroup=undefined;
      this.getMyGroups();
      this.getFirstSelectedUser();
    })
    .catch(err=>{
      console.log(err.message);
    })
  }

  getMyMessages(){
    if(!this.Me) return ;
    this.messageService.getMessagesByUserId(this.Me.id)
    .then(data=>{
      this.messages=data;
    })
    .catch(error=>{
      console.log(error.message);
    })
  }

  deleteGroup(groupId :number){
    this.groupService.deleteGroup(groupId)
    .then(data=>{
      console.log("deleting group ", groupId);
      this.isUserSelected=true;
      this.selectedUserOrGroup=undefined;
      this.getFirstSelectedUser();
      this.signalRService.sendMessage(this.Me.username, "Deleting group");
      
    })
    .catch(error=>{
      console.log(error.message);
      
    })
  }

  getUsersByGroup(groupId: number){
     this.groupService.getUsersByGroupId(groupId)
        .then((users: User[]) => {
            this.usersInGroup = users;
            this.usersNotInGroup = this.users.filter(user => 
                !this.usersInGroup.some(groupUser => groupUser.id === user.id)
            );
        })
        .catch(error => {
            console.log(error.message);
        });
  }

  addInGroupHubs(groups : Group[]){
    const groupstoAdd = groups.filter(group=> !this.groupsAddedInHub.some(groupAdded => groupAdded.id === group.id ) )
    console.log("groups déjà ajouté :", this.groupsAddedInHub , "Group à ajouter :", groupstoAdd)
    for(let group of groupstoAdd){
      this.signalRService.addToGroup(group.name);
      this.groupsAddedInHub.push(group);
    }
    
  }
}
