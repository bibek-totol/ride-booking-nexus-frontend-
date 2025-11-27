import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import Viewer from "react-viewer";
import { Download } from "lucide-react";


export default function DriverAdditionalInfo() {
  const [driversAdditional, setDriversAdditional] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const [visible, setVisible] = useState(false);
const [activeImg, setActiveImg] = useState(null);

const openViewer = (img:string) => {
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
      const response = await adminApi.getAllDriversAdditional(); 

      if (response?.data?.data?.length > 0) {
  setDriversAdditional(response.data.data); 
} else {
  setDriversAdditional([]);
}
    } catch (error) {
      console.error(error);
      setDriversAdditional([]);
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Driver Additional Info</h2>
            <p className="text-muted-foreground">
              View detailed information about registered drivers
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
            <span className="font-semibold">{driversAdditional.length}</span>
            <span className="text-sm text-muted-foreground">Total Details</span>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Driver Details</CardTitle>
            <CardDescription>All registered drivers' additional information</CardDescription>
          </CardHeader>
          <CardContent>
            {driversAdditional.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
                <p className="text-lg font-medium">No additional driver data available</p>
                <p className="mt-2">Once drivers submit their details, you will see them here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-[900px]">
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
                      <TableHead>License & Registration Certificate</TableHead>
                
                    </TableRow>
                  </TableHeader>
                 <TableBody>
  {driversAdditional.map((driver) => (
    <TableRow 
      key={driver._id}
      className="hover:bg-muted/40 transition-colors cursor-pointer"

    >


        <TableCell className="font-extrabold ">
        {driver._id || "N/A"}
      </TableCell>
      {/* NAME / EMAIL */}
      <TableCell>
        <p className="font-semibold text-foreground">{driver.user?.name || "N/A"}</p>
        <p className="text-xs text-muted-foreground italic">{driver.user?.email || "N/A"}</p>
      </TableCell>

      {/* PHONE */}
      <TableCell className="font-medium text-blue-600">
        {driver.phone || "N/A"}
      </TableCell>

      {/* ADDRESS */}
      <TableCell className="text-sm text-muted-foreground">
        {driver.address || "N/A"}
      </TableCell>

      {/* NID */}
      <TableCell className="font-medium text-purple-600">
        {driver.nid || "N/A"}
      </TableCell>

      {/* LICENSE */}
      <TableCell className="font-medium text-green-600">
        {driver.license || "N/A"}
      </TableCell>

      {/* VEHICLE */}
      <TableCell>
        <span className="font-medium text-orange-600">
          {driver.vehicleType || "N/A"} - {driver.vehicleModel || "N/A"}
        </span>
        <br />
        <span className="text-xs text-muted-foreground">{driver.vehicleRegNo || "N/A"}</span>
      </TableCell>

      {/* EXPERIENCE */}
      <TableCell className="font-medium text-amber-700">
        {driver.experience || "N/A"} years
      </TableCell>

      {/* LICENSE IMAGE */}
     <TableCell className="flex flex-col items-center gap-2">
  {driver.licenseImg ? (
    <>
      <img
        src={driver.licenseImg}
        className="h-12 w-20 object-cover rounded shadow-sm cursor-pointer"
        onClick={() => openViewer(driver.licenseImg)}
      />

      
      <button
        onClick={() => downloadImage(driver.licenseImg, `license_${driver.user?.name || "driver"}.jpg`)}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
      >
        <Download size={16} /> Download
      </button>
    </>
  ) : (
    <Badge variant="outline" className="text-red-600 border-red-500">Missing</Badge>
  )}
</TableCell>


      {/* REG CERT IMAGE */}

       <TableCell className="flex flex-col items-center gap-2">
  {driver.regCertImg ? (
    <>
      <img
        src={driver.regCertImg}
        className="h-12 w-20 object-cover rounded shadow-sm cursor-pointer"
        onClick={() => openViewer(driver.regCertImg)}
      />

      
      <button
        onClick={() => downloadImage(driver.regCertImg, `vehicle_registration_${driver.user?.name || "driver"}.jpg`)}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
      >
        <Download size={16} /> Download
      </button>
    </>
  ) : (
    <Badge variant="outline" className="text-red-600 border-red-500">Missing</Badge>
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

      <Viewer
  visible={visible}
  onClose={() => setVisible(false)}
  images={[{ src: activeImg }]}
  rotatable
  scalable
  downloadable
/>


    </DashboardLayout>
  );
}
