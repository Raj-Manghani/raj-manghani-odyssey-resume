// src/components/PlanetSystem/PlanetSystem.jsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import Planet from './Planet'; // Ensure this file is also correct
import Moon from './Moon';    // Ensure this file is also correct
import Rings from './Rings';  // Ensure this file is also correct

const PlanetSystem = ({
  position = [0, 0, 0],
  planetSize = 1,
  planetColor = 'blue',
  planetTextureUrl = null,
  planetAxialTilt = 0,
  moons = [], // Expects array: { name, size, textureUrl, orbitRadius, orbitSpeed, vitals?, description?, funFact? }
  emissiveColor = null,
  emissiveIntensity = 1,
  hasRings = false,
  ringTextureUrl = null,
  ringInnerRadius = null,
  ringOuterRadius = null,
  ringTilt = Math.PI * 0.4,
  // Info Props for the PLANET/SUN
  name,
  vitals,
  description,
  funFact,
  showInfo, // Is THIS planet/sun's info box active?
  onPlanetClick, // Handler from App to set the active body name
  // Need activeInfo to pass down for moons to check against *their* names
  activeInfo // <<< Added prop: the name of the currently active body (or null)
}) => {
  const planetRef = useRef();
  const moonOrbitRefs = useRef([]); // Array of refs for moon orbit groups

  // Hover State for the main Planet/Sun
  const [isPlanetHovered, setIsPlanetHovered] = useState(false);

  // --- useFrame Hook for SELF-Rotation and MOON Orbits ---
  useFrame((state, delta) => {
    // Rotate the planet mesh itself (axial spin)
    if (planetRef.current) {
      const rotationSpeed = emissiveColor ? 0.08 : 0.03;
      planetRef.current.rotation.y += delta * rotationSpeed;
    }
    // Rotate EACH moon's orbit group around the planet
    moons.forEach((moon, index) => {
      // Assign ref within the loop if necessary, though map should handle it
       moonOrbitRefs.current[index] = moonOrbitRefs.current[index] || React.createRef(); // Ensure ref exists (safer?)

      if (moonOrbitRefs.current[index]?.current) { // Check the .current property of the ref object
        moonOrbitRefs.current[index].current.rotation.y += delta * moon.orbitSpeed;
      }
    });
  });
  // --- End useFrame Hook ---

  // Event Handlers for the main Planet/Sun
  const handlePlanetPointerOver = (e) => { e.stopPropagation(); setIsPlanetHovered(true); document.body.style.cursor = 'pointer'; };
  const handlePlanetPointerOut = (e) => { e.stopPropagation(); setIsPlanetHovered(false); document.body.style.cursor = 'default'; };
  const handlePlanetBodyClick = (e) => { e.stopPropagation(); onPlanetClick(name); }; // Use the main body's name

  // Ring Radii Calculation
  const finalRingInnerRadius = ringInnerRadius ?? planetSize * 1.2;
  const finalRingOuterRadius = ringOuterRadius ?? planetSize * 2.2;

  return (
    // This group is positioned by the parent orbit group in App.jsx
    <group position={position}>
      {/* Planet Interaction Group */}
      <group
        // Attach events only to this group (contains Planet)
        onClick={handlePlanetBodyClick}
        onPointerOver={handlePlanetPointerOver}
        onPointerOut={handlePlanetPointerOut}
      >
        <Planet
            rotationRef={planetRef}
            size={planetSize}
            textureUrl={planetTextureUrl}
            color={planetColor}
            emissiveColor={emissiveColor}
            emissiveIntensity={emissiveIntensity}
            axialTilt={planetAxialTilt}
        />
        {/* Planet Name Label on Hover */}
        {isPlanetHovered && !showInfo && (
          <Html position={[0, planetSize * 1.5 + 0.2, 0]} center className="nameLabel">
             <div>{name}<span className="clickPrompt">(Click for Details)</span></div>
          </Html>
        )}
        {/* Planet Full Info Box on Click */}
        {showInfo && (
            // Remove distanceFactor for constant size
            <Html position={[0, planetSize * 1.2, 0]} center className="infoBoxContainer">
                <div className="infoBox">
                    <h3>{name}</h3>
                    {vitals && <p><strong>Vitals:</strong> {vitals}</p>}
                    {description && <p>{description}</p>}
                    {funFact && <p><em>Fun Fact:</em> {funFact}</p>}
                </div>
            </Html>
        )}
      </group> {/* End Planet interaction group */}

      {/* Rings (Rendered outside interaction group) */}
      {hasRings && (
         <Rings
            textureUrl={ringTextureUrl}
            innerRadius={finalRingInnerRadius}
            outerRadius={finalRingOuterRadius}
            tilt={ringTilt}
         />
      )}

      {/* Moons */}
      {moons.map((moon, index) => (
        // This group handles the orbit of the moon around the planet
        <group
          key={moon.name || index}
          // Assign ref using functional ref pattern
          ref={el => moonOrbitRefs.current[index] = { current: el }} // Assign ref object correctly
        >
          {/* Moon component handles its own interactions and info display */}
          <Moon
            position={[moon.orbitRadius, 0, 0]} // Position relative to orbit center
            name={moon.name}
            size={moon.size}
            textureUrl={moon.textureUrl}
            vitals={moon.vitals}
            description={moon.description}
            funFact={moon.funFact}
            // Check if THIS moon's name matches the globally active one
            showInfo={activeInfo === moon.name}
            // Pass the global click handler down
            onMoonClick={onPlanetClick} // Still use App's handler
          />
        </group>
      ))}
    </group>
  );
};

export default PlanetSystem;