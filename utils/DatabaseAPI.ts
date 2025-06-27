import { Message } from "@/interface/Interface";
import { ApiCall } from "./ApiCall";
import { useAuth } from "@/hooks/useAuth";



export const addChat = async (token: string | null,refreshTokens:() => Promise<string | void>) => {
  if (!token) {
    throw new Error("No token available");
  }
  const chat = await ApiCall.post('/chat', token, {}, refreshTokens);
  return chat;
};


export const getMessages = async (token: string | null, chatId: string, refreshTokens:() => Promise<string | void>) => {
    if (!token) {
        throw new Error("No token available");
    }
    const messages = await ApiCall.get(`/chat/${chatId}/messages`, token, {}, refreshTokens);
    return messages as Promise<Message[]>;
};

   




export const deleteChat = async (token: string | null, chatId: string,refreshTokens:() => Promise<string | void>) => {
    if (!token) {
        throw new Error("No token available");
    }
    await ApiCall.delete(`/chat/${chatId}`, token,refreshTokens);
}

export const generateChatTitle = async (token: string | null, chatId: string,refreshTokens:() => Promise<string | void>) => {
    if (!token) {
        throw new Error("No token available");
    }

        const chatTitle = await ApiCall.post(`/chat/${chatId}/generateChatTitle`, token, {}, refreshTokens);
        return chatTitle;
}