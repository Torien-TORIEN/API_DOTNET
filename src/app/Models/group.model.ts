import { User } from "./user.model";

export interface Group {
    id: number;
    name: string;
    creatorId : number;
    creator? :User;
    createdAt : Date;
    Members? : User[];
  }
  