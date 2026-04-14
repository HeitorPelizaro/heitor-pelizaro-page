"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useAppSettings } from "@/context/AppSettingsContext";
import { hexToRgb, readCssHexVar } from "@/lib/cssColor";
import {
  createGraph,
  type GraphState,
  stepGraph,
} from "@/lib/graphSimulation";

const MAX_SEGMENTS = 420;

function FitOrthoCamera() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    const w = size.width;
    const h = size.height;
    cam.left = -w / 2;
    cam.right = w / 2;
    cam.top = h / 2;
    cam.bottom = -h / 2;
    cam.position.set(0, 0, 100);
    cam.near = 0.1;
    cam.far = 500;
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

function toWorldX(x: number, w: number) {
  return x - w / 2;
}

function toWorldY(y: number, h: number) {
  return -(y - h / 2);
}

type GraphMouseRef = {
  x: number;
  y: number;
  active: boolean;
  vx: number;
  vy: number;
};

type GraphSceneProps = {
  performanceMode: boolean;
  dims: { w: number; h: number };
  mouseRef: MutableRefObject<GraphMouseRef>;
  onGraphSparse: () => void;
};

function GraphScene({
  performanceMode,
  dims,
  mouseRef,
  onGraphSparse,
}: GraphSceneProps) {
  const untangleNotified = useRef(false);
  const graphRef = useRef<GraphState | null>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const pointsMatRef = useRef<THREE.PointsMaterial>(null);
  const colorTick = useRef(0);
  const prevMouse = useRef({ x: 0, y: 0 });
  const mouseVelReady = useRef(false);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(MAX_SEGMENTS * 2 * 3);
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setDrawRange(0, 0);
    return g;
  }, []);

  const pointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const cap = 80;
    const pos = new Float32Array(cap * 3);
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setDrawRange(0, 0);
    return g;
  }, []);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    [],
  );
  const pointsMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 5,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    lineMatRef.current = lineMat;
    pointsMatRef.current = pointsMat;
  }, [lineMat, pointsMat]);

  const lineObject = useMemo(
    () => new THREE.LineSegments(lineGeo, lineMat),
    [lineGeo, lineMat],
  );
  const pointsObject = useMemo(
    () => new THREE.Points(pointsGeo, pointsMat),
    [pointsGeo, pointsMat],
  );

  useEffect(() => {
    const { w, h } = dims;
    if (w < 16 || h < 16) return;
    const count = performanceMode ? 24 : 64;
    graphRef.current = createGraph(count, w, h);
  }, [dims, performanceMode]);

  useFrame(({ gl }) => {
    const graph = graphRef.current;
    const { w, h } = dims;
    if (!graph || w < 16 || h < 16) return;

    const m = mouseRef.current;
    if (m.active) {
      if (!mouseVelReady.current) {
        prevMouse.current = { x: m.x, y: m.y };
        mouseVelReady.current = true;
        m.vx = 0;
        m.vy = 0;
      } else {
        let dx = m.x - prevMouse.current.x;
        let dy = m.y - prevMouse.current.y;
        const cap = 72;
        dx = Math.max(-cap, Math.min(cap, dx));
        dy = Math.max(-cap, Math.min(cap, dy));
        m.vx = dx;
        m.vy = dy;
        prevMouse.current = { x: m.x, y: m.y };
      }
    } else {
      mouseVelReady.current = false;
      m.vx = 0;
      m.vy = 0;
    }

    stepGraph(graph, {
      w,
      h,
      mouse: m,
      performanceMode,
    });

    if (
      !untangleNotified.current &&
      graph.nodes.length >= 18 &&
      graph.edges.length <= 8
    ) {
      untangleNotified.current = true;
      onGraphSparse();
    }

    const nodes = graph.nodes;
    const edges = graph.edges;
    const n = nodes.length;

    const lp = lineGeo.attributes.position.array as Float32Array;
    let vi = 0;
    const maxPairs = Math.min(edges.length, MAX_SEGMENTS);
    for (let e = 0; e < maxPairs; e++) {
      const ed = edges[e];
      const A = nodes[ed.a];
      const B = nodes[ed.b];
      lp[vi++] = toWorldX(A.x, w);
      lp[vi++] = toWorldY(A.y, h);
      lp[vi++] = 0;
      lp[vi++] = toWorldX(B.x, w);
      lp[vi++] = toWorldY(B.y, h);
      lp[vi++] = 0;
    }
    lineGeo.setDrawRange(0, maxPairs * 2);
    lineGeo.attributes.position.needsUpdate = true;

    const pp = pointsGeo.attributes.position.array as Float32Array;
    let pi = 0;
    for (let i = 0; i < n; i++) {
      pp[pi++] = toWorldX(nodes[i].x, w);
      pp[pi++] = toWorldY(nodes[i].y, h);
      pp[pi++] = 0;
    }
    pointsGeo.setDrawRange(0, n);
    pointsGeo.attributes.position.needsUpdate = true;

    colorTick.current += 1;
    if (colorTick.current % 5 === 0) {
      const cyanH = readCssHexVar("--neon-cyan", "#00f0ff");
      const magH = readCssHexVar("--neon-magenta", "#ff2d6a");
      const c = hexToRgb(cyanH);
      const m = hexToRgb(magH);
      if (c && lineMatRef.current) {
        lineMatRef.current.color.setRGB(c.r / 255, c.g / 255, c.b / 255);
      }
      if (c && m && pointsMatRef.current) {
        pointsMatRef.current.color.setRGB(
          (c.r * 0.65 + m.r * 0.35) / 255,
          (c.g * 0.65 + m.g * 0.35) / 255,
          (c.b * 0.65 + m.b * 0.35) / 255,
        );
      }
    }

    gl.setClearColor(0x000000, 0);
  });

  return (
    <>
      <FitOrthoCamera />
      <primitive object={lineObject} />
      <primitive object={pointsObject} />
    </>
  );
}

export function GraphWebGL() {
  const { performanceMode, effectiveReduceMotion, onAchievement } =
    useAppSettings();
  const mouseRef = useRef<GraphMouseRef>({
    x: 0,
    y: 0,
    active: false,
    vx: 0,
    vy: 0,
  });
  const [dims, setDims] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1200,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  }));

  useEffect(() => {
    if (effectiveReduceMotion || performanceMode) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    const onResize = () => {
      setDims({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [effectiveReduceMotion, performanceMode]);

  if (effectiveReduceMotion || performanceMode) {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10 cyber-grid opacity-40"
        aria-hidden
      />
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 h-full min-h-dvh w-full"
      aria-hidden
    >
      <Canvas
        orthographic
        frameloop="always"
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        className="!h-full !min-h-dvh !w-full"
        camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 500 }}
        dpr={[1, 1.35]}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <GraphScene
          performanceMode={performanceMode}
          dims={dims}
          mouseRef={mouseRef}
          onGraphSparse={() => onAchievement("graph_untangle")}
        />
      </Canvas>
    </div>
  );
}
