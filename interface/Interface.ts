export enum Role {
    User = 0,
    Bot = 1,
}
export enum MessageType{
    Human = -100,
    AI = -200,
    System = -300,
}
  
  
  export interface Message {
    id: number;
    sessionId: string;
    message:{
      type: "human" | "ai";
      content: string;
    }
    createdAt: string;
    updatedAt: string;
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

  export enum AIModel{
    MISTRAL_SMALL = "mistral-small-latest",
    MISTRAL_LARGE = "mistral-large-latest",

  }
