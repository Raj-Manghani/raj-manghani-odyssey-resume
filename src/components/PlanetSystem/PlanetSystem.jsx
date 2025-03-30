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
  name,        // Still used for display label
  planetKey,   // *** ADDED: The lowercase key for data lookup ***
  vitals,
  description,
  funFact,
  showInfo,    // No longer used directly here
  onPlanetClick
}) => {
  const planetRef = useRef();
  const moonOrbitRefs = useMemo(() => moons.map(() => React.createRef()), [moons.length]);
  const [isHovered, setIsHovered] = useState(false);

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
  // --- End Change ---

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };
  const handlePointerOut = (e) => {
    e.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = 'default';
  };

  const finalRingInnerRadius = ringInnerRadius ?? planetSize * 1.2;
  const finalRingOuterRadius = ringOuterRadius ?? planetSize * 2.2;

  return (
    <group position={position}>
      <group
        onClick={(e) => handleBodyClick(e, planetKey)} // *** Pass planetKey here ***
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
        {isHovered && (
          <Html position={[0, planetSize * 1.5 + 0.2, 0]} center className="nameLabel">
            <div>
                {name} {/* Display capitalized name */}
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

      {moons.map((moon, index) => (
        <group
          key={moon.name || index}
          ref={moonOrbitRefs[index]}
        >
          <Moon
            position={[moon.orbitRadius, 0, 0]}
            size={moon.size}
            textureUrl={moon.textureUrl}
            // onClick={(e) => handleBodyClick(e, `${planetKey}-${moon.name}`)} // Example for future moon click
          />
        </group>
      ))}
    </group>
  );
};

export default PlanetSystem;