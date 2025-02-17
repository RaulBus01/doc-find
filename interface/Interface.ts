export enum Role {
    User = 0,
    Bot = 1,
  }
  
  
  export interface Message {
    id: string;
    chatId: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    isAI: boolean;
  }
  
  export interface Chat {
    id: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  }
  export interface User {
    id: number
    name: string;
    profileData: string;
  }