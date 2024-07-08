import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../Models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private API_URL="http://localhost:5096/api/posts";
  constructor(private http: HttpClient) { }

  getAllPosts(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any[]>((resolve, reject)=>{
      this.http.get<Post[]>(this.API_URL, {headers}).subscribe({
        next :(data :Post[])=>{
          resolve(data);
        },
        error: (err : any) =>{
          reject("Error while fetching all posts :"+ err.message)
        }
      })
    })
  }

  addPost(post: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.post<Post>(`${this.API_URL}/add`, post,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while adding a post :"+ err.message)
        }
      })
    })
  }

  deletePost(id: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.delete<any>(`${this.API_URL}/${id}`,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while deleting a post :"+ err.message)
        }
      })
    })
  }

  updatePost(id: number, post : any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return new Promise<any>((resolve, reject)=>{
      this.http.put<any>(`${this.API_URL}/${id}`,post,{headers}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while updating a post :"+ err.message)
        }
      })
    })
  }

  like(id :number){
    return new Promise<any>((resolve, reject)=>{
      this.http.post(`${this.API_URL}/${id}/like`,{}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while liking a post :"+ err.message)
        }
      })
    })
  }

  dislike(id :number){
    return new Promise<any>((resolve, reject)=>{
      this.http.post(`${this.API_URL}/${id}/dislike`,{}).subscribe({
        next :(data)=>{
          resolve(data);
        },
        error: err=>{
          reject("Error while liking a post :"+ err.message)
        }
      })
    })
  }
}
