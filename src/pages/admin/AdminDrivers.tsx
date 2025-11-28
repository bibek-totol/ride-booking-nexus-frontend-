import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Car, CheckCircle, XCircle, Loader2, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(""); 

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await adminApi.listDrivers();
      if (response?.data?.drivers?.length > 0) {
        const driverList = response.data.drivers;
        const driversWithEarnings = await Promise.all(
          driverList.map(async (driver) => {
            try {
              const earn = await adminApi.getAllDriverEarnings(driver._id);
              return {
                ...driver,
                totalRides: earn.data.totalRides,
                totalEarnings: earn.data.totalEarnings,
                averageFare: earn.data.averageFare,
              };
            } catch {
              return { ...driver, totalRides: 0, totalEarnings: 0, averageFare: 0 };
            }
          })
        );
        setDrivers(driversWithEarnings);
      } else {
        setDrivers([
          {
            _id: "demo1",
            name: "Demo Driver",
            email: "demo@fleet.com",
            status: "active",
            vehicle: { make: "Toyota", model: "Axio", plate: "D-1234" },
            createdAt: new Date().toISOString(),
            totalRides: 12,
            totalEarnings: 5200,
            averageFare: 430,
          },
        ]);
      }
    } catch (error) {
      toast.error("Failed loading drivers information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveDriver = async (driverId: string) => {
    try {
      const response = await adminApi.approveDriver(driverId);
      if (response.error) toast.error(response.error);
      else {
        toast.success('Driver approved successfully');
        fetchDrivers();
      }
    } catch {
      toast.error('Failed to approve driver');
    }
  };

  const handleSuspendDriver = async (driverId: string) => {
    try {
      const response = await adminApi.suspendDriver(driverId);
      if (response.error) toast.error(response.error);
      else {
        toast.success('Driver suspended successfully');
        fetchDrivers();
      }
    } catch {
      toast.error('Failed to suspend driver');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      active: 'bg-success text-success-foreground',
      pending: 'bg-warning text-warning-foreground',
      suspended: 'bg-destructive text-destructive-foreground',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  
  const filteredDrivers = useMemo(() => {
    if (!search) return drivers;
    return drivers.filter(d =>
      d._id.toLowerCase().includes(search.toLowerCase()) ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, drivers]);

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

          <div className="flex gap-2">
            <div className="relative">
              
              <Input
                type="text"
                placeholder="Search by ID, Name or Email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 border-primary/40 focus-visible:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
              <Car className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">{filteredDrivers.length}</span>
              <span className="text-sm text-muted-foreground">Drivers</span>
            </div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Driver Directory</CardTitle>
            <CardDescription>All registered drivers and their approval status</CardDescription>
          </CardHeader>

          
          <CardContent className="overflow-auto max-h-[60vh] w-full">
            <div className="rounded-md border min-w-[900px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Total Rides</TableHead>   
                    <TableHead>Total Earnings</TableHead>      
                    <TableHead>Avg Fare</TableHead>          
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredDrivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No matching drivers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <TableRow key={driver._id}>
                        <TableCell className='font-semibold'>{driver._id}</TableCell>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.totalRides ?? 0}</TableCell>
                        <TableCell className='font-extrabold'>{driver.totalEarnings ?? 0}৳</TableCell>
                        <TableCell className='font-extrabold'>{driver.averageFare ?? 0}৳</TableCell>

                        <TableCell>
                          <Badge className={getStatusColor(driver.status)}>
                            {driver.accepted ? 'active' : 'inactive'}
                          </Badge>
                        </TableCell>

                        <TableCell>{new Date(driver.createdAt).toLocaleDateString()}</TableCell>

                        <TableCell className="text-right space-x-2">
                          {!driver.approved && (
                            <Button size="sm" onClick={() => handleApproveDriver(driver._id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />Approve
                            </Button>
                          )}
                          {driver.approved && (
                            <Button size="sm" variant="destructive" onClick={() => handleSuspendDriver(driver._id)}>
                              <XCircle className="h-4 w-4 mr-1" />Suspend
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
