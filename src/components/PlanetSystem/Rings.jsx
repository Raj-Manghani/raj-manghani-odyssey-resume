// src/components/PlanetSystem/Rings.jsx
import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Rings = ({
    textureUrl = null, innerRadius = 3, outerRadius = 5,
    // Removed tilt prop
}) => {

    // --- Load Texture Unconditionally using Placeholder ---
    const safeTextureUrl = textureUrl || '/textures/placeholder.png';
    const loadedTexture = useTexture(safeTextureUrl);
    const useLoadedTexture = textureUrl && loadedTexture && loadedTexture.image;
    const hasTransparency = useLoadedTexture && textureUrl.toLowerCase().endsWith('.png');

    // Simple X rotation to make it flat on XZ plane
    const initialTiltX = Math.PI / 2;

    return (
        <mesh rotation={[initialTiltX, 0, 0]} receiveShadow>
            <ringGeometry args={[innerRadius, outerRadius, 64]} />
            <meshStandardMaterial
                map={useLoadedTexture ? loadedTexture : undefined}
                color={useLoadedTexture ? '#FFFFFF' : 'lightgrey'}
                side={THREE.DoubleSide}
                transparent={hasTransparency}
                alphaTest={hasTransparency ? 0.1 : 0}
                opacity={1.0}
                roughness={0.8}
                metalness={0.2}
            />
        </mesh>
    );
};
export default Rings;