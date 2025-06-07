import { Message } from "@/interface/Interface";
import { ApiCall } from "./ApiCall";

export const addChat = async (token: string | null, message:string) => {
  if (!token) {
    throw new Error("No token available");
  }
  const chat = await ApiCall.post('/chat', token, { message });
  return chat;
};


export const getMessages = async (token: string | null, chatId: string) => {
    if (!token) {
        throw new Error("No token available");
    }
    const messages = await ApiCall.get(`/chat/${chatId}/messages`, token);
    return messages as Promise<Message[]>;
};

   


export const addMessage = async (chatId: string, token: string | null, content: { message: string, isAI:boolean }) => {
    if (!token) {
        throw new Error("No token available");
    }
    const message = await ApiCall.post(`/chat/${chatId}/addMessage`, token,  {
      message: content.message,
      isAI: content.isAI
    });
    return message;
}

export const deleteChat = async (token: string | null, chatId: string) => {
    if (!token) {
        throw new Error("No token available");
    }
    await ApiCall.delete(`/chat/${chatId}`, token);
}

export const generateChatTitle = async (token: string | null, chatId: string) => {
    if (!token) {
        throw new Error("No token available");
    }

        const chatTitle = await ApiCall.post(`/chat/${chatId}/generateChatTitle`, token, {});
        return chatTitle;
}