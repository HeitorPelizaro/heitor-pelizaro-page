"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useAppSettings } from "@/context/AppSettingsContext";
import { readCssHexVar } from "@/lib/cssColor";

function WireOrbit() {
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  const wheelImpulse = useRef({ y: 0, x: 0 });

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const dy = Math.max(-80, Math.min(80, e.deltaY));
      wheelImpulse.current.y += dy * 0.0018;
      wheelImpulse.current.x += dy * 0.00055;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const geo = useMemo(() => new THREE.TorusGeometry(3.2, 0.03, 12, 80), []);
  const matC = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#00f0ff"),
        transparent: true,
        opacity: 0.35,
        wireframe: true,
      }),
    []
  );
  const matM = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ff2d6a"),
        transparent: true,
        opacity: 0.32,
        wireframe: true,
      }),
    []
  );

  useFrame((_, delta) => {
    const iy = wheelImpulse.current.y;
    const ix = wheelImpulse.current.x;
    wheelImpulse.current.y *= 0.92;
    wheelImpulse.current.x *= 0.92;

    const cHex = readCssHexVar("--neon-cyan", "#00f0ff");
    const mHex = readCssHexVar("--neon-magenta", "#ff2d6a");
    matC.color.set(cHex);
    matM.color.set(mHex);

    if (mesh1.current) {
      mesh1.current.rotation.y += delta * 0.08 + iy;
      mesh1.current.rotation.x += delta * 0.03 + ix * 0.42;
    }
    if (mesh2.current) {
      mesh2.current.rotation.y += delta * 0.07 - iy * 0.35;
      mesh2.current.rotation.x += delta * 0.04 + ix * 0.58;
    }
  });

  return (
    <group>
      <mesh ref={mesh1} geometry={geo} material={matC} />
      <mesh
        ref={mesh2}
        geometry={geo}
        material={matM}
        rotation={[Math.PI / 2, 0, 0]}
      />
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
