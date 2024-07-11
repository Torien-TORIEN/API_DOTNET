import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { PostDetailComponent } from '../post-detail/post-detail.component';
import { LoginService } from '../../Services/login.service';
import { User } from '../../Models/user.model';
import { PostService } from '../../Services/post.service';
import { Post } from '../../Models/post.model';
import { MatIconModule } from '@angular/material/icon';
import { PostSignalRService } from '../../Services/post.signalR.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [PostDetailComponent,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit, OnDestroy {
  Me !:User;
  posts !: Post[];
  buttonLabel="Save";
  postEditId !:number;
  infoReceivedPost !:any;

  form: FormGroup = new FormGroup({
    comment: new FormControl('', [Validators.required, Validators.minLength(3)]),
    image: new FormControl(''),
  });

  constructor(
    private loginService : LoginService,
    private postService : PostService,
    private postSignalRService : PostSignalRService
  ){}

  ngOnInit():void{
    this.Me =this.loginService.getUserLogged();
    this.getAllPosts();

    //SignalR
    this.postSignalRService.startConnection();
    this.postSignalRService.postReceived$.subscribe((data: { user: string, message: string }) => {
      this.getAllPosts(); // Recharger les posts quand un nouveau message est reçu
    });
  }

  ngOnDestroy(): void {
    this.postSignalRService.stopConnection();
  }

  getAllPosts(){
    this.postService.getAllPosts()
    .then(posts=>{
      this.posts=posts;
    })
    .catch(error =>{
      console.log(error.message)
    })
  }

  onSubmit(){
    if(this.form.valid){
      const value =this.form.value;
      if(!this.postEditId || this.postEditId==0){
        //Add
        const post ={
          comment : value.comment,
          image : value.image,
          userId : this.Me.id
        }

        this.postService.addPost(post)
        .then(data=>{
          this.form.reset();
          this.postSignalRService.sendPost(this.Me.username, "Add Poste");
        })
        .catch(err=>{
          console.log(err.message);
        })

      }else{
        //Edit
        const post ={
          comment : value.comment,
          image : value.image,
        }

        this.postService.updatePost(this.postEditId, post)
        .then(data=>{
          this.postSignalRService.sendPost(this.Me.username, "Add Poste");
          this.form.reset();
          this.postEditId=0;
        })
        .catch(err=>{
          console.log(err.message);
        })
      }
      
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  selectPostToEdit(post :Post){
    this.postEditId=post.id;
    this.form.patchValue({
      comment : post.comment,
      image: post.image
    })
  }

}
