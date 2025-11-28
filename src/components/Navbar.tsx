import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-lg shadow-elegant"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-gradient-hero p-2 rounded-lg shadow-glow">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              RideBook
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/features"
              className={`transition-colors font-medium ${
                isActive("/features") ? "text-primary" : "text-foreground/80 hover:text-primary"
              }`}
            >
              Features
            </Link>
            <Link
              to="/faq"
              className={`transition-colors font-medium ${
                isActive("/faq") ? "text-primary" : "text-foreground/80 hover:text-primary"
              }`}
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className={`transition-colors font-medium ${
                isActive("/contact") ? "text-primary" : "text-foreground/80 hover:text-primary"
              }`}
            >
              Contact
            </Link>
            <Link to="/login">
              <Button className="bg-gradient-cta hover:opacity-90 text-primary-foreground shadow-glow transition-all">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/features"
                onClick={closeMobileMenu}
                className={`transition-colors font-medium text-left ${
                  isActive("/features") ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                Features
              </Link>
              <Link
                to="/faq"
                onClick={closeMobileMenu}
                className={`transition-colors font-medium text-left ${
                  isActive("/faq") ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className={`transition-colors font-medium text-left ${
                  isActive("/contact") ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                Contact
              </Link>
              <Link to="/contact" onClick={closeMobileMenu}>
                <Button className="bg-gradient-cta hover:opacity-90 text-primary-foreground shadow-glow w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
