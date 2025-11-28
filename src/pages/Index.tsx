import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechnicalFeatures from "@/components/TechnicalFeatures";
import Footer from "@/components/Footer";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {

   const { isAuthenticated, user } = useAuth();

  
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TechnicalFeatures />
      <Footer />
    </div>
  );
};

export default Index;
