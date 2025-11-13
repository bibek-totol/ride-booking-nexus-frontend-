import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { riderApi } from '@/lib/api';
import { toast } from 'sonner';
import { getAddressFromCoords, getCoordsFromAddress } from '@/lib/geocode';



export default function RiderDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupLat, setPickupLat] = useState('');
  const [pickupLng, setPickupLng] = useState('');
  const [destAddress, setDestAddress] = useState('');
  const [destLat, setDestLat] = useState('');
  const [destLng, setDestLng] = useState('');

  const handleRequestRide = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await riderApi.requestRide({
        pickup: {
          lat: parseFloat(pickupLat),
          lng: parseFloat(pickupLng),
          address: pickupAddress,
        },
        destination: {
          lat: parseFloat(destLat),
          lng: parseFloat(destLng),
          address: destAddress,
        },
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Ride requested successfully! A driver will be assigned soon.');
        
        setPickupAddress('');
        setPickupLat('');
        setPickupLng('');
        setDestAddress('');
        setDestLat('');
        setDestLng('');
      }
    } catch (error) {
      toast.error('Failed to request ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handlePickupCoordsChange = async (lat: string, lng: string) => {
  setPickupLat(lat);
  setPickupLng(lng);

  if (lat && lng) {
    const address = await getAddressFromCoords(lat, lng);
    setPickupAddress(address);
    
  }
};



const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

const handleDestAddressChange = (address: string) => {
  setDestAddress(address);

 
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  
  const timeout = setTimeout(async () => {
    if (address.trim().length > 3) {
      const { lat, lng, display_name } = await getCoordsFromAddress(address);
      if (lat && lng) {
        setDestLat(lat);
        setDestLng(lng);
         setDestAddress(display_name? display_name : address);
        toast.success("Destination coordinates updated automatically!");
      } else {
        toast.error("Address not found. Please check and try again.");
      }
    }

    
    
  }, 1100); 

  setTypingTimeout(timeout);
};





  const useCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPickupLat(position.coords.latitude.toString());
          setPickupLng(position.coords.longitude.toString());
          handlePickupCoordsChange(
            position.coords.latitude.toString(),
            position.coords.longitude.toString()
          );
          toast.success('Location captured!');
        },
        () => {
          toast.error('Unable to get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Request a Ride</h2>
          <p className="text-muted-foreground">Enter your pickup and destination details</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
         
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Ride Details
              </CardTitle>
              <CardDescription>Fill in the pickup and destination information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequestRide} className="space-y-4">
                
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Pickup Location</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={useCurrentLocation}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Use Current
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pickupAddress">Address</Label>
                    <Input
                      id="pickupAddress"
                      placeholder="Press 'Use Current' or enter address manually"
                      value={pickupAddress}
                      
                      onChange={(e) => setPickupAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="pickupLat">Latitude</Label>
                      <Input
                        id="pickupLat"
                        type="number"
                        step="any"
                        placeholder="Ex:12.9716"
                        value={pickupLat}
                        onChange={(e) => handlePickupCoordsChange(e.target.value, pickupLng)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupLng">Longitude</Label>
                      <Input
                        id="pickupLng"
                        type="number"
                        step="any"
                        placeholder="Ex:77.5946"
                        value={pickupLng}
                        onChange={(e) => handlePickupCoordsChange(pickupLat, e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

               
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <Label className="text-base font-semibold">Destination</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="destAddress">Address</Label>
                    <Input
                      id="destAddress"
                      placeholder="Ex:BIRDEM General Hospital,Dhaka  or  Sample Road/Place, City"
                      value={destAddress}
                       onChange={(e) => handleDestAddressChange(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="destLat">Latitude</Label>
                      <Input
                        id="destLat"
                        type="number"
                        step="any"
                        placeholder="Ex:12.9352"
                        value={destLat}
                        onChange={(e) => setDestLat(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destLng">Longitude</Label>
                      <Input
                        id="destLng"
                        type="number"
                        step="any"
                        placeholder="Ex:77.6245"
                        value={destLng}
                        onChange={(e) => setDestLng(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Requesting Ride...
                    </>
                  ) : (
                    'Request Ride'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          
          <div className="space-y-4">
            <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle>How it Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Enter your details</p>
                    <p className="text-sm text-muted-foreground">
                      Provide pickup and destination locations
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Wait for driver</p>
                    <p className="text-sm text-muted-foreground">
                      A nearby driver will accept your request
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Enjoy your ride</p>
                    <p className="text-sm text-muted-foreground">
                      Track your ride in real-time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Having trouble with your ride? Contact our 24/7 support team.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
