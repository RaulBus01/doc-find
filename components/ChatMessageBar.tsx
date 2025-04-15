import React, { useRef, useContext } from "react";
import {
  StyleSheet,
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
  const focusedHeight = useSharedValue(0);
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

  // This will now account for the text input height
  const containerStyle = useAnimatedStyle(() => {
    // Base height + any additional height from text input
    const baseCollapsedHeight = 50;
    const baseExpandedHeight = 105;
    
    // Add the focused height to the expanded state
    const dynamicExpandedHeight = baseExpandedHeight + Math.max(0, focusedHeight.value - 25);
    
    return {
      height: interpolate(
        barExpanded.value,
        [0, 1],
        [baseCollapsedHeight, dynamicExpandedHeight],
        Extrapolation.CLAMP
      ),
    };
  });

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
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      pointerEvents: opacity < 0.1 ? "none" : "auto",
    };
  });

  // Modified input container style to match the text height more directly
  const inputContainerStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      height: Math.max(25, focusedHeight.value), // Ensure minimum height
    };
  });

  const toggleBarExpansion = () => {
    const newValue = barExpanded.value === 0 ? 1 : 0;

    if (newValue === 0 && inputRef.current) {
      inputRef.current.blur();

      setTimeout(() => {
        setIsTabBarVisible(true);

        barExpanded.value = withTiming(
          0,
          {
            duration: 300,
            easing: Easing.out(Easing.cubic),
          },
          () => {
            focusedHeight.value = 0;
          }
        );
      }, 50);
    } else {
      setIsTabBarVisible(false);

      barExpanded.value = withSpring(1, springConfig);

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
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

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const lineHeight = 25;
    const lines = Math.ceil(height / lineHeight); // Use ceiling to avoid partial lines
    const maxLines = 10; // Maximum number of lines allowed
    const newHeight = Math.min(lines, maxLines) * lineHeight;
    
    // Make animation faster to prevent text clipping
    focusedHeight.value = withTiming(newHeight, {
      duration: 100, // Faster animation to prevent clipping
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Less dramatic easing
    });
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
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Collapsed message bar (acts as a button) */}
      <Animated.View style={collapsedBarStyle}>
        <TouchableOpacity style={styles.collapsedBar} onPress={toggleBarExpansion}>
          <Ionicons name="chatbubble-outline" size={22} color={theme.text} />
          <Animated.Text style={styles.collapsedText}>
            Type your symptoms here...
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Expanded message bar */}
      <Animated.View style={expandedBarStyle}>
        <Animated.View style={[styles.contentView]}>
          {/* Input area */}
          <Animated.View style={inputContainerStyle}>
            <TextInput
              ref={inputRef}
              placeholder="Type your symptoms here..."
              placeholderTextColor={`${theme.text}80`}
              multiline
              numberOfLines={10}
              onContentSizeChange={handleContentSizeChange}
              value={message}
              onChangeText={onChangeText}
              onFocus={onInputFocus}
              style={styles.messageInput}
            />
          </Animated.View>
        </Animated.View>

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
