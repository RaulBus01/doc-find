import { Message, MessageType } from "@/interface/Interface";

export const welcomeMessages: Message[] = [
  {
    id: MessageType.System,
    chatId: "0",
    isAI: true,
    content: "Hello! I’m DocFind, your virtual health assistant. Please share your symptoms, and I’ll help you identify potential conditions. If you need immediate assistance, I can also find emergency services nearby.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

  },
  {
    id: MessageType.System,
    isAI: true,
    chatId: "0",
    content:
      "Greetings from DocFind. Please describe your symptoms, and I will provide a list of possible diseases. For urgent situations, I can also direct you to emergency care facilities in your area.",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

  },
  {
    id: MessageType.System,
    chatId: "0",
    isAI: true,
    content:
      "Welcome to DocFind, your health resource. Share your symptoms with me, and I’ll suggest potential diagnoses. Should you require immediate assistance, I can find emergency services near your location.",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

  },
  {
    id: MessageType.System,
    chatId: "0",
    isAI: true,
    content:
      "DocFind is here to support you. Provide details of your symptoms, and I will analyze them for possible conditions. If the situation is critical, I can identify nearby emergency treatment options.",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

  },
  {
    id: MessageType.System,
    chatId: "0",
    isAI: true,
    content:
      "Welcome to DocFind. I’m equipped to help you interpret your symptoms and explore potential illnesses. In case of an emergency, I can also assist by locating nearby medical facilities.",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

  },
];