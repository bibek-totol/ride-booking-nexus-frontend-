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
      const response: any = await adminApi.listRides();
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

  // Theme-aware badge colors
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-warning text-warning-foreground dark:bg-warning/80 dark:text-warning-foreground',
      accepted: 'bg-info text-info-foreground dark:bg-info/80 dark:text-info-foreground',
      picked_up: 'bg-primary text-primary-foreground dark:bg-primary/80 dark:text-primary-foreground',
      completed: 'bg-success text-success-foreground dark:bg-success/80 dark:text-success-foreground',
      cancelled: 'bg-destructive text-destructive-foreground dark:bg-destructive/80 dark:text-destructive-foreground',
    };
    return colors[status] || 'bg-muted text-muted-foreground dark:bg-muted/80 dark:text-muted-foreground';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-white" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-muted/30
        dark:bg-gradient-to-r dark:from-[#08010F] dark:via-[#380996] dark:to-[#240404] p-4 rounded-md">
          
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight dark:text-white">All Rides</h2>
            <p className="text-muted-foreground dark:text-gray-300">Monitor and manage all ride activities</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg dark:bg-muted/50">
            <MapPin className="h-5 w-5 text-muted-foreground dark:text-gray-300" />
            <span className="font-semibold dark:text-white">{rides.length}</span>
            <span className="text-sm text-muted-foreground dark:text-gray-300">Total Rides</span>
          </div>
        </div>

        {/* Rides Table */}
        <Card className="shadow-lg bg-card/50 dark:bg-[#08010f]/50 backdrop-blur-sm border border-border dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Ride History</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Complete overview of all rides in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border dark:border-gray-700">
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
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground dark:text-gray-300">
                        No rides found
                      </TableCell>
                    </TableRow>
                  ) : (
                    rides.map((ride) => (
                      <TableRow key={ride._id} className="hover:bg-muted/20 dark:hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium dark:text-white">{ride.rider?.name}</TableCell>
                        <TableCell className="dark:text-gray-300">
                          {ride.rider?.email || <span className="text-muted-foreground dark:text-gray-400">N/A</span>}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          {ride.driver?.name || <span className="text-muted-foreground dark:text-gray-400">Unassigned</span>}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          {ride.driver?.email || <span className="text-muted-foreground dark:text-gray-400">N/A</span>}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          {ride.driverLocation?.address || <span className="text-muted-foreground dark:text-gray-400">N/A</span>}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1 dark:text-gray-300">
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-success dark:bg-success/80" />
                              <span>{ride.pickup?.address}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-destructive dark:bg-destructive/80" />
                              <span>{ride.destination?.address}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ride.status)}>
                            {ride.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium dark:text-white">{ride.price} BDT</TableCell>
                        <TableCell className="dark:text-gray-300">{new Date(ride.createdAt).toLocaleDateString()}</TableCell>
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
