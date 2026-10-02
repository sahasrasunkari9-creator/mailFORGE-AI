import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

interface Floater {
  obj: THREE.Object3D;
  baseY: number;
  amp: number;
  speed: number;
  phase: number;
  spinY: number;
  rotZ: number;
}

function glowTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const W = () => container.clientWidth;
    const H = () => container.clientHeight;

    /* ---------- renderer / scene / camera ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 1.8));
    renderer.setSize(W(), H());
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04070c);
    scene.fog = new THREE.FogExp2(0x04070c, 0.03);

    const camera = new THREE.PerspectiveCamera(52, W() / H(), 0.1, 100);
    camera.position.set(0, 0.5, 15);

    /* ---------- lights ---------- */
    scene.add(new THREE.AmbientLight(0x2a4d52, 1.15));
    const key = new THREE.DirectionalLight(0xbdf5ea, 0.9);
    key.position.set(6, 9, 7);
    scene.add(key);
    const teal = new THREE.PointLight(0x38e2c6, 42, 48, 2);
    teal.position.set(-7, 3, 3);
    scene.add(teal);
    const amber = new THREE.PointLight(0xffc266, 16, 32, 2);
    amber.position.set(8, -4, -2);
    scene.add(amber);

    const glow = glowTexture();

    /* ---------- envelopes ---------- */
    const floaters: Floater[] = [];
    const envMat = new THREE.MeshStandardMaterial({
      color: 0x0d2b32,
      roughness: 0.35,
      metalness: 0.3,
      emissive: 0x0a3a3e,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.92,
    });
    const flapMat = new THREE.MeshStandardMaterial({
      color: 0x124046,
      roughness: 0.4,
      metalness: 0.3,
      emissive: 0x11655e,
      emissiveIntensity: 0.8,
      side: THREE.DoubleSide,
    });
    const sealMat = new THREE.MeshBasicMaterial({ color: 0x7df3e0 });

    const addFloater = (obj: THREE.Object3D, y: number, amp: number, speed: number, spinY: number, rotZ: number) => {
      obj.position.y = y;
      floaters.push({ obj, baseY: y, amp, speed, phase: rand(0, Math.PI * 2), spinY, rotZ });
      scene.add(obj);
    };

    const envCount = isMobile ? 3 : 6;
    for (let i = 0; i < envCount; i++) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 0.07), envMat);
      const flapGeo = new THREE.BufferGeometry();
      flapGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([-0.75, 0.5, 0.02, 0.75, 0.5, 0.02, 0, 0.02, 0.035], 3)
      );
      flapGeo.computeVertexNormals();
      const flap = new THREE.Mesh(flapGeo, flapMat);
      const seal = new THREE.Mesh(new THREE.CircleGeometry(0.09, 24), sealMat);
      seal.position.set(0, -0.12, 0.045);
      g.add(body, flap, seal);
      const s = rand(0.55, 1.15);
      g.scale.setScalar(s);
      g.rotation.set(rand(-0.25, 0.25), rand(-0.6, 0.6), rand(-0.35, 0.35));
      g.position.x = rand(-9.5, 9.5);
      g.position.z = rand(-9, 2.5);
      addFloater(g, rand(-5, 5), rand(0.25, 0.6), rand(0.25, 0.55), rand(-0.08, 0.08), g.rotation.z);
    }

    /* ---------- glass message cards ---------- */
    const cardCount = isMobile ? 3 : 5;
    const panelMat = new THREE.MeshPhysicalMaterial({
      color: 0x123038,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.48,
    });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x6fe9d6 });
    const avatarMat = new THREE.MeshBasicMaterial({ color: 0x2fc7b2 });
    for (let i = 0; i < cardCount; i++) {
      const g = new THREE.Group();
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.05, 0.045), panelMat);
      const avatar = new THREE.Mesh(new THREE.CircleGeometry(0.1, 20), avatarMat);
      avatar.position.set(-0.52, 0.34, 0.03);
      g.add(panel, avatar);
      const widths = [1.05, 0.88, 0.68, 0.45];
      const ys = [0.1, -0.06, -0.22, -0.36];
      widths.forEach((w, j) => {
        const l = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, 0.012), lineMat);
        l.position.set(-0.7 + w / 2, ys[j], 0.03);
        g.add(l);
      });
      const s = rand(0.7, 1.3);
      g.scale.setScalar(s);
      g.rotation.set(rand(-0.2, 0.2), rand(-0.5, 0.5), rand(-0.2, 0.2));
      g.position.x = rand(-9, 9);
      g.position.z = rand(-8, 1);
      addFloater(g, rand(-4.5, 4.5), rand(0.3, 0.7), rand(0.2, 0.5), rand(-0.06, 0.06), g.rotation.z);
    }

    /* ---------- floating keycaps ---------- */
    const keyCount = isMobile ? 5 : 10;
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0x11333a,
      roughness: 0.4,
      metalness: 0.45,
      emissive: 0x0d3a3c,
      emissiveIntensity: 0.6,
    });
    const keyDotMat = new THREE.MeshBasicMaterial({ color: 0x4adfc9 });
    for (let i = 0; i < keyCount; i++) {
      const g = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.1), keyMat);
      const dot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.02), keyDotMat);
      dot.position.z = 0.055;
      g.add(base, dot);
      g.rotation.set(rand(0, Math.PI), rand(0, Math.PI), rand(0, Math.PI));
      g.position.x = rand(-10, 10);
      g.position.z = rand(-7, 2);
      addFloater(g, rand(-5, 5), rand(0.2, 0.5), rand(0.3, 0.7), rand(-0.15, 0.15), 0);
    }

    /* ---------- glowing particles ---------- */
    const pCount = isMobile ? 130 : 330;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pVel = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = rand(-14, 14);
      pPos[i * 3 + 1] = rand(-8, 8);
      pPos[i * 3 + 2] = rand(-14, 6);
      pVel[i] = rand(0.15, 0.55);
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.09,
      map: glow,
      color: 0x6fe9d6,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    /* ---------- neural network ---------- */
    const net = new THREE.Group();
    const nodeCount = isMobile ? 14 : 30;
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x35e0cf, transparent: true, opacity: 0.9 });
    const nodes: THREE.Mesh[] = [];
    const nodePos: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const n = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), nodeMat);
      n.position.set(rand(-9.5, 9.5), rand(-4.5, 4.5), rand(-11, -3));
      net.add(n);
      nodes.push(n);
      nodePos.push(n.position.clone());
    }
    const edgePts: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePos[i].distanceTo(nodePos[j]) < 3.6) {
          edgePts.push(nodePos[i].x, nodePos[i].y, nodePos[i].z, nodePos[j].x, nodePos[j].y, nodePos[j].z);
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgePts, 3));
    const edges = new THREE.LineSegments(
      edgeGeo,
      new THREE.LineBasicMaterial({ color: 0x16605a, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending })
    );
    net.add(edges);
    scene.add(net);

    /* ---------- data streams ---------- */
    const streamCount = isMobile ? 2 : 4;
    const streams: { curve: THREE.CatmullRomCurve3; comet: THREE.Mesh; t: number; speed: number }[] = [];
    const cometMat = new THREE.MeshBasicMaterial({ color: 0xaef7ec });
    const lineMat2 = new THREE.LineBasicMaterial({ color: 0x0e4a48, transparent: true, opacity: 0.55 });
    for (let i = 0; i < streamCount; i++) {
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k < 4; k++) pts.push(new THREE.Vector3(rand(-12, 12), rand(-6, 6), rand(-10, 4)));
      const curve = new THREE.CatmullRomCurve3(pts);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)), lineMat2);
      scene.add(line);
      const comet = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), cometMat);
      scene.add(comet);
      streams.push({ curve, comet, t: Math.random(), speed: rand(0.03, 0.07) });
    }

    /* ---------- notification pings ---------- */
    const pingCount = isMobile ? 4 : 6;
    const pings: { sphere: THREE.Mesh; ring: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number }[] = [];
    const pingCoreMat = new THREE.MeshBasicMaterial({ color: 0xffc266 });
    for (let i = 0; i < pingCount; i++) {
      const g = new THREE.Group();
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), pingCoreMat);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffc266,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.13, 24), mat);
      g.add(sphere, ring);
      g.position.set(rand(-10, 10), rand(-5, 5), rand(-8, 2));
      scene.add(g);
      pings.push({ sphere, ring, mat, phase: Math.random() });
    }

    /* ---------- volumetric glow orbs ---------- */
    const orbDefs: [number, number, number, number, number][] = [
      [0x16c8ae, -8, 3, -13, 0.16],
      [0x0ea892, 9, -2, -11, 0.14],
      [0xffc266, 2, 5, -15, 0.09],
    ];
    orbDefs.forEach(([color, x, y, z, opacity]) => {
      const m = new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending });
      const s = new THREE.Sprite(m);
      s.position.set(x, y, z);
      s.scale.setScalar(rand(10, 15));
      scene.add(s);
    });

    /* ---------- bloom (desktop only) ---------- */
    let composer: EffectComposer | null = null;
    if (!isMobile) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(W(), H()), 0.62, 0.8, 0.18));
    }

    /* ---------- interaction / animation ---------- */
    const clock = new THREE.Clock();
    let mouseX = 0;
    let mouseY = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    let running = true;

    const onPointer = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
      composer?.setSize(W(), H());
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        clock.getDelta();
        raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
      }
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      tx += (mouseX * 1.5 - tx) * 0.035;
      ty += (mouseY * 0.9 - ty) * 0.035;
      camera.position.x = Math.sin(t * 0.05) * 0.8 + tx;
      camera.position.y = 0.5 + Math.cos(t * 0.041) * 0.5 - ty;
      camera.lookAt(0, 0, -3);

      for (const f of floaters) {
        f.obj.position.y = f.baseY + Math.sin(t * f.speed + f.phase) * f.amp;
        f.obj.rotation.y += f.spinY * dt;
        f.obj.rotation.z = f.rotZ + Math.sin(t * 0.3 + f.phase) * 0.06;
      }

      const pos = pGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pCount; i++) {
        let y = pos.getY(i) + pVel[i] * dt;
        if (y > 8) y = -8;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;

      net.rotation.y = t * 0.04;
      nodes.forEach((n, i) => {
        const s = 1 + 0.35 * Math.sin(t * 1.6 + i * 0.9);
        n.scale.setScalar(s);
      });

      for (const s of streams) {
        s.t = (s.t + dt * s.speed) % 1;
        s.comet.position.copy(s.curve.getPoint(s.t));
      }

      for (const p of pings) {
        const phase = (t * 0.55 + p.phase) % 1;
        p.ring.scale.setScalar(0.5 + phase * 2.2);
        p.mat.opacity = (1 - phase) * 0.45;
        p.ring.lookAt(camera.position);
      }

      if (composer) composer.render();
      else renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* ---------- cleanup ---------- */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = (mesh as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      glow.dispose();
      if (composer) {
        composer.dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden" />;
}
