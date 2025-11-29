import { Car } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
      py-12 border-t border-border backdrop-blur-md
      bg-card/60 transition-all duration-500

      dark:bg-gradient-to-r dark:from-[#08010F] dark:via-[#380996] dark:to-[#240404]
      "
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-hero shadow-glow animate-pulse-subtle">
              <Car className="w-5 h-5 text-white" />
            </div>

            <span className="
              text-xl font-bold tracking-wide 
              bg-gradient-hero bg-clip-text text-transparent
            ">
              RideBook
            </span>
          </div>

          {/* COPYRIGHT */}
          <p className="text-sm text-muted-foreground dark:text-gray-300 text-center">
            © {currentYear} RideBook • All Rights Reserved.
          </p>

          {/* FOOTER LINKS */}
          <div className="flex gap-6 text-sm font-medium">
            <a
              href="#"
              className="
                text-muted-foreground dark:text-gray-300 
                hover:text-primary hover:tracking-wide transition-all
              "
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="
                text-muted-foreground dark:text-gray-300 
                hover:text-primary hover:tracking-wide transition-all
              "
            >
              Terms of Service
            </a>
          </div>

        </div>

        {/* Bottom Divider Shine */}
        <div className="mt-10 h-[2px] w-full bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 opacity-50 dark:opacity-80 animate-shimmer" />
      </div>
    </footer>
  );
};

export default Footer;
