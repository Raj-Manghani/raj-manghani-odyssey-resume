// src/components/TwinklingStars/TwinklingStars.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber'; // <<< Re-import useFrame
import * as THREE from 'three';

// Individual Twinkling Star (With Animation)
function Star() {
  const meshRef = useRef();

  // Keep track of initial random values
  const { initialPosition, scale, timeOffset } = useMemo(() => ({
    initialPosition: new THREE.Vector3(
      (Math.random() - 0.5) * 300,
      (Math.random() - 0.5) * 150,
      (Math.random() - 0.5) * 300
    ),
    // Use a random scale, but slightly larger than before
    scale: Math.random() * 0.60 + 0.02, // Range: 0.02 to 0.06
    timeOffset: Math.random() * 100 // Random offset for twinkle animation
  }), []);

  // --- Re-added useFrame hook ---
  useFrame(({ clock }) => {
    if (!meshRef.current?.material) return; // Add check for material existence

    // Simple twinkle effect: vary opacity using a sine wave
    const twinkle = (Math.sin(clock.elapsedTime * 1.5 + timeOffset) + 1) / 2; // Value 0 to 1
    // Ensure opacity stays within valid range [0, 1] and use a base opacity
    meshRef.current.material.opacity = Math.max(0.1, 0.4 + twinkle * 0.6); // Base 0.4, varying up to 1.0 (min 0.1)

    // Optional: Add slight scale pulsation? (Can impact performance)
    // const scalePulse = 1.0 + Math.sin(clock.elapsedTime + timeOffset * 0.5) * 0.05;
    // meshRef.current.scale.setScalar(scale * scalePulse);
  });
  // --- End useFrame ---

  return (
    <mesh ref={meshRef} position={initialPosition} scale={scale}> {/* Use random scale */}
      <sphereGeometry args={[0.5, 8, 8]} />
      {/* --- Re-added transparent material --- */}
      <meshBasicMaterial
          color="#FFFFFF"
          transparent={true} // <<< Enable transparency
          opacity={0.5}      // <<< Set initial opacity (will be animated)
          depthWrite={false} // <<< Often needed for transparent objects to render correctly
       />
    </mesh>
  );
}

// Component to render multiple twinkling stars (Unchanged structure)
const TwinklingStars = ({ count = 200 }) => { // Increased count back
  // console.log("Attempting to render TwinklingStars (Animated)"); // DEBUG

  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => <Star key={i} />);
  }, [count]);

  return <group>{stars}</group>;
};

export default TwinklingStars;