import { ApiCall } from "./ApiCall";

export const streamModelResponse = async (
  token: string | null,
  message: string,
  onChunk: (chunk: any) => void
) => {
  if (!token) {
    throw new Error("No token available");
  }

  try {
    await ApiCall.stream("/completion/mistral-test", token, { message }, onChunk);
  } catch (error) {
    console.error("Error streaming response:", error);
    throw error;
  }
};
