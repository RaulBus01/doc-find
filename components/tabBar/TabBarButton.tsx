import {StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Pressable } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { ThemeColors } from '@/constants/Colors';

const TabBarButton = (props: { onLongPress?:any, onPress?: any; isFocused?: any; label?: any; iconDefault?: any; iconFocused?: any; color?: any; }) => {
    const {isFocused, label,iconDefault,iconFocused,color } = props;
    const {theme} = useTheme();
    const styles = getStyles(theme);

    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0, { duration:300})
    }, [isFocused,scale])
    const animatedIcon = useAnimatedStyle(() => {
        
        const value = interpolate(scale.value, [0, 1], [0.9, 1.2]);
        const top = interpolate(scale.value, [0, 1], [0, 10]);
        return {
            transform: [{ scale: value }],
            top
        }
      
    }
    )
    const animatedText = useAnimatedStyle(() => {
        
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);
        return {
            opacity
        }
    }
    )

    return (
    <Pressable style={isFocused ? [styles.containerFocused] : styles.container}
        onPress={() => props.onPress()}
    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
    >
        <Animated.View style={{...animatedIcon}}>

        <Ionicons name={isFocused ? iconDefault : iconFocused} size={20} color={theme.text}/>
      </Animated.View>
        <Animated.Text style={[styles.text,animatedText]}>
            {label}
        </Animated.Text>
        
    </Pressable>
    
  )
}

const getStyles = (theme: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: "transparent",
    },
    containerFocused: {
        flex: 1,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.pressedBackground,
        borderRadius: 25,
        
    },
    text: {
        fontSize: 14,
        color: theme.text,
    },
})

export default TabBarButton