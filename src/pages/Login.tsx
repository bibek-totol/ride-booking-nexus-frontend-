import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Mail, Lock, AlertCircle, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

export default function Login() {
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ Check for error in URL params
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setErrorMessage(error);
      // Clear the error from URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('error');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    } 
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(email, password);
      const data = response?.data;
      const requireOtp =
  data?.requiresOtp || data?.data?.requiresOtp;

      
      if (requireOtp) {
        toast.info('OTP sent to your email');
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!role) {
      toast.error('Please select a role first');
      return;
    }
    
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?role=${role}`;
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
              <Car className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">RideBook</h1>
            <p className="text-muted-foreground mt-2 dark:text-gray-300">Welcome back! Log in to continue</p>
          </div>

          {/* ✅ Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-in slide-in-from-top">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {errorMessage}
                  </p>
                </div>
                <button
                  onClick={() => setErrorMessage('')}
                  className="flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Login Card */}
          <Card className="shadow-xl border-0 bg-white dark:bg-[#08010f]/50 transition-colors duration-500">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSignIn();
                    }}
                    className="pl-10 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="button"
                className="w-full bg-gradient-hero text-white hover:opacity-90 transition-opacity"
                onClick={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-[#08010f]/50 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full dark:border-gray-600 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                onClick={() => setOpen(true)}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>

              {/* Signup Link */}
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-500 dark:text-gray-300">Don't have an account? </span>
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Google OAuth Role Selection Modal */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                         bg-white dark:bg-[#08010f]/95 backdrop-blur-sm
                                         p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 
                                         transition-colors duration-500 animate-in zoom-in-95">
                <Dialog.Title className="text-lg font-bold mb-2 dark:text-gray-100">
                  Select your role
                </Dialog.Title>
                <Dialog.Description className="text-sm mb-4 text-gray-500 dark:text-gray-300">
                  Choose how you want to sign in
                </Dialog.Description>

                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#08010f] text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                    <SelectItem value="rider"> Rider</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </SelectContent>
                </Select>

                <div className="mt-6 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setOpen(false);
                      setRole('');
                    }}
                    className="dark:border-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleGoogleLogin}
                    disabled={!role}
                    className="bg-gradient-hero text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue with Google
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      <Footer />
    </div>
  );
}