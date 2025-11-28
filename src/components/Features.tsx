import { Card } from "@/components/ui/card";
import { 
  User, 
  Car, 
  Shield, 
  MapPin, 
  Clock, 
  FileText, 
  CreditCard,
  ToggleLeft,
  CheckCircle,
  XCircle,
  BarChart3,
  Settings,
  Users,
  Map
} from "lucide-react";

const Features = () => {
  const riderFeatures = [
    { icon: MapPin, title: "Request Ride", description: "Location-based pickup & destination" },
    { icon: FileText, title: "Ride History", description: "View past & active rides" },
    { icon: Clock, title: "Real-Time Tracking", description: "Live ride status updates" },
    { icon: XCircle, title: "Ride Cancellation", description: "Cancel anytime with ease" },
    { icon: User, title: "Profile Management", description: "Update personal details" },
  ];

  const driverFeatures = [
    { icon: CheckCircle, title: "Active Ride Dashboard", description: "Accept or reject ride requests" },
    { icon: CreditCard, title: "Earnings Analytics", description: "Track your income & transactions" },
    { icon: ToggleLeft, title: "Availability Toggle", description: "Set online/offline status" },
    { icon: Clock, title: "Live Status Update", description: "Update pickup to drop status" },
    { icon: Settings, title: "Document Management", description: "Upload & verify documents" },
  ];

  const adminFeatures = [
    { icon: BarChart3, title: "Overall Dashboard", description: "View platform-wide metrics" },
    { icon: Users, title: "User Management", description: "Approve, reject, or suspend users" },
    { icon: Map, title: "Global Ride Monitor", description: "Track all rides in real-time" },
    { icon: FileText, title: "Reports & Analytics", description: "Generate detailed insights" },
    { icon: Shield, title: "Permission System", description: "Role-based access control" },
  ];

  return (
    <section id="features" className="py-24 relative">
       <div className="absolute inset-0 bg-gradient-hero opacity-10 " />
      <div className="absolute inset-0 bg-gradient-glow animate-pulse-glow " />

      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-slow" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              RideBook
            </span>
            {" "}Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A Real-Time Ride Booking Platform with Role-Based Access
          </p>
        </div>

        <div className="space-y-16">
          {/* Rider Features */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-hero p-3 rounded-xl shadow-glow">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Rider Features</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {riderFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border-border bg-card/50 backdrop-blur-sm group"
                >
                  <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Driver Features */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-cta p-3 rounded-xl shadow-glow">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Driver Features</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {driverFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border-border bg-card/50 backdrop-blur-sm group"
                >
                  <feature.icon className="w-10 h-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Admin Features */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-card p-3 rounded-xl shadow-glow">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Admin Features</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border-border bg-card/50 backdrop-blur-sm group"
                >
                  <feature.icon className="w-10 h-10 text-secondary mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
