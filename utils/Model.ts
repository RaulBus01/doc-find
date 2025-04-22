import { ApiCall } from "./ApiCall";

export const streamModelResponse = async (
  token: string | null,
  message: string,
  onChunk: (chunk: any) => void,
  chatId: number,
  context?: any,
) => {
  if (!token) {
    throw new Error("No token available");
  }

  try {
    
    await ApiCall.stream("/completion/stream-and-save", token, { message,chatId,context }, onChunk);
  } catch (error) {
    console.error("Error streaming response:", error);
    throw error;
  }
};
