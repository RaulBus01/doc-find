import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

interface SmallCardProps {
    text:string
    icon:string
    color:string 

}

const SmallCard = ({text,icon,color}:SmallCardProps) => {
  return (
    <View style={[styles.container, {backgroundColor:color}]}>
        <Text style={styles.text}>{icon}</Text>
        <Text style={styles.text}>{text}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'row',
      marginHorizontal: 5,
      justifyContent: 'center',
      gap: 5,
      alignItems: 'center',
      width:128,
      height:51,
      borderRadius:25
  },
  text: {
      
      textAlign: 'center',
      fontSize: 16,
      fontFamily: 'Roboto-Medium',
      color: Colors.light.text,
  },

})
export default SmallCard