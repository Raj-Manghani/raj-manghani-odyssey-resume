// src/components/AsteroidField/AsteroidField.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei'; // <<< Ensure useTexture is imported
import * as THREE from 'three';

// Helper function to create random data for one asteroid (Unchanged)
const createAsteroidData = () => {
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 200
  );
  const rotationAxis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
  const rotationSpeed = Math.random() * 0.01 + 0.001;
  const moveSpeed = Math.random() * 0.05 + 0.01;
  const moveDirection = new THREE.Vector3(
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.1,
    Math.random() * 0.8 + 0.2
  ).normalize();
   const scale = Math.random() * 0.3 + 0.1;
  return { position, rotationAxis, rotationSpeed, moveSpeed, moveDirection, scale };
};

// Individual Asteroid Component
function Asteroid({ initialData }) {
  const meshRef = useRef();
  const data = useRef(initialData);

  // --- Load the provided asteroid texture ---
  // Make sure the image file exists at this path in your public folder
  const texture = useTexture('/textures/asteroid_texture.jpg'); // <<< UPDATE PATH IF NEEDED

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Rotation
    meshRef.current.rotateOnAxis(data.current.rotationAxis, data.current.rotationSpeed);
    // Movement
    const moveVector = data.current.moveDirection.clone().multiplyScalar(data.current.moveSpeed);
    meshRef.current.position.add(moveVector);
    // Boundary Check & Reset
    if (meshRef.current.position.z > 100) {
      meshRef.current.position.z = -100;
      meshRef.current.position.x = (Math.random() - 0.5) * 200;
      meshRef.current.position.y = (Math.random() - 0.5) * 100;
    }
  });

  return (
    <mesh ref={meshRef} position={data.current.position} scale={data.current.scale} castShadow receiveShadow>
      <icosahedronGeometry args={[1, 0]} />
      {/* Apply the texture */}
      <meshStandardMaterial
          map={texture}         // <<< Apply texture map
          color="#FFFFFF"       // <<< Use white color with map
          roughness={0.9}       // <<< Increase roughness for rock
          metalness={0.1}
       />
    </mesh>
  );
}

// Asteroid Field Component - Generates multiple asteroids (Unchanged)
const AsteroidField = ({ count = 100 }) => {
  const asteroidsData = useMemo(() => {
    return Array.from({ length: count }, createAsteroidData);
  }, [count]);
  return (
    <group>
      {asteroidsData.map((data, index) => (
        <Asteroid key={index} initialData={data} />
      ))}
    </group>
  );
};

export default AsteroidField;