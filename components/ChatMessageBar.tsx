import React, { useRef } from "react";
import { View, TextInput, StyleSheet, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChatMessageBarStyle from "./ChatMessageBarStyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
  withTiming,
} from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

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
    <Animated.View style={[ChatMessageBarStyle.contentView, { paddingBottom: bottom }]}>
      
        <ATouchableOpacity
          onPress={expandItems}
          style={[ChatMessageBarStyle.button, expandButtonStyle]}
        >
          <Ionicons name="add-outline" size={28} color="black" />
        </ATouchableOpacity>

        <Animated.View
          style={[ChatMessageBarStyle.buttonView, buttonContainerStyle]}
        >
          <TouchableOpacity
            onPress={() => {
              collapseItems();
              console.log("Camera");
            }}
          >
            <Ionicons name="camera-outline" size={26} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              collapseItems();
              console.log("Gallery");
            }}
          >
            <Ionicons name="image-outline" size={26} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              collapseItems();
              console.log("Document");
            }}
          >
            <Ionicons name="document-outline" size={26} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[ChatMessageBarStyle.textAreaView, textAreaAnimatedStyle]}>
          <Animated.View style={inputContainerStyle}>
            <TextInput
              ref={inputRef}
              placeholder="Type your symptoms here..."
              placeholderTextColor="#333"
              multiline
              numberOfLines={3}
              onContentSizeChange={handleContentSizeChange}
              value={message}
              onChangeText={onChangeText}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              style={ChatMessageBarStyle.messageInput}
            />
          </Animated.View>

          <Animated.View style={ChatMessageBarStyle.bottomIcons}>
            <TouchableOpacity onPress={() => { }}>
              <Ionicons name="mic" size={26} />
            </TouchableOpacity>
        
              <Ionicons
                name="send"
                size={26}
                disabled={isSendDisabled}
                onPress={handleSend}
                color={isSendDisabled ? "#ccc" : "black"}
              />
            
          </Animated.View>
        </Animated.View>
    
    </Animated.View>
  );
};

export default MessageBar;
