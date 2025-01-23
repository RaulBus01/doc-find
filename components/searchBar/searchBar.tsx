import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

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
        <Ionicons name="search" size={20} color={Colors.light.text} />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.text + '80'}
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          onSearch(text);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      
      {searchText.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearSearch}
        >
          <Ionicons name="close-circle" size={20} color={Colors.light.text} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: Colors.light.textlight,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1,
  },
  searchIcon: {
    paddingLeft: 15,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 15,
  },
});

export default CustomSearchBar;