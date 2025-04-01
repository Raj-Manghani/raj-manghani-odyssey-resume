// /home/tao/projects/online-resume/raj-manghani-odyssey/src/App.jsx
import React, { useEffect, Suspense, useRef, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Data Imports
// import { PLANET_DATA } from './constants/solarSystemData'; // Old JS import
import PLANET_DATA from './data/solarSystemData.json'; // Import JSON data

// Import components
import TwinklingStars from './components/TwinklingStars/TwinklingStars';
import FlyingObjects from './components/FlyingObjects/FlyingObjects';
import AsteroidField from './components/AsteroidField/AsteroidField';
import DetailPanel from './components/DetailPanel/DetailPanel'; // Keep this import
import Skybox from './components/Skybox/Skybox';
import SolarSystemGroup from './components/SolarSystemGroup/SolarSystemGroup';
import TerminalComponent from './components/Terminal/Terminal'; // Import the new Terminal component

// Section Imports
import LandingSection from './sections/LandingSection/LandingSection';
import SkillsSection from './sections/SkillsSection/SkillsSection';
import ExperienceSection from './sections/ExperienceSection/ExperienceSection';
import ProjectsCertsSection from './sections/ProjectsCertsSection/ProjectsCertsSection';
import TechExpertiseSection from './sections/TechExpertiseSection/TechExpertiseSection';
import ContactSection from './sections/ContactSection/ContactSection';
import BriefingSection from './sections/BriefingSection/BriefingSection'; // Import the new section

import './infoBox.scss'; // Import the SCSS file instead

gsap.registerPlugin(ScrollTrigger);

// --- Main App Component ---
function App() {
  const [showResume, setShowResume] = useState(true);
  const [activeInfo, setActiveInfo] = useState(null); // Stores the key of the active planet OR moon
  const mainRef = useRef();

  // useEffect for GSAP & Visibility (Restored Original Logic)
  useEffect(() => {
    const mainElement = mainRef.current;
    const sections = mainElement ? gsap.utils.toArray(mainElement.children) : [];
    let triggers = [];
    gsap.killTweensOf(mainElement); // Kill any ongoing tweens

    if (showResume) {
        gsap.set(mainElement, { autoAlpha: 1 }); // Ensure main container is visible
        // Initially hide all sections before setting up triggers
        gsap.set(sections, { autoAlpha: 0, y: 30 });
        // Use a slight delay to ensure layout is stable before creating triggers
        const timer = setTimeout(() => {
            sections.forEach((section) => {
                // Create a ScrollTrigger for each section to animate it in/out
                const trigger = ScrollTrigger.create({
                    trigger: section,
                    start: 'top 85%', // When top of section hits 85% from top of viewport
                    end: 'bottom 15%', // When bottom of section leaves 15% from top of viewport
                    // Animate in on enter
                    onEnter: () => gsap.to(section, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' }),
                    // Animate out on leave back (scrolling up)
                    onLeaveBack: () => gsap.to(section, { autoAlpha: 0, y: 30, duration: 0.5, ease: 'power3.in', overwrite: 'auto' }),
                    invalidateOnRefresh: true // Recalculate on resize/refresh
                });
                triggers.push(trigger); // Keep track of triggers to kill them later
            });
        }, 100); // 100ms delay

        // Cleanup function: kill timer and triggers when effect reruns or component unmounts
        return () => {
            clearTimeout(timer);
            triggers.forEach(trigger => trigger.kill());
        };
    } else {
        // If hiding the resume view, kill all active ScrollTriggers immediately
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        // Animate the main container out
        gsap.to(mainElement, { autoAlpha: 0, duration: 0.3 });
    }
  }, [showResume]); // Rerun effect if showResume changes

  // Menu click handler (Unchanged)
  const handleMenuClick = (e) => {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    if (!showResume) {
        setShowResume(true);
        setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350);
    } else {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Click handler for Planets AND Moons
  const handleBodyClick = (key) => { // Renamed from handlePlanetClick for clarity
      console.log(`[App] handleBodyClick received: ${key}`);
      console.log(`[App] Current activeInfo BEFORE update: ${activeInfo}`);
      setActiveInfo(current => {
          const nextState = current === key ? null : key;
          console.log(`[App] Setting activeInfo to: ${nextState}`);
          return nextState;
      });
  };

  // Close panel handler (Unchanged)
  const handleClosePanel = () => {
      console.log("[App] handleClosePanel called.");
      setActiveInfo(null);
   };

   // --- Function to get data object for active planet OR moon ---
   const getActiveBodyData = (key) => {
       if (!key) return null;

       // Check if it's a top-level planet/sun key (using imported JSON data)
       if (PLANET_DATA[key]) {
           return PLANET_DATA[key];
       }

       // Check if it's a moon key (e.g., "jupiter_io")
       for (const planetKey in PLANET_DATA) {
           const planet = PLANET_DATA[planetKey];
           if (planet.moons && planet.moons.length > 0) {
               const foundMoon = planet.moons.find(moon => moon.key === key);
               if (foundMoon) {
                   // Return the found moon data
                   return foundMoon;
               }
           }
       }

       console.warn(`[App] Data not found for key: ${key}`);
       return null; // Key not found
   };

   // Get the data for the currently active body (planet or moon)
   const activeBodyData = getActiveBodyData(activeInfo);
   // --- End Update ---

   // Logging for rendering
   console.log(`[App] Rendering - activeInfo: ${activeInfo}`);
   console.log(`[App] Rendering - activeBodyData found: ${!!activeBodyData}`);

  return (
    <div className="app-container">
        <header className="app-header"> {/* Unchanged */}
            <nav>
                <a href="#about" onClick={handleMenuClick}>About</a>
                <a href="#briefing" onClick={handleMenuClick}>Briefing</a>
                <a href="#skills" onClick={handleMenuClick}>Skills</a>
                <a href="#expertise" onClick={handleMenuClick}>Expertise</a>
                <a href="#experience" onClick={handleMenuClick}>Experience</a>
                <a href="#projects" onClick={handleMenuClick}>Projects</a>
                <a href="#contact" onClick={handleMenuClick}>Contact</a>
            </nav>
        </header>

        <button className="toggle-view-button" onClick={() => setShowResume(!showResume)}> {/* Unchanged */}
            {showResume ? 'Explore Solar System' : 'Show Resume'}
        </button>

        {!showResume && ( /* Unchanged */
            <div className="controls-info">
                <p><span>L-Drag:</span> Orbit | <span>R-Drag:</span> Pan | <span>Scroll:</span> Zoom</p>
            </div>
        )}

        {/* --- Render Terminal Component (Conditionally) --- */}
        {!showResume && <TerminalComponent />}

        {/* --- Render DetailPanel (Passes data for planet OR moon) --- */}
        <DetailPanel data={activeBodyData} onClose={handleClosePanel} />

        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}> {/* Canvas container */}
            <Canvas shadows camera={{ position: [0, 0, 60], fov: 50 }}>
                <OrbitControls enableDamping dampingFactor={0.1} />
                {/* Use imported Skybox */}
                <Suspense fallback={null}><Skybox /></Suspense>
                <ambientLight intensity={0.60} />
                <pointLight position={[0, 0, 0]} intensity={750} distance={1000} decay={2} color="#FFF0D0" castShadow shadow-mapSize-height={1024} shadow-mapSize-width={1024} shadow-bias={-0.005}/>
                <Suspense fallback={null}>
                    <TwinklingStars count={200} />
                    <AsteroidField count={60} />
                    <FlyingObjects count={3} />
                    {/* Pass the updated click handler */}
                    <SolarSystemGroup
                        activeInfo={activeInfo}
                        handlePlanetClick={handleBodyClick} // Pass the correct handler
                    />
                </Suspense>
            </Canvas>
        </div>

        <main ref={mainRef} className={`main-content ${showResume ? 'visible' : 'hidden'}`}> {/* Apply visibility class */}
            <LandingSection id="about" />
            <BriefingSection id="briefing" />
            <SkillsSection id="skills" />
            <TechExpertiseSection id="expertise" />
            <ExperienceSection id="experience" />
            <ProjectsCertsSection id="projects" />
            <ContactSection id="contact" />
        </main>
    </div>
  );
}
export default App;
