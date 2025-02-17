import { fetch } from "expo/fetch";
const API_URL = "http://192.168.1.105:8080";

export class ApiCall {
  static async get(url: string, token: string) {
    try {
      const response = await fetch(API_URL + url, {
        method: "GET",
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

  static async post(url: string, token: string, data: any) {
    try {
      const response = await fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
  static async stream(
    url: string,
    token: string,
    data: any,
    onChunk: (chunk: any) => void
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
      console.error("Stream error:", error);
      throw error;
    }
  }
}
