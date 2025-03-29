// src/components/PlanetSystem/Planet.jsx
import React, { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three'; // Import THREE

const Planet = ({
    size = 1, textureUrl = null, color = 'blue', emissiveColor = null,
    emissiveIntensity = 1, rotationRef, axialTilt = 0
}) => {
    const internalRef = useRef(); // Internal ref for fallback
    const meshRef = rotationRef || internalRef; // Use passed ref if available

    // --- Load Texture Unconditionally using Placeholder ---
    // Use placeholder if no real textureUrl is provided or it's falsy
    const safeTextureUrl = textureUrl || '/textures/placeholder.png';
    const loadedTexture = useTexture(safeTextureUrl);
    // Determine if we should USE the loaded texture (was a real URL provided AND did it load?)
    const useLoadedTexture = textureUrl && loadedTexture && loadedTexture.image; // Check if image data is present

    return (
        <mesh ref={meshRef} rotation={[axialTilt, 0, 0]} castShadow={!emissiveColor} receiveShadow={!emissiveColor}>
            {/* Increased segments slightly for potentially larger planets */}
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial
                map={useLoadedTexture ? loadedTexture : undefined}
                color={useLoadedTexture ? '#FFFFFF' : color} // Use white base if textured
                roughness={emissiveColor ? 1 : 0.85}
                metalness={0.1}
                emissive={emissiveColor}
                // Only map emission if texture exists AND it's an emissive object
                emissiveMap={emissiveColor && useLoadedTexture ? loadedTexture : undefined}
                emissiveIntensity={emissiveColor ? emissiveIntensity : 0}
            />
        </mesh>
    );
};
export default Planet;