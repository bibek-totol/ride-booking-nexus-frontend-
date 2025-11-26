import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { riderApi } from '@/lib/api';
import { toast } from 'sonner';
import { MapPin, Clock, DollarSign, XCircle, Loader2 } from 'lucide-react';

interface Ride {
  _id: string;
  pickup: { address: string };
  destination: { address: string };
   price?: number;
  status: string;
  createdAt: string;
  driver?: { name: string; email?: string };
}

export default function RiderRides() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await riderApi.getRideHistory();
      if (response.data) {
        console.log(response.data);
       setRides((response.data as { rides: Ride[] })?.rides as Ride[]);
      } else if (response.error) {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error('Failed to load rides');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRide = async (rideId: string) => {
    try {
      const response = await riderApi.cancelRide(rideId);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Ride cancelled successfully');
        fetchRides();
      }
    } catch (error) {
      toast.error('Failed to cancel ride');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-warning text-warning-foreground',
      requested: 'bg-warning text-warning-foreground',
      accepted: 'bg-info text-info-foreground',
      picked_up: 'bg-primary text-primary-foreground',
      completed: 'bg-success text-success-foreground',
      cancelled: 'bg-destructive text-destructive-foreground',
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
          <h2 className="text-3xl font-bold tracking-tight">My Rides</h2>
          <p className="text-muted-foreground">View and manage your ride history</p>
        </div>

        {rides.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No rides yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Request your first ride to get started!
              </p>
              <Button onClick={() => (window.location.href = '/rider')}>Request Ride</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {rides.map((ride) => (
              <Card key={ride._id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        <Badge className={getStatusColor(ride.status)}>
                          {ride.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(ride.createdAt).toLocaleString()}
                      </CardDescription>
                      {(ride.status === 'pending' || ride.status === 'requested') && (
                        <p className="text-sm text-muted-foreground">
                          You can cancel this ride anytime before it gets accepted.
                        </p>
                      )}
                    </div>
                    {(ride.status === 'pending' || ride.status === 'requested') && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelRide(ride._id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">

              
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 flex items-center justify-center bg-success/20 text-success rounded-full">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pickup</p>
                      <p className="text-sm text-muted-foreground">{ride.pickup.address}</p>
                    </div>
                  </div>

                  
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 flex items-center justify-center bg-destructive/20 text-destructive rounded-full">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Destination</p>
                      <p className="text-sm text-muted-foreground">{ride.destination.address}</p>
                    </div>
                  </div>

                
                  {ride.price && (
                    <div className="mt-2 flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg font-semibold text-primary w-fit">
                      <DollarSign className="h-4 w-4" />
                      {Math.round(ride.price)} BDT
                    </div>
                  )}

                  
                  {ride.driver && (
                    <div className="text-sm mt-4 border-t pt-3">
                      <span className="text-muted-foreground">Driver: </span>
                      <span className="font-medium">{ride.driver.name}</span>
                      {ride.driver.email && (
                        <> <span className="text-muted-foreground"> | Email: </span>
                          <span className="font-medium">{ride.driver.email}</span>
                        </>
                      )}
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
