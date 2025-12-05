"use client";

import React, { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { driverApi, userApi } from "@/lib/api";
import { toast } from "sonner";
import { MapPin, Check, X, Loader2, Clock, Navigation, DollarSign } from "lucide-react";
import { getAddressFromCoords } from "@/lib/geocode";
import { getSocket } from "@/lib/socketClient";

interface Ride {
  _id: string;
  pickup: { address: string; lat?: number; lng?: number };
  destination: { address: string; lat?: number; lng?: number };
  price?: number;
  status: string;
  rider?: { name: string } | null;
  driver?: { name?: string };
  createdAt: string;
  driverLocation?: { lat: number; lng: number; address?: string } | null;
}

export default function DriverDashboard() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const locationIntervalRef = useRef<number | null>(null);
  const socketRef = useRef(getSocket());

  // Fetch rides (single-run)
  useEffect(() => {
    let mounted = true;
    const fetchRides = async () => {
      try {
        const response: any = await driverApi.getAllRides();
        if (response?.error) {
          toast.error(response.error);
          return;
        }
        const ridesArray: any[] = response.data?.rides || [];

        // Optionally fetch rider detail for each ride
        const ridesWithUser = await Promise.all(
          ridesArray.map(async (ride: any) => {
            if (!ride.rider) return ride;
            try {
              const userResponse: any = await userApi.getUserById(ride.rider);
              return { ...ride, rider: userResponse?.data?.user || null };
            } catch {
              return ride;
            }
          })
        );

        if (!mounted) return;
        setRides(ridesWithUser);
      } catch (err) {
        toast.error("Failed to fetch rides");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRides();
    return () => { mounted = false; };
  }, []);

  // Helper: start periodic location sending
  const startLiveLocation = (rideId: string) => {
    // Clear previous interval (if any)
    if (locationIntervalRef.current) {
      window.clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }

    // Ensure socket is connected & join ride room
    const socket = socketRef.current;
    socket.emit("join_ride_room", rideId);

    // Immediately send one location, then interval
    const sendPosition = () => {
      if (!navigator.geolocation) {
        toast.error("Geolocation not supported");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          // Optionally get address (async)
          (async () => {
            try {
              const address = await getAddressFromCoords(lat.toString(), lng.toString());
              // update backend with initial driverLocation through API (optional)
              try {
                await driverApi.updateDriverLocation?.(rideId, { lat, lng, address });
              } catch (_e) { /* ignore */ }
            } catch (_e) {
              /* ignore geocode failure */
            }
          })();

          // emit through socket
          socket.emit("driver_location", { rideId, lat, lng });
          console.log("driver_location emitted:", { rideId, lat, lng });
        },
        (err) => {
          console.error("geolocation get error:", err);
        },
        { enableHighAccuracy: true, maximumAge: 2000 }
      );
    };

    // send immediate
    sendPosition();

    // start interval every 4-5s (choose your preferred — using 4500ms)
    const id = window.setInterval(sendPosition, 4500);
    locationIntervalRef.current = id;
  };

  const stopLiveLocation = () => {
    if (locationIntervalRef.current) {
      window.clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
  };

  // Accept ride: start live tracking
  const handleAcceptRide = async (rideId: string) => {
    try {
      // use geolocation to get initial coords and address
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          let address = "";
          try {
            address = await getAddressFromCoords(lat.toString(), lng.toString());
          } catch {
            address = "";
          }

          // Call your API to accept ride (existing driverApi)
          const response: any = await driverApi.acceptRide(rideId, {
            driverLocation: { lat, lng, address },
          });

          if (response?.error) {
            toast.error(response.error);
            return;
          }

          toast.success("Ride accepted!");

          // update local state
          setRides((prev) => prev.map(r => r._id === rideId ? { ...r, status: "accepted", driverLocation: { lat, lng, address } } : r));

          // START live location updates via socket
          startLiveLocation(rideId);
        },
        (err) => {
          toast.error("Unable to get current location. Please enable GPS.");
          console.error(err);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch (err) {
      toast.error("Failed to accept ride");
    }
  };

  // Reject ride
  const handleRejectRide = async (rideId: string) => {
    try {
      const response: any = await driverApi.rejectRide(rideId);
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Ride rejected");
        setRides(prev => prev.filter(r => r._id !== rideId));
      }
    } catch {
      toast.error("Failed to reject ride");
    }
  };

  // Update status (picked up, completed)
  const handleUpdateStatus = async (rideId: string, status: string) => {
    try {
      const response: any = await driverApi.updateRideStatus(rideId, status);
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Status updated");
        setRides(prev => prev.map(r => r._id === rideId ? { ...r, status } : r));

        // stop live location when ride is completed
        if (status === "completed") {
          stopLiveLocation();
        }
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      stopLiveLocation();
      try {
        socketRef.current.disconnect();
      } catch { /* ignore */ }
    };
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Ride Requests</h2>
          <p className="text-muted-foreground">Accept rides and manage your active trips</p>
        </div>

        {rides.length === 0 ? (
          <Card className="shadow-lg bg-card/50 dark:bg-[#08010f]/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Navigation className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No active ride requests</p>
              <p className="text-sm text-muted-foreground">
                New ride requests will appear here when riders request a ride
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {rides.map(ride => (
              <Card key={ride._id} className="shadow-lg bg-card/50 dark:bg-[#08010f]/50 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">Ride Request</CardTitle>
                        <Badge>{ride.status.toUpperCase()}</Badge>
                      </div>
                    </div>
                    {ride.price && (
                      <div className="mt-2 flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg font-semibold text-primary w-fit">
                        <DollarSign className="h-4 w-4" />
                        {Math.round(ride.price)} BDT
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {ride.rider && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Rider Name</p>
                      <p className="font-medium">{ride.rider.name}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Pickup Location</p>
                        <p className="text-sm text-muted-foreground">{ride.pickup.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Destination</p>
                        <p className="text-sm text-muted-foreground">{ride.destination.address}</p>
                      </div>
                    </div>
                  </div>

                  {(ride.status === "requested" || ride.status === "pending") && (
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1" onClick={() => handleAcceptRide(ride._id)}>
                        <Check className="h-4 w-4 mr-2" />
                        Accept Ride
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleRejectRide(ride._id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {ride.status === 'accepted' && (
                    <div className="space-y-2 pt-2">
                      <p className="text-sm font-medium">Update Ride Status</p>
                      <Select
                        value={ride.status}
                        onValueChange={(value) => handleUpdateStatus(ride._id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="picked_up">Picked Up</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
