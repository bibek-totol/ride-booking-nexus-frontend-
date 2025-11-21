import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { driverApi, userApi } from '@/lib/api';
import { toast } from 'sonner';
import { MapPin, Check, X, Loader2, Clock, Navigation } from 'lucide-react';
 import { getAddressFromCoords } from "@/lib/geocode";

interface Ride {
  _id: string;
  pickup: { address: string };
  destination: { address: string };
  status: string;
  fare?: number;
  rider?: { name: string };
  createdAt: string;
}

export default function DriverDashboard() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const fetchRides = async () => {
      try {
        const response = await driverApi.getAllRides();
        if (response.error) {
          toast.error(response.error);
          setIsLoading(false);
          return;
        }

        const ridesArray = response.data.rides;

        const ridesWithUser = await Promise.all(
          ridesArray.map(async (ride: any) => {
            if (!ride.rider) return ride;

            const userResponse = await userApi.getUserById(ride.rider);
            return {
              ...ride,
              rider: userResponse.data?.user || null,
            };
          })
        );

        setRides(ridesWithUser);
      } catch (err) {
        toast.error("Failed to fetch rides");
      }

      setIsLoading(false);
    };

    fetchRides();
  }, []);

 
const handleAcceptRide = async (rideId: string) => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    
    const address = await getAddressFromCoords(lat.toString(), lng.toString());

    const response = await driverApi.acceptRide(rideId, {
      driverLocation: { lat, lng, address },
    });

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success("Ride accepted!");
    setRides(rides.map(r =>
      r._id === rideId ? { ...r, status: "accepted" } : r
    ));
  });
};




  const handleRejectRide = async (rideId: string) => {
    try {
      const response = await driverApi.rejectRide(rideId);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Ride rejected');
        setRides(rides.filter(r => r._id !== rideId));
      }
    } catch {
      toast.error('Failed to reject ride');
    }
  };

  const handleUpdateStatus = async (rideId: string, status: string) => {
    try {
      const response = await driverApi.updateRideStatus(rideId, status);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Status updated');
        setRides(rides.map(r => r._id === rideId ? { ...r, status } : r));
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-warning text-warning-foreground',
      requested: 'bg-warning text-warning-foreground',
      accepted: 'bg-info text-info-foreground',
      picked_up: 'bg-primary text-primary-foreground',
      completed: 'bg-success text-success-foreground',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

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
          <Card className="shadow-lg">
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
              <Card key={ride._id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">Ride Request</CardTitle>
                        <Badge className={getStatusColor(ride.status)}>
                          {ride.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>

                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(ride.createdAt).toLocaleString()}
                      </CardDescription>
                    </div>

                    {ride.fare && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">$1500</p>
                        <p className="text-xs text-muted-foreground">Estimated fare</p>
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
