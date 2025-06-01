import { Message, MessageType } from "@/interface/Interface";
import { useTranslation } from "react-i18next";

export const getWelcomeMessage = (): Message => {
  const {t} = useTranslation();
  const welcomeMessages = t('chat.welcomeMessages', { returnObjects: true }) as string[];
  const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
  const randomMessage = welcomeMessages[randomIndex];

  return {
    id: MessageType.System,
    chatId: "0",
    isAI: true,
    content: randomMessage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
