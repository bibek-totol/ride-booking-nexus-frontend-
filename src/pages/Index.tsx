import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, MapPin, DollarSign, Shield, ArrowRight } from 'lucide-react';

export default function Index() {
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated users to their dashboard
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary shadow-md">
              <Car className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">RideBook</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

     
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Your Ride, Your Way
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience seamless rides at your fingertips. Book a ride in seconds or start earning as a driver.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="text-lg px-8">
              Book Your Ride
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Become a Driver
            </Button>
          </Link>
        </div>
      </section>

     
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
              <p className="text-sm text-muted-foreground">
                Request a ride with just a few taps. Your driver will arrive in minutes.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
                <Car className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Reliable Drivers</h3>
              <p className="text-sm text-muted-foreground">
                All our drivers are verified and trained to provide excellent service.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 mb-4">
                <DollarSign className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fair Pricing</h3>
              <p className="text-sm text-muted-foreground">
                Transparent pricing with no hidden fees. Know the cost before you ride.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-info/10 mb-4">
                <Shield className="h-8 w-8 text-info" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Safe & Secure</h3>
              <p className="text-sm text-muted-foreground">
                Your safety is our priority with 24/7 support and ride tracking.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      
      <section className="container mx-auto px-4 py-20">
        <Card className="shadow-2xl border-0 bg-gradient-primary">
          <CardContent className="py-16 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of riders and drivers using RideBook every day
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

     
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 RideBook. All rights reserved.</p>
          <p className="mt-2">Your trusted ride-booking platform</p>
        </div>
      </footer>
    </div>
  );
}
