// src/components/PlanetSystem/Moon.jsx
import React, { useState } from 'react'; // Added useState
import { useTexture, Html } from '@react-three/drei'; // Added Html

// Updated Moon component to be interactive
const Moon = ({
    size = 0.3,
    textureUrl = null,
    color = 'grey',
    position = [0, 0, 0],
    // --- Info Props for Moon ---
    name, // Name passed down
    vitals,
    description,
    funFact,
    showInfo, // Controlled by App state via PlanetSystem
    onMoonClick // Function passed down from App via PlanetSystem
    // --- End Info Props ---
}) => {

    // --- Hover State for Moon ---
    const [isHovered, setIsHovered] = useState(false);

    // --- Texture Loading ---
    // If textureUrl is falsy, use an invalid placeholder path
    const safeTextureUrl = textureUrl || '/invalid-texture-path.jpg';
    const texture = useTexture(safeTextureUrl);
    // Check if the original URL was provided AND the texture loaded
    const textureLoaded = textureUrl && texture;
    // --- End Texture Loading ---

    // --- Event Handlers specific to this moon ---
    const handlePointerOver = (e) => {
        e.stopPropagation(); // Prevent event bubbling up to planet/orbit group
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
    };
    const handlePointerOut = (e) => {
        e.stopPropagation();
        setIsHovered(false);
        document.body.style.cursor = 'default';
    };
    const handleClick = (e) => {
        e.stopPropagation();
        onMoonClick(name); // Call the handler passed down with THIS moon's name
    };
    // --- End Event Handlers ---

    // Only render if size is positive
    if (size <= 0) return null;

    return (
        // Group now handles events for the moon
        <group
            position={position}
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
            <mesh castShadow receiveShadow> {/* Moon mesh */}
                {/* Ensure geometry args are valid */}
                <sphereGeometry args={[size, Math.max(8, Math.floor(size * 20)), Math.max(8, Math.floor(size * 20))]} />
                <meshStandardMaterial
                    map={textureLoaded ? texture : undefined}
                    color={textureLoaded ? '#FFFFFF' : color}
                    roughness={0.9} // Moons typically rough
                />
            </mesh>

             {/* --- Moon Name Label on Hover --- */}
             {isHovered && !showInfo && name && ( // Show only if hovered, not showing full info, and name exists
                <Html position={[0, size * 1.8 + 0.1, 0]} center className="nameLabel"> {/* Adjust vertical offset based on size */}
                    <div>
                        {name}
                        <span className="clickPrompt">(Click for Details)</span>
                    </div>
                </Html>
             )}

            {/* --- Moon Full Info Box on Click --- */}
            {showInfo && name && ( // Show only if active and name exists
                // Remove distanceFactor to keep size constant
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