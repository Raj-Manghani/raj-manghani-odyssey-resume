// src/components/PlanetSystem/PlanetSystem.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import Planet from './Planet'; // Ensure uses version with conditional texture
import Moon from './Moon';    // Ensure uses version with conditional texture
import Rings from './Rings';  // Ensure uses version with conditional texture

const PlanetSystem = ({
  position = [0, 0, 0], planetSize = 1, planetColor = 'blue', planetTextureUrl = null,
  planetAxialTilt = 0, moons = [], emissiveColor = null, emissiveIntensity = 1,
  hasRings = false, ringTextureUrl = null, ringInnerRadius = null, ringOuterRadius = null,
  ringTilt = Math.PI * 0.4, // This is relative tilt to planet equator, applied via group rotation
  // Info Props
  name, vitals, description, funFact,
  // State & Handler from App
  showInfo, // <<< BOOLEAN: Is THIS body's info box active?
  onPlanetClick, // <<< Handler to call with body name
  activeInfo // <<< Currently active body name (needed for moons)
}) => {
  const planetRef = useRef();
  const moonOrbitRefs = useRef([]);
  const [isPlanetHovered, setIsPlanetHovered] = useState(false);

  useEffect(() => { moonOrbitRefs.current = Array(moons.length).fill(0).map((_, i) => moonOrbitRefs.current[i] || React.createRef()); }, [moons.length]);

  useFrame((state, delta) => {
    if (planetRef.current) { const rs = emissiveColor ? 0.08 : 0.03; planetRef.current.rotation.y += delta * rs; }
    moons.forEach((m, i) => { if (moonOrbitRefs.current[i]?.current) { moonOrbitRefs.current[i].current.rotation.y += delta * m.orbitSpeed; } });
  });

  // Event Handlers for Planet
  const handlePlanetPointerOver = (e) => { if (!showInfo) { e.stopPropagation(); setIsPlanetHovered(true); document.body.style.cursor = 'pointer'; }};
  const handlePlanetPointerOut = (e) => { e.stopPropagation(); setIsPlanetHovered(false); document.body.style.cursor = 'default'; };
  // Pass THIS body's name to the handler from App
  const handlePlanetBodyClick = (e) => { e.stopPropagation(); setIsPlanetHovered(false); document.body.style.cursor = 'default'; onPlanetClick(name); };

  const finalRingInnerRadius = ringInnerRadius ?? planetSize * 1.2;
  const finalRingOuterRadius = ringOuterRadius ?? planetSize * 2.2;

  // showInfo prop directly controls visibility

  return (
    <group position={position}>
      {/* Planet Interaction Group */}
      <group onClick={handlePlanetBodyClick} onPointerOver={handlePlanetPointerOver} onPointerOut={handlePlanetPointerOut} >
        <Planet
            rotationRef={planetRef} size={planetSize} textureUrl={planetTextureUrl} color={planetColor}
            emissiveColor={emissiveColor} emissiveIntensity={emissiveIntensity}
            axialTilt={planetAxialTilt}
        />
        {/* Planet Name Label on Hover */}
        {isPlanetHovered && !showInfo && name && ( // <<< Check showInfo prop
          <Html position={[0, planetSize * 1.5 + 0.2, 0]} center className="nameLabel">
             <div>{name}<span className="clickPrompt">(Click for Details)</span></div>
          </Html>
        )}
        {/* Planet Full Info Box on Click */}
        {showInfo && name && ( // <<< Check showInfo prop
            <Html position={[0, planetSize * 1.2, 0]} center className="infoBoxContainer">
                <div className="infoBox">
                    <h3>{name}</h3>
                    {vitals && <p><strong>Vitals:</strong> {vitals}</p>}
                    {description && <p>{description}</p>}
                    {funFact && <p><em>Fun Fact:</em> {funFact}</p>}
                </div>
            </Html>
        )}
      </group>

      {/* Rings Group (Applies Planet's Axial Tilt) */}
      {hasRings && (
         <group rotation={[planetAxialTilt, 0, 0]}>
             <Rings textureUrl={ringTextureUrl} innerRadius={finalRingInnerRadius} outerRadius={finalRingOuterRadius}/>
         </group>
      )}

      {/* Moons */}
      {moons.map((moon, index) => (
        <group key={moon.name || index} ref={moonOrbitRefs.current[index]} >
          <Moon
            position={[moon.orbitRadius, 0, 0]}
            // Pass all moon data from PLANET_DATA down
            name={moon.name} size={moon.size} textureUrl={moon.textureUrl}
            vitals={moon.vitals} description={moon.description} funFact={moon.funFact}
            // Pass down the check comparing activeInfo to THIS moon's name
            showInfo={activeInfo === moon.name} // <<< Correct check
            // Pass down the App's click handler, aliased as onMoonClick
            onMoonClick={onPlanetClick}
          />
        </group>
      ))}
    </group>
  );
};
export default PlanetSystem;