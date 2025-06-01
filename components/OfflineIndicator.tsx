import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { View,Text,StyleSheet } from "react-native";

export const OfflineIndicator = () => {
    const [isOffline,setIsOffline] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
       const unsubscribe = NetInfo.addEventListener(state => {
            setIsOffline(!state.isConnected);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    if(!isOffline) {
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor: "transparent" }]}>
            <Text style={[styles.text, { color: theme.textLight ? theme.textLight : theme.text }]}>
                You are offline
            </Text>
        </View> 
    )

}
export const useOfflineStatus = () => {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOffline(!state.isConnected);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return isOffline;
};

const styles = StyleSheet.create({
    container: {
        zIndex: 1000,
        alignItems: "center",
        marginVertical:5,
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

    