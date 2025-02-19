import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'

interface MediumCardProps {
  text: string
  icon: string
  color: string
  onPress: () => void
}

const MediumCard = ({text, icon, color,onPress }: MediumCardProps) => {
  return (
    <TouchableOpacity
      
      activeOpacity={0.6}
      onPress={onPress}
      style={[stylesMedium.container, { backgroundColor: color }]}>
      <Text style={stylesMedium.text}>{text}</Text>
      <Ionicons name={icon as any} size={24} color="black" /> 

    </TouchableOpacity>
  )
}


const stylesMedium = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 100,
    borderRadius: 20,
    padding: 12,
    boxShadow: '5px 5px 5px 1px rgba(0,0,0,0.1)',
    elevation: 5,
    gap: 8,
  },
  text: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    color: Colors.light.text,
    letterSpacing: 0.3,
  },
})
export default MediumCard