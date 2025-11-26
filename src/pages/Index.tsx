import { motion, useScroll, useTransform } from "framer-motion";
import { Car, MapPin, Shield, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";


const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);


  const { isAuthenticated, user } = useAuth();

  
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: MapPin,
      title: "Easy Booking",
      description: "Request a ride with just a few taps. Your driver will arrive in minutes.",
      color: "from-blue-400/20 to-blue-600/20",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      icon: Car,
      title: "Reliable Drivers",
      description: "All our drivers are verified and trained to provide excellent service.",
      color: "from-orange-400/20 to-orange-600/20",
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/10",
    },
    {
      icon: DollarSign,
      title: "Fair Pricing",
      description: "Transparent pricing with no hidden fees. Know the cost before you ride.",
      color: "from-green-400/20 to-green-600/20",
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your safety is our priority with 24/7 support and ride tracking.",
      color: "from-cyan-400/20 to-cyan-600/20",
      iconColor: "text-cyan-500",
      iconBg: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl shadow-card border-b border-white/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RideBook
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >

             <Link to="/login">
            <Button
              variant="ghost"
              className="text-foreground transition-colors font-medium "
            >
              Sign In
            </Button>
            </Link>

            <Link to="/register">
            <Button className="bg-gradient-hero text-white shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 font-medium px-6">
              Get Started
            </Button>
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-glow animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-glow animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow animate-pulse-glow" />
        </div>

        {/* Floating Decorative Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-32 right-20 w-20 h-20 rounded-full bg-gradient-hero opacity-20 blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-32 left-20 w-32 h-32 rounded-full bg-gradient-cta opacity-20 blur-xl"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            {/* Main Headline with Gradient */}
            <h1 className="text-7xl md:text-8xl font-black leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary-glow bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                Your Ride, Your Way
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light tracking-wide"
            >
              Experience seamless rides at your fingertips. Book a ride in seconds or start
              earning as a driver.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-8"
            >

               <Link to="/register">
              <Button
                size="lg"
                className="bg-gradient-hero text-white shadow-elegant hover:shadow-glow transition-all duration-500 hover:scale-110 text-lg px-10 py-7 rounded-2xl group font-semibold"
              >
                Book Your Ride
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              </Link>

              <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary/20 hover:border-primary text-foreground transition-colors  text-lg px-10 py-7 rounded-2xl  duration-500 hover:scale-105 backdrop-blur-sm font-semibold"
              >
                Become a Driver
              </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Car Illustration Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-20"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 mx-auto bg-gradient-hero rounded-full opacity-30 blur-2xl"
              />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -12,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
                
                {/* Card */}
                <div className="relative  backdrop-blur-sm rounded-3xl p-8 shadow-card hover:shadow-elegant transition-all duration-500 border border-border/50 group-hover:border-primary/30">
                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow duration-300`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 rounded-3xl" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden"
          >
            {/* Animated Background Glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-glow blur-3xl"
            />

            {/* CTA Card */}
            <div className="relative bg-gradient-hero rounded-[2.5rem] p-16 shadow-elegant">
              <div className="relative z-10 text-center space-y-8">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-6xl font-black text-white tracking-tight"
                >
                  Ready to Get Started?
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-white/90 max-w-2xl mx-auto font-light tracking-wide"
                >
                  Join thousands of riders and drivers using RideBook every day
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.6 }}
                >

                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 shadow-glow hover:shadow-elegant transition-all duration-500 hover:scale-110 text-lg px-12 py-7 rounded-2xl group font-bold"
                  >
                    Sign Up Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-10 right-10 w-24 h-24 border-4 border-white/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-10 left-10 w-32 h-32 border-4 border-white/10 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RideBook
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2025 RideBook. Your ride, your way.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
