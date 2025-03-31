// /home/tao/projects/online-resume/raj-manghani-odyssey/src/components/PlanetSystem/PlanetSystem.jsx
import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import Planet from './Planet';
import Moon from './Moon';
import Rings from './Rings';

const PlanetSystem = ({
  position = [0, 0, 0],
  planetSize = 1,
  planetTextureUrl = null,
  planetAxialTilt = 0,
  moons = [],
  emissiveColor = null,
  emissiveIntensity = 1,
  hasRings = false,
  ringTextureUrl = null,
  ringInnerRadius = null,
  ringOuterRadius = null,
  ringTilt = Math.PI * 0.4,
  // Info Props
  name,        // Used for display label
  planetKey,   // Key for click handler
  showInfo,    // Keep: Used by SolarSystemGroup to determine active state
  onPlanetClick
}) => {
  const planetRef = useRef();
  const moonOrbitRefs = useMemo(() => moons.map(() => React.createRef()), [moons.length]); // Keep refs for orbit animation
  const [hoveredBody, setHoveredBody] = useState(null); // Track hovered planet OR moon key

  useFrame((state, delta) => {
    if (planetRef.current) {
      const rotationSpeed = emissiveColor ? 0.08 : 0.03;
      planetRef.current.rotation.y += delta * rotationSpeed;
    }
    moons.forEach((moon, index) => {
      if (moonOrbitRefs[index]?.current) {
        moonOrbitRefs[index].current.rotation.y += delta * moon.orbitSpeed;
      }
    });
  });

  // --- Use planetKey in click handler ---
  const handleBodyClick = (e, key) => { // Parameter name changed for clarity
    console.log(`[PlanetSystem] handleBodyClick triggered for key: ${key}`);
    e.stopPropagation();
    if (onPlanetClick) {
        console.log(`[PlanetSystem] Calling onPlanetClick with key: ${key}`);
        onPlanetClick(key); // Pass the lowercase key up
    } else {
        console.error("[PlanetSystem] onPlanetClick prop is missing!");
    }
  };

  // --- Updated Hover Handlers ---
  const handlePointerOver = (e, key) => {
    e.stopPropagation();
    setHoveredBody(key);
    document.body.style.cursor = 'pointer';
  };
  const handlePointerOut = (e) => {
    e.stopPropagation();
    // Only reset if the mouse is truly leaving the interactive area
    // This basic check might need refinement depending on event bubbling details
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
        setHoveredBody(null);
        document.body.style.cursor = 'default';
    } else if (!e.relatedTarget) { // Handle cases where relatedTarget is null (e.g., moving off window)
        setHoveredBody(null);
        document.body.style.cursor = 'default';
    }
  };

  const finalRingInnerRadius = ringInnerRadius ?? planetSize * 1.2;
  const finalRingOuterRadius = ringOuterRadius ?? planetSize * 2.2;

  return (
    <group position={position}>
      {/* --- Planet Group --- */}
      <group
        onClick={(e) => handleBodyClick(e, planetKey)}
        onPointerOver={(e) => handlePointerOver(e, planetKey)}
        onPointerOut={handlePointerOut} // Keep simple out handler for the group
      >
        <Planet
          rotationRef={planetRef} // Keep for planet's self-rotation
          size={planetSize}
          textureUrl={planetTextureUrl}
          emissiveColor={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          axialTilt={planetAxialTilt}
        />
        {hoveredBody === planetKey && ( // Show label if this planet is hovered
          <Html position={[0, planetSize * 1.5 + 0.2, 0]} center className="nameLabel">
            <div>
                {name} {/* Display planet name */}
                <span className="clickPrompt">(Click for Details)</span>
            </div>
          </Html>
        )}
      </group>

      {hasRings && (
         <Rings
            textureUrl={ringTextureUrl}
            innerRadius={finalRingInnerRadius}
            outerRadius={finalRingOuterRadius}
            tilt={ringTilt}
         />
      )}

      {/* --- Moons Group --- */}
      {moons.map((moon, index) => (
        // This outer group handles the moon's orbit around the planet
        <group key={moon.key} ref={moonOrbitRefs[index]}>
          {/* This inner group handles clicking and hovering on the moon itself */}
          <group
            position={[moon.orbitRadius, 0, 0]} // Position moon relative to its orbit center
            onClick={(e) => handleBodyClick(e, moon.key)} // Use moon's unique key
            onPointerOver={(e) => handlePointerOver(e, moon.key)} // Track hover by moon key
            onPointerOut={handlePointerOut} // Use same out handler
          >
            <Moon
              // No position prop needed here as parent group handles it
              size={moon.size}
              textureUrl={moon.textureUrl}
            />
            {hoveredBody === moon.key && ( // Show label if this moon is hovered
              <Html position={[0, moon.size * 1.5 + 0.1, 0]} center className="nameLabel">
                 <div>
                    {moon.name} {/* Display moon name */}
                    <span className="clickPrompt">(Click for Details)</span>
                 </div>
              </Html>
            )}
          </group>
        </group>
      ))}
    </group>
  );
};

export default PlanetSystem;
