import { View, Text, Pressable,StyleSheet, useAnimatedValue } from 'react-native'
import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const TabBarButton = (props) => {
    const {isFocused, label,iconDefault,iconFocused,color } = props;

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
    <Pressable {...props} style={styles.container}>
        <Animated.View style={{...animatedIcon}}>

        <Ionicons name={isFocused ? iconDefault : iconFocused} size={24} color={isFocused} />
      </Animated.View>
        <Animated.Text style={[{ color: isFocused ? color : 'black' },animatedText]}>
            {label}
        </Animated.Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
    
    
    },
    text: {
        fontSize: 14,
       
    },
})

export default TabBarButton