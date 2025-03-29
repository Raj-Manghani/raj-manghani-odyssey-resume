// src/App.jsx
import React, { useEffect, Suspense, useRef, useState, useMemo, useCallback } from 'react'; // Added useCallback back just in case needed later, though not used in handler currently
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Import Data
import { PLANET_DATA } from './data/planetData'; // Ensure this file exists and is correct

// Import components
import TwinklingStars from './components/TwinklingStars/TwinklingStars';
import PlanetSystem from './components/PlanetSystem/PlanetSystem'; // Ensure uses version #53 (with info box logic)
import FlyingObjects from './components/FlyingObjects/FlyingObjects';
import AsteroidField from './components/AsteroidField/AsteroidField';

// Section Imports
import LandingSection from './sections/LandingSection/LandingSection';
import SkillsSection from './sections/SkillsSection/SkillsSection';
import ExperienceSection from './sections/ExperienceSection/ExperienceSection';
import ProjectsCertsSection from './sections/ProjectsCertsSection/ProjectsCertsSection';
import TechExpertiseSection from './sections/TechExpertiseSection/TechExpertiseSection';
import ContactSection from './sections/ContactSection/ContactSection';

import './infoBox.css'; // Ensure CSS is imported

// Skybox Component
function Skybox() { const t = useTexture('/textures/star_milky_way.jpg'); return ( <mesh scale={[-1,1,1]}><sphereGeometry args={[500,32,16]}/><meshBasicMaterial map={t} side={THREE.BackSide} fog={false}/></mesh> ); }

// SolarSystemGroup Component - Receives activeInfo and handler
function SolarSystemGroup({ activeInfo, handlePlanetClick }) {
  const orbitRefs = useMemo(() => { const r={}; Object.keys(PLANET_DATA).filter(n=>n!=='sun').forEach(n=>{r[n]=React.createRef();}); return r; }, []);
  useFrame((s,d)=>{ Object.keys(PLANET_DATA).filter(n=>n!=='sun').forEach(n=>{if(orbitRefs[n]?.current){orbitRefs[n].current.rotation.y+=d*PLANET_DATA[n].orbitSpeed;}}); });
  const sunData = PLANET_DATA.sun || {};
  return (
    <group>
       <PlanetSystem key="sun" {...sunData} name={sunData.name||"Sun"} showInfo={activeInfo === (sunData.name||"Sun")} onPlanetClick={handlePlanetClick} activeInfo={activeInfo} position={[0,0,0]} planetTextureUrl="/textures/sun_map.jpg" moons={[]} emissiveColor="orange" emissiveIntensity={2.0} planetAxialTilt={0} hasRings={false} />
       {Object.keys(PLANET_DATA).filter(name => name !== 'sun').map((name) => {
           const data = PLANET_DATA[name]; if (!data) return null;
           return ( <group key={name} ref={orbitRefs[name]}> <PlanetSystem {...data} name={data.name} showInfo={activeInfo === data.name} onPlanetClick={handlePlanetClick} activeInfo={activeInfo} position={[data.orbitRadius||10, data.yOffset||0, 0]} planetTextureUrl={`/textures/${name}_map.jpg`} planetAxialTilt={data.tilt||0} moons={data.moons||[]} hasRings={name==='saturn'} ringTextureUrl={name==='saturn' ? "/textures/saturn_rings_map.png" : null} emissiveColor={null} emissiveIntensity={0} /> </group> );
       })}
    </group>
  );
}
// --- End SolarSystemGroup ---


// --- Main App Component ---
function App() {
  const [showResume, setShowResume] = useState(true);
  // --- Restore activeInfo state ---
  const [activeInfo, setActiveInfo] = useState(null);

  // Menu click handler
  const handleMenuClick = (e) => {
    const targetId = e.target.getAttribute('href'); const targetElement = document.querySelector(targetId); if (!targetElement) return;
    if (!showResume) { setShowResume(true); e.preventDefault(); requestAnimationFrame(() => { setTimeout(() => { targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }); }
  };

  // --- Restore Click handler with state setting ---
  const handlePlanetClick = (bodyName) => {
      console.log(">>> CLICKED ON:", bodyName, "| Current activeInfo:", activeInfo);
      setActiveInfo(current => (current === bodyName ? null : bodyName)); // Toggle logic
  };

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

        {/* Canvas Container Div - REMOVED onClick handler */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} /* onClick removed */ >
            <Canvas shadows camera={{ position: [0, 40, 120], fov: 50 }}>
                <OrbitControls enableDamping dampingFactor={0.1} />
                <Suspense fallback={null}><Skybox /></Suspense>
                {/* Your Lighting */}
                <ambientLight intensity={0.60} />
                <pointLight position={[0, 0, 0]} intensity={750} distance={1000} decay={2} color="#FFF0D0" castShadow shadow-mapSize-height={1024} shadow-mapSize-width={1024} shadow-bias={-0.005}/>
                <Suspense fallback={null}>
                    <TwinklingStars count={200} />
                    <AsteroidField count={60} />
                    <FlyingObjects count={3} />
                    {/* Pass state and handler down */}
                    <SolarSystemGroup
                        activeInfo={activeInfo}
                        handlePlanetClick={handlePlanetClick}
                    />
                </Suspense>
            </Canvas>
        </div>

        {/* Conditionally Rendered Resume Content */}
        {showResume && (
            <main>
                <LandingSection id="about" />
                <SkillsSection id="skills" />
                <TechExpertiseSection id="expertise" />
                <ExperienceSection id="experience" />
                <ProjectsCertsSection id="projects" />
                <ContactSection id="contact" />
            </main>
        )}
    </div>
  );
}
export default App;