import { HeroSlider } from "@/components/home/hero-slider"
import { StatsSection } from "@/components/home/stats-section"
import { BestWorkers } from "@/components/home/best-workers"
import { HowItWorks } from "@/components/home/how-it-works"
import { FeaturesSection } from "@/components/home/features-section"
import { Testimonials } from "@/components/home/testimonials"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <StatsSection />
      <BestWorkers />
      <HowItWorks />
      <FeaturesSection />
      <Testimonials />
      <CTASection />
    </>
  )
}
