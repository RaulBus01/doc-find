import React, { useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  TextInput,
  Keyboard,
  Pressable,
  View,
  Text,
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
  runOnJS,
} from "react-native-reanimated";

import Animated from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";
import { TabBarVisibilityContext } from "@/context/TabBarContext";

const ATouchableOpacity = Animated.createAnimatedComponent(Pressable);

type Props = {
  onModalPress: () => void;
  onMessageSend: (message: string) => void;
};

const MessageBar = ({ onModalPress, onMessageSend }: Props) => {
  const [message, setMessage] = React.useState("");
  const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(0);
  const isExpanded = useSharedValue(false);
  const barExpanded = useSharedValue(0);
  const focusedHeight = useSharedValue(0);
  const inputRef = useRef<TextInput>(null);
  const isSendDisabled = !message.trim();
  const { theme } = useTheme();
  const { isTabBarVisible, setIsTabBarVisible } = useContext(
    TabBarVisibilityContext
  );

  // Define styles inline
  const styles = StyleSheet.create({
    container: {
      position: "relative",
      paddingBottom: bottom,
    },
    contentView: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.progressColor,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      paddingHorizontal: 15,
    },
    collapsedBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.background,
      borderRadius: 22,
      marginHorizontal: 15,
      marginBottom: 10,
      marginTop: 5,
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 15,
      elevation: 3,
    },
    collapsedText: {
      color: `${theme.text}80`,
      marginLeft: 10,
      flex: 1,
      fontSize: 15,
    },
    button: {
      marginRight: 10,
      width: 30,
      height: 30,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: `${theme.background}`,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    buttonView: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginLeft: 5,
      paddingVertical: 5,
    },
    textAreaView: {
      flex: 1,
      minHeight: 46,
      maxHeight: 150,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.background,
      borderRadius: 22,
      marginHorizontal: 8,
      marginVertical: 5,
      paddingVertical: 6,
      paddingHorizontal: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    bottomIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      position: "absolute",
      bottom: 8,
      right: 12,
    },
    messageInput: {
      flex: 1,
      marginLeft: 8,
      padding: 6,
      borderRadius: 20,
      backgroundColor: "transparent",
      color: theme.text,
      fontSize: 16,
    },
    iconButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
    },
    activeIconButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: `${theme.text}15`,
    },
    sendButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: theme.text,
    },
    actionButtonsContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      justifyContent: "space-between",
    },
    attachmentButtons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    toolbarContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
  });

  const springConfig: WithSpringConfig = {
    damping: 22,
    stiffness: 180,
    mass: 1,
  };


  const containerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        barExpanded.value,
        [0, 1],
        [50, 105],
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

  const textAreaAnimatedStyle = useAnimatedStyle(() => {
    return {
      minHeight: interpolate(
        focusedHeight.value,
        [0, 1],
        [46, 100],
        Extrapolation.CLAMP
      ),
    };
  });

  // Animate the text input to shift upward when focused
  const inputContainerStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      marginTop: interpolate(
        focusedHeight.value,
        [0, 1],
        [0, -15],
        Extrapolation.CLAMP
      ),
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
    const lineHeight = 20;
    const lines = height / lineHeight;
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
        <Pressable style={styles.collapsedBar} onPress={toggleBarExpansion}>
          <Ionicons name="chatbubble-outline" size={22} color={theme.text} />
          <Animated.Text style={styles.collapsedText}>
            Type your symptoms here...
          </Animated.Text>
        </Pressable>
      </Animated.View>

      {/* Expanded message bar */}
      <Animated.View style={expandedBarStyle}>
        <Animated.View style={[styles.contentView]}>
          {/* Input area */}
          <Animated.View style={[styles.textAreaView, textAreaAnimatedStyle]}>
            <Animated.View style={inputContainerStyle}>
              <TextInput
                ref={inputRef}
                placeholder="Type your symptoms here..."
                placeholderTextColor={`${theme.text}80`}
                multiline
                numberOfLines={3}
                onContentSizeChange={handleContentSizeChange}
                value={message}
                onChangeText={onChangeText}
                onFocus={onInputFocus}
                style={styles.messageInput}
              />
            </Animated.View>

            <Animated.View style={styles.bottomIcons}>
              {!isSendDisabled ? (
                <Pressable onPress={handleSend} style={styles.sendButton}>
                  <Ionicons name="send" size={22} color="#fff" />
                </Pressable>
              ) : (
                <Pressable onPress={() => {}} style={styles.iconButton}>
                  <Ionicons name="mic" size={24} color={theme.text} />
                </Pressable>
              )}
            </Animated.View>
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
              <Pressable
                onPress={() => {
                  collapseItems();
                  console.log("Camera");
                }}
                style={styles.activeIconButton}
              >
                <Ionicons name="camera-outline" size={24} color={theme.text} />
              </Pressable>
              <Pressable
                onPress={() => {
                  collapseItems();
                  console.log("Gallery");
                }}
                style={styles.iconButton}
              >
                <Ionicons name="image-outline" size={24} color={theme.text} />
              </Pressable>
              <Pressable
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
              </Pressable>
            </Animated.View>
          </View>

          {/* Close button */}
          <Pressable onPress={toggleBarExpansion} style={styles.iconButton}>
            <Ionicons name="chevron-down" size={24} color={theme.text} />
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default MessageBar;
