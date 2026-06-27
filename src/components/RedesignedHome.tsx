"use client";

import { useEffect, useRef } from "react";
import PremiumLoader from "./animations/PremiumLoader";
import JungleBackground from "./animations/JungleBackground";
import Hero from "./hero/Hero";
import ServicesSection from "./services/ServicesSection";
import PortfolioSection from "./portfolio/PortfolioSection";
import TemplatesSection from "./templates/TemplatesSection";
import PricingSection from "./pricing/PricingSection";
import LeadFormSection from "./forms/LeadFormSection";
import NewFooter from "./footer/NewFooter";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ScrollTransition } from "@/components/ScrollTransition";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function RedesignedHome() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use useEffect to handle any global setup if needed
  useEffect(() => {
    // Smooth scrolling can be handled here or via existing Lenis provider
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    // Scroll Velocity Skew Effect
    const proxy = { skew: 0 },
      skewSetter = gsap.quickSetter(".skew-container", "skewY", "deg"),
      clamp = gsap.utils.clamp(-5, 5); // Limit the maximum skew to 5 degrees

    ScrollTrigger.create({
      onUpdate: (self) => {
        const skew = clamp(self.getVelocity() / -300);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: "power3",
            overwrite: true,
            onUpdate: () => skewSetter(proxy.skew),
          });
        }
      },
    });
    
    // Smoothly reset on resize
    const onResize = () => skewSetter(0);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative bg-background min-h-screen text-foreground overflow-hidden font-sans skew-container">
      <PremiumLoader />
      
      {/* Background layer */}
      <JungleBackground />

      {/* Content Layers */}
      <div className="relative z-10 flex flex-col">
        {/* Page 1: Hero */}
        <Hero />
        
        {/* Page 2 & 3: Services */}
        <ScrollTransition effect="depth-pull">
          <ServicesSection />
        </ScrollTransition>
        
        {/* Page 4: Portfolio */}
        <PortfolioSection />
        
        {/* Page 5: Templates */}
        <ScrollTransition effect="fade-slide">
          <TemplatesSection />
        </ScrollTransition>
        
        {/* Page 6: Pricing */}
        <ScrollTransition effect="zoom-in">
          <PricingSection />
        </ScrollTransition>
        
        {/* Page 7: Lead Form */}
        <ScrollTransition effect="curtain">
          <LeadFormSection />
        </ScrollTransition>
        
        {/* Page 8: Footer */}
        <NewFooter />
      </div>
    </main>
  );
}
