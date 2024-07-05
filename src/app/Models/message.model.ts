import { User } from "./user.model";

export interface Message {
    id: Number;
    message: string;
    email : string;
    sentAt : Date;
    fromUserId: Number;
    fromUser? : User;
    toUserId :Number
    toUser ?:User
  }
  