import { Group } from "./group.model";
import { User } from "./user.model";

export interface Message {
    id: number;
    message: string;
    email : string;
    sendAt : Date;
    fromUserId: number;
    fromUser? : User;
    toUserId :number;
    toUser? :User;
    isForGroup : boolean;
    toGroupId? : number;
    group? :Group;

}
  