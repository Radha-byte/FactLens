import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Workflow from "@/components/landing/Workflow";
import Architecture from "@/components/landing/Architecture";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <Architecture />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
