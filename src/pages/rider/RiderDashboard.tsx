import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { riderApi } from '@/lib/api';
import { toast } from 'sonner';
import { getAddressFromCoords, getCoordsFromAddress } from '@/lib/geocode';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Banknote } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';



export default function RiderDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cash'>('stripe');

  // IMPORTANT: Store coordinates as numbers (NOT strings)
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupLat, setPickupLat] = useState<number | null>(null);
  const [pickupLng, setPickupLng] = useState<number | null>(null);

  const [destAddress, setDestAddress] = useState('');
  const [destLat, setDestLat] = useState<number | null>(null);
  const [destLng, setDestLng] = useState<number | null>(null);

  const [priceFare, setPriceFare] = useState<number | null>(null);

  const { user } = useAuth();
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  //
  // FARE CALCULATION
  //
  useEffect(() => {
    if (
      pickupLat !== null &&
      pickupLng !== null &&
      destLat !== null &&
      destLng !== null
    ) {
      calculateFare(pickupLat, pickupLng, destLat, destLng);
    }
  }, [pickupLat, pickupLng, destLat, destLng]);


  function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }


  function calculateFare(pLat: number, pLng: number, dLat: number, dLng: number) {
    const distance = getDistanceKm(pLat, pLng, dLat, dLng);

    const BaseFare = 35;
    const PerKmRate = 35;
    const total = BaseFare + distance * PerKmRate;
    const finalFare = Math.round(total);

    setPriceFare(finalFare);
    toast.success(`Distance: ${distance.toFixed(2)} km | Fare: ৳${finalFare}`);
  }


  //
  // REQUEST RIDE
  //
  const handleRequestRide = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      pickupLat === null ||
      pickupLng === null ||
      destLat === null ||
      destLng === null
    ) {
      toast.error("Pickup and destination coordinates are required.");
      return;
    }

    if (!priceFare) {
      toast.error("Fare not calculated.");
      return;
    }

    setIsPaymentModalOpen(true);
  };


  //
  // PAYMENT OPTION HANDLING
  //
  const handleProceedPayment = async () => {
    if (
      pickupLat === null ||
      pickupLng === null ||
      destLat === null ||
      destLng === null
    ) {
      toast.error("Coordinates missing.");
      return;
    }

    if (!priceFare) {
      toast.error("Invalid fare.");
      return;
    }

    if (paymentMethod === "cash") {
      toast.success("Payment will be in Cash");
      setIsPaymentModalOpen(false);
      setIsLoading(true);

      try {
        const response: any = await riderApi.requestRide({
          pickup: {
            lat: pickupLat,
            lng: pickupLng,
            address: pickupAddress,
          },
          destination: {
            lat: destLat,
            lng: destLng,
            address: destAddress,
          },
          price: priceFare,
          payment: {
            method: 'cash',
            paymentIntentId: undefined,
            amount: priceFare,
          },
          riderName: user?.name,
          riderEmail: user?.email,
        });

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Ride requested successfully!");
          resetForm();
        }

      } catch {
        toast.error("Failed to request ride.");
      }

      setIsLoading(false);
    }

    if (paymentMethod === "stripe") {
      setIsPaymentModalOpen(false);

      navigate("/stripe-payment-checkout", {
        state: {
          amount: priceFare,
          pickup: {
            lat: pickupLat,
            lng: pickupLng,
            address: pickupAddress
          },
          destination: {
            lat: destLat,
            lng: destLng,
            address: destAddress
          },
          price: priceFare
        }
      });
    }
  };


  function resetForm() {
    setPickupAddress('');
    setPickupLat(null);
    setPickupLng(null);

    setDestAddress('');
    setDestLat(null);
    setDestLng(null);

    setPriceFare(null);
  }


  //
  // PICKUP COORDINATE HANDLING
  //
  const handlePickupCoordsChange = async (lat: string, lng: string) => {
    const numericLat = Number(lat);
    const numericLng = Number(lng);

    if (!isNaN(numericLat)) setPickupLat(numericLat);
    if (!isNaN(numericLng)) setPickupLng(numericLng);

    if (!isNaN(numericLat) && !isNaN(numericLng)) {
      const address = await getAddressFromCoords(lat, lng);
      setPickupAddress(address);
    }
  };


  //
  // DESTINATION ADDRESS HANDLING + AUTOCOMPLETE
  //
  const handleDestAddressChange = (address: string) => {
    setDestAddress(address);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(async () => {
      const trimmed = address.trim();
      if (!trimmed) return;

      if (trimmed.length > 3) {
        try {
          const result = await getCoordsFromAddress(trimmed);
          console.log(result);

          if (result && result.lat && result.lng) {
            setDestLat(Number(result.lat));
            setDestLng(Number(result.lng));

            setDestAddress(result.display_name ?? trimmed);
          } else {
            toast.error("Address not found.");
          }

        } catch {
          toast.error("Failed to fetch location.");
        }
      }
    }, 900);
  };


  //
  // USE CURRENT LOCATION
  //
  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setPickupLat(lat);
        setPickupLng(lng);

        handlePickupCoordsChange(lat.toString(), lng.toString());
        toast.success("Location captured!");
      },
      () => toast.error("Unable to get your location")
    );
  };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Request a Ride</h2>
          <p className="text-muted-foreground">Enter your pickup and destination details</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
         
          <Card className="shadow-lg bg-card/50 dark:bg-[#08010f]/50">
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
                        value={pickupLat !== null ? pickupLat.toString() : ''}
                        onChange={(e) => handlePickupCoordsChange(e.target.value, pickupLng !== null ? pickupLng.toString() : '')}
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
                        value={pickupLng !== null ? pickupLng.toString() : ''}
                        onChange={(e) => handlePickupCoordsChange(pickupLat !== null ? pickupLat.toString() : '', e.target.value)}
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
                        onChange={(e) => {
                          const numericValue = Number(e.target.value);
                          if (!isNaN(numericValue)) setDestLat(numericValue);
                        }}
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
                        onChange={(e) => {
                          const numericValue = Number(e.target.value);
                          if (!isNaN(numericValue)) setDestLng(numericValue);
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>


                <div className="space-y-2">
  <Label>Estimated Price Fare (BDT)</Label>
  <Input
    readOnly
    value={priceFare !== null ? `৳ ${priceFare}` : "Auto Calculating..."}
    className="font-bold text-green-600"
  />
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
            <Card className="shadow-lg border-primary/20  dark:bg-[#08010f]/50 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle>How it Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground font-semibold">
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground font-semibold">
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground font-semibold">
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

            <Card className="shadow-lg bg-card/50 dark:bg-[#08010f]/50">
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
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose how you would like to pay for your ride.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as 'stripe' | 'cash')}>
              <div className={`flex items-center space-x-4 rounded-md border p-4 cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`} onClick={() => setPaymentMethod('stripe')}>
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex-1 cursor-pointer flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <div className="flex flex-col">
                    <span className="font-semibold">Pay with Stripe Payment</span>
                    <span className="text-xs text-muted-foreground">Secure online payment</span>
                  </div>
                </Label>
              </div>
              <div className={`flex items-center space-x-4 rounded-md border p-4 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`} onClick={() => setPaymentMethod('cash')}>
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex-1 cursor-pointer flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-green-500" />
                  <div className="flex flex-col">
                    <span className="font-semibold">Pay With Cash</span>
                    <span className="text-xs text-muted-foreground">Pay directly to driver</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
            <Button onClick={handleProceedPayment}>Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
