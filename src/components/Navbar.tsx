import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Menu, X, Moon, Sun } from "lucide-react";
import useTheme from "@/hooks/useTheme";   

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const isActive = (path: string) => location.pathname === path;

  return (
   <nav
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
    dark:bg-gradient-to-r dark:from-[#08010F] dark:via-[#380996] dark:to-[#240404]
    ${isScrolled ? "shadow-lg backdrop-blur-lg" : "bg-transparent"}
  `}
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

            <Link to="/features" className={`font-medium transition-colors ${isActive("/features") ? "text-primary" : "text-foreground/80 hover:text-primary"}`}>
              Features
            </Link>
            <Link to="/faq" className={`font-medium transition-colors ${isActive("/faq") ? "text-primary" : "text-foreground/80 hover:text-primary"}`}>
              FAQ
            </Link>
            <Link to="/contact" className={`font-medium transition-colors ${isActive("/contact") ? "text-primary" : "text-foreground/80 hover:text-primary"}`}>
              Contact
            </Link>

            <Link to="/login">
              <Button className="bg-gradient-cta hover:opacity-90 text-primary-foreground shadow-glow transition-all">
                Get Started
              </Button>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg border border-border hover:bg-accent transition-all"
            >
              {theme === "dark" ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-4">

              <Link to="/features" onClick={closeMobileMenu} className={`${isActive("/features") ? "text-primary" : "text-foreground/80 hover:text-primary"} transition`}>
                Features
              </Link>
              <Link to="/faq" onClick={closeMobileMenu} className={`${isActive("/faq") ? "text-primary" : "text-foreground/80 hover:text-primary"} transition`}>
                FAQ
              </Link>
              <Link to="/contact" onClick={closeMobileMenu} className={`${isActive("/contact") ? "text-primary" : "text-foreground/80 hover:text-primary"} transition`}>
                Contact
              </Link>

              <Link to="/login" onClick={closeMobileMenu}>
                <Button className="bg-gradient-cta w-full hover:opacity-90 text-primary-foreground shadow-glow">
                  Get Started
                </Button>
              </Link>

              {/* Mobile Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-3 rounded-lg border border-border hover:bg-accent w-full transition-all flex items-center justify-center"
              >
                {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
              </button>

            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
