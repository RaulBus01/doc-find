import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';


interface BottomSheetModalButtonProps {
    title: string;
    icon: string;
    onPress: ()=>void;
}

const BottomSheetModalButton: React.FC<BottomSheetModalButtonProps> = ({ title, icon, onPress }) => {
    const {theme} = useTheme();
    const styles = getStyles(theme);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.container}>
            <Ionicons name={icon as any} size={28} style={title === "Delete" ? styles.iconDelete : styles.icon} />
            <Text style={title === "Delete" ? styles.textDelete : styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}
const getStyles = (theme: any) => StyleSheet.create({
    container:{
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        padding:16,
        marginLeft:16,
        
    },
    icon:{
        marginRight:20,
        color:theme.text
    },
    text:{
        fontSize:20,
        fontFamily:"Roboto-Medium",
        color:theme.text,
        
    },
    iconDelete:{
      marginRight:20,
      color:theme.red
    },
    textDelete:{
        fontSize:20,
        fontFamily:"Roboto-Medium",
        color:theme.red,
      
    }
  
})

export default BottomSheetModalButton