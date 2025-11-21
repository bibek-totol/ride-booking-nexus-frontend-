import { riderApi } from "./api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';


export async function getAddressFromCoords(lat: string, lng: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/reverse-geocode?lat=${lat}&lng=${lng}`
    );

    const data = await response.json();
    console.log("Reverse geocode data:", data);
    return data.address || "Unknown location";
  } catch (error) {
    return "Unknown location";
  }
}




export async function getCoordsFromAddress(address: string) {
  try {
   


    const response = await riderApi.getCoords(address);

    
    console.log("Geocode data:", response.data);
    const data = response.data;
    

    if (Array.isArray(data) && data.length > 0) {
      return { lat: data[0].lat, lng: data[0].lon, display_name: data[0].display_name };
    } else {
      return { lat: "", lng: "" };
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return { lat: "", lng: "" };
  }
}
