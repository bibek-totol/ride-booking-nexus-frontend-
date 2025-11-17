import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Car, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Driver {
  _id: string;
  name: string;
  email: string;
  status: string;
  vehicle?: { make: string; model: string; plate: string };
  createdAt: string;
}

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await adminApi.listDrivers();
      console.log("Fetched drivers:", response);
      if (response.data) {
        setDrivers(response.data.drivers as Driver[]);
      } else if (response.error) {
        toast.error(response.error);
        
        setDrivers([
          {
            _id: '1',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            status: 'active',
            vehicle: { make: 'Toyota', model: 'Camry', plate: 'ABC123' },
            createdAt: new Date().toISOString(),
          },
          {
            _id: '2',
            name: 'Sarah Williams',
            email: 'sarah@example.com',
            status: 'pending',
            vehicle: { make: 'Honda', model: 'Civic', plate: 'XYZ789' },
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      toast.error('Failed to load drivers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveDriver = async (driverId: string) => {
    try {
      const response = await adminApi.approveDriver(driverId);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Driver approved successfully');
        fetchDrivers();
      }
    } catch (error) {
      toast.error('Failed to approve driver');
    }
  };

  const handleSuspendDriver = async (driverId: string) => {
    try {
      const response = await adminApi.suspendDriver(driverId);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Driver suspended successfully');
        fetchDrivers();
      }
    } catch (error) {
      toast.error('Failed to suspend driver');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'bg-success text-success-foreground',
      pending: 'bg-warning text-warning-foreground',
      suspended: 'bg-destructive text-destructive-foreground',
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
            <h2 className="text-3xl font-bold tracking-tight">Manage Drivers</h2>
            <p className="text-muted-foreground">Approve, suspend, or manage driver accounts</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
            <Car className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">{drivers.length}</span>
            <span className="text-sm text-muted-foreground">Total Drivers</span>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Driver Directory</CardTitle>
            <CardDescription>All registered drivers and their approval status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No drivers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    drivers.map((driver) => (
                      <TableRow key={driver._id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>
                          {driver.vehicle ? (
                            <div className="text-sm">
                              <p className="font-medium">
                                {driver.vehicle.make} {driver.vehicle.model}
                              </p>
                              <p className="text-muted-foreground">{driver.vehicle.plate}</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(driver.status)}>
                            {driver.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(driver.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {driver.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveDriver(driver._id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {driver.status === 'active' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleSuspendDriver(driver._id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Suspend
                            </Button>
                          )}
                          {driver.status === 'suspended' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveDriver(driver._id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Reactivate
                            </Button>
                          )}
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
