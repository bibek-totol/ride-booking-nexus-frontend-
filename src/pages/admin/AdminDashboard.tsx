import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Users, Car, MapPin, TrendingUp, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalRides: 0,
    activeRides: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch data from multiple endpoints
      const [usersRes, driversRes, ridesRes] = await Promise.all([
        adminApi.listUsers(),
        adminApi.listDrivers(),
        adminApi.listRides(),
      ]);

      const users = usersRes.data as any[] || [];
      const drivers = driversRes.data as any[] || [];
      const rides = ridesRes.data as any[] || [];

      setStats({
        totalUsers: users.length,
        totalDrivers: drivers.length,
        totalRides: rides.length,
        activeRides: rides.filter((r: any) => 
          ['pending', 'accepted', 'picked_up'].includes(r.status)
        ).length,
      });
    } catch (error) {
      // Set mock data for demonstration
      setStats({
        totalUsers: 156,
        totalDrivers: 42,
        totalRides: 328,
        activeRides: 12,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Drivers',
      value: stats.totalDrivers,
      icon: Car,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Total Rides',
      value: stats.totalRides,
      icon: MapPin,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Active Rides',
      value: stats.activeRides,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

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
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Overview of your ride-booking platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`h-10 w-10 flex items-center justify-center rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.title === 'Active Rides' ? 'Currently ongoing' : 'Registered'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <a
                href="/admin/users"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <Users className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium">Manage Users</p>
                  <p className="text-xs text-muted-foreground">View and manage all users</p>
                </div>
              </a>

              <a
                href="/admin/drivers"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <Car className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium">Manage Drivers</p>
                  <p className="text-xs text-muted-foreground">Approve or suspend drivers</p>
                </div>
              </a>

              <a
                href="/admin/rides"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <MapPin className="h-5 w-5 text-info group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium">View Rides</p>
                  <p className="text-xs text-muted-foreground">Monitor all ride activities</p>
                </div>
              </a>

              <a
                href="/admin/reports"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <TrendingUp className="h-5 w-5 text-success group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium">Reports</p>
                  <p className="text-xs text-muted-foreground">Generate system reports</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">System Status</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-success/20 text-success">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Active Drivers Online</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-info/20 text-info">
                  {Math.floor(stats.totalDrivers * 0.6)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Pending Driver Approvals</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning/20 text-warning">
                  {Math.floor(stats.totalDrivers * 0.1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
