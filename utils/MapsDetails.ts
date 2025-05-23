
import { Region } from 'react-native-maps'
import Constants from "expo-constants";
const API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

async function fetchNearbyPlaces(region:Region,type:string = "doctor") {

  const {latitude, longitude,latitudeDelta } =region;
  const radius = Math.round(Math.max(latitudeDelta, region.longitudeDelta) * 111000 / 2);

 
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
async function fetchPlaceDetails(placeId: string) {
 
  const request ={
    placeId: placeId,
  }
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${request.placeId}&key=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
}




  
 export { fetchNearbyPlaces, fetchPlaceDetails };