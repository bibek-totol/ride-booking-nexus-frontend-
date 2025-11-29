import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import Viewer from "react-viewer";
import { Download } from "lucide-react";

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
      const response:any = await adminApi.getAllDriversAdditional();
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
      <div className="space-y-6">

        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Driver Additional Info</h2>
            <p className="text-muted-foreground">View detailed information about registered drivers</p>
          </div>

          <Input
            placeholder="Search by ID / Name / Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 border-primary/40 focus-visible:ring-primary"
          />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Driver Details</CardTitle>
            <CardDescription>All registered drivers' additional information</CardDescription>
          </CardHeader>
          <CardContent>

            {filteredDrivers.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground text-lg">No results found</p>
            ) : (
              <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-md border">
                <Table className="min-w-[1100px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name / Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>NID</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>(License & RC)</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver._id} className="hover:bg-muted/40">

                        <TableCell className="font-bold">{driver._id}</TableCell>

                        <TableCell>
                          <p className="font-semibold">{driver.user?.name}</p>
                          <p className="text-xs text-muted-foreground">{driver.user?.email}</p>
                        </TableCell>

                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.address}</TableCell>
                        <TableCell>{driver.nid}</TableCell>
                        <TableCell>{driver.license}</TableCell>

                        <TableCell>
                          {driver.vehicleType} - {driver.vehicleModel}
                          <br />
                          <span className="text-xs text-muted-foreground">{driver.vehicleRegNo}</span>
                        </TableCell>

                        <TableCell>{driver.experience} Years</TableCell>

                        {/* Images & Download */}
                        <TableCell className="flex gap-3">
                          {/* License */}
                          {driver.licenseImg ? (
                            <div className="flex flex-col items-center">
                              <img
                                src={driver.licenseImg}
                                className="h-14 w-24 rounded cursor-pointer"
                                onClick={() => openViewer(driver.licenseImg)}
                              />
                              <button
                                className="text-blue-600 text-xs"
                                onClick={() => downloadImage(driver.licenseImg, "license.jpg")}
                              >
                                <Download size={14} /> Download
                              </button>
                            </div>
                          ) : <Badge variant="outline" className="text-red-500">Missing</Badge>}

                          {/* RC */}
                          {driver.regCertImg ? (
                            <div className="flex flex-col items-center">
                              <img
                                src={driver.regCertImg}
                                className="h-14 w-24 rounded cursor-pointer"
                                onClick={() => openViewer(driver.regCertImg)}
                              />
                              <button
                                className="text-blue-600 text-xs"
                                onClick={() => downloadImage(driver.regCertImg, "registration.jpg")}
                              >
                                <Download size={14} /> Download
                              </button>
                            </div>
                          ) : <Badge variant="outline" className="text-red-500">Missing</Badge>}
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

      <Viewer visible={visible} onClose={() => setVisible(false)} images={[{ src: activeImg }]} />
    </DashboardLayout>
  );
}
