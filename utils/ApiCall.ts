import { fetch } from "expo/fetch";
// const API_URL = "https://docfind-backend.deno.dev";
const API_URL = "http://192.168.1.120:8080";
interface QueryParams {
  [key: string]: string | number | boolean;
}
export class ApiCall {
  private static buildUrl(baseUrl: string, query?: QueryParams): string {
    if (!query) return baseUrl;
    
    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    
    return `${baseUrl}?${searchParams.toString()}`;
  }
  static async get(url: string, token: string,query?:QueryParams) {
    try {

      const fullUrl = this.buildUrl(API_URL + url, query);
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    } catch (error) {

    }
  }

  static async post(url: string, token: string, data: any) {
    try {
      const response = await fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }

  static async put(url: string, token: string, data: any) {
    try {
      const response = await fetch(API_URL + url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }
  static async delete(url: string, token: string) {
    try {
      const response = await fetch(API_URL + url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }
  
  static async stream(
    url: string,
    token: string,
    data: any,
    onChunk: (chunk: any) => void,
    abortSignal?: AbortSignal,

  ) {
    try {
   
      const response = await fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(data),
        signal: abortSignal,
      }); 
   
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);

        

        onChunk({ content: chunk });
      }
    } catch (error) {
      
    throw error;
    }
  }
}
