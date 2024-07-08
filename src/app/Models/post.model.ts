import { User } from "./user.model";

export interface Post {
    id: number;
    comment: string;
    likes : number;
    dislikes : number;
    image: string;
    createdAt : Date;
    userId: number;
    owner? : User;
  }
  