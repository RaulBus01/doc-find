import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'

interface LargeCardProps {
  text: string
  icon: string
  color: string

}

const LargeCard = ({ text, icon, color }: LargeCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[stylesLarge.container, { backgroundColor: color }]}>

      <Text style={stylesLarge.text}>Name: </Text>
      <Text style={stylesLarge.text}>Age: </Text>
      <Text style={stylesLarge.text}>Sex:</Text>
      <Text style={stylesLarge.text}>Blood Group:</Text>


    </TouchableOpacity>
  )
}


const stylesLarge = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginHorizontal: 8,
    marginVertical: 6,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 190,
    height: 160,
    borderRadius: 24,
    padding: 16,
    boxShadow: '5px 5px 5px 1px rgba(0,0,0,0.1)',
    elevation: 10,
    gap: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: Colors.light.text,
    letterSpacing: 0.3,
    opacity: 0.9,
    lineHeight: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.light.text,
    opacity: 1,
  }
})
export default LargeCard