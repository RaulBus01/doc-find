import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  Keyboard,

  Text,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { ThemeColors } from '@/constants/Colors';
import * as ExpoGooglePlaces from "expo-google-places";
import { secureGetValueFor } from '@/utils/SecureStorage';
import * as Location from "expo-location";
import { FlashList } from '@shopify/flash-list';

interface SearchBarProps {
  onSearch: (text: string) => void;
  placeholder?: string;
  onLocationSelect?: (coordinates: { latitude: number; longitude: number }) => void;
}

const CustomSearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onLocationSelect,
  placeholder = "Search location..."
}) => {
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);

  const {theme} = useTheme();
  const styles = getStyles(theme);

  const clearSearch = () => {
    setSearchText('');
    setPredictions([]);
    setShowPredictions(false);
    onSearch('');
    Keyboard.dismiss();
  };

  const fetchPredictions = async (search: string) => {
    if (search.length < 2) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    try {
      const lastLocation = await secureGetValueFor("lastLocation");
      const lastLocationParsed = JSON.parse(lastLocation!) as Location.LocationObject;

      const predictions = await ExpoGooglePlaces.fetchPredictionsWithSession(search, {
        origin: {
          latitude: (lastLocationParsed?.coords.latitude || 45.75),
          longitude: (lastLocationParsed?.coords.longitude || 21.22),
        },
        locationBias: {
          northEastBounds: {
            latitude: (lastLocationParsed?.coords.latitude || 45.75),
            longitude: (lastLocationParsed?.coords.longitude || 21.22),
          },
          southWestBounds: {
            latitude: (lastLocationParsed?.coords.latitude || 45.75),
            longitude: (lastLocationParsed?.coords.longitude || 21.22),
          }
        },
      });
      
      setPredictions(predictions);
      setShowPredictions(predictions.length > 0);
    } catch (error) {
    
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const selectPrediction = async (prediction:ExpoGooglePlaces.AutocompletePrediction) => {

    setSearchText(prediction.primaryText);
    setPredictions([]);
    setShowPredictions(false);
    onSearch(prediction.primaryText);
    Keyboard.dismiss();


    if (prediction.placeID && onLocationSelect) {
      try {
       
        const placeDetails = await ExpoGooglePlaces.fetchPlaceWithSession(prediction.placeID);

        
        if (placeDetails.coordinate) {
          onLocationSelect({
            latitude: placeDetails.coordinate.latitude,
            longitude: placeDetails.coordinate.longitude
          });
        }
      } catch (error) {
      
      }
    }
  };

  const renderPredictionItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.predictionItem}
      onPress={() => selectPrediction(item)}
    >
      <Ionicons name="location-outline" size={16} color={theme.text} style={styles.predictionIcon} />
      <View style={styles.predictionTextContainer}>
        <Text style={styles.predictionPrimaryText}>
          {item.primaryText || item.description}
        </Text>
        {item.secondaryText && (
          <Text style={styles.predictionSecondaryText}>
            {item.secondaryText}
          </Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.searchIcon}>
          <Ionicons name="search" size={20} color={theme.text} />
        </View>
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.text}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            fetchPredictions(text);
          }}
        />
       
        {searchText.length > 0 && (
          <Pressable 
            style={styles.clearButton}
            onPress={clearSearch}
          >
            <Ionicons name="close-circle" size={20} color={theme.text} />
          </Pressable>
        )}
      </View>

      {showPredictions && (
        <View style={styles.predictionsContainer}>
          <FlashList
            data={predictions}
            renderItem={renderPredictionItem}
            keyExtractor={(item, index) => `${item.placeId || index}`}
            style={styles.predictionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            
          />
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 50,
    left: 50,
    right: 50,
    width: '75%',
    zIndex: 1,
  },
  container: {
    height: 50,
    backgroundColor: theme.tabbarBackground,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  predictionsContainer: {
    backgroundColor: theme.tabbarBackground,
    borderRadius: 12,
    marginTop: 5,
    maxHeight: 200,

    elevation: 5,
  },
  predictionsList: {
    maxHeight: 200,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.text + '20',
  },
  predictionIcon: {
    marginRight: 10,
  },
  predictionTextContainer: {
    flex: 1,
  },
  predictionPrimaryText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '500',
  },
  predictionSecondaryText: {
    color: theme.text + '80',
    fontSize: 14,
    marginTop: 2,
  },
});

export default CustomSearchBar;