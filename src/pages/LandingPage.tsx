import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Privacy } from "@/components/landing/Privacy";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

import { User } from "@supabase/supabase-js";

interface LandingPageProps {
  onStartChat: () => void;
  user: User | null;
}

export function LandingPage({ onStartChat, user }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Hero onStartChat={onStartChat} user={user} />
      <Features />
      <Privacy />
      <CTA onStartChat={onStartChat} />
      <Footer />
    </div>
  );
}
