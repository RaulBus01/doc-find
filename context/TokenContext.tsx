import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { secureDeleteValue, secureGetValueFor } from '../utils/SecureStorage';

interface TokenContextType {
  token: string | null;
  isLoading: boolean;
  error: Error | null;
  refreshAccessToken: () => Promise<void>;
  clearToken: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType>({
  token: null,
  isLoading: true,
  error: null,
  refreshAccessToken: async () => {},
  clearToken: async () => {},
});

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshAccessToken = async () => {
    setIsLoading(true);
    try {
      const accessToken = await secureGetValueFor("accessToken");
      setToken(accessToken);
      setError(null);
    } catch (e: any) {
      setError(e);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };
  const refreshToken = async () => {
    setIsLoading(true);
    try {
      const refreshToken = await secureGetValueFor("refreshToken");
      setToken(refreshToken);
      setError(null);
    } catch (e: any) {
      setError(e);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }


  const clearToken = async () => {
    try{
      await secureDeleteValue("accessToken");
      setToken(null);
      setError(null);

    }catch(e:any){
      setError(e);
    }
  }


  useEffect(() => {
    refreshAccessToken();
    refreshToken()
  }, []);

  return (
    <TokenContext.Provider value={{ token, isLoading, error, refreshAccessToken,clearToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);