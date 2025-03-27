// src/App.jsx
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- CORRECT Imports for Section Components ---
import LandingSection from './sections/LandingSection/LandingSection';
import SkillsSection from './sections/SkillsSection/SkillsSection';
import ExperienceSection from './sections/ExperienceSection/ExperienceSection';
import ProjectsCertsSection from './sections/ProjectsCertsSection/ProjectsCertsSection';
import TechExpertiseSection from './sections/TechExpertiseSection/TechExpertiseSection';
import ContactSection from './sections/ContactSection/ContactSection';
// --- End Section Imports ---

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // --- GSAP Animations for Section Entry ---
    const sections = gsap.utils.toArray('main > section');

    sections.forEach((section) => {
      // Add the class for initial state (hidden), only if it doesn't have it yet
      // This prevents re-adding if HMR updates
      if (!section.classList.contains('section-fade-in')) {
          section.classList.add('section-fade-in');
      }

      // Use ScrollTrigger.create for better cleanup potential
      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        end: 'bottom 20%',
        // markers: true, // Uncomment during development
        onEnter: () => gsap.to(section, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' }),
        onLeaveBack: () => gsap.to(section, { opacity: 0, y: 30, duration: 0.5, ease: 'power3.in', overwrite: 'auto' }),
        // toggleActions: 'play none none reverse', // Alternative: simpler but might replay on scroll up/down fast
      });
    });

    // Cleanup ScrollTriggers when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="app-container">
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