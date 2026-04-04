import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ProjectsPlayground } from "@/components/ProjectsPlayground";
import { ContactSection } from "@/components/ContactSection";
import { CheatCodes } from "@/components/CheatCodes";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <CheatCodes />
      <div id="hero"><HeroSection /></div>
      <div id="about"><AboutSection /></div>
      <div id="experience"><ExperienceSection /></div>
      <div id="projects"><ProjectsPlayground /></div>
      <div id="contact"><ContactSection /></div>
    </div>
  );
}
