import { Button } from "@/components/ui/button";
import { ArrowRight, Play,Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
  id="hero"
  className="
    relative min-h-screen flex items-center justify-center overflow-hidden pt-16

    dark:bg-gradient-to-r dark:from-[#08010F] dark:via-[#380996] dark:to-[#240404]

    bg-gradient-to-r from-white via-gray-50 to-white
  "
>
  {/* Animated Background Layer */}
  <div className="absolute inset-0 dark:opacity-10 opacity-40 bg-gradient-hero"></div>
  <div className="absolute inset-0 bg-gradient-glow animate-pulse-glow dark:opacity-30 opacity-20" />

  {/* Floating soft glows */}
  <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-[120px] animate-float 
    bg-primary/20 dark:bg-purple-600/30"
  />
  <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[120px] animate-float-slow 
    bg-accent/20 dark:bg-red-600/30"
  />

  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-4xl mx-auto text-center animate-slide-up">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm 
        border border-border shadow-card mb-6 dark:bg-white/10"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
        <span className="text-sm text-muted-foreground">Real-Time Ride Booking Platform</span>
      </div>

      {/* Heading */}
      <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
        <span className="bg-gradient-hero bg-clip-text text-transparent">
          Book Your Ride
        </span>
        <br />
        <span className="dark:text-white text-foreground">In Seconds</span>
      </h1>

      {/* Subheading */}
      <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto dark:text-gray-300">
        A comprehensive ride-booking platform with role-based access for Riders, Drivers, and Admins.
        Experience seamless real-time tracking, secure authentication, and efficient management.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link to="/register">
          <Button size="lg" className="bg-gradient-cta hover:opacity-90 text-primary-foreground shadow-glow group">
            Sign Up
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>

        <Link to="/login">
          <Button size="lg" variant="outline"
            className="border-2 hover:bg-card/50 hover:text-primary transition-all group dark:border-white/30"
          >
            <Lock className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Login
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto text-center">
        {[
          { value: "10K+", label: "Active Riders" },
          { value: "2K+", label: "Verified Drivers" },
          { value: "99.9%", label: "Uptime" }
        ].map((item) => (
          <div key={item.label}>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
              {item.value}
            </div>
            <div className="text-sm text-muted-foreground dark:text-gray-300">
              {item.label}
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
</section>

  );
};

export default Hero;
