// src/components/PlanetSystem/Rings.jsx
// Removed React import
import { useTexture } from '@react-three/drei';
import * as THREE from 'three'; // Import THREE for DoubleSide

const Rings = ({
    textureUrl = null,
    innerRadius = 3, // Example default inner radius
    outerRadius = 5, // Example default outer radius
    tilt = 0 // Default no tilt
}) => {

    // Load ring texture
    const safeTextureUrl = textureUrl || '/invalid-texture-path.jpg';
    const texture = useTexture(safeTextureUrl);
    const textureLoaded = textureUrl && texture;

    // Check if texture actually loaded and has alpha (transparency)
    const hasTransparency = textureLoaded // && texture.format === THREE.RGBAFormat; // More precise check if needed

    return (
        <mesh rotation={[tilt, 0, 0]} receiveShadow> {/* Apply tilt, receive shadow */}
            {/* RingGeometry: innerRadius, outerRadius, thetaSegments */}
            <ringGeometry args={[innerRadius, outerRadius, 64]} />
            <meshStandardMaterial
                map={textureLoaded ? texture : undefined}
                color={textureLoaded ? '#FFFFFF' : 'lightgrey'} // Fallback color
                side={THREE.DoubleSide} // Make visible from both sides
                transparent={hasTransparency} // Enable transparency if texture likely has it
                alphaTest={hasTransparency ? 0.1 : 0} // Avoid rendering fully transparent pixels (adjust threshold if needed)
                opacity={hasTransparency ? 0.9 : 1.0} // Slight opacity adjustment if transparent
                roughness={0.8}
                metalness={0.2}
            />
        </mesh>
    );
};

export default Rings;
