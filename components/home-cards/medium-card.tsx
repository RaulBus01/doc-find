import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'

interface MediumCardProps {
    text:string
    icon:string
    color:string 

}

const MediumCard = ({text,icon,color}:MediumCardProps) => {
  return (
    <View style={[stylesMedium.container, {backgroundColor:color}]}>
        <Text style={stylesMedium.text}>{text}</Text>
        {icon === 'add-circle-outline' ? <Ionicons  name={icon as any} size={24} color="black" /> : <Text style={stylesMedium.text}>{icon}</Text>}
      
    </View>
  )
}


const stylesMedium = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'column',
      marginHorizontal: 5,
      justifyContent: 'center',
      gap: 5,
      alignItems: 'center',
      width:128,
      height:94,
      borderRadius:25
  },
  text: {
      
      textAlign: 'center',
      fontSize: 16,
      fontFamily: 'Roboto-Medium',
      color: Colors.light.text,
  },

})
export default MediumCard