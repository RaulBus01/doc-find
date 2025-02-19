import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';


interface BottomSheetModalButtonProps {
    title: string;
    icon: string;
    onPress: ()=>void;
}

const BottomSheetModalButton: React.FC<BottomSheetModalButtonProps> = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.container}>
            <Ionicons name={icon as any} size={28} style={title === "Delete" ? styles.iconDelete : styles.icon} />
            <Text style={title === "Delete" ? styles.textDelete : styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        padding:16,
        marginLeft:16,
        
    },
    icon:{
        marginRight:20,
        color:Colors.light.text
    },
    text:{
        fontSize:20,
        fontFamily:"Roboto-Medium",
        color:Colors.light.text,
        
    },
    iconDelete:{
      marginRight:20,
      color:Colors.light.red
    },
    textDelete:{
        fontSize:20,
        fontFamily:"Roboto-Medium",
        color:Colors.light.red,
      
    }
  
})

export default BottomSheetModalButton