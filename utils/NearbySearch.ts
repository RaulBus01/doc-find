
import { Region } from 'react-native-maps'
import Constants from "expo-constants";


async function fetchNearbyPlaces(region:Region,type:string = "doctor") {

  const {latitude, longitude,latitudeDelta } =region;
  const radius = Math.round(Math.max(latitudeDelta, region.longitudeDelta) * 111000 / 2);
  const API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;
 
  const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&radius=' + radius + '&type=' + type + '&key=' + API_KEY;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    throw error;
    }
}
  
 export { fetchNearbyPlaces };