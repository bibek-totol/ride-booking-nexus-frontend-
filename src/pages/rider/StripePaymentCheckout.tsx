import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { riderApi } from "@/lib/api";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


function PaymentForm({ amount, paymentIntentId, rideData }: any) {

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const result = await stripe.confirmPayment({
  elements,
  confirmParams: {
    return_url: window.location.origin + "/payment-success?paymentIntentId=" + paymentIntentId + "&rideData=" + encodeURIComponent(JSON.stringify(rideData)),
  },
});


    if (result.error) {
      toast.error(result.error.message);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement className="p-4 border rounded-md bg-white dark:bg-zinc-800" />

      <Button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}


export default function StripePaymentCheckout() {
  const navigate = useNavigate();
  const location = useLocation();



  
  const { amount, pickup, destination, price } = location.state || {};

 const [clientSecret, setClientSecret] = useState<string>("");
 const [paymentIntentId, setPaymentIntentId] = useState<string>("");

  useEffect(() => {
    if (!amount) return;

    const loadClientSecret = async () => {
      const response: any = await riderApi.createPaymentIntent(amount);
      

      if (response.error) {
        toast.error(response.error || "Failed to initialize payment");
        return;
      }

      const { clientSecret, paymentIntentId } = response.data.data;

    
    setClientSecret(clientSecret);
    setPaymentIntentId(paymentIntentId);
    };

    loadClientSecret();
  }, [amount]);

  if (!amount) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col gap-4">
        <p className="text-lg text-red-600">Invalid payment details.</p>
        <Button onClick={() => navigate('/rider')}>Go Back</Button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-3xl text-blue-600 font-bold ">Loading payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      {/* ------------ LEFT SIDE (SUMMARY) ------------- */}
      <div className="w-full md:w-1/2 bg-gradient-to-r from-[#08010F] via-[#380996] to-[#240404] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80 hover:bg-white/10 p-0 h-auto mb-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="mb-10">
            <p className="text-blue-100 mb-2">Payment amount</p>
            <h1 className="text-5xl font-bold">${amount.toFixed(2)}</h1>
            <span className="text-blue-100 text-sm">Per ride</span>
          </div>

          <div className="space-y-4 text-blue-100">
            <div className="flex justify-between">
              <span>Ride Fare</span>
              <span>${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="h-px bg-white/20 my-4"></div>
            <div className="flex justify-between font-semibold text-white text-lg">
              <span>Total due today</span>
              <span>${amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="w-full md:w-1/2 p-8 md:p-12 bg-white dark:bg-zinc-900 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-6">Payment Information</h2>

          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
              },
            }}
          >
        
            <PaymentForm amount={amount} paymentIntentId={paymentIntentId} rideData={{ pickup, destination, price }} />

          </Elements>
        </div>
      </div>
    </div>
  );
}
