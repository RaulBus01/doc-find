export enum Role {
    User = 0,
    Bot = 1,
  }
  
  export interface Message {
    role: Role;
    content: string;
    imageUrl?: string;
    prompt?: string;
  }
  
  export interface Chat {
    id: string;
    profileId: number;
    title: string;
  }
  export interface User {
    id: number
    name: string;
    profileData: string;
  }