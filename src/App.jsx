// /home/tao/projects/online-resume/raj-manghani-odyssey/src/App.jsx
import React, { useEffect, Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import components
import TwinklingStars from './components/TwinklingStars/TwinklingStars';
import PlanetSystem from './components/PlanetSystem/PlanetSystem';
import FlyingObjects from './components/FlyingObjects/FlyingObjects';
import AsteroidField from './components/AsteroidField/AsteroidField';
import DetailPanel from './components/DetailPanel/DetailPanel'; // Keep this import

// Section Imports
import LandingSection from './sections/LandingSection/LandingSection';
import SkillsSection from './sections/SkillsSection/SkillsSection';
import ExperienceSection from './sections/ExperienceSection/ExperienceSection';
import ProjectsCertsSection from './sections/ProjectsCertsSection/ProjectsCertsSection';
import TechExpertiseSection from './sections/TechExpertiseSection/TechExpertiseSection';
import ContactSection from './sections/ContactSection/ContactSection';

import './infoBox.css'; // Keep this import

gsap.registerPlugin(ScrollTrigger);

// --- Planet Data (Unchanged) ---
const degToRad = (degrees) => degrees * (Math.PI / 180);
const genericMoonTexture = '/textures/moon_map.jpg';
const sunSize = 3.0;

const PLANET_DATA = {
    sun: { name: "Sun", size: sunSize, isEmissive: true, vitals: "Type: G-type Star | Diameter: ~1.4 million km | Temp: ~5,500°C (surface)", description: "The star at the center of our solar system, providing light and heat.", funFact: "The Sun accounts for about 99.86% of the total mass of the Solar System!", moons: [] },
    mercury: { name: "Mercury", size: 0.25, orbitRadius: 5, orbitSpeed: 0.25, yOffset: 0.1, tilt: degToRad(0.03), moons: [], vitals: "Type: Rocky Planet | Diameter: ~4,880 km | Temp: -173 to 427°C", description: "The smallest planet and closest to the Sun, with extreme temperature variations.", funFact: "A year on Mercury (one orbit) takes only 88 Earth days!" },
    venus:   { name: "Venus", size: 0.55, orbitRadius: 8, orbitSpeed: 0.18, yOffset: -0.2, tilt: degToRad(177.4), moons: [], vitals: "Type: Rocky Planet | Diameter: ~12,104 km | Temp: ~465°C (Hottest!)", description: "Similar in size to Earth but with a thick, toxic atmosphere and runaway greenhouse effect.", funFact: "Venus rotates backwards compared to most planets, and very slowly (a day is longer than its year)." },
    earth:   { name: "Earth", size: 0.6,  orbitRadius: 12, orbitSpeed: 0.15, yOffset: 0, tilt: degToRad(23.4), moons: [ { name: "Moon", size: 0.15, textureUrl: genericMoonTexture, orbitRadius: 1.0, orbitSpeed: 0.5, vitals: "Type: Natural Satellite | Diameter: ~3,474 km", description: "Earth's only natural satellite, influencing tides and stabilizing our planet's wobble.", funFact: "The Moon is slowly moving away from Earth at about 3.8 cm per year." } ], vitals: "Type: Rocky Planet | Diameter: ~12,742 km | Temp: Avg ~15°C", description: "Our home planet, the only known place with liquid water on the surface and life.", funFact: "Earth is not perfectly round; it bulges slightly at the equator." },
    mars:    { name: "Mars", size: 0.4, orbitRadius: 17, orbitSpeed: 0.12, yOffset: 0.3, tilt: degToRad(25.2), moons: [ { name: "Phobos", size: 0.05, textureUrl: genericMoonTexture, orbitRadius: 0.6, orbitSpeed: 0.7, vitals:"Moon", description:"Mars moon 1", funFact:"Fact 1"}, { name: "Deimos", size: 0.04, textureUrl: genericMoonTexture, orbitRadius: 0.8, orbitSpeed: 0.6, vitals:"Moon", description:"Mars moon 2", funFact:"Fact 2" } ], vitals: "Type: Rocky Planet | Diameter: ~6,779 km | Temp: -153 to 20°C", description: "The 'Red Planet', known for its iron oxide dust, polar ice caps, and potential for past life.", funFact: "Mars has the tallest volcano and the deepest, longest canyon in the solar system." },
    jupiter: { name: "Jupiter", size: 1.5, orbitRadius: 28, orbitSpeed: 0.06, yOffset: -0.4, tilt: degToRad(3.1), moons: [ { name: "Io", size: 0.3,  textureUrl: genericMoonTexture, orbitRadius: 2.5, orbitSpeed: 0.2, vitals:"Moon", description:"Jup moon 1", funFact:"Fact 1" }, { name: "Europa", size: 0.25, textureUrl: genericMoonTexture, orbitRadius: 3.2, orbitSpeed: 0.18, vitals:"Moon", description:"Jup moon 2", funFact:"Fact 2" }, { name: "Ganymede", size: 0.28, textureUrl: genericMoonTexture, orbitRadius: 4.0, orbitSpeed: 0.15, vitals:"Moon", description:"Jup moon 3", funFact:"Fact 3" } ], vitals: "Type: Gas Giant | Diameter: ~139,820 km | Temp: Avg ~-145°C (cloud tops)", description: "The largest planet in the solar system, a massive ball of gas with a Great Red Spot storm.", funFact: "Jupiter has the shortest day of all the planets, rotating once in just under 10 hours." },
    saturn:  { name: "Saturn", size: 1.2, orbitRadius: 40, orbitSpeed: 0.045, yOffset: 0.2, tilt: degToRad(26.7), moons: [ { name: "Titan", size: 0.25, textureUrl: genericMoonTexture, orbitRadius: 3.8, orbitSpeed: 0.1, vitals:"Moon", description:"Saturn moon 1", funFact:"Fact 1" }, { name: "Rhea", size: 0.2,  textureUrl: genericMoonTexture, orbitRadius: 4.8, orbitSpeed: 0.09, vitals:"Moon", description:"Saturn moon 2", funFact:"Fact 2" } ], vitals: "Type: Gas Giant | Diameter: ~116,460 km | Temp: Avg ~-178°C (cloud tops)", description: "Famous for its stunning, complex ring system made mostly of ice particles.", funFact: "Saturn is the least dense planet; it would float in water (if you could find a bathtub big enough!)." },
    uranus:  { name: "Uranus", size: 0.9, orbitRadius: 55, orbitSpeed: 0.03, yOffset: -0.1, tilt: degToRad(97.8), moons: [ { name: "Titania", size: 0.18, textureUrl: genericMoonTexture, orbitRadius: 1.8, orbitSpeed: 0.12, vitals:"Moon", description:"Uranus moon 1", funFact:"Fact 1" }, { name: "Oberon", size: 0.15, textureUrl: genericMoonTexture, orbitRadius: 2.5, orbitSpeed: 0.1, vitals:"Moon", description:"Uranus moon 2", funFact:"Fact 2" } ], vitals: "Type: Ice Giant | Diameter: ~50,724 km | Temp: Avg ~-216°C (cloud tops)", description: "An ice giant tilted on its side, possibly due to a massive collision long ago.", funFact: "Uranus appears blue-green because of methane gas in its atmosphere, which absorbs red light." },
    neptune: { name: "Neptune", size: 0.85, orbitRadius: 70, orbitSpeed: 0.025, yOffset: 0.15, tilt: degToRad(28.3), moons: [ { name: "Triton", size: 0.2, textureUrl: genericMoonTexture, orbitRadius: 2.0, orbitSpeed: 0.08, vitals:"Moon", description:"Neptune moon 1", funFact:"Fact 1" } ], vitals: "Type: Ice Giant | Diameter: ~49,244 km | Temp: Avg ~-214°C (cloud tops)", description: "A dark, cold ice giant with the strongest winds in the solar system.", funFact: "Neptune was the first planet located through mathematical prediction rather than direct observation." },
};
// --- End planetData ---

// Skybox Component (Unchanged)
function Skybox() { const texture = useTexture('/textures/star_milky_way.jpg'); return ( <mesh scale={[-1, 1, 1]}> <sphereGeometry args={[500, 64, 32]} /> <meshBasicMaterial map={texture} side={THREE.BackSide} /> </mesh> ); }


// ============================================
// --- SolarSystemGroup Component (MODIFIED) ---
// ============================================
function SolarSystemGroup({ activeInfo, handlePlanetClick }) {
  const orbitRefs = useMemo(() => {
    const refs = {};
    // Use lowercase keys directly from PLANET_DATA for refs
    Object.keys(PLANET_DATA).filter(key => key !== 'sun').forEach(key => { refs[key] = React.createRef(); });
    return refs;
  }, []); // Dependency array is empty, refs are created once

  useFrame((state, delta) => {
    // Use lowercase keys to access refs and data
    Object.keys(PLANET_DATA).filter(key => key !== 'sun').forEach((key) => {
      if (orbitRefs[key]?.current) {
        orbitRefs[key].current.rotation.y += delta * PLANET_DATA[key].orbitSpeed;
      }
    });
  });

  return (
    <group>
       {/* --- Sun --- */}
       <PlanetSystem
         planetKey="sun" // *** ADDED: Pass the lowercase key ***
         name={PLANET_DATA.sun.name} // Keep capitalized name for display
         vitals={PLANET_DATA.sun.vitals}
         description={PLANET_DATA.sun.description}
         funFact={PLANET_DATA.sun.funFact}
         showInfo={activeInfo === 'sun'} // *** UPDATED: Compare with lowercase key ***
         onPlanetClick={handlePlanetClick} // Pass the handler
         position={[0, 0, 0]}
         planetSize={PLANET_DATA.sun.size}
         planetTextureUrl="/textures/sun_map.jpg" // Texture path doesn't need changing
         moons={[]}
         emissiveColor="orange"
         emissiveIntensity={2.0}
         planetAxialTilt={0}
         hasRings={false}
       />

       {/* --- Planets --- */}
       {/* *** UPDATED: Loop using lowercase 'key' *** */}
       {Object.keys(PLANET_DATA).filter(key => key !== 'sun').map((key) => {
           const data = PLANET_DATA[key]; // Get data using the lowercase key
           if (!data) {
               console.error("Missing data for planet key:", key);
               return null;
           }
           return (
               <group key={key} ref={orbitRefs[key]}> {/* Use key here */}
                   <PlanetSystem
                       planetKey={key} // *** ADDED: Pass the lowercase key ***
                       name={data.name} // Keep capitalized name for display
                       vitals={data.vitals}
                       description={data.description}
                       funFact={data.funFact}
                       showInfo={activeInfo === key} // *** UPDATED: Compare with lowercase key ***
                       onPlanetClick={handlePlanetClick} // Pass the handler
                       position={[data.orbitRadius, data.yOffset, 0]}
                       planetSize={data.size}
                       planetTextureUrl={`/textures/${key}_map.jpg`} // *** UPDATED: Use lowercase key for texture path ***
                       planetAxialTilt={data.tilt || 0}
                       moons={data.moons}
                       hasRings={key === 'saturn'} // Use key
                       ringTextureUrl={key === 'saturn' ? "/textures/saturn_rings_map.png" : null} // Use key
                       emissiveColor={null}
                       emissiveIntensity={0}
                    />
               </group>
           );
       })}
    </group>
  );
}
// ============================================
// --- End SolarSystemGroup (MODIFIED) ---
// ============================================


// --- Main App Component (LOGGING REMAINS, other logic unchanged) ---
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

  // Get the data object for the active planet/body (Should work now)
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
                <Suspense fallback={null}><Skybox /></Suspense>
                <ambientLight intensity={0.60} />
                <pointLight position={[0, 0, 0]} intensity={750} distance={1000} decay={2} color="#FFF0D0" castShadow shadow-mapSize-height={1024} shadow-mapSize-width={1024} shadow-bias={-0.005}/>
                <Suspense fallback={null}>
                    <TwinklingStars count={200} />
                    <AsteroidField count={60} />
                    <FlyingObjects count={3} />
                    {/* SolarSystemGroup now gets the correct handler passed */}
                    <SolarSystemGroup
                        activeInfo={activeInfo}
                        handlePlanetClick={handlePlanetClick}
                    />
                </Suspense>
            </Canvas>
        </div>

        <main ref={mainRef} style={{ visibility: showResume ? 'visible' : 'hidden', opacity: showResume ? 1 : 0 }}> {/* Unchanged */}
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