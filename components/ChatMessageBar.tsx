import React, { useRef } from "react";
import {  TextInput, Keyboard,Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChatMessageBarStyle from "./ChatMessageBarStyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  WithSpringConfig,
  withTiming,
} from "react-native-reanimated";

import Animated from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";

const ATouchableOpacity = Animated.createAnimatedComponent(Pressable);

type Props = {
  onModalPress: () => void;
  onMessageSend: (message: string) => void;
};

const MessageBar = ({ onModalPress, onMessageSend }: Props) => {
  const [message, setMessage] = React.useState("");
  const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(0);
  const focusedHeight = useSharedValue(0);
  const inputRef = useRef<TextInput>(null);
  const isSendDisabled = !message.trim();
  const {theme} = useTheme();
  const styles = ChatMessageBarStyle(theme);
  const springConfig: WithSpringConfig = {
    damping: 15,
    stiffness: 120
  }
  const textAreaAnimatedStyle = useAnimatedStyle(() => {
    return {
      minHeight: interpolate(
        focusedHeight.value,
        [0, 1],
        [40, 100],
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
        [0, -20], // The input moves up by 20 when focused
        Extrapolation.CLAMP
      ),
    };
  });
  const expandItems = () => {
    expanded.value = withTiming(1, { duration: 400 });
    Keyboard.dismiss();
  };

  const collapseItems = () => {
    expanded.value = withTiming(0, { duration: 400 });
  };

  const onInputFocus = () => {
    collapseItems();
    focusedHeight.value = withTiming(1, { duration: 300 });
  }
  const onInputBlur = () => {
    focusedHeight.value = withTiming(0, { duration: 300 });
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
      [30, 0],
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
      [0, 100],
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

  const [numberOfLines, setNumberOfLines] = React.useState(0);

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const lineHeight = 19;
    const lines = height / lineHeight;

    setNumberOfLines(Math.round(lines));
  };

  const handleSend = () => {
    if (message.trim()) {
      onMessageSend(message);
      setMessage("");
      
    }
  };

  return (
    <Animated.View style={[styles.contentView, { paddingBottom: bottom }]}>
      
        <ATouchableOpacity
          onPress={expandItems}
          style={[styles.button, expandButtonStyle]}
        >
          <Ionicons name="add-outline" size={28} color={theme.text} />
        </ATouchableOpacity>

        <Animated.View
          style={[styles.buttonView, buttonContainerStyle]}
        >
          <Pressable
            onPress={() => {
              collapseItems();
              console.log("Camera");
            }}
          >
            <Ionicons name="camera-outline" size={26} color={theme.text}/>
          </Pressable>
          <Pressable
            onPress={() => {
              collapseItems();
              console.log("Gallery");
            }}
          >
            <Ionicons name="image-outline" size={26} color={theme.text} />
          </Pressable>
          <Pressable
            onPress={() => {
              collapseItems();
              console.log("Document");
            }}
          >
            <Ionicons name="document-outline" size={26} color={theme.text} />
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.textAreaView, textAreaAnimatedStyle]}>
          <Animated.View style={inputContainerStyle}>
            <TextInput
              ref={inputRef}
              placeholder="Type your symptoms here..."
              placeholderTextColor={theme.text}
              multiline
              numberOfLines={3}
              onContentSizeChange={handleContentSizeChange}
              value={message}
              onChangeText={onChangeText}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              style={styles.messageInput}
            />
          </Animated.View>

          <Animated.View style={styles.bottomIcons}>
            <Pressable onPress={() => { }}>
              <Ionicons name="mic" size={26} color={theme.text}/>
            </Pressable>
        
            {!isSendDisabled && (
              <Ionicons
                name="send"
                size={26}
                disabled={isSendDisabled}
                color={theme.text}
                onPress={handleSend}
               
              />
            )}
          </Animated.View>
        </Animated.View>
    
    </Animated.View>
  );
};

export default MessageBar;
