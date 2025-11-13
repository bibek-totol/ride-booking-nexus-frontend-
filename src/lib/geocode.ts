import { riderApi } from "./api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
export async function getAddressFromCoords(lat: string, lng: string): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();

    if (data && data.display_name) {
      return data.display_name;
    } else {
      return "Unknown location";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Unable to fetch address";
  }
}




export async function getCoordsFromAddress(address: string) {
  try {
   


    const response = await riderApi.getCoords(address);

    // const data = await response.json();
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
