import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "react-native-auth0";
import { router, useSegments, useRootNavigationState } from "expo-router";
import Constants from "expo-constants";
import { secureDeleteValue, secureGetValueFor, secureSave } from "@/utils/SecureStorage";
import { Toast } from "toastify-react-native";

type AuthContextType = {
  signIn: () => Promise<string | void>;
  signOut: () => Promise<void>;
  refreshTokens: ()=> Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  error: Error | null;
  token?: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { authorize, clearSession, user, error, getCredentials, isLoading } = useAuth0();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<string | undefined>(undefined);
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && inAuthGroup) {

      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthGroup) {
  
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, segments, navigationState?.key]);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const savedToken = await secureGetValueFor("accessToken");
        if (savedToken) {
          setToken(savedToken);
        }
      } catch (e) {
        console.error("Error retrieving token:", e);
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    const checkRefreshToken = async () => {
      try {
        const savedRefreshToken = await secureGetValueFor("refreshToken");
        if (savedRefreshToken) {
          setRefreshToken(savedRefreshToken);
        }
      } catch (e) {
        console.error("Error retrieving refresh token:", e);
      }
    }
    checkRefreshToken();
  }, []);

  const signIn = async () => {
    try {
      await authorize({
        
        scope: "openid profile email offline_access",
        audience: `${Constants.expoConfig?.extra?.auth0?.audience}`,
        
      });
      const credentials = await getCredentials();
      if (!credentials) {
        Toast.show({
          type: "error",
          text1: "Authentication failed",
          text2: "No credentials received from Auth0.",
        })
        return;
        
      }
     
      if (credentials?.accessToken) {
     
        setToken(credentials.accessToken);
        await secureSave("accessToken", credentials.accessToken);
      }

      if(credentials?.refreshToken) {
        setRefreshToken(credentials.refreshToken);
        await secureSave("refreshToken", credentials.refreshToken);
      }
    
      setIsAuthenticated(true);
        
    } catch (e) {
      console.error("Login error:", e);
    }
  };
 const refreshTokens = async () => {
    try {
      const savedRefreshToken = await secureGetValueFor("refreshToken");
      if (!savedRefreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(`https://${Constants.expoConfig?.extra?.auth0?.domain}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          client_id: Constants.expoConfig?.extra?.auth0?.clientId,
          refresh_token: savedRefreshToken,
        }),
      });
      

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      
 
      setToken(data.access_token);
      await secureSave("accessToken", data.access_token);
      
      if (data.refresh_token) {
        setRefreshToken(data.refresh_token);
        await secureSave("refreshToken", data.refresh_token);
      }

    } catch (e) {
      console.error("Token refresh error:", e);
    
      await signOut();
    }
  };

  const signOut = async () => {
    try {
      await clearSession();
      await secureDeleteValue("accessToken");
      await secureDeleteValue("refreshToken");
      setIsAuthenticated(false);
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        refreshTokens,
        isAuthenticated,
        isLoading,
        user,
        error,
        token,
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
