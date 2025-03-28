// src/components/PlanetSystem/Planet.jsx
import React from 'react'; // Removed useRef as it's passed in
import { useTexture } from '@react-three/drei';

const Planet = ({
    size = 1,
    textureUrl = null,
    color = 'blue',
    emissiveColor = null,
    emissiveIntensity = 1,
    rotationRef, // Ref from parent for rotation animation
    axialTilt = 0 // <<< New prop for axial tilt (in radians)
}) => {

// If textureUrl is falsy (null, undefined, ''), use an invalid placeholder path
const safeTextureUrl = textureUrl || '/invalid-texture-path.jpg';
const texture = useTexture(safeTextureUrl);
    const textureLoaded = textureUrl && texture;

    return (
        // Apply axial tilt directly to the planet mesh's rotation
        <mesh ref={rotationRef} rotation={[axialTilt, 0, 0]} castShadow={!emissiveColor} receiveShadow={!emissiveColor}>
            <sphereGeometry args={[size, 64, 64]} />
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