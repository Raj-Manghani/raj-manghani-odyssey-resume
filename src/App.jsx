// /home/tao/projects/online-resume/raj-manghani-odyssey/src/App.jsx
import React, { useEffect, Suspense, useRef, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Data Imports
import { PLANET_DATA } from './constants/solarSystemData'; // Import planet data

// Import components
import TwinklingStars from './components/TwinklingStars/TwinklingStars';
import FlyingObjects from './components/FlyingObjects/FlyingObjects';
import AsteroidField from './components/AsteroidField/AsteroidField';
import DetailPanel from './components/DetailPanel/DetailPanel'; // Keep this import
import Skybox from './components/Skybox/Skybox'; // Import extracted component
import SolarSystemGroup from './components/SolarSystemGroup/SolarSystemGroup'; // Import extracted component

// Section Imports
import LandingSection from './sections/LandingSection/LandingSection';
import SkillsSection from './sections/SkillsSection/SkillsSection';
import ExperienceSection from './sections/ExperienceSection/ExperienceSection';
import ProjectsCertsSection from './sections/ProjectsCertsSection/ProjectsCertsSection';
import TechExpertiseSection from './sections/TechExpertiseSection/TechExpertiseSection';
import ContactSection from './sections/ContactSection/ContactSection';

import './infoBox.scss'; // Import the SCSS file instead

gsap.registerPlugin(ScrollTrigger);

// Removed inline Skybox component definition
// Removed inline SolarSystemGroup component definition

// --- Main App Component ---
function App() {
  const [showResume, setShowResume] = useState(true);
  const [activeInfo, setActiveInfo] = useState(null);
  const mainRef = useRef();

  // useEffect for GSAP & Visibility (Unchanged)
  useEffect(() => {
    const mainElement = mainRef.current;
    const sections = mainElement ? gsap.utils.toArray(mainElement.children) : [];
    let triggers = [];
    gsap.killTweensOf(mainElement);
    if (showResume) {
        gsap.set(mainElement, { autoAlpha: 1 });
        gsap.set(sections, { autoAlpha: 0, y: 30 });
        const timer = setTimeout(() => {
            sections.forEach((section) => {
                const trigger = ScrollTrigger.create({
                    trigger: section, start: 'top 85%', end: 'bottom 15%',
                    onEnter: () => gsap.to(section, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' }),
                    onLeaveBack: () => gsap.to(section, { autoAlpha: 0, y: 30, duration: 0.5, ease: 'power3.in', overwrite: 'auto' }),
                    invalidateOnRefresh: true
                });
                triggers.push(trigger);
            });
        }, 100);
        return () => { clearTimeout(timer); triggers.forEach(trigger => trigger.kill()); };
    } else {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        gsap.to(mainElement, { autoAlpha: 0, duration: 0.3 });
    }
  }, [showResume]);

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

  // Planet click handler (Receives lowercase key now)
  const handlePlanetClick = (planetKey) => {
      console.log(`[App] handlePlanetClick received: ${planetKey}`);
      console.log(`[App] Current activeInfo BEFORE update: ${activeInfo}`);
      setActiveInfo(current => {
          const nextState = current === planetKey ? null : planetKey;
          console.log(`[App] Setting activeInfo to: ${nextState}`);
          return nextState;
      });
  };

  // Close panel handler (Unchanged)
  const handleClosePanel = () => {
      console.log("[App] handleClosePanel called.");
      setActiveInfo(null);
  };

  // Get the data object for the active planet/body (Uses imported PLANET_DATA)
  const activePlanetData = activeInfo ? PLANET_DATA[activeInfo] : null;

  // Logging for rendering (Unchanged)
  console.log(`[App] Rendering - activeInfo: ${activeInfo}`);
  console.log(`[App] Rendering - activePlanetData found: ${!!activePlanetData}`);
  if (activePlanetData) {
      // console.log("[App] activePlanetData contents:", activePlanetData);
  }

  return (
    <div className="app-container">
        <header className="app-header"> {/* Unchanged */}
            <nav>
                <a href="#about" onClick={handleMenuClick}>About</a>
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

        {/* --- Render DetailPanel (Unchanged) --- */}
        <DetailPanel data={activePlanetData} onClose={handleClosePanel} />

        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}> {/* Unchanged */}
            <Canvas shadows camera={{ position: [0, 40, 120], fov: 50 }}>
                <OrbitControls enableDamping dampingFactor={0.1} />
                {/* Use imported Skybox */}
                <Suspense fallback={null}><Skybox /></Suspense>
                <ambientLight intensity={0.60} />
                <pointLight position={[0, 0, 0]} intensity={750} distance={1000} decay={2} color="#FFF0D0" castShadow shadow-mapSize-height={1024} shadow-mapSize-width={1024} shadow-bias={-0.005}/>
                <Suspense fallback={null}>
                    <TwinklingStars count={200} />
                    <AsteroidField count={60} />
                    <FlyingObjects count={3} />
                    {/* Use imported SolarSystemGroup */}
                    <SolarSystemGroup
                        activeInfo={activeInfo}
                        handlePlanetClick={handlePlanetClick}
                    />
                </Suspense>
            </Canvas>
        </div>

        <main ref={mainRef} className={`main-content ${showResume ? 'visible' : 'hidden'}`}> {/* Unchanged */}
            <LandingSection id="about" />
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