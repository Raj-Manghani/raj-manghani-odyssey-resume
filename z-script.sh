#!/bin/bash

TARGET_FILE="src/App.jsx"
BACKUP_FILE="${TARGET_FILE}.bak.restore_minimal.$(date +%s)"

echo ">>> Backing up ${TARGET_FILE} to ${BACKUP_FILE}..."
cp "$TARGET_FILE" "$BACKUP_FILE"

echo ">>> Overwriting ${TARGET_FILE} with minimal working UI + empty Canvas structure..."

cat > "$TARGET_FILE" << 'EOF'
// src/App.jsx
import React, { useEffect, Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
// Keep OrbitControls and useTexture (for Skybox potentially)
import { useTexture, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Import components (Keep imports available)
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

// --- planetData Definition (Keep available) ---
const PLANET_DATA = { /* ... Your full planet data object ... */ };
const degToRad = (degrees) => degrees * (Math.PI / 180);
const genericMoonTexture = '/textures/moon_map.jpg';
// --- End planetData ---

// --- Skybox Component Definition (Ensure this is present) ---
function Skybox() {
  const texture = useTexture('/textures/star_milky_way.jpg');
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 32, 16]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} fog={false} />
    </mesh>
  );
}
// --- End Skybox ---


// --- SolarSystemGroup Component Definition (Ensure present, but return null) ---
function SolarSystemGroup({ activeInfo, handlePlanetClick }) {
  // const orbitRefs = useMemo(() => { /* ... */ }, []); // Comment out internals if needed
  // useFrame((state, delta) => { /* ... */ });
  return null; // Keep returning null for minimal test
}
// --- End SolarSystemGroup ---


// --- Main App Component ---
function App() {
  const [showResume, setShowResume] = useState(true);
  // const [activeInfo, setActiveInfo] = useState(null); // Keep commented for now

  const handleMenuClick = (e) => {
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    if (!showResume) { setShowResume(true); e.preventDefault(); requestAnimationFrame(() => { setTimeout(() => { targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }); }
  };

  // Keep handler definition, but state is commented
  const handlePlanetClick = (bodyName) => { console.log(">>> CLICKED ON:", bodyName); };

  console.log("Rendering App (Minimal Restore) - showResume:", showResume);

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
            <Canvas shadows camera={{ position: [0, 10, 20], fov: 60 }}> {/* Closer camera */}
                <OrbitControls enableDamping dampingFactor={0.1} />
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 5]} intensity={1.0} />

                {/* --- NO 3D components rendered initially --- */}
                 {/* <Suspense fallback={null}><Skybox /></Suspense> */}
                 {/* <Suspense fallback={null}><TwinklingStars count={200} /></Suspense> */}
                 {/* <Suspense fallback={null}><AsteroidField count={60} /></Suspense> */}
                 {/* <Suspense fallback={null}><FlyingObjects count={3} /></Suspense> */}
                 {/* <Suspense fallback={null}><SolarSystemGroup handlePlanetClick={handlePlanetClick} /></Suspense> */}
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
EOF

echo ">>> ${TARGET_FILE} has been restored to minimal state."
echo ">>> Backup created at ${BACKUP_FILE}"
echo ">>> Please run 'npm run dev', clear browser cache, and test UI."