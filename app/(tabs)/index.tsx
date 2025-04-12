import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import SmallCard from "@/components/home-cards/small-card";
import MediumCard from "@/components/home-cards/medium-card";
import LargeCard from "@/components/home-cards/large-card";
import { useRouter } from "expo-router";
import { Chat } from "@/interface/Interface";
import { useToken } from "@/context/TokenContext";
import { getChats } from "@/utils/DatabaseAPI";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";



const Home = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  const handleRouting = (path: string) => {

    router.push(`/(profiles)/${path}`);
  };
  const ProfileComponent = () => {
    return (
      <View style={{ padding: 10 }}>
        <Text style={[styles.text, { paddingLeft: 10 }]}>Your Profiles</Text>
        <View style={styles.horizontalScroll}>
          <LargeCard
            text={"Add New Profile"}
            icon={"user-plus"}
            color={theme.mediumbackground}
            onPress={() => handleRouting("new")}
          />
         <LargeCard
          text="View All Profiles"
          icon="users"
          color={theme.darkbackground}
          onPress={() => handleRouting("history")}
        />
        </View>

      </View>
    );
  };

  const ChatsComponent = () => {
    const RETRIVE_CHATS = 5;
    const [chats, setChats] = useState<Chat[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { token } = useToken();
    const router = useRouter();

    useEffect(() => {
      const fetchChats = async () => {
        try {
          setIsLoading(true);
          const data = await getChats(token, RETRIVE_CHATS);
          setChats(data);
        } catch (err) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch chats")
          );
        } finally {
          setIsLoading(false);
        }
      };

      if (token) {
        fetchChats();
      }
    }, [token]);

    const handleRouting = (path: string) => {
      router.push(`/(tabs)/(chat)/${path}`);
    };

    if (error) {
      return (
        <View>
          <Text>ERROR</Text>
        </View>
      );
    }
    return (
      <View style={{ padding: 10 }}>
        <Text style={[styles.text, { paddingLeft: 10 }]}>Last Chats</Text>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          <MediumCard
            text={"Start New Chat"}
            icon={"add-circle-outline"}
            color={theme.mediumbackground}
            onPress={() => handleRouting("new")}
          />
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.tint} />
          ) : (
            chats?.map((chat) => (
              <MediumCard
                key={chat.id}
                text={chat.title}
                icon="chatbox-outline"
                color={theme.tint}
                onPress={() => handleRouting(chat.id)}
              />
            ))
          )}
          <MediumCard
            text={"Chat History"}
            icon={"chatbubbles-outline"}
            color={theme.darkbackground}
            onPress={() => handleRouting("history")}
          />
        </ScrollView>
      </View>
    );
  };

  const SymptomsComponent = () => {
    const router = useRouter();
    const handleRouting = (symptom: string) => {
      console.log(symptom);
      router.push("/(tabs)/(chat)/new");
    };
    return (
      <View style={{ padding: 10 }}>
        <Text style={[styles.text, { paddingLeft: 10 }]}>
          What are your symptoms?
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          <SmallCard
            text={"Cough"}
            icon={"😷"}
            color={theme.tint}
            onPress={handleRouting}
          />
          <SmallCard
            text={"Headache"}
            icon={"🤕"}
            color={theme.mediumbackground}
            onPress={handleRouting}
          />
          <SmallCard
            text={"Fever"}
            icon={"🤒"}
            color={theme.darkbackground}
            onPress={handleRouting}
          />
        </ScrollView>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Welcome</Text>
        </View>
      <ScrollView nestedScrollEnabled={true} style={{ flex: 1 }}>
        <ProfileComponent />
        <SymptomsComponent />
        <ChatsComponent />
      </ScrollView>

    </SafeAreaView>
  );
};
const getStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,

  },
  headerContainer: {
    justifyContent: "center",
    backgroundColor:theme.cardBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    
  },
  header: {
    fontSize: 32,
    fontFamily: "Roboto-Bold",
    color: theme.text,
    opacity: 0.65,
  },
  horizontalScroll: {
    flexDirection: "row",
    padding: 5,
    alignContent: "center",
  },
  text: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    color: theme.text,
  },
});

export default Home;
