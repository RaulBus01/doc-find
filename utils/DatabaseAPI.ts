import { Message } from "@/interface/Interface";
import { ApiCall } from "./ApiCall";

export const addChat = async (token: string | null, message:string) => {
  if (!token) {
    throw new Error("No token available");
  }
  const chat = await ApiCall.post('/chat', token, { message });
  return chat;
};

export const getChats = async (token: string | null, limit?:number) => {
  if (!token) {
    throw new Error("No token available");
  }
  const chats = await ApiCall.get('/chat/getChats/', token,{
    limit: limit ?? 5
  })
  
  return chats;
};

export const getChat = async (token: string | null, chatId: string) => {
  if (!token) {
    throw new Error("No token available");
  }
  const chat = await ApiCall.get(`/chat/${chatId}`, token);
  return chat;
};

export const getChatsCount = async (token: string | null) => {
  if (!token) {
    throw new Error("No token available");
  }
  const count = await ApiCall.get('/chat/counter', token);
  return count;
}

export const getMessages = async (token: string | null, chatId: string) => {
    if (!token) {
        throw new Error("No token available");
    }
    const messages = await ApiCall.get(`/chat/${chatId}/messages`, token);
    return messages as Promise<Message[]>;
};
export const getLastMessage = async (token: string | null, chatId: string,limit:number) => {
    if (!token) {
        throw new Error("No token available");
    }
    const messages = await ApiCall.get(`/chat/${chatId}/lastMessages/${limit}`, token);
    if (messages.length === 0) {
        return null;
    }
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