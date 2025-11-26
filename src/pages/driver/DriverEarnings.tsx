import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { driverApi } from '@/lib/api';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, Calendar, Loader2 } from 'lucide-react';



export default function DriverEarnings() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [earnings, setEarnings] = useState<any[]>([]);


  const [stats, setStats] = useState<any>({
  totalEarnings: 0,
  totalRides: 0,
  averageFare: 0,
});

useEffect(() => {
  loadStats();
}, []);

const loadStats = async () => {
  setIsLoading(true); 
  try {
    const res = await driverApi.getDriverEarnings();
    const data:any = res.data;
    setStats(data);
    setEarnings(res.data.recentEarnings || []);
  } catch (error) {
    toast.error("Failed to load earnings");
  } finally {
    setIsLoading(false); 
  }
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
          <h2 className="text-3xl font-bold tracking-tight">Earnings History</h2>
          <p className="text-muted-foreground">Track your income and ride history</p>
        </div>

        
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalEarnings} BDT</div>
              <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRides}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed rides</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Fare</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageFare}BDT
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per ride</p>
            </CardContent>
          </Card>
        </div>

      
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
            <CardDescription>Your earnings from completed rides</CardDescription>
          </CardHeader>
          <CardContent>
  {isLoading ? (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ) : earnings.length > 0 ? (
    <div className="space-y-3">
      {earnings.map((earning) => (
        <div
          key={earning._id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="space-y-1">
            <p className="font-medium">Ride #{earning.rideId}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(earning.date).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-success">
              +{earning.amount.toFixed(2)} BDT
            </p>
            <p className="text-xs text-muted-foreground">Earnings</p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-8">
      <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground">No earnings yet</p>
      <p className="text-sm text-muted-foreground">Complete rides to start earning</p>
    </div>
  )}
</CardContent>

        </Card>
      </div>
    </DashboardLayout>
  );
}
