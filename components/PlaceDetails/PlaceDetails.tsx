import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from "react-native";
import { GooglePlaceDetails } from "@/interface/Interface";
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { ThemeColors } from "@/constants/Colors";
import { fetchPlaceDetails } from "@/utils/MapsDetails";
import { Toast } from "toastify-react-native";
import { useTranslation } from "react-i18next";
import { useOfflineStatus } from "../OfflineIndicator";
import * as Clipboard from "expo-clipboard";


const PlaceDetails = ({
  theme,
  data,
}: {
  theme: ThemeColors;
  data?: GooglePlaceDetails;
}) => {
  const styles = getStyles(theme);
  const [completeDetails, setCompleteDetails] = useState<GooglePlaceDetails | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const {t} = useTranslation();
  const isOffline = useOfflineStatus();
  const getPlaceDetails = async (placeId: string) => {
    if (isOffline) {
      return;
    }
    try{
    const result = await fetchPlaceDetails(placeId);
    if (result) {
      setCompleteDetails(result);
    } else {

      Toast.show({
        type: "error",
        text1: t('toast.error'),
        text2: t("placeDetails.failedToFetchDetails"),
      });
    }
    }
    catch (error) {
    
      Toast.show({
        type: "error",
        text1: t('toast.error'),
        text2: t("placeDetails.failedToFetchDetails"),
      });
    }
  };
  
  useEffect(() => {
    if (data?.place_id) {
      getPlaceDetails(data.place_id);
    }
  }, [data?.place_id]);
  

  const displayData = completeDetails || data;
  
  const renderStars = (rating = 0) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
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
        stars.push(
          <FontAwesome 
            key={i} 
            name="star-half" 
            size={16} 
            color={theme.progressColor} 
            style={{ marginRight: 2 }}
          />
        );
      } else {
        stars.push(
          <FontAwesome 
            key={i} 
            name="star-o" 
            size={16} 
            color={theme.progressColor} 
            style={{ marginRight: 2 }}
          />
        );
      }
    }
    
    return stars;
  };
  
  const getStatusColor = () => {

    if (displayData?.current_opening_hours) {
      return displayData.current_opening_hours.open_now ? theme.progressColor : theme.red;
    }

    if (displayData?.opening_hours) {
      return displayData.opening_hours.open_now ? theme.progressColor : theme.red;
    }

    if(displayData?.business_status){
      return displayData.business_status === "OPERATIONAL" ? theme.progressColor : theme.red; 
    }
    return theme.textLight ? theme.textLight : theme.text; 
  };

  const getStatusText = () => {
    if( displayData?.current_opening_hours) {
      return displayData.current_opening_hours.open_now ? t("placeDetails.openNow") : t("placeDetails.closedNow");
    }
    if (displayData?.opening_hours) {
      return displayData.opening_hours.open_now ? t("placeDetails.openNow") : t("placeDetails.closedNow");
    }
    if (displayData?.business_status) {
      return displayData.business_status === "OPERATIONAL" ? t("placeDetails.operational") : t("placeDetails.closed");
    }
    return t("placeDetails.statusUnknown");
  }

  const openMaps = () => {
    const { lat, lng } = displayData!.geometry.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };
  
  const openUrl = (url: string) => {
    if (url) Linking.openURL(url);
  };
  
  const makePhoneCall = (phone: string) => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };
  
  
  const getOpeningHours = () => {
    return displayData?.current_opening_hours?.weekday_text || 
           displayData?.opening_hours?.weekday_text || 
           [];
  };
   const handleCopyName = async () => {
    if (displayData?.name) {
      await Clipboard.setStringAsync(displayData.name);
      
    }
  }
  const handleCopyAddress = async () => {
    const address = displayData?.formatted_address || displayData?.vicinity || "";
    if (address) {
      await Clipboard.setStringAsync(address);
    }
  }

  
  return (
    <View style={[styles.container]}>
      {/* Header Section */}
      <View style={styles.placeHeader}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 10}} onPress={handleCopyName}>
        <Text style={styles.placeName}>{displayData?.name}</Text>
        <Ionicons name="clipboard-outline" size={24} color={theme.text}  />
        </TouchableOpacity>
        
        {/* Rating Section */}
        <View style={styles.ratingContainer}>
          {renderStars(displayData?.rating || 0)}
          <Text style={styles.ratingText}>
            {displayData?.rating ? displayData.rating.toFixed(1) : '0.0'} 
            ({displayData?.user_ratings_total || 0})
          </Text>
        </View>
      </View>

      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>
          {
            getStatusText()
          }
        </Text>
      </View>

      {/* Main Info Section */}
      <View style={styles.infoSection}>
        {/* Address */}
        <TouchableOpacity style={styles.infoRow} onPress={handleCopyAddress}>
          <FontAwesome6 name="location-dot" size={22} color={theme.progressColor} />
          <Text style={styles.infoText}>
            {displayData?.formatted_address || displayData?.vicinity || t("placeDetails.addressNotAvailable")}
          </Text>
        </TouchableOpacity>

        {/* Phone Number */}
        {(displayData?.formatted_phone_number || displayData?.international_phone_number) && (
          <TouchableOpacity 
            style={styles.infoRow} 
            onPress={() => makePhoneCall(displayData?.formatted_phone_number || displayData?.international_phone_number || "")}
          >
            <FontAwesome6 name="phone" size={22} color={theme.progressColor} />
            <Text style={[styles.infoText, styles.linkText]}>
              {displayData?.formatted_phone_number || displayData?.international_phone_number}
            </Text>
          </TouchableOpacity>
        )}

        {/* Categories */}
        <View style={styles.infoRow}>
          <FontAwesome6 name="hand-holding-medical" size={22} color={theme.progressColor}/>
          <Text style={styles.infoText}>
            {(() => {
                const types = displayData?.types
                ?.filter(t => t !== "point_of_interest" && t !== "establishment")
                .map(t => t.charAt(0).toUpperCase() + t.slice(1))
                .join(", ") || t("placeDetails.noCategories");
              return types.charAt(0).toUpperCase() + types.slice(1);
            })()}
          </Text>
        </View>

        {/* Wheelchair Access */}
        {displayData?.wheelchair_accessible_entrance !== undefined && (
          <View style={styles.infoRow}>
            <FontAwesome6 name="wheelchair" size={22} color={theme.progressColor} />
            <Text style={styles.infoText}>
              {displayData.wheelchair_accessible_entrance ? 
                t("placeDetails.wheelchairAccessible") : 
                t("placeDetails.notWheelchairAccessible")}
            </Text>
          </View>
        )}

        {/* Website Link - Use website field first, url as fallback */}
        {(displayData?.website || displayData?.url) && (
          <TouchableOpacity 
            style={styles.infoRow} 
            onPress={() => openUrl(displayData?.website || displayData?.url || "")}
          >
            <FontAwesome6 name="globe" size={22} color={theme.progressColor} />
            <Text style={[styles.infoText, styles.linkText]}>
              {displayData?.website ? t('placeDetails.website') : t('placeDetails.viewMaps')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Opening Hours Section */}
      {getOpeningHours().length > 0 && (
        <View style={styles.infoSection}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => setShowHours(!showHours)}
          >
            <View style={styles.sectionHeaderContent}>
              <FontAwesome5 name="clock" size={20} color={theme.progressColor} />
              <Text style={styles.sectionTitle}>{t('placeDetails.openingHours')}</Text>
            </View>
            <FontAwesome6 
              name={showHours ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={theme.text} 
            />
          </TouchableOpacity>
          
          {showHours && (
            <View style={styles.hoursList}>
              {getOpeningHours().map((dayHours, index) => (
                <View key={index} style={styles.hoursRow}>
                  <Text style={[
                    styles.dayText, 
                    dayHours.includes(new Date().toLocaleDateString(t('date'),{weekday: 'long'})) 
                      ? {color: theme.progressColor, fontWeight: '700'} 
                      : {}
                  ]}>
                    {dayHours.split(': ')[0]}:
                  </Text>
                  <Text style={styles.hoursText}>{dayHours.split(': ')[1]}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.LightBlueIconBackground }]}
          onPress={openMaps}
        >
          <FontAwesome5 name="directions" size={22} color={theme.text} />
          <Text style={styles.actionButtonText}>{t('placeDetails.directions')}</Text>
        </TouchableOpacity>
        
        {displayData?.formatted_phone_number && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.progressColor}]}
            onPress={() => makePhoneCall(displayData?.formatted_phone_number || "")}
          >
            <FontAwesome name="phone" size={22} color={theme.text} />
            <Text style={styles.actionButtonText}>{t('placeDetails.call')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Reviews Section */}
      {displayData?.reviews && displayData.reviews.length > 0 && (
        <View style={styles.reviewsContainer}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => setShowReviews(!showReviews)}
          >
            <View style={styles.sectionHeaderContent}>
              <FontAwesome name="comment" size={20} color={theme.progressColor} />
              <Text style={styles.sectionTitle}>{t('placeDetails.reviews')} ({displayData.reviews.length})</Text>
            </View>
            <FontAwesome6 
              name={showReviews ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={theme.text} 
            />
          </TouchableOpacity>
          
          {showReviews && (
            <View style={styles.reviewsList}>
              {displayData.reviews.map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAuthorContainer}>
                      {review.profile_photo_url && (
                        <Image 
                          source={{ uri: review.profile_photo_url }} 
                          style={styles.reviewAuthorImage} 
                        />
                      )}
                      <Text style={styles.reviewAuthor}>{review.author_name}</Text>
                    </View>
                    <View style={styles.reviewRating}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                  <Text style={styles.reviewTime}>{review.relative_time_description}</Text>
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 20,
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
      color: theme.text,
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
      backgroundColor: theme.backgroundDark || theme.background,
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
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
    linkText: {
      color: theme.progressColor,
      textDecorationLine: 'underline',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 8,
    },
    sectionHeaderContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 10,
    },
    hoursList: {
      marginTop: 10,
    },
    hoursRow: {
      flexDirection: 'row',
      marginBottom: 6,
    },
    dayText: {
      width: 100,
      fontSize: 14,
      color: theme.text,
      fontWeight: '500',
    },
    hoursText: {
      fontSize: 14,
      color: theme.text,
      flex: 1,
    },
    reviewsContainer: {
      backgroundColor: theme.backgroundDark || theme.background,
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
    },
    reviewsList: {
      marginTop: 10,
    },
    reviewItem: {
      marginBottom: 15,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.separator,
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    reviewAuthorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reviewAuthorImage: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 8,
    },
    reviewAuthor: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    reviewRating: {
      flexDirection: 'row',
    },
    reviewTime: {
      fontSize: 12,
      color: theme.text,
      marginBottom: 5,
    },
    reviewText: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
    },
    actionButtons: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    actionButton: {
      
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginHorizontal: 5,
      borderRadius: 12,
      gap: 10,
      flex: 1,
    },
    actionButtonText: {
      color: theme.text,
      fontWeight: "600",
      marginLeft: 8,
    },
  });

export default PlaceDetails;