import { User } from "./user.model";

export interface Post {
    id: Number;
    comment: string;
    likes : Number;
    createdAt : Date;
    userId: Number;
    owner? : User;
  }
  