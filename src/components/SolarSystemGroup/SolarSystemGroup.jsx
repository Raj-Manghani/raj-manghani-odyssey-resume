import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import PlanetSystem from '../PlanetSystem/PlanetSystem';
import { PLANET_DATA } from '../../constants/solarSystemData'; // Import data

function SolarSystemGroup({ activeInfo, handlePlanetClick }) {
    const orbitRefs = useMemo(() => {
        const refs = {};
        Object.keys(PLANET_DATA).filter(key => key !== 'sun').forEach(key => { refs[key] = React.createRef(); });
        return refs;
    }, []);

    useFrame((state, delta) => {
        Object.keys(PLANET_DATA).filter(key => key !== 'sun').forEach((key) => {
            if (orbitRefs[key]?.current) {
                orbitRefs[key].current.rotation.y += delta * PLANET_DATA[key].orbitSpeed;
            }
        });
    });

    return (
        <group>
            {/* --- Sun --- */}
            <PlanetSystem
                planetKey="sun"
                name={PLANET_DATA.sun.name}
                showInfo={activeInfo === 'sun'}
                onPlanetClick={handlePlanetClick}
                position={[0, 0, 0]}
                planetSize={PLANET_DATA.sun.size}
                planetTextureUrl="/textures/sun_map.jpg"
                moons={[]}
                emissiveColor="orange"
                emissiveIntensity={2.0}
                planetAxialTilt={0}
                hasRings={false}
            />

            {/* --- Planets --- */}
            {Object.keys(PLANET_DATA).filter(key => key !== 'sun').map((key) => {
                const data = PLANET_DATA[key];
                if (!data) {
                    console.error("Missing data for planet key:", key);
                    return null;
                }
                return (
                    <group key={key} ref={orbitRefs[key]}>
                        <PlanetSystem
                            planetKey={key}
                            name={data.name}
                            showInfo={activeInfo === key}
                            onPlanetClick={handlePlanetClick}
                            position={[data.orbitRadius, data.yOffset, 0]}
                            planetSize={data.size}
                            planetTextureUrl={`/textures/${key}_map.jpg`}
                            planetAxialTilt={data.tilt || 0}
                            moons={data.moons}
                            hasRings={key === 'saturn'}
                            ringTextureUrl={key === 'saturn' ? "/textures/saturn_rings_map.png" : null}
                            emissiveColor={null}
                            emissiveIntensity={0}
                        />
                    </group>
                );
            })}
        </group>
    );
}

export default SolarSystemGroup; 