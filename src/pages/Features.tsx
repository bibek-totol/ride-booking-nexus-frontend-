import Navbar from "@/components/Navbar";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="">
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
