import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { userApi } from "@/lib/api";

// Fix Leaflet icon issue
(delete (L.Icon.Default as any).prototype._getIconUrl);
(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
});

// Driver icon
const carIcon = L.icon({
  iconUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA95APG4XyNdqb5XzmYTHbsgLJf-uETvVP2X9UkpSqlGPFPcje8hmBRBI&s",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

export default function TrackRealtime() {
  const [activeRides, setActiveRides] = useState<any[]>([]);
  const [selectedRide, setSelectedRide] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch active rides on mount
  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      const response: any = await userApi.getAcceptedRides();
      console.log("Accepted rides response:", response);
      const rides = response?.data?.rides;
      if (Array.isArray(rides) && rides.length > 0) {
        setActiveRides(rides);
        setSelectedRide(rides[0]); 
      }
      setLoading(false);
    };
    fetchRides();
  }, []);

  const handleRideSelect = (rideId: string) => {
    const ride = activeRides.find((r) => r._id === rideId);
    if (ride) setSelectedRide(ride);
  };

  if (loading) return <DashboardLayout>Loading rides...</DashboardLayout>;
  if (!selectedRide) return <DashboardLayout>No active rides available.</DashboardLayout>;

  const ride = selectedRide;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Track Your Ride</h2>
          <p className="text-muted-foreground">View pickup, destination, and driver live</p>
        </div>

        
        <Card className="shadow-lg bg-card/50 dark:bg-[#08010f]/50">
          <CardHeader>
            <CardTitle>Select Active Ride</CardTitle>
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  {"Select a Ride!!"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {activeRides.map((r) => (
                  <React.Fragment key={r._id}>
                    <DropdownMenuItem onClick={() => handleRideSelect(r._id)}>
                      {r._id} — {"Rider Name: " + r.rider.name}
                    </DropdownMenuItem>
                    <hr />
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        
        <Card className="shadow-lg bg-card/50 dark:bg-[#08010f]/50">
          <CardHeader>
            <CardTitle>Ride Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Status: <span className="font-semibold">{ride.status}</span>
            </p>
          </CardContent>
        </Card>

        
        <Card className="shadow-lg bg-card/50 dark:bg-[#08010f]/50">
          <CardHeader>
            <CardTitle>Ride Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full">
              <MapContainer
                center={[ride.pickup.lat, ride.pickup.lng]}
                zoom={14}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                
                <Marker position={[ride.pickup.lat, ride.pickup.lng]}>
                  <Popup>{ride.pickup.address}</Popup>
                </Marker>

                
                <Marker position={[ride.destination.lat, ride.destination.lng]}>
                  <Popup>{ride.destination.address}</Popup>
                </Marker>

                
                <Marker position={[ride.driverLocation.lat, ride.driverLocation.lng]} icon={carIcon}>
                  <Popup>
                    {ride.driver.name} <br /> {ride.driver.email}
                  </Popup>
                </Marker>

                
                <Polyline
                  positions={[
                    [ride.pickup.lat, ride.pickup.lng],
                    [ride.destination.lat, ride.destination.lng],
                  ]}
                  color="blue"
                />
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
