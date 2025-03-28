// src/components/PlanetSystem/PlanetSystem.jsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import Planet from './Planet';
import Moon from './Moon';
import Rings from './Rings';

const PlanetSystem = ({
  position = [0, 0, 0],
  planetSize = 1,
  planetColor = 'blue',
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
  name,
  vitals,
  description,
  funFact,
  showInfo,
  onPlanetClick
}) => {
  const planetRef = useRef();
  const moonOrbitRefs = useRef([]);

  // Hover State (Unchanged)
  const [isHovered, setIsHovered] = useState(false);

  // useFrame Hook (Unchanged logic for planet/moon rotation)
  useFrame((state, delta) => {
    if (planetRef.current) { const rotationSpeed = emissiveColor ? 0.08 : 0.03; planetRef.current.rotation.y += delta * rotationSpeed; }
    moons.forEach((moon, index) => { if (moonOrbitRefs.current[index]) { moonOrbitRefs.current[index].rotation.y += delta * moon.orbitSpeed; } });
  });

  // Event Handlers (Unchanged)
  const handleBodyClick = (e, bodyName) => { e.stopPropagation(); onPlanetClick(bodyName); };
  const handlePointerOver = (e) => { e.stopPropagation(); setIsHovered(true); document.body.style.cursor = 'pointer'; };
  const handlePointerOut = (e) => { e.stopPropagation(); setIsHovered(false); document.body.style.cursor = 'default'; };

  // Ring Radii Calculation (Unchanged)
  const finalRingInnerRadius = ringInnerRadius ?? planetSize * 1.2;
  const finalRingOuterRadius = ringOuterRadius ?? planetSize * 2.2;

  return (
    <group position={position}>
      {/* Wrap Planet in a group for events and Html */}
      <group
        // Add pointer events ONLY to the main planet mesh group for simplicity
        // Note: Clicking moons/rings won't trigger info currently
        onClick={(e) => handleBodyClick(e, name)}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
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
        {/* --- UPDATED Name Label on Hover --- */}
        {isHovered && !showInfo && (
          <Html position={[0, planetSize * 1.5 + 0.2, 0]} center className="nameLabel">
            <div>
                {name}
                {/* Add click prompt */}
                <span className="clickPrompt">(Click for Details)</span>
            </div>
          </Html>
        )}
        {/* --- Full Info Box on Click --- */}
        {showInfo && (
            <Html position={[0, planetSize * 1.2, 0]} center distanceFactor={10} className="infoBoxContainer">
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

      {/* Moons (Rendered outside interaction group) */}
      {moons.map((moon, index) => (
        <group
          key={moon.name || index}
          ref={el => moonOrbitRefs.current[index] = el}
        >
          <Moon
            position={[moon.orbitRadius, 0, 0]}
            size={moon.size}
            textureUrl={moon.textureUrl}
          />
        </group>
      ))}
    </group>
  );
};

export default PlanetSystem;