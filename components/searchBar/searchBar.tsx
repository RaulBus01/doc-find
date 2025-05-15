import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  Keyboard,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { ThemeColors } from '@/constants/Colors';
import * as ExpoGooglePlaces from "expo-google-places";
import { secureGetValueFor } from '@/utils/SecureStorage';
import * as Location from "expo-location";

interface SearchBarProps {
  onSearch: (text: string) => void;
  placeholder?: string;
}


const CustomSearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search location..."
}) => {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const animatedWidth = new Animated.Value(1);
  const {theme} = useTheme();
  const styles = getStyles(theme);
  


  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(animatedWidth, {
      toValue: 1.02,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(animatedWidth, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const clearSearch = () => {
    setSearchText('');
    onSearch('');
    Keyboard.dismiss();
  };
  const fetchPredictions = async (search: string) => {
  try {
    const lastLocation =  await secureGetValueFor("lastLocation");
    const lastLocationParsed = JSON.parse(lastLocation!) as Location.LocationObject;

    const predictions = await ExpoGooglePlaces.fetchPredictionsWithSession(search, {
      origin: {
        latitude: lastLocationParsed?.coords.latitude || 45.75,
        longitude: lastLocationParsed?.coords.longitude || 21.22,
      },
      locationBias: {
        northEastBounds: {
          latitude: (lastLocationParsed?.coords.latitude || 45.75)+1,
          longitude: (lastLocationParsed?.coords.longitude || 21.22)+1,
        }
        ,
        southWestBounds: {
          latitude: (lastLocationParsed?.coords.latitude || 45.75)-1,
          longitude: (lastLocationParsed?.coords.longitude || 21.22)-1,
        }
        
      },
      types:["hospital","pharmacy","physiotherapist","dentist","doctor"],
    });
    predictions.forEach((prediction) => {
      console.log("Prediction: ", prediction);
    });

  } catch (error) {
    console.log("Error fetching predictions", error);
  }
};
  

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ scale: animatedWidth }],
          shadowOpacity: isFocused ? 0.3 : 0.2,
        }
      ]}
    >
      <View style={styles.searchIcon}>
        <Ionicons name="search" size={20} color={theme.textLight ? theme.textLight : theme.text} />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.textLight ? theme.textLight : theme.text}
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          fetchPredictions(text);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
     
      {searchText.length > 0 && (
        <Pressable 
          style={styles.clearButton}
          onPress={clearSearch}
        >
          <Ionicons name="close-circle" size={20} color={theme.text} />
        </Pressable>
      )}
    </Animated.View>
  );
};

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left:50,
    right: 50,
    width: '75%',
    height: 50,
    backgroundColor: theme.tabbarBackground,
    borderRadius: 12,
    flexDirection: 'row',
    color: theme.text,
    alignItems: 'center',
    zIndex: 1,
  },
  searchIcon: {
    paddingLeft: 15,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 15,
  },
});

export default CustomSearchBar;