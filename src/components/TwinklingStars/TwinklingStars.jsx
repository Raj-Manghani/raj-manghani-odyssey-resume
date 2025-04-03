// src/components/TwinklingStars/TwinklingStars.jsx
import { useRef, useMemo } from 'react'; // Removed React
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Individual Twinkling Star
function Star() {
  const meshRef = useRef();
  // useMemo ensures these random values are set only once per star instance
  const { initialPosition, scale, timeOffset } = useMemo(() => ({
    initialPosition: new THREE.Vector3(
      (Math.random() - 0.5) * 300, // Spread them out wider than asteroids
      (Math.random() - 0.5) * 150,
      (Math.random() - 0.5) * 300
    ),
    scale: Math.random() * 0.022 + 0.005, // Range: 0.005 to 0.027
    timeOffset: Math.random() * 100 // Random offset for twinkle animation
  }), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    // Simple twinkle effect: vary opacity using a sine wave
    // Adjust frequency (e.g., * 2) and magnitude (e.g., * 0.3) for different effects
    const twinkle = (Math.sin(clock.elapsedTime * 1.5 + timeOffset) + 1) / 2; // Value between 0 and 1
    meshRef.current.material.opacity = 0.5 + twinkle * 0.5; // Base opacity 0.5, varying up to 1.0
  });

  return (
    <mesh ref={meshRef} position={initialPosition} scale={scale}>
      <sphereGeometry args={[0.5, 8, 8]} /> {/* Simple sphere geometry */}
      {/* Basic material that doesn't need light, set transparent=true for opacity changes */}
      <meshBasicMaterial color="#FFFFFF" transparent={true} />
    </mesh>
  );
}

// Component to render multiple twinkling stars
const TwinklingStars = ({ count = 100 }) => {
  // Create an array of Star components
  const stars = useMemo(() => Array.from({ length: count }).map((_, i) => <Star key={i} />), [count]);

  return <group>{stars}</group>;
};

export default TwinklingStars;
