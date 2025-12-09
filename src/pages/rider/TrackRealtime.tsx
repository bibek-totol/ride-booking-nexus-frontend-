"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { userApi } from "@/lib/api";
import { getSocket } from "@/lib/socketClient";
import { toast } from "sonner";
import { getAddressFromCoords } from "@/lib/geocode";

// Fix leaflet icon issue (if using the default icons)
(delete (L.Icon.Default as any).prototype._getIconUrl);
(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
});

const carIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/194/194933.png", // change as you like
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

interface Ride {
  _id: string;
  pickup: { lat: number; lng: number; address?: string };
  destination: { lat: number; lng: number; address?: string };
  driver?: { name?: string; email?: string };
  driverLocation?: { lat: number; lng: number };
  status?: string;
}

export default function TrackRealtime() {
  const socket = useMemo(() => getSocket(), []);
  const [activeRides, setActiveRides] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [driverPos, setDriverPos] = useState<{ lat: number; lng: number } | null>(null);
  const driverPosRef = useRef(driverPos);

  const playNotificationSound = () => {

  const audio = new Audio("/sounds/mixkit-happy-bells-notification-937.wav");

  audio.volume = 1.0; // optional: adjust volume 0.0 - 1.0
  audio.play().catch(() => {});
};


  // Keep ref in sync with state
  useEffect(() => {driverPos
    driverPosRef.current = driverPos;
  }, [driverPos]);

useEffect(() => {
  const interval = setInterval(async () => {
    const pos = driverPosRef.current;
    if (pos) {
      const address = await getAddressFromCoords(pos.lat.toString(), pos.lng.toString());

      toast.success(`Driver is at: ${address}`);
      playNotificationSound();
    }
  }, 1 * 60 * 1000);

  return () => clearInterval(interval);
}, []);


  
  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        const response: any = await userApi.getAcceptedRides();
        const rides = response?.data?.rides || [];
        setActiveRides(rides);
        if (rides.length > 0) {
          setSelectedRide(rides[0]);
          setDriverPos(rides[0]?.driverLocation || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  
  useEffect(() => {
    if (!selectedRide) return;

    const rideId = selectedRide._id;
    socket.emit("join_ride_room", rideId);

    const onLocationUpdate = (payload: { lat: number; lng: number; ts?: number }) => {
      setDriverPos({ lat: payload.lat, lng: payload.lng });

      
      setSelectedRide(prev => prev ? { ...prev, driverLocation: { lat: payload.lat, lng: payload.lng }} : prev);
    };

    socket.on("driver_location_update", onLocationUpdate);

    return () => {
      socket.off("driver_location_update", onLocationUpdate);
    };
  }, [selectedRide, socket]);

  const handleRideSelect = (rideId: string) => {
    const ride = activeRides.find(r => r._id === rideId) || null;
    setSelectedRide(ride);
    setDriverPos(ride?.driverLocation || null);
  };

  if (loading) return <DashboardLayout>Loading rides...</DashboardLayout>;
  if (!selectedRide) return <DashboardLayout>No active rides available.</DashboardLayout>;

  const ride = selectedRide;

  return (
    <DashboardLayout>
      <div className="space-y-6  relative z-30">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Track Your Ride</h2>
          <p className="text-muted-foreground">View pickup, destination, and driver live</p>
        </div>

        <Card className="shadow-lg bg-card/50 dark:bg-[#08010f]/50">
          <CardHeader><CardTitle>Select Active Ride</CardTitle></CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">Select a Ride</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {activeRides.map(r => (
                  <DropdownMenuItem key={r._id} onClick={() => handleRideSelect(r._id)}>
                    {r._id} — {r.pickup.address || "Ride"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-card/50 dark:bg-[#08010f]/50">
          <CardHeader><CardTitle>Ride Locations</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[500px] w-full ">
              <MapContainer
                center={[ride.pickup.lat, ride.pickup.lng]}
                zoom={13}
                scrollWheelZoom
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

                {driverPos && (
                  <Marker position={[driverPos.lat, driverPos.lng]} icon={carIcon}>
                    <Popup>
                      {ride.driver?.name} <br /> {ride.driver?.email}
                    </Popup>
                  </Marker>
                )}

                <Polyline positions={[
                  [ride.pickup.lat, ride.pickup.lng],
                  [ride.destination.lat, ride.destination.lng]
                ]} />
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
