// src/components/PlanetSystem/Moon.jsx
import React from 'react'; // Make sure React is imported if using JSX
import { useTexture } from '@react-three/drei';

// Simple component just for the moon mesh and texture
const Moon = ({
    size = 0.3,
    textureUrl = null,
    color = 'grey', // Fallback color
    position = [0, 0, 0]
}) => {

    // --- Load Texture Unconditionally ---
    const safeTextureUrl = textureUrl || '/invalid-texture-path.jpg';
    const texture = useTexture(safeTextureUrl);
    const textureLoaded = textureUrl && texture;

    return (
        <mesh position={position} castShadow receiveShadow>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial
                map={textureLoaded ? texture : undefined}
                color={textureLoaded ? '#FFFFFF' : color}
                roughness={0.9}
            />
        </mesh>
    );
}; // <<< Check for semicolon

export default Moon; // <<< Check default export