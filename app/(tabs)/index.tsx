import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import {useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors';
import SmallCard from '@/components/home-cards/small-card';
import MediumCard from '@/components/home-cards/medium-card';
import { Ionicons } from '@expo/vector-icons';
import LargeCard from '@/components/home-cards/large-card';




function Home () {

  
const {top,bottom} = useSafeAreaInsets();



  return (
    
        <View style={{flex:1,backgroundColor:Colors.light.background,paddingTop:top,paddingBottom:bottom}}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Welcome</Text>
          </View>
          <ScrollView nestedScrollEnabled={true} style={{flex:1}}>
          {ProfileComponent()}
            {SymptomsComponent()}

            {ChatsComponent()}
            
          </ScrollView>


       

        </View>
   
  )

  


  function ProfileComponent() {
    return <View style={{ padding: 10 }}>
      <Text style={[styles.text, { paddingLeft: 10 }]}>Your Profiles</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <LargeCard text={'User1'} icon={'add-circle-outline'} color={Colors.light.mediumbackground} />
        <LargeCard text={'Blood Analysis'} icon={'😷'} color={Colors.light.tint} />
        <LargeCard text={'Fever'} icon={'🤒'} color={Colors.light.darkbackground} />
      </ScrollView>
    </View>;
  }

  function ChatsComponent() {
    return <View style={{ padding: 10 }}>
      <Text style={[styles.text, { paddingLeft: 10 }]}>Last Chats</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <MediumCard text={'Start New Chat'} icon={'add-circle-outline'} color={Colors.light.mediumbackground} />
        <MediumCard text={'Blood Analysis'} icon={'😷'} color={Colors.light.tint} />
        <MediumCard text={'Fever'} icon={'🤒'} color={Colors.light.darkbackground} />
      </ScrollView>
    </View>;
  }

  function SymptomsComponent() {
    return <View style={{ padding: 10 }}>
      <Text style={[styles.text, { paddingLeft: 10 }]}>What are your symptoms?</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <SmallCard text={'Cough'} icon={'😷'} color={Colors.light.tint} />
        <SmallCard text={'Headache'} icon={'🤕'} color={Colors.light.mediumbackground} />
        <SmallCard text={'Fever'} icon={'🤒'} color={Colors.light.darkbackground} />
      </ScrollView>
    </View>;
  }
}
const styles = StyleSheet.create({
  headerContainer: {
      justifyContent: 'center',
      backgroundColor: Colors.light.tint,
      paddingVertical: 10,
      paddingHorizontal: 20,
  },
  header: {
      fontSize: 32,
      fontFamily: 'Roboto-Bold',
      color: Colors.light.text,
      opacity: 0.65

  },
  horizontalScroll: {
      flexDirection: 'row',
      padding: 5,
      // backgroundColor:'green',
      alignContent:'center',
      
  },
  text:{
    fontSize:16,
    fontFamily:'Roboto-Bold',
    color:Colors.light.text
  }
 
})

export default Home;