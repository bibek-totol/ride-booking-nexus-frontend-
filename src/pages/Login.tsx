import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Mail, Lock } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [role, setRole] = useState('rider');

  const handleSignIn = async () => {
    if (!email || !password) return; // basic validation
    setIsLoading(true);
    try {
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?role=${role}`;
  };

  return (
    <div className="min-h-screen flex flex-col 
                    bg-gray-50 dark:bg-gradient-to-r dark:from-[#08010F] dark:via-[#380996] dark:to-[#240404] 
                    text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Navbar />

      <div className=" mt-16  flex flex-1 items-center justify-center p-4 
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
                    className="pl-10 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="button"
                className="w-full bg-gradient-hero text-white"
                onClick={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 dark:border-gray-600 dark:text-gray-100"
                onClick={() => setOpen(true)}
              >
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
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                         bg-white dark:bg-[#08010f]/50
                                         p-6 rounded-lg shadow-lg w-80 transition-colors duration-500">
                <Dialog.Title className="text-lg font-bold mb-2 dark:text-gray-100">Select your role</Dialog.Title>
                <Dialog.Description className="text-sm mb-4 text-gray-500 dark:text-gray-300">
                  Choose a role before signing in with Google
                </Dialog.Description>

                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-gray-50 dark:bg-transparent text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#08010f] text-gray-900 dark:text-gray-100">
                    <SelectItem value="rider">Rider</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </SelectContent>
                </Select>

                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={handleGoogleLogin}>Complete</Button>
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
