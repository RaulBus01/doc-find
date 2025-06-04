import { Chat } from "@/interface/Interface";
import { useQuery } from "@powersync/react-native";


export const getPowerSyncChats = (userId: string, RETRIVE_CHATS: number = 5): {
    data: Chat[] | undefined;
    isLoading: boolean;
} => {
    if (!userId) {
        return { data: [], isLoading: true };
    }

    const { data: chatsData, isLoading } = useQuery('SELECT * FROM chats WHERE chats.user_id = ? ORDER BY created_at DESC LIMIT ?', [userId, RETRIVE_CHATS], {
        throttleMs: 1000,
        tables: ['chats'],
    });

    if (isLoading) {
        return { data: undefined, isLoading: true };
    }
    if (!chatsData) {
        return { data: [], isLoading: false };
    }
    return { data: chatsData as Chat[], isLoading: false };

}
export const getAllPowerSyncChats = (userId: string): {
    data: Chat[] | undefined;
    isLoading: boolean;
} => {
    if (!userId) {
        return { data: [], isLoading: true };
    }

    const { data: chatsData, isLoading } = useQuery('SELECT * FROM chats WHERE chats.user_id = ? ORDER BY created_at DESC', [userId], {
        throttleMs: 1000,
        tables: ['chats'],
    });

    if (isLoading) {
        return { data: undefined, isLoading: true };
    }
    if (!chatsData) {
        return { data: [], isLoading: false };
    }
    return { data: chatsData as Chat[], isLoading: false };

}

export const getPowerSyncChatsCount = (userId: string): number => {
    const { data: countData, isLoading } = useQuery('SELECT COUNT(*) as count FROM chats WHERE chats.user_id = ?', [userId], {
        throttleMs: 1000,
        tables: ['chats'],
    });

    if (isLoading) {
        return 0;
    }
    if (!countData || countData.length === 0) {
        return 0;
    }
    return countData[0].count as number;
}

