// src/components/PlanetSystem/Planet.jsx
import React, { useRef } from 'react';
import { useTexture } from '@react-three/drei';

const Planet = ({
    size = 1, textureUrl = null, color = 'blue', emissiveColor = null,
    emissiveIntensity = 1, rotationRef, axialTilt = 0
}) => {
    // --- Unconditional Hook Calls First ---
    const internalRef = useRef(); // Keep this or another hook here if PlanetSystem relies on consistent hook count
    const meshRef = rotationRef || internalRef;

    // --- Conditionally load texture *after* other hooks ---
    const texture = textureUrl ? useTexture(textureUrl) : null;
    const textureLoaded = texture; // Simpler check now

    return (
        <mesh ref={meshRef} rotation={[axialTilt, 0, 0]} castShadow={!emissiveColor} receiveShadow={!emissiveColor}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial
                map={textureLoaded ? texture : undefined}
                color={textureLoaded ? '#FFFFFF' : color}
                roughness={emissiveColor ? 1 : 0.85}
                metalness={0.1}
                emissive={emissiveColor}
                emissiveMap={emissiveColor && textureLoaded ? texture : undefined}
                emissiveIntensity={emissiveColor ? emissiveIntensity : 0}
            />
        </mesh>
    );
};
export default Planet;