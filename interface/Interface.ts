import { int } from "drizzle-orm/mysql-core";

export enum Role {
    User = 0,
    Bot = 1,
}
export enum MessageType{
    Human = "-100",
    AI = "-200",
    System = "-300",
}
  
  
  export interface Message {
    id: string;
    chatId: string;
    isAI: boolean;
    content: string;
  }
  
  export interface Chat {
    id: number;
    user_id: string;
    title: string;
    created_at: string;
    updated_at: string;
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
    periods?: Array<any>; 
    weekday_text?: string[]; 
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
  
 
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  adr_address?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  reviews?: Array<{
    author_name: string;
    author_url?: string;
    language?: string;
    original_language?: string;
    profile_photo_url?: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
    translated: boolean;
  }>;
  url?: string;
  utc_offset?: number;
  wheelchair_accessible_entrance?: boolean;
  
  
  current_opening_hours?: {
    open_now: boolean;
    periods?: Array<any>;
    weekday_text?: string[];
  };
  website?: string;
}

