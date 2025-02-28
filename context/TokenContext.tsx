import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { secureGetValueFor } from '../utils/SecureStorage';

interface TokenContextType {
  token: string | null;
  isLoading: boolean;
  error: Error | null;
  refreshToken: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType>({
  token: null,
  isLoading: true,
  error: null,
  refreshToken: async () => {},
});

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshToken = async () => {
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

  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <TokenContext.Provider value={{ token, isLoading, error, refreshToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);