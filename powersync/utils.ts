import { Chat, Message } from "@/interface/Interface";
import { useQuery as useTanStackQuery } from "@powersync/tanstack-react-query";
import { useQuery } from "@powersync/react";
import { PowerSyncMessage } from "@/powersync/types";



export const getPowerSyncChats = (userId: string, RETRIVE_CHATS: number = 5): {
  data: Chat[] | undefined;
  isLoading: boolean;
} => {

  const { data: chatsData, isLoading } = useTanStackQuery({
    queryKey: ['chats'],
    query: 'SELECT * FROM chats WHERE chats.user_id = ? ORDER BY chats.updated_at DESC LIMIT ?',
    parameters: [userId, RETRIVE_CHATS],
  });
  if (isLoading) {
    return { data: undefined, isLoading: true };
  }
  if (!chatsData || chatsData.length === 0) {
    return { data: [], isLoading: false };
  }
  return { data: chatsData as Chat[], isLoading: false };

}
export const getAllPowerSyncChats = (userId: string): {
  data: Chat[] | undefined;
  isLoading: boolean;
} => {

  const { data: chatsData, isLoading } = useQuery('SELECT * FROM chats ORDER BY chats.updated_at DESC');

  if (isLoading) {
    return { data: undefined, isLoading: true };
  }
  if (!chatsData) {
    return { data: [], isLoading: false };
  }
  return { data: chatsData as Chat[], isLoading: false };

}

export const getPowerSyncChatsCount = (userId: string): {
  count: number,
  isLoading: boolean;
} => {

  const { data: countData, isLoading } = useQuery('SELECT COUNT(*) as count FROM chats WHERE chats.user_id = ?', [userId], {
    throttleMs: 1000,

  });

  if (isLoading) {
    return { count: 0, isLoading: true };
  }
  if (!countData || countData.length === 0 || countData[0].count === undefined || countData[0].count === null) {
    return { count: 0, isLoading: false };
  }
  return {
    count: Number(countData[0].count), isLoading: false
  }
}

export const getPowerSyncMessages = (chatId: string, options: { enabled: boolean }): {
  data: Message[],
  isLoading: boolean;
} => {

  const { data: messagesData, isLoading } = useTanStackQuery({
    queryKey: ['chats'],
    query: 'SELECT * FROM checkpoints WHERE thread_id = ?',
    parameters: [chatId],
    enabled: options.enabled,
  })
  if (!options.enabled) {
    return { data: [], isLoading: false };
  }
  if (!messagesData || messagesData.length === 0) {
    return { data: [], isLoading: false };
  }
  const extractedMessages = extractMessagesFromPowerSync(messagesData as PowerSyncMessage[], chatId);

  if (isLoading) {
    return { data: [], isLoading: true };
  }
  if (!messagesData || messagesData.length === 0) {
    return { data: [], isLoading: false };
  }
  return { data: extractedMessages as Message[], isLoading: false };
}

function extractMessagesFromPowerSync(
  powerSyncMessages: PowerSyncMessage[],
  sessionId?: string
): Message[] {
  try {
    const extractedMessages: Message[] = [];
    const seenIds = new Set<string>();
    for (const powerSyncMsg of powerSyncMessages) {
      try {

        const metadata = JSON.parse(powerSyncMsg.metadata);


        const writes = metadata.writes;
        if (!writes) continue;


        const messageSources = [
          writes.__start__?.messages,
          writes.router?.messages,
          writes.general_agent?.messages
        ];

        for (const messages of messageSources) {
          if (!messages || !Array.isArray(messages)) continue;

          for (const message of messages) {
            if (!message || !message.kwargs || !message.kwargs.content) continue;

            const content = message.kwargs.content;
            if (typeof content !== "string" || content.trim() === "") continue;
            if (message.id.includes("ToolMessage")) continue;
            const isAI = message.id && Array.isArray(message.id) &&
              (message.id.includes("AIMessage") || message.id.includes("AIMessageChunk"));

            if (seenIds.has(message.kwargs.id || powerSyncMsg.id)) continue;
            seenIds.add(message.kwargs.id || powerSyncMsg.id);
            console.log("Extracted message:", {
              id: message.kwargs.id || powerSyncMsg.id
            });
            extractedMessages.push({
              id: message.kwargs.id || powerSyncMsg.id,
              chatId: sessionId || powerSyncMsg.thread_id || "",
              isAI: isAI,
              content: content
            });
          }
        }
      }
      catch (error) {
        console.error("Error processing PowerSync message:", error);
      }
    }





    return extractedMessages;
  } catch (error) {
    console.error("Error extracting messages from PowerSync:", error);
    return [];
  }
}
