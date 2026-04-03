import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ProjectsPlayground } from "@/components/ProjectsPlayground";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsPlayground />
      <ContactSection />
    </div>
  );
}
