import { View, Text, StyleSheet,TouchableOpacity} from 'react-native'

import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { ThemeColors } from '@/constants/Colors';


interface BottomSheetModalButtonProps {
    title: string;
    icon: string;
    onPress: ()=>void;
}

const BottomSheetModalButton: React.FC<BottomSheetModalButtonProps> = ({ title, icon, onPress }) => {
    const {theme} = useTheme();
    const styles = getStyles(theme);
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
            <Ionicons name={icon as any} size={22} style={title === "Delete" ? styles.iconDelete : styles.icon} />
            <Text style={title === "Delete" ? styles.textDelete : styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}
const getStyles = (theme: ThemeColors) => StyleSheet.create({
    container:{
       
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        padding:16,
        marginLeft:16,
        zIndex:100,
        
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