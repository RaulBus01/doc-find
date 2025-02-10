import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth0 } from 'react-native-auth0';
import { ActivityIndicator, View } from 'react-native';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth0();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/(auth)/index");
        }
    }, [user, isLoading]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;