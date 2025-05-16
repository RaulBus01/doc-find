import { int } from "drizzle-orm/mysql-core";

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
    chatId: string;
    isAI: boolean;
    content: string;
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
  export const MapsTypes = [
   "hospital",
  "doctor",
   "pharmacy",
    
  ]
export interface GooglePlaceDetails {
  business_status: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: any;
      southwest: any;
    };
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Array<{
    height: number;
    html_attributions: string[];
    photo_reference: string;
    width: number;
  }>;
  place_id: string;
  plus_code?: {
    compound_code: string;
    global_code: string;
  };
  rating?: number;
  reference: string;
  scope: string;
  types: string[];
  user_ratings_total?: number;
  vicinity: string;
}