import { ApiCall } from "./ApiCall";


export const streamModelResponse = async (
  token: string | null,
  message: string,
  onChunk: (chunk: any) => void,
  chatId: number,
  context?: any,
  abortSignal?: AbortSignal,
) => {
  if (!token) {
    throw new Error("No token available");
  }

  try {
 
    await ApiCall.stream("/completion/stream-and-save", token, { message,chatId,context}, onChunk,abortSignal);
  } catch (error) {
 
    
  }
};
