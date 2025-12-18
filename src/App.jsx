// /home/tao/projects/online-resume/raj-manghani-odyssey/src/App.jsx
import { useEffect, Suspense, useRef, useState } from 'react'; // Removed React (implicit) and useMemo
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three'; // Removed THREE
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
import HistorySection from './sections/HistorySection/HistorySection'; // Import the new History section
import SkillsSection from './sections/SkillsSection/SkillsSection';
import ExperienceSection from './sections/ExperienceSection/ExperienceSection';
import ProjectsCertsSection from './sections/ProjectsCertsSection/ProjectsCertsSection';
import TechExpertiseSection from './sections/TechExpertiseSection/TechExpertiseSection';
import ContactSection from './sections/ContactSection/ContactSection';
import BriefingSection from './sections/BriefingSection/BriefingSection';

import './infoBox.scss';
import './Header.scss'; // Import new SCSS file for header/menu styles

gsap.registerPlugin(ScrollTrigger);

const APP_VERSION = '1.00.2';

// --- Main App Component ---
function App() {
  const [showResume, setShowResume] = useState(true);
  const [activeInfo, setActiveInfo] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const mainRef = useRef();

  // useEffect for GSAP & Visibility (Simplified - Let sections handle own entrance)
  useEffect(() => {
    const mainElement = mainRef.current;
    gsap.killTweensOf(mainElement); // Kill any ongoing tweens on the main element

    if (showResume) {
      // Animate the main container to visible
      gsap.to(mainElement, { autoAlpha: 1, duration: 0.3 });
      // Enable all ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.enable());
      // Ensure ScrollTrigger is refreshed in case calculations were off while hidden
      ScrollTrigger.refresh();
    } else {
      // Disable all ScrollTriggers when hiding resume to prevent interference
      // This is important so section animations don't run while hidden
      ScrollTrigger.getAll().forEach(trigger => trigger.disable(true)); // true resets progress
      // Animate the main container to hidden
      gsap.to(mainElement, { autoAlpha: 0, duration: 0.3 });
    }
    // No App-level cleanup needed for section triggers
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
    setIsMobileMenuOpen(false); // Close mobile menu on link click
  };

  // DevOps Monitor Button Click Handler
  const handleDevOpsClick = () => {
    alert("Opening Grafana monitor in a new tab.\nDefault credentials: user / user");
    window.open('/grafana/', '_blank', 'noopener,noreferrer'); // Open in new tab securely
  };

  // Toggle Mobile Menu
  const toggleMobileMenu = () => {
    console.log('Toggling mobile menu. Current state:', isMobileMenuOpen); // Log current state
    setIsMobileMenuOpen(prevState => !prevState); // Use functional update
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
   console.log('[App] Rendering - isMobileMenuOpen:', isMobileMenuOpen); // Log menu state on render

  return (
    <div className="app-container">
        {/* Add mobile-menu-active class when open */}
        <header className={`app-header ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
            {/* Hamburger Button (visible on mobile) */}
            <button className="hamburger-button" onClick={toggleMobileMenu} aria-label="Toggle menu" aria-expanded={isMobileMenuOpen}>
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar"></span>
            </button>

            {/* Navigation Links (conditionally styled/classed for mobile) */}
            <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
                <a href="#about" onClick={handleMenuClick}>About</a> {/* Landing section is still 'about' */}
                <a href="#history" onClick={handleMenuClick}>History</a> {/* Add History link */}
                <a href="#briefing" onClick={handleMenuClick}>Briefing</a>
                <a href="#skills" onClick={handleMenuClick}>Skills</a>
                <a href="#expertise" onClick={handleMenuClick}>Expertise</a>
                <a href="#experience" onClick={handleMenuClick}>Experience</a>
                <a href="#projects" onClick={handleMenuClick}>Projects</a>
                <a href="#contact" onClick={handleMenuClick}>Contact</a>
            </nav>
            <div className="version-badge" aria-label={`Application version ${APP_VERSION}`}>
                Version {APP_VERSION}
            </div>
            {/* DevOps Monitor Button */}
        </header>

        <button className="toggle-view-button" onClick={() => setShowResume(!showResume)}> {/* Unchanged */}
            {showResume ? 'Explore Solar System' : 'Show Resume'}
        </button>
        {/* DevOps Monitor Button - Moved and styled like toggle button */}
        <button className="toggle-view-button devops-monitor-button-spacing" onClick={handleDevOpsClick}>
            View DevOps Monitor
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
                        // activeInfo={activeInfo} // No longer needed by SolarSystemGroup
                        handlePlanetClick={handleBodyClick} // Pass the correct handler
                    />
                </Suspense>
            </Canvas>
        </div>

        <main ref={mainRef} className={`main-content ${showResume ? 'visible' : 'hidden'}`}> {/* Apply visibility class */}
            <LandingSection id="about" /> {/* Keep LandingSection with id="about" */}
            <HistorySection id="history" /> {/* Add HistorySection */}
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
