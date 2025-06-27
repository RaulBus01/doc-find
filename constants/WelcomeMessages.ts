import { Message, MessageType } from "@/interface/Interface";


export const getWelcomeMessage = (t: any): Message => {
  const welcomeMessages = t('chat.welcomeMessages', { returnObjects: true }) as string[];
  const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
  const randomMessage = welcomeMessages[randomIndex];

  return {
    id: MessageType.System,
    chatId: "0",
    isAI: true,
    content: randomMessage,
  };
};