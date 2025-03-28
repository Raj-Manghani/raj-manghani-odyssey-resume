// src/components/FlyingObjects/FlyingObjects.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Helper function to create random data for one object
const createObjectData = () => {
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 150, // Slightly tighter initial spread than asteroids
    (Math.random() - 0.5) * 80,
    (Math.random() - 0.5) * 200 - 100 // Start further back on average
  );
  // Faster movement speed than asteroids
  const moveSpeed = Math.random() * 0.3 + 0.1;
  // More directed movement, less random spread
  const moveDirection = new THREE.Vector3(
    (Math.random() - 0.5) * 0.1,
    (Math.random() - 0.5) * 0.1,
    0.9 + Math.random() * 0.1 // Strongly biased towards positive Z
  ).normalize();
  const scale = Math.random() * 0.3 + 0.2; // Size

  return { position, moveSpeed, moveDirection, scale };
};

// Individual Flying Object Component (Rocket/Comet)
function FlyingObject({ initialData }) {
  const meshRef = useRef();
  const data = useRef(initialData);
  // Store current position separately for lookAt calculation
  const currentPos = useRef(initialData.position.clone());

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Movement
    const moveVector = data.current.moveDirection.clone().multiplyScalar(data.current.moveSpeed);
    currentPos.current.add(moveVector); // Update logical position

    // Apply position to mesh
    meshRef.current.position.copy(currentPos.current);

    // Make the object point in the direction it's moving
    const lookAtPos = currentPos.current.clone().add(data.current.moveDirection);
    meshRef.current.lookAt(lookAtPos);

    // Boundary Check & Reset (Looping effect)
    if (currentPos.current.z > 150) { // Reset if it goes too far
      currentPos.current.z = -150; // Loop back
      // Randomize X/Y position slightly on reset
      currentPos.current.x = (Math.random() - 0.5) * 150;
      currentPos.current.y = (Math.random() - 0.5) * 80;
    }
  });

  return (
    // Use a group to handle the lookAt rotation separately from geometry orientation if needed
    // Cone points up Y axis by default, rotate it to point down Z axis initially
    <group ref={meshRef} position={data.current.position} scale={data.current.scale} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
         {/* ConeGeometry: radius, height, radialSegments */}
        <coneGeometry args={[0.5, 1.5, 8]} />
        {/* Brighter color like orange or cyan */}
        <meshStandardMaterial color="orange" roughness={0.5} metalness={1.3} emissive="darkorange" emissiveIntensity={0.3}/>
      </mesh>
    </group>
  );
}

// FlyingObjects Component - Generates multiple objects
const FlyingObjects = ({ count = 20 }) => { // Fewer rockets than asteroids
  const objectsData = useMemo(() => {
    return Array.from({ length: count }, createObjectData);
  }, [count]);

  return (
    <group>
      {objectsData.map((data, index) => (
        <FlyingObject key={index} initialData={data} />
      ))}
    </group>
  );
};

export default FlyingObjects;