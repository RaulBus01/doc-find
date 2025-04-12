import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Touchable,
  TouchableOpacity,
} from "react-native";
import MapView, { Camera, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, ThemeColors } from "@/constants/Colors";
import { TextInput } from "react-native";
import CustomSearchBar from "@/components/searchBar/searchBar";
import { TabBarVisibilityContext } from "@/context/TabBarContext";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { on } from "events";
import { ComposedGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/gestureComposition";
import { useTheme } from "@/context/ThemeContext";


export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const { setIsTabBarVisible } = useContext(TabBarVisibilityContext); // Consume context
  
  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
  };

  const handleZoomIn = () => {
    mapRef.current?.getCamera().then((camera) => {
      if(camera.zoom )
      camera.zoom += 1;
      mapRef.current?.animateCamera(camera, { duration: 300 });
    });
  };

  const handleZoomOut = () => {
    mapRef.current?.getCamera().then((camera) => {
      if(camera.zoom )
      camera.zoom -= 1;
      mapRef.current?.animateCamera(camera, { duration: 300 });
    });
  };

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
      
    },2000
  );
  };

  useEffect(() => {
    userLocation();
  }, []);
  const handleSearch = (text: string) => {
    setSearch(text);

  
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
      <TouchableOpacity style={styles.locationButton} onPress={getUserLocation}>
        <Ionicons name="locate-sharp" size={22} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.plusButton} onPress={handleZoomIn}>
        <Ionicons name="add" size={22} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.minusButton} onPress={handleZoomOut}>
        <Ionicons name="remove" size={22} color="black" />
      </TouchableOpacity>
      </View>


      <CustomSearchBar onSearch={handleSearch} />
      
      <MapView
        customMapStyle={mapStyle}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        zoomControlEnabled={false}
        initialRegion={{
          latitude: location?.coords?.latitude || 46,
          longitude: location?.coords?.longitude || 23,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        ref={mapRef}
        onPanDrag={() => setIsTabBarVisible(false)}
        // onRegionChangeComplete={() => setIsTabBarVisible(true)}
       
        onTouchEnd={() => {
          setTimeout(() => setIsTabBarVisible(true), 100);
        }}


       
      />
     
    </View>
 
  );
}

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  locationButton: {
    backgroundColor: theme.lightgreen,
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  searchBar: { 
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    borderRadius: 10,
    padding: 10,
    backgroundColor: theme.textlight,
    zIndex: 1,
    minWidth: 300,
    minHeight: 50,
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    color:"black"

  },
  buttonsContainer: {
    position: "absolute",
    flexDirection: "column",
    justifyContent: "center",
    gap: 5,
    bottom: 55,
    right: 5,
    zIndex: 1,
  },
  plusButton: {
    backgroundColor: theme.lightgreen,
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  minusButton: {
    backgroundColor: theme.lightgreen,
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  
});
const mapStyle = 
  [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#f8f8e2",
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#66757F",
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#FFFFFF",
        },
      ],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#66757F",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#8c8c71",
        },
      ],
    },
    
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#5baf5d",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#6b9a76",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#FFFFFF",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#f8f8e2",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9ca5b3",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#746855",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#b9bf7c",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#475054",
        },
      ],
    },
    
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#b9d3e0",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#515c6d",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        {
          color: "#d6d6b9",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#677177",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          color: "#e8e8d2",
        },
      ],
    },
    {
      featureType: "poi.business",
      elementType: "geometry",
      stylers: [
        {
          color: "#d6d6b9",
        },
      ],
    },
    {
      featureType: "poi.school",
      elementType: "geometry",
      stylers: [
        {
          color: "#e0d5b3",
        },
      ],
    },
    {
      featureType: "administrative.neighborhood",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#555555",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#666666",
        },
      ],
    },
    {
      featureType: "poi.medical",
      elementType: "geometry",
      stylers: [
        {
          color: "#f0e6e6",
        },
      ],
    },
    {
      featureType: "poi.medical",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#f23a52",
        },
      ],
    }
  ];