// src/components/PlanetSystem/Moon.jsx
import React, { useState, useRef } from 'react';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

const Moon = ({
    size = 0.3, textureUrl = null, color = 'grey', position = [0, 0, 0],
    name, vitals, description, funFact, showInfo, onMoonClick
}) => {

    const [isHovered, setIsHovered] = useState(false);
    const meshRef = useRef();
    const safeTextureUrl = textureUrl || '/textures/placeholder.png';
    const texture = useTexture(safeTextureUrl);
    const useLoadedTexture = textureUrl && texture && texture.image;

    const handlePointerOver = (e) => { if (!showInfo) { e.stopPropagation(); setIsHovered(true); document.body.style.cursor = 'pointer'; }};
    const handlePointerOut = (e) => { e.stopPropagation(); setIsHovered(false); document.body.style.cursor = 'default'; };
    const handleClick = (e) => { e.stopPropagation(); setIsHovered(false); document.body.style.cursor = 'default'; onMoonClick(name); };

    if (size <= 0) return null;

    return (
        <group position={position} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} >
            <mesh ref={meshRef} castShadow receiveShadow>
                <sphereGeometry args={[size, Math.max(8, Math.floor(size * 16)), Math.max(8, Math.floor(size * 16))]} />
                <meshStandardMaterial map={useLoadedTexture ? texture : undefined} color={useLoadedTexture ? '#FFFFFF' : color} roughness={0.9} />
            </mesh>

             {/* Moon Name Label on Hover */}
             {isHovered && !showInfo && name && (
                <Html position={[0, size * 1.8 + 0.1, 0]} center className="nameLabel">
                    <div>
                         {name}
                         {/* <<< Ensure this span is here >>> */}
                         <span className="clickPrompt">(Click for Details)</span>
                     </div>
                </Html>
             )}

            {/* Moon Full Info Box on Click */}
            {showInfo && name && (
                <Html position={[0, size * 1.5, 0]} center className="infoBoxContainer">
                    <div className="infoBox">
                        <h3>{name}</h3>
                        {vitals && <p><strong>Vitals:</strong> {vitals}</p>}
                        {description && <p>{description}</p>}
                        {funFact && <p><em>Fun Fact:</em> {funFact}</p>}
                    </div>
                </Html>
            )}
        </group>
    );
};
export default Moon;