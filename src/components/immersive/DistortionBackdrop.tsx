"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useAppSettings } from "@/context/AppSettingsContext";

function WireOrbit() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.08;
    group.current.rotation.x += delta * 0.03;
  });

  const geo = useMemo(() => new THREE.TorusGeometry(3.2, 0.03, 12, 80), []);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#00f0ff"),
        transparent: true,
        opacity: 0.35,
        wireframe: true,
      }),
    []
  );

  return (
    <group ref={group}>
      <mesh geometry={geo} material={mat} />
      <mesh geometry={geo} material={mat} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <WireOrbit />
      <EffectComposer multisampling={0}>
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0012, 0.0008)}
          radialModulation
          modulationOffset={0.5}
        />
        <Noise blendFunction={BlendFunction.OVERLAY} opacity={0.12} />
        <Vignette eskil={false} offset={0.35} darkness={0.62} />
      </EffectComposer>
    </>
  );
}

export function DistortionBackdrop() {
  const { performanceMode, effectiveReduceMotion } = useAppSettings();
  if (performanceMode || effectiveReduceMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-[5] opacity-90"
      aria-hidden
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
