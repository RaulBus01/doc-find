import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors, ThemeColors } from "@/constants/Colors";
import CustomSearchBar from "@/components/searchBar/searchBar";
import { TabBarVisibilityContext } from "@/context/TabBarContext";

import { useTheme } from "@/context/ThemeContext";
import { secureGetValueFor, secureSaveObject } from "@/utils/SecureStorage";
import { fetchNearbyPlaces } from "@/utils/MapsDetails";
import { GooglePlaceDetails, MapsTypes } from "@/interface/Interface";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import PlaceDetails from "@/components/PlaceDetails/PlaceDetails";
import PlaceDetailsBottomSheet from "@/components/modals/PlaceDetails";
import { Toast } from "toastify-react-native";
import { useTranslation } from "react-i18next";
import {
  OfflineIndicator,
  useOfflineStatus,
} from "@/components/OfflineIndicator";

export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const mapRef = useRef<MapView>(null);
  const [search, setSearch] = useState("");
  const { setIsTabBarVisible } = useContext(TabBarVisibilityContext);
  const [places, setPlaces] = useState<GooglePlaceDetails[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("doctor");
  const [isLoading, setIsLoading] = useState(false);
  const [lastRegion, setLastRegion] = useState<Region | null>(null);
  const { t } = useTranslation();
  const isOffline = useOfflineStatus();

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    await secureSaveObject("lastLocation", location);
    if (isOffline) {

      return;
    }
    fetchNearbyPlaces(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      } as Region,
      activeFilter
    )
      .then((places) => {
        setPlaces(places);
        setLocation(location);
        mapRef.current?.animateToRegion(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          2000
        );
      })
      .catch((error) => {
       
        Toast.show({
          type: "error",
          text1: t("toast.networkError")
        });

      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const getLastLocation = async () => {
    const lastLocation = await secureGetValueFor("lastLocation");
    if (lastLocation) {
      const parsedLocation = JSON.parse(
        lastLocation
      ) as Location.LocationObject;
      setLocation(parsedLocation);
      mapRef.current?.animateToRegion(
        {
          latitude: parsedLocation.coords.latitude,
          longitude: parsedLocation.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        },
        2000
      );
    }
  };

  const handleZoomIn = () => {
    mapRef.current?.getCamera().then((camera) => {
      if (camera.zoom) camera.zoom += 1;
      mapRef.current?.animateCamera(camera, { duration: 300 });
    });
  };

  const handleZoomOut = () => {
    mapRef.current?.getCamera().then((camera) => {
      if (camera.zoom) camera.zoom -= 1;
      mapRef.current?.animateCamera(camera, { duration: 300 });
    });
  };

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "info",
        text1: t("toast.info"),
        text2: t("locationPermissionDenied"),
      });

      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    mapRef.current?.animateToRegion(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      2000
    );
    await secureSaveObject("lastLocation", location);
  };
  const fetchPlacesInViewport = async (region: Region, type: string) => {
    if (isOffline) {
      return;
    }
    fetchNearbyPlaces(region, type)
      .then((places) => {
        setPlaces(places);
        setLastRegion(region);
      })
      .catch((error) => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    userLocation();
    if (!location) {
      getLastLocation();
    }
  }, []);
  const handleSearch = (text: string) => {
    setSearch(text);
  };
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback((place: GooglePlaceDetails) => {
    bottomSheetModalRef.current?.present(place);
  }, []);

  const hasChangedSignificantly = (region: Region) => {
    const result =
      lastRegion === null ||
      Math.abs(region.latitude - lastRegion.latitude) > 0.02 ||
      Math.abs(region.longitude - lastRegion.longitude) > 0.02 ||
      Math.abs(region.latitudeDelta - lastRegion.latitudeDelta) > 0.05 ||
      Math.abs(region.longitudeDelta - lastRegion.longitudeDelta) > 0.05;
    return result;
  };
  const getIconForType = (type: string) => {
    switch (type) {
      case "hospital":
        return (
          <MaterialCommunityIcons
            name="hospital-building"
            size={22}
            color={theme.text}
          />
        );
      case "pharmacy":
        return (
          <MaterialIcons name="local-pharmacy" size={22} color={theme.text} />
        );
      case "doctor":
        return <FontAwesome6 name="user-doctor" size={22} color={theme.text} />;
      default:
        return (
          <FontAwesome6 name="map-marker-alt" size={22} color={theme.text} />
        );
    }
  };
  const markerIcons: { [key: string]: any } = {
    hospital: require("@/assets/images/hospitalIcon.png"),
    pharmacy: require("@/assets/images/pharmacyIcon.png"),
    doctor: require("@/assets/images/doctorIcon.png"),
  };

  const handleLocationSelect = (coordinates: {
    latitude: number;
    longitude: number;
  }) => {
    if (isOffline) {
      return;
    }
    mapRef.current?.animateToRegion(
      {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );

    const newRegion = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    fetchPlacesInViewport(newRegion, activeFilter);
  };

  return (
    <View style={styles.container}>
      <MapView
        customMapStyle={mapStyle}
        style={[StyleSheet.absoluteFill, { zIndex: 0 }]}
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
        onTouchEnd={() => {
          setTimeout(() => setIsTabBarVisible(true), 100);
        }}
        onRegionChangeComplete={(region) => {
          if (hasChangedSignificantly(region)) {
            fetchPlacesInViewport(region, activeFilter);
          }
        }}
      >
        {places.map((place) => (
          <Marker
            key={place.place_id}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            onPress={() => handlePresentModalPress(place)}
            tracksViewChanges={false}
            icon={markerIcons[activeFilter]}
            style={{width: 300, height: 300}}
          ></Marker>
        ))}
      </MapView>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={getUserLocation}
        >
          <Ionicons name="locate-sharp" size={22} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.plusButton} onPress={handleZoomIn}>
          <Ionicons name="add" size={22} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.minusButton} onPress={handleZoomOut}>
          <Ionicons name="remove" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        {MapsTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={{
              backgroundColor:
                activeFilter === type
                  ? theme.progressColor
                  : theme.tabbarBackground,
              padding: 5,
              borderRadius: 10,
              marginBottom: 5,
            }}
            onPress={() => {
              setActiveFilter(type);
              fetchPlacesInViewport(
                lastRegion || {
                  latitude: location?.coords?.latitude || 46,
                  longitude: location?.coords?.longitude || 23,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
                type
              );
            }}
          >
            <View style={{ alignItems: "center" }}>{getIconForType(type)}</View>
          </TouchableOpacity>
        ))}
      </View>

      <CustomSearchBar
        onSearch={handleSearch}
        onLocationSelect={handleLocationSelect}
      />
      <OfflineIndicator
        style={{
          position: "absolute",
          backgroundColor: theme.red,
          borderRadius: 12,
          top: 100,
          left: 50,
          right: 50,
          width: "75%",
        }}
      />

      <PlaceDetailsBottomSheet ref={bottomSheetModalRef}>
        {({ data }) => (
          <BottomSheetScrollView style={{ padding: 20 }}>
            <PlaceDetails data={data} theme={theme} />
          </BottomSheetScrollView>
        )}
      </PlaceDetailsBottomSheet>
    </View>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    locationButton: {
      backgroundColor: theme.progressColor,
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
      backgroundColor: theme.textLight ? theme.textLight : theme.text,
      zIndex: 1,
      minWidth: 300,
      minHeight: 50,
      alignItems: "center",
      gap: 10,
      flexDirection: "row",
      color: "black",
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
    filterContainer: {
      position: "absolute",
      flexDirection: "column",
      justifyContent: "center",
      gap: 5,
      left: 5,
      top: 120,
      zIndex: 1,
    },
    markerButton: {
      padding: 5,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },

    plusButton: {
      backgroundColor: theme.tabbarBackground,
      padding: 10,
      borderRadius: 10,
      marginLeft: 10,
    },

    minusButton: {
      backgroundColor: theme.tabbarBackground,
      padding: 10,
      borderRadius: 10,
      marginLeft: 10,
    },
  });
const mapStyle = [
  {
    featureType: "poi",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
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
];
