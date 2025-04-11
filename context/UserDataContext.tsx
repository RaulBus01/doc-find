import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { secureDeleteValue, secureGetValueFor } from '../utils/SecureStorage';

interface UserDataContextType {
    email: string | null;
    username: string | null;
    userId: string | null;
    picture: string | null;
    isLoading: boolean;
    error: Error | null;
    refreshData: () => Promise<void>;
    clearUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType>({
    email: null,
    username: null,
    userId: null,
    picture: null,
    isLoading: true,
    error: null,
    refreshData: async () => { },
    clearUserData: async () => { },
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
    const clearUserData = async () => {
        try {
            await secureDeleteValue("user");
            setEmail(null);
            setUsername(null);
            setUserId(null);
            setPicture(null);
            setError(null);
        } catch (e: any) {
            setError(e);
        }finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        refreshData();
    }, []);

    console.log("UserDataProvider", { email, username, userId, picture, isLoading, error });

    return (
        <UserDataContext.Provider value={{ email, username, userId, picture, isLoading, error, refreshData,clearUserData }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = () => useContext(UserDataContext);