// src/App.jsx
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import Background Component
import BackgroundParticles from './components/BackgroundParticles/BackgroundParticles';

// Import Section Components
import LandingSection from './sections/LandingSection/LandingSection';
import SkillsSection from './sections/SkillsSection/SkillsSection';
import ExperienceSection from './sections/ExperienceSection/ExperienceSection';
import ProjectsCertsSection from './sections/ProjectsCertsSection/ProjectsCertsSection';
import TechExpertiseSection from './sections/TechExpertiseSection/TechExpertiseSection';
import ContactSection from './sections/ContactSection/ContactSection';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // GSAP Animations for Section Entry
    const sections = gsap.utils.toArray('main > section');

    sections.forEach((section) => {
      if (!section.classList.contains('section-fade-in')) {
          section.classList.add('section-fade-in');
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%', // Start animation a bit lower on the screen
        end: 'bottom 15%',
        // markers: true,
        onEnter: () => gsap.to(section, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' }),
        onLeaveBack: () => gsap.to(section, { opacity: 0, y: 30, duration: 0.5, ease: 'power3.in', overwrite: 'auto' }),
      });
    });

    // Cleanup ScrollTriggers when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="app-container">
      <BackgroundParticles /> {/* Add the particle background */}
      {/* Optional Header can go here */}
      <main>
        {/* Pass the 'id' prop for potential navigation */}
        <LandingSection id="about" />
        <SkillsSection id="skills" />
        <ExperienceSection id="experience" />
        <ProjectsCertsSection id="projects" />
        <TechExpertiseSection id="expertise" />
        <ContactSection id="contact" />
      </main>
      {/* Optional Footer can go here */}
    </div>
  );
}

export default App;
