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
    <section
      id="features"
      className="
        py-24 relative transition-colors duration-500

      
        bg-muted/30

      
        dark:bg-gradient-to-r dark:from-[#08010F] dark:via-[#380996] dark:to-[#240404]"
    >
      {/* Background Glows */}
       {/* <div className="absolute inset-0 bg-gradient-hero   opacity-10 dark:opacity-20" /> */}
     <div className="absolute inset-0 bg-gradient-glow  dark:bg-black  animate-pulse-glow dark:opacity-30" />
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float bg-primary/20 dark:bg-purple-600/30" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-float-slow bg-accent/20 dark:bg-red-600/30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-hero bg-clip-text text-transparent">RideBook</span> Features
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
            A Real-Time Ride Booking Platform with Role-Based Access
          </p>
        </div>

        <div className="space-y-16">
          {/* Rider Features */}
          <FeatureGroup
            icon={<User className="w-6 h-6 text-primary-foreground" />}
            title="Rider Features"
            features={riderFeatures}
            cardColor="bg-card/50 dark:bg-[#08010f]/50"
          />

          {/* Driver Features */}
          <FeatureGroup
            icon={<Car className="w-6 h-6 text-primary-foreground" />}
            title="Driver Features"
            features={driverFeatures}
            cardColor="bg-card/50 dark:bg-[#08010f]/50"
          />

          {/* Admin Features */}
          <FeatureGroup
            icon={<Shield className="w-6 h-6 text-primary-foreground" />}
            title="Admin Features"
            features={adminFeatures}
            cardColor="bg-card/50 dark:bg-[#08010f]/50"
          />
        </div>
      </div>
    </section>
  );
};

/* Subcomponent for Feature Group */
const FeatureGroup = ({
  icon,
  title,
  features,
  cardColor
}: {
  icon: React.ReactNode;
  title: string;
  features: { icon: any; title: string; description: string }[];
  cardColor: string;
}) => (
  <div className="animate-fade-in">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-gradient-hero p-3 rounded-xl shadow-glow">{icon}</div>
      <h3 className="text-2xl md:text-3xl font-bold dark:text-white">{title}</h3>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, idx) => (
        <Card
          key={idx}
          className={`
            p-6 border-border group relative overflow-hidden
            hover:shadow-glow hover:-translate-y-1 transition-all duration-300 ${cardColor}
          `}
        >
          <feature.icon className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform text-primary dark:text-white" />
          <h4 className="text-lg font-semibold mb-2 dark:text-white">{feature.title}</h4>
          <p className="text-sm text-muted-foreground dark:text-gray-300">{feature.description}</p>
        </Card>
      ))}
    </div>
  </div>
);

export default Features;
