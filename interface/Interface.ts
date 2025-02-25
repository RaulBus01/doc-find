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
    id: string,
    username: string,
    email: string,
    emailVerified: string,
    givenName: string,
    familyName: string,
    picture: string,
    createdAt: string,
  }
  export interface FormData {
    name: string;
    gender: 'Male' | 'Female' | '';
    age: string;
    smoker: "Yes" | "No" | "I used to"| null;
    hypertensive: "Yes" | "No" | "I don't know"| null;
    diabetic: "Yes" | "No" | "I don't know" | null;
    
  }