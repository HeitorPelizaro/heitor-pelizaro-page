"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useAppSettings } from "@/context/AppSettingsContext";
import { readCssHexVar } from "@/lib/cssColor";

/** Rotação base dos torus (rad/s) — valores ~45% dos originais para movimento mais calmo */
const RING_SPEED_Y_1 = 0.036;
const RING_SPEED_X_1 = 0.0135;
const RING_SPEED_Y_2 = 0.0315;
const RING_SPEED_X_2 = 0.018;
/** Impulso do scroll sobre a rotação */
const WHEEL_GAIN_Y = 0.001;
const WHEEL_GAIN_X = 0.00032;
const WHEEL_DECAY = 0.92;

function WireOrbit() {
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  const wheelImpulse = useRef({ y: 0, x: 0 });

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const dy = Math.max(-80, Math.min(80, e.deltaY));
      wheelImpulse.current.y += dy * WHEEL_GAIN_Y;
      wheelImpulse.current.x += dy * WHEEL_GAIN_X;
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
    wheelImpulse.current.y *= WHEEL_DECAY;
    wheelImpulse.current.x *= WHEEL_DECAY;

    const cHex = readCssHexVar("--neon-cyan", "#00f0ff");
    const mHex = readCssHexVar("--neon-magenta", "#ff2d6a");
    matC.color.set(cHex);
    matM.color.set(mHex);

    if (mesh1.current) {
      mesh1.current.rotation.y += delta * RING_SPEED_Y_1 + iy;
      mesh1.current.rotation.x += delta * RING_SPEED_X_1 + ix * 0.42;
    }
    if (mesh2.current) {
      mesh2.current.rotation.y += delta * RING_SPEED_Y_2 - iy * 0.35;
      mesh2.current.rotation.x += delta * RING_SPEED_X_2 + ix * 0.58;
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

function Scene({ lightPostFx }: { lightPostFx: boolean }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <WireOrbit />
      <EffectComposer multisampling={0}>
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={
            lightPostFx
              ? new THREE.Vector2(0, 0)
              : new THREE.Vector2(0.0012, 0.0008)
          }
          radialModulation={!lightPostFx}
          modulationOffset={0.5}
        />
        <Noise
          blendFunction={BlendFunction.OVERLAY}
          opacity={lightPostFx ? 0.05 : 0.12}
        />
        <Vignette eskil={false} offset={0.35} darkness={lightPostFx ? 0.52 : 0.62} />
      </EffectComposer>
    </>
  );
}

function useLightBackdropFx() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const q = () => {
      const w = window.innerWidth;
      const dpr = window.devicePixelRatio || 1;
      setLight(w >= 1920 || dpr > 1.5);
    };
    q();
    window.addEventListener("resize", q);
    return () => window.removeEventListener("resize", q);
  }, []);
  return light;
}

export function DistortionBackdrop() {
  const { performanceMode, effectiveReduceMotion } = useAppSettings();
  const lightPostFx = useLightBackdropFx();
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
        dpr={lightPostFx ? [1, 1.25] : [1, 1.5]}
      >
        <Scene lightPostFx={lightPostFx} />
      </Canvas>
    </div>
  );
}
