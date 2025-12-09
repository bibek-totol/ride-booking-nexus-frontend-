import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { riderApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);

    const paymentIntentId = query.get("paymentIntentId");
    const rideDataRaw = query.get("rideData");

    if (!paymentIntentId || !rideDataRaw) {
      toast.error("Invalid payment response");
      navigate("/");
      return;
    }

    const rideData = JSON.parse(rideDataRaw);

    const saveRide = async () => {
      try {
        const response = await riderApi.requestRide({
          pickup: {
            lat: Number(rideData.pickup.lat),
            lng: Number(rideData.pickup.lng),
            address: rideData.pickup.address
          },
          destination: {
            lat: Number(rideData.destination.lat),
            lng: Number(rideData.destination.lng),
            address: rideData.destination.address
          },
          price: Number(rideData.price),
          payment: {
            method: "stripe",
            paymentIntentId,
            amount: Number(rideData.price),
          },
          riderName: user?.name,
          riderEmail: user?.email,
        });

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success("Ride confirmed and Payment Complete");

      
        setTimeout(() => {
          navigate("/");
        }, 2500);

      } catch {
        toast.error("Failed to save ride");

        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };

    saveRide();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen text-3xl font-bold text-green-500">
      Confirming payment...
    </div>
  );
}
