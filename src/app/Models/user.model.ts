import { Profile } from "./profile.model";

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    profile? : Profile,
    profileName? : string,
    profileId : number
}
