'use client';

import { useMemo, useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Float } from '@react-three/drei';
import * as THREE from 'three';
import useStore from './useStore';

const MATERIAL_LOOKUP = {
  grass: {
    color: '#6ba36b',
    emissive: '#1d2f1d'
  },
  dirt: {
    color: '#9c744d',
    emissive: '#3b2714'
  },
  stone: {
    color: '#828b9a',
    emissive: '#232831'
  },
  glow: {
    color: '#ffd86e',
    emissive: '#ffb347'
  }
};

function Voxel({ position, type }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const addBlock = useStore((state) => state.addBlock);
  const removeBlock = useStore((state) => state.removeBlock);

  const material = MATERIAL_LOOKUP[type] ?? MATERIAL_LOOKUP.grass;

  const handlePointerDown = useCallback(
    (event) => {
      event.stopPropagation();
      const isRemove = event.shiftKey || event.button === 2;
      const currentPosition = meshRef.current.position;
      const base = [Math.round(currentPosition.x), Math.round(currentPosition.y), Math.round(currentPosition.z)];

      if (isRemove) {
        removeBlock(base);
        return;
      }

      const face = event.face;
      if (!face) return;
      const normal = face.normal.clone().round();
      const addPosition = [
        base[0] + normal.x,
        base[1] + normal.y,
        base[2] + normal.z
      ];
      const chosenType = normal.y > 0 ? 'grass' : normal.y < 0 ? 'stone' : 'dirt';
      addBlock(addPosition, chosenType);
    },
    [addBlock, removeBlock]
  );

  return (
    <mesh
      ref={meshRef}
      position={position}
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={material.color}
        emissive={hovered ? '#6572ff' : material.emissive}
        roughness={0.75}
        metalness={0.08}
      />
      {hovered && (
        <Edges
          scale={1.02}
          threshold={20}
          color="#f0f3ff"
        />
      )}
    </mesh>
  );
}

function Fireflies() {
  const group = useRef();
  const instances = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 30; i += 1) {
      const x = THREE.MathUtils.randFloatSpread(30);
      const y = THREE.MathUtils.randFloat(4, 12);
      const z = THREE.MathUtils.randFloatSpread(30);
      temp.push({ position: [x, y, z], phase: Math.random() * Math.PI * 2 });
    }
    return temp;
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const elapsed = clock.elapsedTime;
    group.current.children.forEach((child, idx) => {
      const { phase } = instances[idx];
      child.position.y += Math.sin(elapsed + phase) * 0.005;
      const intensity = (Math.sin(elapsed * 2 + phase) + 1) / 2;
      child.material.emissiveIntensity = THREE.MathUtils.lerp(0.4, 1.4, intensity);
    });
  });

  return (
    <group ref={group}>
      {instances.map((item, index) => (
        <mesh key={index} position={item.position} castShadow>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#ffd86e" emissive="#ffd86e" emissiveIntensity={1.2} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export default function World() {
  const blocks = useStore((state) => state.blocks);
  const blockEntries = useMemo(() => Object.values(blocks), [blocks]);

  return (
    <group>
      <fog attach="fog" args={["#05060a", 20, 140]} />
      <group position={[0, 0.5, 0]}>
        {blockEntries.map(({ position, type }) => (
          <Voxel key={position.join(':')} position={position} type={type} />
        ))}
      </group>
      <Float floatIntensity={0.6} speed={0.8} rotationIntensity={0.2}>
        <Fireflies />
      </Float>
    </group>
  );
}
