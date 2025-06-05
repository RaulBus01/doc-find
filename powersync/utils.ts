import { Chat } from "@/interface/Interface";
import { useQuery } from "@powersync/react-native";


export const getPowerSyncChats = (userId: string, RETRIVE_CHATS: number = 5): {
    data: Chat[] | undefined;
    isLoading: boolean;
} => {

    const { data: chatsData, isLoading } = useQuery('SELECT * FROM chats WHERE chats.user_id = ? ORDER BY chats.updated_at DESC LIMIT ?', [userId, RETRIVE_CHATS], {
        throttleMs: 1000,
        tables: ['chats'],
    }
    );
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
    const { data: chatsData, isLoading } = useQuery('SELECT * FROM chats'); // This query doesn't depend on userId

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
        tables: ['chats'],
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

