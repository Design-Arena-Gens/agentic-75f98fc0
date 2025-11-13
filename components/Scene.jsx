'use client';

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Sky, Stars } from '@react-three/drei';
import World from './World';

export default function Scene() {
  useEffect(() => {
    const handleContextMenu = (event) => event.preventDefault();
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div className="canvas-container">
      <Canvas
        shadows
        camera={{ position: [18, 16, 18], fov: 55, near: 0.1, far: 500 }}
      >
        <color attach="background" args={["#05060a"]} />
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[25, 40, 15]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-12, 15, -18]} intensity={0.4} />
        <Sky
          distance={450000}
          sunPosition={[0.4, 0.8, -0.2]}
          inclination={0.52}
          azimuth={0.2}
          turbidity={8}
          rayleigh={3}
          mieCoefficient={0.005}
          mieDirectionalG={0.95}
        />
        <Stars radius={120} depth={50} count={6000} factor={4} fade />
        <World />
        <Environment preset="forest" background={false} />
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={12}
          maxDistance={90}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
      <div className="crosshair" />
    </div>
  );
}
