import React, {useRef} from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChatMessageBarStyle from "./ChatMessageBarStyle";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";


const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type Props = {
  onModalPress: () => void;
  onMessageSend: (message: string) => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

const MessageBar = ({ onModalPress, onMessageSend, message, setMessage }: Props) => {
  const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(0);
  const inputRef = useRef<TextInput>(null);

  const expandItems = () => {
    expanded.value = withTiming(1, { duration: 400 });
  }

  const collapseItems = () => {
    expanded.value = withTiming(0, { duration: 400 });
  }

  const expandButtonStyle = useAnimatedStyle(() => {
     const opacity = interpolate(expanded.value, [0, 1], [1,0],Extrapolation.CLAMP);
     const width = interpolate(expanded.value, [0, 1], [30, 0],Extrapolation.CLAMP);

      return {
        opacity,
        width,
      }
  }
  );

  const buttonContainerStyle = useAnimatedStyle(() => {
    const width = interpolate(expanded.value, [0, 1], [0, 100],Extrapolation.CLAMP);

    return {
      width,
      opacity: expanded.value
    }
  }
  );




  const onChangeText = (text: string) => {
    collapseItems();
    setMessage(text);

  }

  const onSend = () => {
    onMessageSend(message);
    setMessage("");
  }

  const onPress = () => {
    collapseItems();
    onModalPress();
  }




  

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
    
    }
  };

  return (
    <View style={[ChatMessageBarStyle.contentView, { paddingBottom: bottom }]}>
      <View style={ChatMessageBarStyle.row}>
       
        <ATouchableOpacity
          onPress={expandItems}
          style={[ChatMessageBarStyle.button,expandButtonStyle]}
        >
          <Ionicons name="add-outline" size={28} color="black" />
        </ATouchableOpacity>

        <Animated.View style={[ChatMessageBarStyle.buttonView,buttonContainerStyle]}>
          <TouchableOpacity onPress={() =>{
            collapseItems();
            console.log('Camera');}}
            >
            <Ionicons name="camera-outline" size={26} />
            </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            collapseItems();
            console.log('Gallery');}
            }>
            <Ionicons name="image-outline" size={26} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            collapseItems();
            console.log('Document');}
            }>
            <Ionicons name="document-outline" size={26} />

          </TouchableOpacity>
        </Animated.View>




      
      
      <View style={ChatMessageBarStyle.textAreaView}>
       
        <TextInput
          autoFocus
          ref={inputRef}
          placeholder="Type your symptoms here..."
          placeholderTextColor="#333"
          multiline
          numberOfLines={3}
          onContentSizeChange={handleContentSizeChange}
          value={message}
          onChangeText={onChangeText}
          onFocus={collapseItems}
          style={ChatMessageBarStyle.messageInput}
        />
        
        {message.trim().length > 0 ? (
           numberOfLines > 3 ?  (
            <View style={ChatMessageBarStyle.textAreaButtonView}>
            <TouchableOpacity onPress={onPress}>
            <Ionicons name="expand-outline" size={26} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={()=> setMessage("")}>
            <Ionicons name="close" size={26}  />
          </TouchableOpacity>
          </View>
        ) :
        <TouchableOpacity onPress={()=> setMessage("")}>
            <Ionicons name="close" size={26} />
          </TouchableOpacity>
     
        ) :
          <TouchableOpacity onPress={() => handleSend()}>
          <Ionicons name="mic" size={26}  />
        </TouchableOpacity>
      }
      </View>
      <View >
        {message.trim().length > 0 ? (
          <TouchableOpacity onPress={() => handleSend()}>
            <Ionicons name="send" size={26} />
          </TouchableOpacity>
        ) : 
        <TouchableOpacity onPress={() => console.log('Voice')}>
          <Ionicons name="headset" size={26} />
        </TouchableOpacity>  
        }
       
      </View>
      </View>
     
    </View>
  );
};

export default MessageBar;
