import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function AvatarCanvas3D({ modelFile = "Doctor_Female_Young.gltf", avatarState = "IDLE" }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const activeActionRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setLoading(true);
    setError(null);

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 380;

    // 3D Scene Setup
    const scene = new THREE.Scene();

    // Medium Close-Up Conversational Camera Framing (Head, Shoulders & Torso Focus)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 1.32, 1.85);
    camera.lookAt(0, 1.25, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Soft Studio Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(1.5, 3, 2.5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    fillLight.position.set(-2, 2, 1);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 0.6);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Load 3D GLTF Model
    const loader = new GLTFLoader();
    const modelUrl = `/models/${modelFile}`;

    let animationMixer = null;
    let clock = new THREE.Clock();
    let reqId = null;

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(1.15, 1.15, 1.15);

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(model);

        // Setup Skeletal Animations
        if (gltf.animations && gltf.animations.length > 0) {
          animationMixer = new THREE.AnimationMixer(model);
          mixerRef.current = animationMixer;
          const actions = {};

          gltf.animations.forEach((clip) => {
            actions[clip.name] = animationMixer.clipAction(clip);
          });
          actionsRef.current = actions;

          const defaultAnim = actions["Idle"] || actions["idle"] || Object.values(actions)[0];
          if (defaultAnim) {
            defaultAnim.play();
            activeActionRef.current = defaultAnim;
          }
        }

        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Failed to load 3D GLTF model:", err);
        setError("Unable to load 3D GLTF model file.");
        setLoading(false);
      }
    );

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (animationMixer) {
        animationMixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelFile]);

  // Handle Avatar State Animation Transitions
  useEffect(() => {
    const actions = actionsRef.current;
    if (!actions || Object.keys(actions).length === 0) return;

    let targetAction = actions["Idle"];

    if (avatarState === "SPEAKING" || avatarState === "WALKING") {
      targetAction = actions["Walk"] || actions["Walk_Carry"] || actions["Idle"];
    } else if (avatarState === "CORRECT" || avatarState === "VICTORY" || avatarState === "QUIZ_COMPLETE" || avatarState === "ENCOURAGING") {
      targetAction = actions["Victory"] || actions["StandUp"] || actions["Idle"];
    } else {
      targetAction = actions["Idle"] || Object.values(actions)[0];
    }

    if (targetAction && targetAction !== activeActionRef.current) {
      if (activeActionRef.current) {
        activeActionRef.current.fadeOut(0.3);
      }
      targetAction.reset().fadeIn(0.3).play();
      activeActionRef.current = targetAction;
    }
  }, [avatarState]);

  return (
    <div className="relative w-full h-[380px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-sky-400 gap-3 bg-slate-950/80 backdrop-blur-sm z-20">
          <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Loading 3D Doctor Avatar ({modelFile})...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 text-xs p-4 text-center z-20 bg-slate-950">
          ⚠️ {error}
        </div>
      )}

      {/* WebGL 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Subtle overlay badge */}
      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-[11px] font-semibold backdrop-blur-md z-10 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Medium Close-Up 3D WebGL Canvas ({modelFile})
      </div>
    </div>
  );
}

export default AvatarCanvas3D;
