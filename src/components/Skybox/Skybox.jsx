import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Skybox() {
    const texture = useTexture('/textures/star_milky_way.jpg');
    return (
        <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 64, 32]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}

export default Skybox; 