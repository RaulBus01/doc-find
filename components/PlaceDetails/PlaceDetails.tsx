import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { GooglePlaceDetails } from "@/interface/Interface";
import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { ThemeColors } from "@/constants/Colors";

const PlaceDetails = ({
  data,
  theme,
}: {
  data: GooglePlaceDetails;
  theme: ThemeColors;
}) => {
  const styles = getStyles(theme);
  
  // Function to render appropriate star icon based on rating
  const renderStars = () => {
    const rating = data?.rating || 0;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        // Full star
        stars.push(
          <FontAwesome 
            key={i} 
            name="star" 
            size={16} 
            color={theme.progressColor} 
            style={{ marginRight: 2 }}
          />
        );
      } else if (rating >= i - 0.5) {
        // Half star
        stars.push(
          <FontAwesome 
            key={i} 
            name="star-half" 
            size={16} 
            color={theme.progressColor} 
            style={{ marginRight: 5 }}
          />
        );
      } else {
        // Empty star
        stars.push(
          <FontAwesome 
            key={i} 
            name="star-o" 
            size={16} 
            color={theme.text} 
            style={{ marginRight: 2 }}
          />
        );
      }
    }
    
    return stars;
  };
  const getStatusColor = () => {
    if (data?.opening_hours) {
      return data.opening_hours.open_now ? theme.progressColor : theme.red;// Open or Closed
    }
    if(data?.business_status){
      return data.business_status === "OPERATIONAL" ? theme.progressColor : theme.red; // Operational or Not Operational
    }
    return theme.textLight || "#888888"; // Default color if no opening hours
  }
  
  return (
    <View style={[styles.container]}>
      <View style={styles.placeHeader}>
        <Text style={styles.placeName}>{data?.name}</Text>
        <View style={styles.ratingContainer}>
          {renderStars()}
          <Text style={styles.ratingText}>
            {data?.rating ? data.rating.toFixed(1) : '0.0'} ({data?.user_ratings_total || 0})
          </Text>
        </View>
      </View>

      <View style={[styles.statusBadge,{ backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>
          {data?.opening_hours ? (data.opening_hours.open_now ? "Open Now" : "Closed") : data?.business_status || "Unknown"}
           
        </Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <FontAwesome6
            name="location-dot"
            size={18}
            color={theme.progressColor}
          />
          <Text style={styles.infoText}>{data?.vicinity}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons
            name="category"
            size={18}
            color={theme.progressColor}
          />
          <Text style={styles.infoText}>
            {data?.types
              ?.filter(
                (t: string) =>
                  t !== "point_of_interest" && t !== "establishment"
              )
              .join(", ")}
          </Text>
        </View>

        {data?.plus_code && (
          <View style={styles.infoRow}>
            <FontAwesome6
              name="map-pin"
              size={18}
              color={theme.progressColor}
            />
            <Text style={styles.infoText}>{data?.plus_code.compound_code}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.progressColor },
          ]}
          onPress={() => {
            /* Handle navigation */
          }}
        >
          <FontAwesome6 name="directions" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.tabbarBackground },
          ]}
          onPress={() => {
            /* Handle saving */
          }}
        >
          <FontAwesome6 name="bookmark" size={18} color={theme.text} />
          <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    placeHeader: {
      marginBottom: 15,
    },
    placeName: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 5,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5,
    },
    ratingText: {
      fontSize: 14,
      color: theme.textLight || "#888888",
      marginLeft: 5,
    },
    statusBadge: {
      backgroundColor: theme.progressColor,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
      alignSelf: "flex-start",
      marginBottom: 15,
    },
    statusText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
    infoSection: {
      backgroundColor: theme.backgroundDark,
      borderRadius: 12,
      padding: 15,
      marginBottom: 20,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    infoText: {
      marginLeft: 10,
      fontSize: 14,
      color: theme.text,
      flex: 1,
    },
    actionButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      flex: 0.48,
    },
    actionButtonText: {
      color: "#FFFFFF",
      fontWeight: "600",
      marginLeft: 8,
    },
  });

export default PlaceDetails;
