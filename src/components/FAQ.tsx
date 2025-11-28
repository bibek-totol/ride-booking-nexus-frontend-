import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How does RideBook match Riders & Drivers?",
      answer: "RideBook uses intelligent location-based algorithms to match riders with the nearest available drivers. When a rider requests a ride, the system identifies drivers within proximity and sends them a ride request. Drivers can accept or reject based on their preference. The platform prioritizes driver ratings, distance, and availability to ensure optimal matching for both parties."
    },
    {
      question: "Can Drivers upload documents for verification?",
      answer: "Yes, drivers can easily upload their documents directly through the platform's document management system. This includes driver's license, vehicle registration, insurance documents, and identity verification. The admin team reviews these documents to ensure compliance and safety standards. Once verified, drivers receive approval notifications and can start accepting rides immediately."
    },
    {
      question: "How do push notifications work for approvals?",
      answer: "Our email push notification system keeps users informed in real-time. When an admin performs actions such as approving a driver, suspending an account, or completing document verification, the affected user receives an instant email notification. These notifications include detailed information about the action taken and any next steps required from the user."
    },
    {
      question: "Is Google/OTP login supported?",
      answer: "Absolutely! RideBook offers multiple secure authentication methods. Users can sign in using their Google account via OAuth for quick access, or choose traditional email/password authentication. For enhanced security, we also provide OTP (One-Time Password) verification via email for both login and password reset processes, ensuring your account remains protected."
    },
    {
      question: "Do Riders & Drivers have separate dashboards?",
      answer: "Yes, RideBook provides role-specific dashboards tailored to each user type. Riders have access to a dashboard showing their ride history, active bookings, and profile management. Drivers see their earnings analytics, ride requests, and availability status. Admins have a comprehensive dashboard with platform-wide metrics, user management tools, and global ride monitoring capabilities."
    },
    {
      question: "Does RideBook support real-time ride tracking?",
      answer: "Yes! Real-time ride tracking is a core feature of RideBook. Riders can track their driver's location live on an interactive map from the moment the ride is accepted until completion. The system shows real-time updates including driver pickup time, current location, and estimated arrival. This transparency ensures riders feel safe and informed throughout their journey."
    }
  ];

  return (
    <section id="faq" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-10 " />
      <div className="absolute inset-0 bg-gradient-glow animate-pulse-glow " />

      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-slow" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about RideBook
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto animate-fade-in">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
