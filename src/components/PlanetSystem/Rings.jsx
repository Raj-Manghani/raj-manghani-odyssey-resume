// src/components/PlanetSystem/Rings.jsx
import React, { useRef } from 'react'; // Added useRef
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Rings = ({ textureUrl = null, innerRadius = 3, outerRadius = 5 }) => {

    // --- Unconditional Hook Call First ---
    const meshRef = useRef(); // Example placeholder hook

    // --- Conditionally load texture *after* other hooks ---
    const texture = textureUrl ? useTexture(textureUrl) : null;
    const textureLoaded = texture; // Simpler check
    const hasTransparency = textureLoaded && textureUrl.toLowerCase().endsWith('.png');
    const initialTiltX = Math.PI / 2;

    return (
        <mesh ref={meshRef} rotation={[initialTiltX, 0, 0]} receiveShadow>
            <ringGeometry args={[innerRadius, outerRadius, 64]} />
            <meshStandardMaterial
                map={textureLoaded ? texture : undefined}
                color={textureLoaded ? '#FFFFFF' : 'lightgrey'}
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