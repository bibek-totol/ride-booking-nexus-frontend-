import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ShieldCheck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function VerifyOtp() {
  const { verifyLoginOtp } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('Email is missing');
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }
    setIsLoading(true);
    try {
      await verifyLoginOtp(email, otp);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.resendOtp(email);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('OTP resent successfully');
        setTimer(120);
        setCanResend(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col 
                    bg-gray-50 dark:bg-gradient-to-r dark:from-[#08010F] dark:via-[#380996] dark:to-[#240404] 
                    text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Navbar />

      <div className="mt-16 flex flex-1 items-center justify-center p-4 
                      bg-gradient-to-br from-gray-50 via-gray-100/30 to-gray-50
                      dark:from-[#08010F] dark:via-[#380996]/20 dark:to-[#240404] transition-colors duration-500">
        <div className="w-full max-w-md">

          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-hero mb-4 shadow-lg">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Verify Identity</h1>
            <p className="text-muted-foreground mt-2 dark:text-gray-300">We've sent a code to {email}</p>
          </div>

          {/* OTP Card */}
          <Card className="shadow-xl border-0 bg-white dark:bg-[#08010f]/50 transition-colors duration-500">
            <CardHeader>
              <CardTitle>Enter OTP</CardTitle>
              <CardDescription className="dark:text-gray-300">
                The code will expire in <span className="font-bold text-primary">{formatTime(timer)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <div className="relative">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Copy Paste OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-[1em] font-bold h-14 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <Button
                type="button"
                className="w-full bg-gradient-hero text-white h-12 text-lg"
                onClick={handleVerify}
                disabled={isLoading || otp.length < 4}
              >
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || isLoading}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:no-underline"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Resend Code
                </button>
              </div>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
