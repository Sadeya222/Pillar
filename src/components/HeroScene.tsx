import { Edges, Float, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface SceneProps {
  isCoarsePointer: boolean;
}

function ParticleField({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 4 + Math.random() * 7;
      const angle = Math.random() * Math.PI * 2;
      data[index * 3] = Math.cos(angle) * radius;
      data[index * 3 + 1] = (Math.random() - 0.46) * 10;
      data[index * 3 + 2] = Math.sin(angle) * radius - 2;
    }
    return data;
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#a78bfa"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.52}
        depthWrite={false}
      />
    </points>
  );
}

function Monolith({ isCoarsePointer }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const targetX = isCoarsePointer ? -0.08 : pointer.y * 0.13 - 0.08;
    const targetY = isCoarsePointer ? -0.24 : pointer.x * 0.22 - 0.24;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3, delta);
    group.current.position.y = -0.25 + Math.sin(clock.elapsedTime * 0.55) * 0.07;
  });

  return (
    <group ref={group} rotation={[-0.08, -0.24, 0]}>
      <Float speed={isCoarsePointer ? 0 : 0.7} rotationIntensity={0.08} floatIntensity={0.15}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.94, 1.16, 4.6, 6, 1, false]} />
          <meshStandardMaterial color="#0c0c12" metalness={0.92} roughness={0.2} />
          <Edges color="#4c1d95" opacity={0.46} transparent threshold={12} />
        </mesh>

        <mesh position={[0, 0, 0.1]} scale={[0.72, 0.93, 0.72]}>
          <cylinderGeometry args={[0.94, 1.02, 4.6, 6]} />
          <meshStandardMaterial
            color="#17111f"
            emissive="#4c1d95"
            emissiveIntensity={0.25}
            metalness={0.72}
            roughness={0.26}
          />
        </mesh>

        <RoundedBox args={[0.055, 3.25, 0.045]} radius={0.02} position={[0, 0.08, 0.91]}>
          <meshBasicMaterial color="#8b5cf6" toneMapped={false} />
        </RoundedBox>

        <mesh position={[0, 2.28, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[1.04, 1.04, 0.08, 6]} />
          <meshStandardMaterial color="#19131f" metalness={1} roughness={0.14} />
          <Edges color="#8b5cf6" opacity={0.7} transparent />
        </mesh>

        {!isCoarsePointer && (
          <>
            <RoundedBox args={[0.24, 3.55, 0.28]} radius={0.08} position={[-1.23, -0.22, -0.25]}>
              <meshStandardMaterial color="#0b0b0f" metalness={0.86} roughness={0.27} />
            </RoundedBox>
            <RoundedBox args={[0.18, 2.8, 0.22]} radius={0.06} position={[1.18, -0.46, 0.08]}>
              <meshStandardMaterial color="#0b0b0f" metalness={0.86} roughness={0.27} />
            </RoundedBox>
          </>
        )}
      </Float>

      <mesh position={[0, -2.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.72, 0.018, 8, 96]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.78} toneMapped={false} />
      </mesh>
      <mesh position={[0, -2.7, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.3, 64]} />
        <meshStandardMaterial color="#09090c" metalness={0.35} roughness={0.68} />
      </mesh>
    </group>
  );
}

function Scene({ isCoarsePointer }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#080808"]} />
      <fog attach="fog" args={["#080808", 8, 18]} />
      <ambientLight intensity={isCoarsePointer ? 0.38 : 0.55} />
      <spotLight
        position={[3.5, 6, 4]}
        color="#d8b4fe"
        intensity={45}
        angle={0.35}
        penumbra={0.8}
        castShadow={!isCoarsePointer}
      />
      {!isCoarsePointer && (
        <pointLight position={[-4, 0, 1]} color="#6d28d9" intensity={20} distance={9} />
      )}
      <pointLight position={[0, -1.6, 2]} color="#7c3aed" intensity={13} distance={5} />
      <ParticleField count={isCoarsePointer ? 110 : 320} />
      <Monolith isCoarsePointer={isCoarsePointer} />
    </>
  );
}

function StaticMonolith() {
  return (
    <div className="static-monolith" aria-hidden="true">
      <div className="static-monolith__edge" />
      <div className="static-monolith__beam" />
      <div className="static-monolith__base" />
    </div>
  );
}

interface HeroSceneProps extends SceneProps {
  prefersReducedMotion: boolean;
}

export function HeroScene({ isCoarsePointer, prefersReducedMotion }: HeroSceneProps) {
  if (prefersReducedMotion) return <StaticMonolith />;

  return (
    <div className="h-full w-full" aria-hidden="true">
      <Canvas
        dpr={isCoarsePointer ? 1 : [1, 1.5]}
        camera={{ position: [0, 0.1, 7.6], fov: 37, near: 0.1, far: 30 }}
        gl={{ antialias: !isCoarsePointer, alpha: false, powerPreference: "high-performance" }}
        shadows={!isCoarsePointer}
      >
        <Scene isCoarsePointer={isCoarsePointer} />
      </Canvas>
    </div>
  );
}