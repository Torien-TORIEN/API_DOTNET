import { User } from "./user.model";

export interface Message {
    id: number;
    message: string;
    email : string;
    sentAt : Date;
    fromUserId: number;
    fromUser? : User;
    toUserId :number
    toUser ?:User
  }
  