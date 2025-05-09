import React, { useRef, useContext, useState } from "react";
import {
  TextInput,
  Keyboard,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  WithSpringConfig,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";

import {MessageBarStyles} from "@/components/ChatMessageBarStyle";
import Animated from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";
import { TabBarVisibilityContext } from "@/context/TabBarContext";


const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type Props = {
  onModalPress: () => void;
  onMessageSend: (message: string) => void;
};

const MessageBar = ({ onModalPress, onMessageSend }: Props) => {
  const [message, setMessage] = React.useState("");
  const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(0);
  const barExpanded = useSharedValue(0);
  const inputRef = useRef<TextInput>(null);
  const isSendDisabled = !message.trim();
  const { theme } = useTheme();
  const { isTabBarVisible, setIsTabBarVisible } = useContext(
    TabBarVisibilityContext
  );

  
  const styles = MessageBarStyles(theme, bottom);
  
  const springConfig: WithSpringConfig = {
    damping: 22,
    stiffness: 180,
    mass: 1,
  };


  const collapsedBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      barExpanded.value,
      [0, 0.3], 
      [1, 0],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      barExpanded.value,
      [0, 0.3], 
      [1, 0.95],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
      position: "absolute",
      bottom: bottom + 10,
      left: 0,
      right: 0,
      zIndex: opacity === 0 ? -1 : 1,
    };
  });

  const expandedBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      barExpanded.value,
      [0.3, 0.8], 
      [0, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      barExpanded.value,
      [0.3, 0.8], 
      [20, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
      position: "relative",
    
    };
  });



  const toggleBarExpansion = () => {
    if (barExpanded.value === 0) {
      // Opening the bar
      setIsTabBarVisible(false);
      barExpanded.value = withSpring(1, springConfig);
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          
         
        }
      }, 200);
    } else {
     
      
      setIsTabBarVisible(true);
    

     
       setTimeout(() => {
       
           barExpanded.value = withSpring(0, springConfig);
             
      }, 200);
      Keyboard.dismiss();
     
    }
  };

  const expandItems = () => {
    expanded.value = withTiming(1, { duration: 400 });
    Keyboard.dismiss();
  };

  const collapseItems = () => {
    expanded.value = withTiming(0, { duration: 400 });
  };

  const onInputFocus = () => {
    collapseItems();

    setIsTabBarVisible(false);
    
    // If there's existing text, measure it on focus
    if (message.trim().length > 0 && inputRef.current) {
      // Use setTimeout to allow the input to properly mount
      setTimeout(() => {
        inputRef.current?.measure(() => {
          // This forces a layout recalculation
          inputRef.current?.setNativeProps({});
        });
      }, 100);
    }
  };

  const expandButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      expanded.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    );
    const width = interpolate(
      expanded.value,
      [0, 1],
      [40, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      width,
    };
  });

  const buttonContainerStyle = useAnimatedStyle(() => {
    const width = interpolate(
      expanded.value,
      [0, 1],
      [0, 160],
      Extrapolation.CLAMP
    );

    return {
      width,
      opacity: expanded.value,
    };
  });

  const onChangeText = (text: string) => {
    collapseItems();
    setMessage(text);
  };

  const onPress = () => {
    collapseItems();
    onModalPress();
  };

  

  const handleSend = () => {
    if (message.trim()) {
      onMessageSend(message);
      setMessage("");
      setTimeout(() => {
        toggleBarExpansion();
        setIsTabBarVisible(true);
      }, 300);
    }
  };

  return (
    <Animated.View style={[styles.container]}>
      {/* Collapsed message bar (acts as a button) */}
      <Animated.View style={collapsedBarStyle}>
        <TouchableOpacity style={styles.collapsedBar} onPress={toggleBarExpansion}>
          <Ionicons name="chatbubble-outline" size={22} color={theme.text} />
          <Animated.Text style={styles.collapsedText}>
            {message.length > 0 
    ? message.replace(/\s+/g, ' ').trim().slice(0, 20) + (message.replace(/\s+/g, ' ').trim().length > 20 ? "..." : "")
    : "Type a message..."}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Expanded message bar */}
      <Animated.View style={expandedBarStyle}>
     
          {/* Input area */}
       
            <TextInput
              ref={inputRef}
              textAlignVertical="top"
              placeholder="Type your symptoms here..."
              placeholderTextColor={theme.text}
              multiline
              numberOfLines={10}
              value={message}
              selectionColor={theme.red}
              onChangeText={onChangeText}
              onFocus={onInputFocus}
              style={[
                styles.messageInput]}
            />
  

        {/* Action buttons container */}
        <View style={styles.actionButtonsContainer}>
          <View style={styles.attachmentButtons}>
            <ATouchableOpacity
              onPress={expandItems}
              style={[styles.button, expandButtonStyle]}
            >
              <Ionicons name="add-outline" size={24} color={theme.text} />
            </ATouchableOpacity>

            <Animated.View style={[styles.buttonView, buttonContainerStyle]}>
              <TouchableOpacity
                onPress={() => {
                  collapseItems();
                  console.log("Camera");
                }}
                style={styles.iconButton}
              >
                <Ionicons name="camera-outline" size={24} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  collapseItems();
                  console.log("Gallery");
                }}
                style={styles.iconButton}
              >
                <Ionicons name="image-outline" size={24} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  collapseItems();
                  console.log("Document");
                }}
                style={styles.iconButton}
              >
                <Ionicons
                  name="document-outline"
                  size={24}
                  color={theme.text}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
          <Animated.View style={styles.bottomIcons}>
              {!isSendDisabled ? (
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                  <Ionicons name="send" size={22} color="#fff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => {}} style={styles.iconButton}>
                  <Ionicons name="mic" size={24} color={theme.text} />
                </TouchableOpacity>
              )}
            </Animated.View>

          {/* Close button */}
          <TouchableOpacity onPress={toggleBarExpansion} style={styles.iconButton}>
            <Ionicons name="chevron-down" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default MessageBar;
