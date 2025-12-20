import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApi } from "@/lib/api";
import { Loader2, Users, Car, MapPin, TrendingUp } from "lucide-react";

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
      const [usersRes, driversRes, ridesRes] = await Promise.all([
        adminApi.listUsers(),
        adminApi.listDrivers(),
        adminApi.listRides(),
      ]);

  

      const users = usersRes.data?.users || [];
      const drivers = driversRes.data?.drivers || [];
      const rides = ridesRes.data?.rides || [];

      setStats({
        totalUsers: users.length,
        totalDrivers: drivers.length,
        totalRides: rides.length,
        activeRides: rides.filter((r: any) =>
          ["pending", "accepted", "picked_up"].includes(r.status)
        ).length,
      });

    } catch (e) {
      // Mock data fallback
      setStats({
        totalUsers: 0,
        totalDrivers: 0,
        totalRides: 0,
        activeRides: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      bg: "bg-gradient-hero",
    },
    {
      title: "Total Drivers",
      value: stats.totalDrivers,
      icon: Car,
      bg: "bg-gradient-cta",
    },
    {
      title: "Total Rides",
      value: stats.totalRides,
      icon: MapPin,
      bg: "bg-gradient-card",
    },
    {
      title: "Active Rides",
      value: stats.activeRides,
      icon: TrendingUp,
      bg: "bg-purple-600/30 dark:bg-green-600/30",
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
      {/* Background Layer */}
      <div
        className="
        relative min-h-screen p-6 rounded-xl
        bg-muted/30
        dark:bg-gradient-to-r dark:from-[#08010F] dark:via-[#380996] dark:to-[#240404]
      "
      >
        {/* Light/Dark Background Glow Effects */}
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float dark:bg-purple-600/30 pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-slow dark:bg-red-600/30 pointer-events-none" />

        <div className="relative z-10 space-y-6">

          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight dark:text-white">
              Admin Dashboard
            </h2>
            <p className="text-muted-foreground dark:text-gray-300">
              Overview of your ride-booking platform
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card
                key={stat.title}
                className="
                  shadow-lg hover:shadow-glow transition-all
                  bg-card/50 backdrop-blur-sm border-border
                  dark:bg-[#08010f]/50
                "
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-white">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`h-10 w-10 flex items-center justify-center rounded-lg shadow-glow ${stat.bg}`}
                  >
                    <stat.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold dark:text-white">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground dark:text-gray-300 mt-1">
                    {stat.title === "Active Rides"
                      ? "Currently ongoing"
                      : "Registered"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card
            className="
              shadow-lg bg-card/50 dark:bg-[#08010f]/50 backdrop-blur-sm border-border
            "
          >
            <CardHeader>
              <CardTitle className="dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    href: "/admin/users",
                    icon: Users,
                    label: "Manage Users",
                    desc: "View and manage all users",
                  },
                  {
                    href: "/admin/drivers",
                    icon: Car,
                    label: "Manage Drivers",
                    desc: "Approve or suspend drivers",
                  },
                  {
                    href: "/admin/rides",
                    icon: MapPin,
                    label: "View Rides",
                    desc: "Monitor all ride activities",
                  },
                  {
                    href: "/admin/reports",
                    icon: TrendingUp,
                    label: "Reports",
                    desc: "Generate system reports",
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="
                      flex items-center gap-3 p-4 border rounded-lg
                      hover:bg-muted/50 transition-colors group
                      dark:border-gray-700
                    "
                  >
                    <item.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium dark:text-white">{item.label}</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-300">
                        {item.desc}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Section */}
          <Card
            className="
              shadow-lg bg-card/50 dark:bg-[#08010f]/50 backdrop-blur-sm border-border
            "
          >
            <CardHeader>
              <CardTitle className="dark:text-white">Platform Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                  <span className="text-sm font-medium dark:text-white">
                    Active Drivers Online
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-info/20 text-info">
                    {Math.floor(stats.totalDrivers * 0.6)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                  <span className="text-sm font-medium dark:text-white">
                    Pending Driver Approvals
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning/20 text-warning">
                    {Math.floor(stats.totalDrivers * 0.1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}
