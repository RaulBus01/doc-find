import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { secureGetValueFor } from '@/utils/Token';

interface UserDataContextType {
    email: string | null;
    username: string | null;
    userId: string | null;
    picture: string | null;
    isLoading: boolean;
    error: Error | null;
    refreshData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType>({
    email: null,
    username: null,
    userId: null,
    picture: null,
    isLoading: true,
    error: null,
    refreshData: async () => { },
});


export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const [email, setEmail] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [picture, setPicture] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            const userData = await secureGetValueFor("user");
            console.log(userData);
            if (userData) {
                const userJSON = await JSON.parse(userData);
                setEmail(userJSON.email);
                setUsername(userJSON.username);
                setUserId(userJSON.id);
                setPicture(userJSON.picture);
                setError(null);
            }
        } catch (e: any) {
            setError(e);
            setEmail(null);
            setUsername(null);
            setUserId(null);
            setPicture(null);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        refreshData();
    }, []);

    return (
        <UserDataContext.Provider value={{ email, username, userId, picture, isLoading, error, refreshData }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = () => useContext(UserDataContext);