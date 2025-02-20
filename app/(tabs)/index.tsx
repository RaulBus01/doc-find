import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import SmallCard from "@/components/home-cards/small-card";
import MediumCard from "@/components/home-cards/medium-card";
import LargeCard from "@/components/home-cards/large-card";
import { useRouter } from "expo-router";
import { Chat } from "@/interface/Interface";
import { useToken } from "@/context/TokenContext";
import { getChats } from "@/utils/Database";

const Home = () => {
  const { top, bottom } = useSafeAreaInsets();

  



  const ProfileComponent = () => {
    return (
      <View style={{ padding: 10 }}>
        <Text style={[styles.text, { paddingLeft: 10 }]}>Your Profiles</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          <LargeCard
            text={"User1"}
            icon={"add-circle-outline"}
            color={Colors.light.mediumbackground}
          />
          <LargeCard
            text={"Blood Analysis"}
            icon={"😷"}
            color={Colors.light.tint}
          />
          <LargeCard
            text={"Fever"}
            icon={"🤒"}
            color={Colors.light.darkbackground}
          />
        </ScrollView>
      </View>
    );
  };

  const ChatsComponent = () => {
    const RETRIVE_CHATS = 5;
    const [chats,setChats] = useState<Chat[]>();
    const [isLoading,setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { token } = useToken();
    const router = useRouter();
    
    useEffect(() => {
      const fetchChats = async () => {
        try {
          setIsLoading(true);
          const data = await getChats(token,RETRIVE_CHATS);
          setChats(data);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to fetch chats'));
        } finally {
          setIsLoading(false);
        }
      };
  
      if (token) {
        fetchChats();
      }
    }, [token]);

    const handleRouting= (path:string) =>{
      router.push(`/(tabs)/(chat)/${path}`);
    }
    if (isLoading) {
      return <View>
        <Text>isLoading</Text>
      </View>
    }
  
    if (error) {
      return <View>
        <Text>ERROR</Text>
      </View>
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
            color={Colors.light.mediumbackground}
            onPress={()=>handleRouting("new")}
          />
          {chats?.map((chat) =>(
            <MediumCard
            key={chat.id}
            text={chat.title}
            icon="chatbox-outline"
            color={Colors.light.tint}
            onPress={()=>handleRouting(chat.id)}
            />
          ))}
          <MediumCard
           text={"Chat History"}
           icon={"chatbubbles-outline"}
           color={Colors.light.darkbackground}
           onPress={()=>handleRouting("history")}
           />
        </ScrollView>
      </View>
    );
  };

  const SymptomsComponent = () => {
    const router = useRouter();
    const handleRouting= (symptom:string) =>{
        console.log(symptom);
        router.push("/(tabs)/(chat)/new");
    }
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
          <SmallCard text={"Cough"} icon={"😷"} color={Colors.light.tint} 
          onPress={handleRouting}/>
          <SmallCard
            text={"Headache"}
            icon={"🤕"}
            color={Colors.light.mediumbackground}
            onPress={handleRouting}
          />
          <SmallCard
            text={"Fever"}
            icon={"🤒"}
            color={Colors.light.darkbackground}
            onPress={handleRouting}
          />
          
        </ScrollView>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingBottom: bottom,
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Welcome</Text>
      </View>
      <ScrollView nestedScrollEnabled={true} style={{ flex: 1 }}>
       <ProfileComponent />
       <SymptomsComponent/>
       <ChatsComponent />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container:{
      flex: 1,
      backgroundColor: Colors.light.background,
    },
  headerContainer: {
    justifyContent: "center",
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontFamily: "Roboto-Bold",
    color: Colors.light.text,
    opacity: 0.65,
  },
  horizontalScroll: {
    flexDirection: "row",
    padding: 5,
    // backgroundColor:'green',
    alignContent: "center",
  },
  text: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    color: Colors.light.text,
  },
});

export default Home;
