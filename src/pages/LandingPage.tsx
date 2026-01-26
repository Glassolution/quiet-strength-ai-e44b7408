import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Privacy } from "@/components/landing/Privacy";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

interface LandingPageProps {
  onStartChat: () => void;
}

export function LandingPage({ onStartChat }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Hero onStartChat={onStartChat} />
      <Features />
      <Privacy />
      <CTA onStartChat={onStartChat} />
      <Footer />
    </div>
  );
}
