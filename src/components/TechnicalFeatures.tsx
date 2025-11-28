import { Card } from "@/components/ui/card";
import { 
  Key, 
  Mail, 
  Shield, 
  FileCheck, 
  Bell, 
  Navigation, 
  Code,
  CheckCircle2
} from "lucide-react";

const TechnicalFeatures = () => {
  const features = [
    {
      icon: Key,
      title: "JWT Token Authentication",
      description: "Secure token-based auth for seamless sessions",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Google OAuth Login",
      description: "Quick sign-in with your Google account",
      color: "text-accent"
    },
    {
      icon: Mail,
      title: "OTP Verification",
      description: "Secure login & password reset via email OTP",
      color: "text-info"
    },
    {
      icon: FileCheck,
      title: "Document Upload & Verification",
      description: "Driver ID & document validation system",
      color: "text-success"
    },
    {
      icon: Bell,
      title: "Email Push Notifications",
      description: "Real-time alerts on admin actions & updates",
      color: "text-warning"
    },
    {
      icon: Navigation,
      title: "Real-Time Location Tracking",
      description: "Live ride tracking with interactive maps",
      color: "text-primary"
    },
    {
      icon: Code,
      title: "Scalable Architecture",
      description: "Production-ready modular design",
      color: "text-secondary"
    },
    {
      icon: CheckCircle2,
      title: "Role-Based Permissions",
      description: "Granular access control for all user types",
      color: "text-accent"
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Excellence
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with modern technologies and industry best practices
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border-border bg-card group relative overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-5 transition-opacity" />
              
              <div className="relative">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10">
                  <feature.icon className={`w-8 h-8 ${feature.color} group-hover:scale-110 transition-transform`} />
                </div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">System Reliability</span>
            <span className="text-sm font-bold text-success">99.9%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-cta animate-shimmer"
              style={{
                width: "99.9%",
                backgroundSize: "200% 100%",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalFeatures;
