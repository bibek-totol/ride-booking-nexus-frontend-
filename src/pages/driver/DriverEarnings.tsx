import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { driverApi } from '@/lib/api';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, Calendar, Loader2 } from 'lucide-react';

interface Earning {
  _id: string;
  amount: number;
  date: string;
  rideId: string;
}

export default function DriverEarnings() {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await driverApi.getEarningsHistory();
      if (response.data) {
        const earningsData = response.data as Earning[];
        setEarnings(earningsData);
        const total = earningsData.reduce((sum, e) => sum + e.amount, 0);
        setTotalEarnings(total);
      } else if (response.error) {
        toast.error(response.error);
        // Set mock data for demonstration
        const mockEarnings = [
          { _id: '1', amount: 25.50, date: new Date().toISOString(), rideId: 'R001' },
          { _id: '2', amount: 18.75, date: new Date(Date.now() - 86400000).toISOString(), rideId: 'R002' },
          { _id: '3', amount: 32.00, date: new Date(Date.now() - 172800000).toISOString(), rideId: 'R003' },
        ];
        setEarnings(mockEarnings);
        setTotalEarnings(mockEarnings.reduce((sum, e) => sum + e.amount, 0));
      }
    } catch (error) {
      toast.error('Failed to load earnings');
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

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{earnings.length}</div>
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
                ${earnings.length > 0 ? (totalEarnings / earnings.length).toFixed(2) : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per ride</p>
            </CardContent>
          </Card>
        </div>

        {/* Earnings List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
            <CardDescription>Your earnings from completed rides</CardDescription>
          </CardHeader>
          <CardContent>
            {earnings.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No earnings yet</p>
                <p className="text-sm text-muted-foreground">Complete rides to start earning</p>
              </div>
            ) : (
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
                        +${earning.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">Earnings</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
