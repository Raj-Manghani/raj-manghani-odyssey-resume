// src/components/PlanetSystem/PlanetSystem.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import Planet from './Planet'; // Points to updated Planet
import Moon from './Moon';    // Points to updated Moon (hover label only)
import Rings from './Rings';  // Points to updated Rings

const PlanetSystem = ({
  position = [0, 0, 0],
  planetSize = 1,
  planetColor = 'blue', // Fallback color
  planetTextureUrl = null,
  planetAxialTilt = 0, // Keep tilt for planet and rings
  moons = [], // Expects array { name, size, textureUrl, orbitRadius, orbitSpeed }
  emissiveColor = null,
  emissiveIntensity = 1,
  hasRings = false,
  ringTextureUrl = null,
  ringInnerRadius = null,
  ringOuterRadius = null,
  // REMOVED ringTilt prop
  // Info props kept for hover label on planet
  name,
  // REMOVED unused info props & handlers for this simplified version
  // vitals, description, funFact, showInfo, onPlanetClick, activeInfo
  onPlanetClick // Keep handler prop to pass down if needed later
}) => {
  const planetRef = useRef();
  const moonOrbitRefs = useRef([]);
  const [isPlanetHovered, setIsPlanetHovered] = useState(false); // Keep for planet hover

  useEffect(() => { moonOrbitRefs.current = Array(moons.length).fill(0).map((_, i) => moonOrbitRefs.current[i] || React.createRef()); }, [moons.length]);

  useFrame((state, delta) => {
    if (planetRef.current) { const rotationSpeed = emissiveColor ? 0.08 : 0.03; planetRef.current.rotation.y += delta * rotationSpeed; }
    moons.forEach((moon, index) => { if (moonOrbitRefs.current[index]?.current) { moonOrbitRefs.current[index].current.rotation.y += delta * moon.orbitSpeed; } });
  });

  // Simplified Event Handlers for Planet (Hover only)
  const handlePlanetPointerOver = (e) => { e.stopPropagation(); setIsPlanetHovered(true); document.body.style.cursor = 'pointer'; };
  const handlePlanetPointerOut = (e) => { e.stopPropagation(); setIsPlanetHovered(false); document.body.style.cursor = 'default'; };
  // REMOVED handlePlanetBodyClick logic

  const finalRingInnerRadius = ringInnerRadius ?? planetSize * 1.2;
  const finalRingOuterRadius = ringOuterRadius ?? planetSize * 2.2;

  return (
    <group position={position}>
      {/* Planet Interaction Group (Hover only) */}
      <group
        // Removed onClick
        onPointerOver={handlePlanetPointerOver}
        onPointerOut={handlePlanetPointerOut}
      >
        <Planet
            rotationRef={planetRef} size={planetSize} textureUrl={planetTextureUrl} color={planetColor}
            emissiveColor={emissiveColor} emissiveIntensity={emissiveIntensity}
            axialTilt={planetAxialTilt} // Pass tilt down
        />
        {/* Planet Name Label on Hover */}
        {isPlanetHovered && name && (
          <Html position={[0, planetSize * 1.5 + 0.2, 0]} center className="nameLabel">
             <div>{name} {/* Removed click prompt */}</div>
          </Html>
        )}
        {/* REMOVED Info Box */}
      </group>

      {/* Rings Group (Applies Planet's Axial Tilt) */}
      {hasRings && (
         <group rotation={[planetAxialTilt, 0, 0]}>
             <Rings
                textureUrl={ringTextureUrl}
                innerRadius={finalRingInnerRadius}
                outerRadius={finalRingOuterRadius}
             />
         </group>
      )}

      {/* Moons */}
      {moons.map((moon, index) => (
        <group key={moon.name || index} ref={moonOrbitRefs.current[index]} >
          <Moon
            position={[moon.orbitRadius, 0, 0]}
            name={moon.name} // Pass name for hover
            size={moon.size}
            textureUrl={moon.textureUrl}
            // Removed unused info/click props
          />
        </group>
      ))}
    </group>
  );
};
export default PlanetSystem;