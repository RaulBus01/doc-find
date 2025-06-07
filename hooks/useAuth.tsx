import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "react-native-auth0";
import { router, useSegments, useRootNavigationState } from "expo-router";
import Constants from "expo-constants";
import { secureDeleteValue, secureGetValueFor, secureSave } from "@/utils/SecureStorage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

type AuthContextType = {
  signIn: () => Promise<string | void>;
  signOut: () => Promise<void>;
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

  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && inAuthGroup) {
      console.log("User is authenticated, redirecting to main app");
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthGroup) {
      console.log("User is not authenticated, redirecting to login");

      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, segments, navigationState?.key]);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const savedToken = await secureGetValueFor("token");
        if (savedToken) {
          setToken(savedToken);
        }
      } catch (e) {
        console.error("Error retrieving token:", e);
      }
    };

    checkToken();
  }, []);

  const signIn = async () => {
    try {
      await authorize({
        scope: "openid profile email",
        audience: `${Constants.expoConfig?.extra?.auth0?.audience}`,
      });
      const credentials = await getCredentials();
      console.log("User credentials:", credentials);
      if (credentials?.accessToken) {
        console.log("Access Token:", credentials.accessToken);
        setToken(credentials.accessToken);
        await secureSave("token", credentials.accessToken);
      }
    
      setIsAuthenticated(true);
        
    } catch (e) {
      console.error("Login error:", e);
    }
  };

  const signOut = async () => {
    try {
      await clearSession();
      await secureDeleteValue("token");
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
