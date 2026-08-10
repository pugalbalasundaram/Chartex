import Navbar from "@/components/landing/Navbar/Navbar";
import Hero from "@/components/landing/Hero/Hero";
import Features from "@/components/landing/Features/Features";
import DashboardPreview from "@/components/landing/DashboardPreview/DashboardPreview";
import Workflow from "@/components/landing/Workflow/Workflow";
import TrustedBy from "@/components/landing/TrustedBy/TrustedBy";
import Capabilities from "@/components/landing/Capabilities/Capabilities";
import ProductScreenshots from "@/components/landing/Screenshots/ProductScreenshots";
import Testimonials from "@/components/landing/Testimonials/Testimonials";
import Pricing from "@/components/landing/Pricing/Pricing";
import FAQ from "@/components/landing/FAQ/FAQ";
import CTA from "@/components/landing/CTA/CTA";
import Footer from "@/components/landing/Footer/Footer";

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#05070c] text-white selection:bg-cyan-300 selection:text-slate-950">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <Workflow />
      <DashboardPreview />
      <Capabilities />
      <ProductScreenshots />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
