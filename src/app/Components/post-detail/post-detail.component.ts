import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { User } from '../../Models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { Post } from '../../Models/post.model';
import { PostService } from '../../Services/post.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailComponent implements OnInit {
    @Input() userLogged !: User;
    @Input() post !: Post;

    @Output() postToEdit = new EventEmitter<Post>()

    constructor(private postService : PostService){}



  ngOnInit():void{
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

  onDelete( id : number){
    this.postService.deletePost(id)
    .then(data=>{

    })
    .catch(err=>{
      console.log(err.message);
    })
  }

  onEdit(){
    this.postToEdit.emit(this.post);
    console.log("edit")
  }

  onlike(){
    this.postService.like(this.post.id)
    .then(data=>{
      console.log("liking a post : ", data);
    })
    .catch(err=>{
      console.log(err.message)
    })
  }

  onDislike(){
    this.postService.dislike(this.post.id)
    .then(data=>{
      console.log("disliking a post : ", data);
    })
    .catch(err=>{
      console.log(err.message)
    })
  }

}
