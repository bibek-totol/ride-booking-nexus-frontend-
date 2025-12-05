import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";
import { Car, CheckCircle, XCircle, Loader2 } from "lucide-react";
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
      const response: any = await adminApi.listDrivers();
      if (response?.data?.drivers?.length > 0) {
        const driverList = response.data.drivers;

        const driversWithEarnings = await Promise.all(
          driverList.map(async (driver) => {
            try {
              const earn: any = await adminApi.getAllDriverEarnings(driver._id);
              return {
                ...driver,
                totalRides: earn.data.totalRides,
                totalEarnings: earn.data.totalEarnings,
                averageFare: earn.data.averageFare,
              };
            } catch {
              return {
                ...driver,
                totalRides: 0,
                totalEarnings: 0,
                averageFare: 0,
              };
            }
          })
        );

        setDrivers(driversWithEarnings);
      }
    } catch {
      toast.error("Failed loading drivers");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      active: "bg-green-500/20 text-green-700 dark:text-green-300",
      pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
      suspended: "bg-red-500/20 text-red-700 dark:text-red-300",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const handleApproveDriver = async (driverId: string) => {
    try {
      const res = await adminApi.approveDriver(driverId);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Driver approved and Email Sent");
        fetchDrivers();
      }
    } catch {
      toast.error("Approval failed");
    }
  };

  const handleSuspendDriver = async (driverId: string) => {
    try {
      const res = await adminApi.suspendDriver(driverId);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Driver suspended and Email Sent");
        fetchDrivers();
      }
    } catch {
      toast.error("Suspension failed");
    }
  };

  const filteredDrivers = useMemo(() => {
    if (!search) return drivers;

    return drivers.filter((d) =>
      [d._id, d.name, d.email].some((v) =>
        v.toLowerCase().includes(search.toLowerCase())
      )
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
      {/* Outer Background */}
      <div
        className="
        relative p-6 rounded-xl
        bg-muted/30
        dark:bg-gradient-to-r dark:from-[#08010F] dark:via-[#380996] dark:to-[#240404]
      "
      >
        {/* Glow effects */}

        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl dark:bg-purple-600/30 pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl dark:bg-red-600/30 pointer-events-none" />

        <div className="relative z-20 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight dark:text-white">
              Manage Drivers
            </h2>
            <p className="text-muted-foreground dark:text-gray-300">
              Approve, suspend, or manage drivers
            </p>
          </div>

          {/* Search + Stats */}
          <div className="flex items-center justify-between">
            <div className="relative">
              <Input
                placeholder="Search by ID, Name, Email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 border-primary/40 focus-visible:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 dark:bg-[#08010f]/40 rounded-lg backdrop-blur-sm border dark:border-gray-700">
              <Car className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold dark:text-white">
                {filteredDrivers.length}
              </span>
              <span className="text-sm text-muted-foreground dark:text-gray-300">
                Drivers
              </span>
            </div>
          </div>

          {/* Main Card */}
          <Card className="shadow-lg bg-card/50 dark:bg-[#08010f]/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Driver Directory
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                All registered drivers & approval status
              </CardDescription>
            </CardHeader>

            <CardContent className="overflow-auto max-h-[60vh]">
              <div className="rounded-md border dark:border-gray-700 min-w-[900px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="dark:text-gray-300">User ID</TableHead>
                      <TableHead className="dark:text-gray-300">Name</TableHead>
                      <TableHead className="dark:text-gray-300">Email</TableHead>
                      <TableHead className="dark:text-gray-300">Total Rides</TableHead>
                      <TableHead className="dark:text-gray-300">Earnings</TableHead>
                      <TableHead className="dark:text-gray-300">Avg Fare</TableHead>
                      <TableHead className="dark:text-gray-300">Status</TableHead>
                      <TableHead className="dark:text-gray-300">Joined</TableHead>
                      <TableHead className="text-right dark:text-gray-300">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredDrivers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center py-8 text-muted-foreground dark:text-gray-400"
                        >
                          No matching drivers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDrivers.map((driver) => (
                        <TableRow key={driver._id}>
                          <TableCell className="font-semibold dark:text-white">
                            {driver._id}
                          </TableCell>
                          <TableCell className="dark:text-gray-200">
                            {driver.name}
                          </TableCell>
                          <TableCell className="dark:text-gray-200">
                            {driver.email}
                          </TableCell>
                          <TableCell className="dark:text-gray-200">
                            {driver.totalRides}
                          </TableCell>
                          <TableCell className="font-bold dark:text-white">
                            {driver.totalEarnings}৳
                          </TableCell>
                          <TableCell className="font-bold dark:text-white">
                            {driver.averageFare}৳
                          </TableCell>

                          <TableCell>
                            <Badge className={getStatusColor(driver.status)}>
                              {driver.accepted ? "active" : "inactive"}
                            </Badge>
                          </TableCell>

                          <TableCell className="dark:text-gray-400">
                            {new Date(driver.createdAt).toLocaleDateString()}
                          </TableCell>

                          <TableCell className="text-right space-x-2">
                            {!driver.approved ? (
                              <Button size="sm" onClick={() => handleApproveDriver(driver._id)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleSuspendDriver(driver._id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Suspend
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
      </div>
    </DashboardLayout>
  );
}
