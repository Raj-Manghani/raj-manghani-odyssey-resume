// src/App.jsx
import React, { useEffect, Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Import components
import TwinklingStars from './components/TwinklingStars/TwinklingStars';
import PlanetSystem from './components/PlanetSystem/PlanetSystem';
import FlyingObjects from './components/FlyingObjects/FlyingObjects';
import AsteroidField from './components/AsteroidField/AsteroidField';

// Section Imports
import LandingSection from './sections/LandingSection/LandingSection';
import SkillsSection from './sections/SkillsSection/SkillsSection';
import ExperienceSection from './sections/ExperienceSection/ExperienceSection';
import ProjectsCertsSection from './sections/ProjectsCertsSection/ProjectsCertsSection';
import TechExpertiseSection from './sections/TechExpertiseSection/TechExpertiseSection';
import ContactSection from './sections/ContactSection/ContactSection';

import './infoBox.css';

// --- planetData Definition ---
const degToRad = (degrees) => degrees * (Math.PI / 180);
const genericMoonTexture = '/textures/moon_map.jpg';
const sunSize = 3.0;

const PLANET_DATA = {
  sun: {
    name: "Sun", size: sunSize, isEmissive: true,
    vitals: "Type: G-type Star | Diameter: ~1.4 million km | Temp: ~5,500°C (surface)",
    description: "The star at the center of our solar system, providing light and heat essential for life on Earth.",
    funFact: "The Sun accounts for about 99.86% of the total mass of the Solar System!",
    moons: []
  },
  mercury: { name: "Mercury", size: 0.25, orbitRadius: 5, orbitSpeed: 0.25, yOffset: 0.1, tilt: degToRad(0.03), moons: [], vitals: "Type: Rocky Planet | Diameter: ~4,880 km | Temp: -173 to 427°C", description: "The smallest planet and closest to the Sun, with extreme temperature variations.", funFact: "A year on Mercury (one orbit) takes only 88 Earth days!" },
  venus:   { name: "Venus", size: 0.55, orbitRadius: 8, orbitSpeed: 0.18, yOffset: -0.2, tilt: degToRad(177.4), moons: [], vitals: "Type: Rocky Planet | Diameter: ~12,104 km | Temp: ~465°C (Hottest!)", description: "Similar in size to Earth but with a thick, toxic atmosphere and runaway greenhouse effect.", funFact: "Venus rotates backwards compared to most planets, and very slowly (a day is longer than its year)." },
  earth:   { name: "Earth", size: 0.6,  orbitRadius: 12, orbitSpeed: 0.15, yOffset: 0, tilt: degToRad(23.4), moons: [ { name: "Moon", size: 0.15, textureUrl: genericMoonTexture, orbitRadius: 1.0, orbitSpeed: 0.5, vitals: "Type: Natural Satellite | Diameter: ~3,474 km", description: "Earth's only natural satellite, influencing tides and stabilizing our planet's wobble.", funFact: "The Moon always shows the same face to Earth..." } ], vitals: "Type: Rocky Planet | Diameter: ~12,742 km | Temp: Avg ~15°C", description: "Our home planet, the only known place with liquid water on the surface and life.", funFact: "Earth is the densest planet in the Solar System." },
  mars:    { name: "Mars", size: 0.4, orbitRadius: 17, orbitSpeed: 0.12, yOffset: 0.3, tilt: degToRad(25.2), moons: [ { name: "Phobos", size: 0.05, textureUrl: genericMoonTexture, orbitRadius: 0.6, orbitSpeed: 0.7, vitals: "Type: Small Moon | Shape: Irregular", description:"Larger/inner moon.", funFact: "Orbits faster than Mars rotates."}, { name: "Deimos", size: 0.04, textureUrl: genericMoonTexture, orbitRadius: 0.8, orbitSpeed: 0.6, vitals: "Type: Small Moon | Shape: Irregular", description:"Smaller/outer moon.", funFact: "Likely captured asteroids."} ], vitals: "Type: Rocky Planet | Diameter: ~6,779 km | Temp: -153 to 20°C", description: "The 'Red Planet', known for iron oxide dust, volcanoes, and canyons.", funFact: "Mars has seasons like Earth, but they last twice as long." },
  jupiter: { name: "Jupiter", size: 1.5, orbitRadius: 28, orbitSpeed: 0.06, yOffset: -0.4, tilt: degToRad(3.1), moons: [ { name: "Io", size: 0.3,  textureUrl: genericMoonTexture, orbitRadius: 2.5, orbitSpeed: 0.2, vitals: "Feature: Most Volcanically Active", description:"Innermost large moon.", funFact:"Surface reshaped by eruptions."}, { name: "Europa", size: 0.25, textureUrl: genericMoonTexture, orbitRadius: 3.2, orbitSpeed: 0.18, vitals: "Feature: Subsurface Ocean?", description:"Smooth icy surface.", funFact:"Potential candidate for life."}, { name: "Ganymede", size: 0.28, textureUrl: genericMoonTexture, orbitRadius: 4.0, orbitSpeed: 0.15, vitals: "Feature: Largest Moon in Solar System", description:"Has own magnetic field.", funFact:"Larger than Mercury."} ], vitals: "Type: Gas Giant | Diameter: ~139,820 km | Moons: 95 (known)", description: "Largest planet, massive gas ball with Great Red Spot.", funFact: "Jupiter has the shortest day." },
  saturn:  { name: "Saturn", size: 1.2, orbitRadius: 40, orbitSpeed: 0.045, yOffset: 0.2, tilt: degToRad(26.7), moons: [ { name: "Titan", size: 0.25, textureUrl: genericMoonTexture, orbitRadius: 3.8, orbitSpeed: 0.1, vitals: "Feature: Thick Atmosphere, Lakes", description:"Largest moon of Saturn.", funFact:"Only moon with dense atmosphere."}, { name: "Rhea", size: 0.2,  textureUrl: genericMoonTexture, orbitRadius: 4.8, orbitSpeed: 0.09, vitals: "Composition: Mostly Water Ice", description:"Second largest moon.", funFact:"May have its own rings."} ], vitals: "Type: Gas Giant | Diameter: ~116,460 km | Moons: 146 (known)", description: "Famous for its stunning ring system.", funFact: "Saturn is the least dense planet." },
  uranus:  { name: "Uranus", size: 0.9, orbitRadius: 55, orbitSpeed: 0.03, yOffset: -0.1, tilt: degToRad(97.8), moons: [ { name: "Titania", size: 0.18, textureUrl: genericMoonTexture, orbitRadius: 1.8, orbitSpeed: 0.12, vitals: "Feature: Canyons, Scarps", description:"Largest moon of Uranus.", funFact:"Evidence of past geology."}, { name: "Oberon", size: 0.15, textureUrl: genericMoonTexture, orbitRadius: 2.5, orbitSpeed: 0.1, vitals: "Feature: Heavily Cratered", description:"Outermost large moon.", funFact:"Has large mountains."} ], vitals: "Type: Ice Giant | Diameter: ~50,724 km | Temp: Avg ~-216°C", description: "Ice giant tilted on its side.", funFact: "Appears blue-green due to methane." },
  neptune: { name: "Neptune", size: 0.85, orbitRadius: 70, orbitSpeed: 0.025, yOffset: 0.15, tilt: degToRad(28.3), moons: [ { name: "Triton", size: 0.2, textureUrl: genericMoonTexture, orbitRadius: 2.0, orbitSpeed: 0.08, vitals: "Orbit: Retrograde | Surface: Nitrogen Ice", description:"Largest moon of Neptune.", funFact:"Likely a captured dwarf planet."} ], vitals: "Type: Ice Giant | Diameter: ~49,244 km | Moons: 16 (known)", description: "Dark, cold ice giant with strong winds.", funFact: "First planet found via math." },
};
// --- End planetData ---


// Skybox Component
function Skybox() { const texture = useTexture('/textures/star_milky_way.jpg'); return ( <mesh scale={[-1, 1, 1]}> <sphereGeometry args={[500, 32, 16]} /> <meshBasicMaterial map={texture} side={THREE.BackSide} fog={false} /> </mesh> ); }


// --- SolarSystemGroup Component ---
function SolarSystemGroup({ activeInfo, handlePlanetClick }) {
  const orbitRefs = useMemo(() => { const refs = {}; Object.keys(PLANET_DATA).filter(name => name !== 'sun').forEach(name => { refs[name] = React.createRef(); }); return refs; }, []);
  useFrame((state, delta) => { Object.keys(PLANET_DATA).filter(name => name !== 'sun').forEach((name) => { if (orbitRefs[name]?.current) { orbitRefs[name].current.rotation.y += delta * PLANET_DATA[name].orbitSpeed; } }); });
  return ( <group> <PlanetSystem key="sun" name={PLANET_DATA.sun.name} {...PLANET_DATA.sun} position={[0, 0, 0]} planetTextureUrl="/textures/sun_map.jpg" moons={[]} emissiveColor="orange" emissiveIntensity={2.0} showInfo={activeInfo === PLANET_DATA.sun.name} onPlanetClick={handlePlanetClick} activeInfo={activeInfo} hasRings={false} planetAxialTilt={0} /> {Object.keys(PLANET_DATA).filter(name => name !== 'sun').map((name) => { const data = PLANET_DATA[name]; if (!data) return null; return ( <group key={name} ref={orbitRefs[name]}> <PlanetSystem name={data.name} vitals={data.vitals} description={data.description} funFact={data.funFact} showInfo={activeInfo === data.name} onPlanetClick={handlePlanetClick} position={[data.orbitRadius, data.yOffset, 0]} planetSize={data.size} planetTextureUrl={`/textures/${name}_map.jpg`} planetAxialTilt={data.tilt || 0} moons={data.moons} hasRings={name === 'saturn'} ringTextureUrl={name === 'saturn' ? "/textures/saturn_rings_map.png" : null} emissiveColor={null} emissiveIntensity={0} activeInfo={activeInfo} /> </group> ); })} </group> );
}
// --- End SolarSystemGroup ---


// --- Main App Component ---
function App() {
  const [showResume, setShowResume] = useState(true);
  const [activeInfo, setActiveInfo] = useState(null);

  // Menu click handler
  const handleMenuClick = (e) => { /* ... */ };
  // Planet click handler
  const handlePlanetClick = (bodyName) => { setActiveInfo(current => (current === bodyName ? null : bodyName)); };

  return (
    <div className="app-container">
        <header className="app-header">
             <nav>
                <a href="#about" onClick={handleMenuClick}>About</a>
                <a href="#skills" onClick={handleMenuClick}>Skills</a>
                <a href="#experience" onClick={handleMenuClick}>Experience</a>
                <a href="#projects" onClick={handleMenuClick}>Projects</a>
                <a href="#expertise" onClick={handleMenuClick}>Expertise</a>
                <a href="#contact" onClick={handleMenuClick}>Contact</a>
            </nav>
        </header>
        <button className="toggle-view-button" onClick={() => setShowResume(!showResume)}>
            {showResume ? 'Explore Solar System' : 'Show Resume'}
        </button>
        {!showResume && ( <div className="controls-info"><p><span>L-Drag:</span> Orbit | <span>R-Drag:</span> Pan | <span>Scroll:</span> Zoom</p></div> )}

        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <Canvas shadows camera={{ position: [0, 40, 120], fov: 50 }}>
                <OrbitControls enableDamping dampingFactor={0.1} />
                <Suspense fallback={null}><Skybox /></Suspense>
                {/* Lighting */}
                <ambientLight intensity={0.60} />
                <pointLight position={[0, 0, 0]} intensity={750} distance={1000} decay={2} color="#FFF0D0" castShadow shadow-mapSize-height={1024} shadow-mapSize-width={1024} shadow-bias={-0.005}/>
                {/* Render ALL 3D content */}
                <Suspense fallback={null}>
                    <TwinklingStars count={200} />
                    <AsteroidField count={60} />
                    <FlyingObjects count={3} />
                    {/* Re-enable SolarSystemGroup */}
                    <SolarSystemGroup
                        activeInfo={activeInfo}
                        handlePlanetClick={handlePlanetClick}
                    />
                </Suspense>
            </Canvas>
        </div>

        {/* Conditionally Render Resume Content */}
        {showResume && (
            <main>
                <LandingSection id="about" />
                <SkillsSection id="skills" />
                <ExperienceSection id="experience" />
                <ProjectsCertsSection id="projects" />
                <TechExpertiseSection id="expertise" />
                <ContactSection id="contact" />
            </main>
        )}
    </div>
  );
}
export default App;
// NOTE: Ensure PLANET_DATA, handleMenuClick, section components are present.