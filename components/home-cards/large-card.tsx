import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'

interface LargeCardProps {
    text:string
    icon:string
    color:string 

}

const LargeCard = ({text,icon,color}:LargeCardProps) => {
  return (
    <View style={[stylesLarge.container, {backgroundColor:color}]}>
        <Text style={stylesLarge.text}>{text}</Text>
        <Text style={stylesLarge.text}>Name: </Text>
        <Text style={stylesLarge.text}>Age: </Text>
        <Text style={stylesLarge.text}>Sex:</Text>
        <Text style={stylesLarge.text}>Blood Group:</Text>
        
      
    </View>
  )
}


const stylesLarge = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'column',
      marginHorizontal: 5,
      justifyContent: 'center',
      gap: 5,
      alignItems: 'center',
      width:185,
      height:150,
      borderRadius:25
  },
  text: {
      
      textAlign: 'center',
      fontSize: 14,
      fontFamily: 'Roboto-Medium',
     
  },

})
export default LargeCard