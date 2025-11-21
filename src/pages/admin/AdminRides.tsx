import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { MapPin, Loader2 } from 'lucide-react';



export default function AdminRides() {
  const [rides, setRides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await adminApi.listRides();
      console.log(response);
      if (response.data) {
        setRides(response.data.rides);
      } else if (response.error) {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error('Failed to load rides');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-warning text-warning-foreground',
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">All Rides</h2>
            <p className="text-muted-foreground">Monitor and manage all ride activities</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">{rides.length}</span>
            <span className="text-sm text-muted-foreground">Total Rides</span>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Ride History</CardTitle>
            <CardDescription>Complete overview of all rides in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rider</TableHead>
                    <TableHead>Rider Email</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Driver Email</TableHead>
                    <TableHead>Driver Location</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rides.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No rides found
                      </TableCell>
                    </TableRow>
                  ) : (
                    rides.map((ride) => (
                      <TableRow key={ride._id}>
                        <TableCell className="font-medium">{ride.rider?.name}</TableCell>
                         
                         <TableCell>
                          {ride.rider?.email || (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>

                        {/* Driver Name */}
                        <TableCell>
                          {ride.driver?.name || (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>

                        {/* Driver Email */}
                        <TableCell>
                          {ride.driver?.email || (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>

                        {/* Driver Location */}
                        <TableCell>
                          <span className="text-muted-foreground">{ride.driverLocation.address}</span>
                        </TableCell>

                        {/* Route */}
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-success" />
                              <span className="text-muted-foreground">{ride.pickup.address}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-destructive" />
                              <span className="text-muted-foreground">{ride.destination.address}</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge className={getStatusColor(ride.status)}>
                            {ride.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>

                        {/* Fare */}
                        <TableCell className="font-medium">
                          {ride.fare ? `$${ride.fare.toFixed(2)}` : 'N/A'}
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-muted-foreground">
                          {new Date(ride.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
