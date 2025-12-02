import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Download } from "lucide-react";
import { adminApi } from "@/lib/api";
import Viewer from "react-viewer";

export default function DriverAdditionalInfo() {
  const [driversAdditional, setDriversAdditional] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [activeImg, setActiveImg] = useState(null);

  const openViewer = (img: string) => {
    setActiveImg(img);
    setVisible(true);
  };

  const downloadImage = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    fetchDriverAdditionalData();
  }, []);

  const fetchDriverAdditionalData = async () => {
    try {
      const response: any = await adminApi.getAllDriversAdditional();
      setDriversAdditional(response?.data?.data || []);
    } catch {
      setDriversAdditional([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDrivers = useMemo(() => {
    if (!search) return driversAdditional;
    return driversAdditional.filter((d) =>
      d._id?.toLowerCase().includes(search.toLowerCase()) ||
      d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.user?.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, driversAdditional]);

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
      {/* Outer glowing gradient wrapper */}
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
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight dark:text-white">
                Driver Additional Info
              </h2>
              <p className="text-muted-foreground dark:text-gray-300">
                View detailed information about registered drivers
              </p>
            </div>

            <Input
              placeholder="Search by ID / Name / Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 border-primary/40 focus-visible:ring-primary"
            />
          </div>

          {/* Main Card */}
          <Card className="shadow-lg bg-card/50 dark:bg-[#08010f]/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="dark:text-white">Driver Details</CardTitle>
              <CardDescription className="dark:text-gray-300">
                All registered drivers' additional information
              </CardDescription>
            </CardHeader>

            <CardContent>
              {filteredDrivers.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground text-lg dark:text-gray-400">
                  No results found
                </p>
              ) : (
                <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-md border dark:border-gray-700">
                  <Table className="min-w-[1100px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="dark:text-gray-300">User ID</TableHead>
                        <TableHead className="dark:text-gray-300">Name / Email</TableHead>
                        <TableHead className="dark:text-gray-300">Phone</TableHead>
                        <TableHead className="dark:text-gray-300">Address</TableHead>
                        <TableHead className="dark:text-gray-300">NID</TableHead>
                        <TableHead className="dark:text-gray-300">License</TableHead>
                        <TableHead className="dark:text-gray-300">Vehicle</TableHead>
                        <TableHead className="dark:text-gray-300">Experience</TableHead>
                        <TableHead className="dark:text-gray-300">(License & RC)</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredDrivers.map((driver) => (
                        <TableRow
                          key={driver._id}
                          className="hover:bg-muted/40 dark:hover:bg-white/10"
                        >
                          <TableCell className="font-bold dark:text-white">
                            {driver._id}
                          </TableCell>

                          <TableCell>
                            <p className="font-semibold dark:text-white">
                              {driver.user?.name}
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-gray-400">
                              {driver.user?.email}
                            </p>
                          </TableCell>

                          <TableCell className="dark:text-gray-200">
                            {driver.phone}
                          </TableCell>

                          <TableCell className="dark:text-gray-200">
                            {driver.address}
                          </TableCell>

                          <TableCell className="dark:text-gray-200">
                            {driver.nid}
                          </TableCell>

                          <TableCell className="dark:text-gray-200">
                            {driver.license}
                          </TableCell>

                          <TableCell className="dark:text-gray-200">
                            {driver.vehicleType} - {driver.vehicleModel}
                            <br />
                            <span className="text-xs text-muted-foreground dark:text-gray-400">
                              {driver.vehicleRegNo}
                            </span>
                          </TableCell>

                          <TableCell className="dark:text-gray-200">
                            {driver.experience} Years
                          </TableCell>

                          {/* Images */}
                          <TableCell className="flex gap-4">
                            {/* License Image */}
                            {driver.licenseImg ? (
                              <div className="flex flex-col items-center">
                                <img
                                  src={driver.licenseImg}
                                  className="h-14 w-24 rounded cursor-pointer border dark:border-gray-600"
                                  onClick={() => openViewer(driver.licenseImg)}
                                />
                                <button
                                  className="text-blue-600 dark:text-blue-400 text-xs flex items-center gap-1 mt-1"
                                  onClick={() =>
                                    downloadImage(driver.licenseImg, "license.jpg")
                                  }
                                >
                                  <Download size={14} /> Download
                                </button>
                              </div>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-red-600 dark:text-red-400 border-red-500 dark:border-red-400"
                              >
                                Missing
                              </Badge>
                            )}

                            {/* RC Image */}
                            {driver.regCertImg ? (
                              <div className="flex flex-col items-center">
                                <img
                                  src={driver.regCertImg}
                                  className="h-14 w-24 rounded cursor-pointer border dark:border-gray-600"
                                  onClick={() => openViewer(driver.regCertImg)}
                                />
                                <button
                                  className="text-blue-600 dark:text-blue-400 text-xs flex items-center gap-1 mt-1"
                                  onClick={() =>
                                    downloadImage(driver.regCertImg, "registration.jpg")
                                  }
                                >
                                  <Download size={14} /> Download
                                </button>
                              </div>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-red-600 dark:text-red-400 border-red-500 dark:border-red-400"
                              >
                                Missing
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Viewer
        visible={visible}
        onClose={() => setVisible(false)}
        images={[{ src: activeImg }]}
      />
    </DashboardLayout>
  );
}
