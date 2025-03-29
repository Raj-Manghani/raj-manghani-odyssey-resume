// src/components/PlanetSystem/Moon.jsx
import React, { useState, useRef } from 'react';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

// Simplified Moon component - Hover label only, no click info yet
const Moon = ({
    size = 0.3,
    textureUrl = null,
    color = 'grey',
    position = [0, 0, 0],
    name, // Keep name prop for hover label
    // REMOVED info/click props for this version
    // vitals, description, funFact, showInfo, onMoonClick
}) => {

    const [isHovered, setIsHovered] = useState(false);
    const meshRef = useRef();

    // --- Load Texture Unconditionally using Placeholder ---
    const safeTextureUrl = textureUrl || '/textures/placeholder.png';
    const loadedTexture = useTexture(safeTextureUrl);
    const useLoadedTexture = textureUrl && loadedTexture && loadedTexture.image;

    // Simplified Event Handlers - Only Hover
    const handlePointerOver = (e) => { e.stopPropagation(); setIsHovered(true); document.body.style.cursor = 'pointer'; };
    const handlePointerOut = (e) => { e.stopPropagation(); setIsHovered(false); document.body.style.cursor = 'default'; };
    // No handleClick defined

    if (size <= 0) return null;

    return (
        <group
            position={position}
            // onClick={handleClick} // Removed click
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
            <mesh ref={meshRef} castShadow receiveShadow>
                <sphereGeometry args={[size, Math.max(8, Math.floor(size * 16)), Math.max(8, Math.floor(size * 16))]} />
                <meshStandardMaterial map={useLoadedTexture ? loadedTexture : undefined} color={useLoadedTexture ? '#FFFFFF' : color} roughness={0.9} />
            </mesh>

             {/* Moon Name Label on Hover */}
             {isHovered && name && (
                <Html position={[0, size * 1.8 + 0.1, 0]} center className="nameLabel">
                    <div> {name} {/* Removed click prompt */} </div>
                </Html>
             )}
             {/* REMOVED Full Info Box */}
        </group>
    );
};

export default Moon;