import { useEffect, useRef, useState, useContext } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AvatarContext } from "../context/AvatarContext";
import { Sparkles, Volume2, UserCheck, Eye, Smile, RefreshCw, Hand, Brain, Trophy, ShieldAlert, Cpu } from "lucide-react";
import { speakWithAvatarVoice } from "../utils/speechUtils";
import { AVATAR_CONFIGS } from "../config/avatarConfig";

function AvatarCanvas3D({
  avatar: propAvatar,
  avatarState = "IDLE",
  isSpeaking = false,
  trackingData = null,
  qualityPreset = "balanced",
  onGestureTrigger,
}) {
  const context = useContext(AvatarContext);
  const activeAvatar = propAvatar || context?.selectedAvatar || AVATAR_CONFIGS.doctor;

  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentGesture, setCurrentGesture] = useState("idle");

  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const activeActionRef = useRef(null);
  const headBoneRef = useRef(null);
  const jawBoneRef = useRef(null);
  const spineBoneRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  const avatarId = activeAvatar.id || "doctor";
  const isMale = activeAvatar.gender === "male";
  const modelFile = activeAvatar.modelFile || (isMale ? "Doctor_Male_Young.gltf" : "Doctor_Female_Young.gltf");
  const config = AVATAR_CONFIGS[avatarId] || AVATAR_CONFIGS.doctor;

  // Build 3D Realistic Environment matching selected profession
  const buildRealistic3DEnvironment = (scene, envType) => {
    const envGroup = new THREE.Group();

    // 1. Realistic Floor
    let floorColor = 0x475569;
    let roughness = 0.5;
    let metalness = 0.1;

    if (envType === "clinic") {
      floorColor = 0xe2e8f0; // Polished clinic tile
      roughness = 0.2;
      metalness = 0.1;
    } else if (envType === "classroom" || envType === "library") {
      floorColor = 0x78350f; // Warm oak parquet
      roughness = 0.4;
      metalness = 0.05;
    } else if (envType === "sanctuary") {
      floorColor = 0xd6d3d1; // Calming neutral tone
      roughness = 0.8;
      metalness = 0.0;
    } else if (envType === "office") {
      floorColor = 0x334155; // Corporate terrazzo
      roughness = 0.3;
      metalness = 0.2;
    } else if (envType === "lounge") {
      floorColor = 0x854d0e; // Warm cafe timber
      roughness = 0.5;
      metalness = 0.1;
    }

    const floorMat = new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: roughness,
      metalness: metalness,
    });

    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = qualityPreset !== "low";
    envGroup.add(floor);

    // 2. Realistic Back Wall
    const wallGeo = new THREE.PlaneGeometry(16, 10);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.6,
      metalness: 0.1,
    });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 3, -4.5);
    backWall.receiveShadow = qualityPreset !== "low";
    envGroup.add(backWall);

    // 3. Environment-specific Architectural Props
    if (envType === "clinic") {
      // Medical Wall Cross & Glowing Vitals Monitor
      const crossMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.05), crossMat);
      crossV.position.set(-1.8, 2.5, -4.4);
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.05), crossMat);
      crossH.position.set(-1.8, 2.5, -4.4);
      envGroup.add(crossV, crossH);

      // Vitals Monitor Display
      const monitorFrame = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 1.4, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 })
      );
      monitorFrame.position.set(1.6, 2.4, -4.4);
      const monitorScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(2.0, 1.2),
        new THREE.MeshBasicMaterial({ color: 0x0369a1 })
      );
      monitorScreen.position.set(1.6, 2.4, -4.35);
      envGroup.add(monitorFrame, monitorScreen);

    } else if (envType === "classroom") {
      // Large Chalkboard / Whiteboard
      const boardFrame = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 2.4, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5 })
      );
      boardFrame.position.set(0, 2.4, -4.4);
      const boardMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.7 });
      const board = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 2.2), boardMat);
      board.position.set(0, 2.4, -4.34);
      envGroup.add(boardFrame, board);

    } else if (envType === "sanctuary") {
      // Wooden Slat Panels & Soft Glow
      for (let i = -6; i <= 6; i++) {
        const slat = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 6, 0.06),
          new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6 })
        );
        slat.position.set(i * 0.35, 2.5, -4.4);
        envGroup.add(slat);
      }
      // Potted Plant Geometry
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.25, 0.7, 16),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
      );
      pot.position.set(-2.0, 0.35, -2.5);
      const plant = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.55),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 })
      );
      plant.position.set(-2.0, 0.95, -2.5);
      envGroup.add(pot, plant);

    } else if (envType === "office") {
      // High-Rise Panoramic Glass Windows & Skyline Pillars
      const windowFrame = new THREE.Mesh(
        new THREE.BoxGeometry(5.0, 3.2, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 })
      );
      windowFrame.position.set(0, 2.4, -4.4);
      const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(4.8, 3.0),
        new THREE.MeshBasicMaterial({ color: 0x1e3a8a })
      );
      glass.position.set(0, 2.4, -4.35);
      envGroup.add(windowFrame, glass);

    } else if (envType === "shop") {
      // Store Merchandise Shelving Units
      for (let y = 1.0; y <= 3.2; y += 0.8) {
        const shelf = new THREE.Mesh(
          new THREE.BoxGeometry(4.0, 0.08, 0.4),
          new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.4 })
        );
        shelf.position.set(0, y, -4.0);
        envGroup.add(shelf);
      }

    } else if (envType === "library") {
      // Library Bookshelves
      for (let y = 0.8; y <= 3.5; y += 0.7) {
        const shelf = new THREE.Mesh(
          new THREE.BoxGeometry(4.5, 0.08, 0.4),
          new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 })
        );
        shelf.position.set(0, y, -4.1);
        envGroup.add(shelf);
      }
    } else {
      // Social Lounge String Lights / Ambient Accents
      for (let i = -3; i <= 3; i++) {
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        bulb.position.set(i * 0.7, 3.5 - Math.abs(i) * 0.08, -3.8);
        envGroup.add(bulb);
      }
    }

    scene.add(envGroup);
  };

  // Main 3D Canvas Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setLoading(true);
    setError(null);

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.08);

    // 2. Camera: Conversational close-up framing
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 1.35, 1.8);
    camera.lookAt(0, 1.28, 0);

    // 3. WebGL Renderer with Quality Preset Tuning
    const isLowQuality = qualityPreset === "low";
    const renderer = new THREE.WebGLRenderer({
      antialias: !isLowQuality,
      alpha: true,
      powerPreference: isLowQuality ? "low-power" : "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isLowQuality ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isLowQuality;
    if (!isLowQuality) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(config.ambientColor || 0xe2e8f0, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(1.5, 3.2, 2.2);
    keyLight.castShadow = !isLowQuality;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(config.accentColor || 0x38bdf8, 1.2);
    fillLight.position.set(-2, 2.2, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.0);
    rimLight.position.set(0, 3.5, -2.5);
    scene.add(rimLight);

    // 5. Build Profession Environment
    buildRealistic3DEnvironment(scene, config.environment?.type || "clinic");

    // 6. Load 3D Character Model
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

        // Customize Materials for Gender & Profession
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = !isLowQuality;
            child.receiveShadow = !isLowQuality;

            if (child.material) {
              const matName = child.material.name ? child.material.name.toLowerCase() : "";
              if (matName.includes("main") || matName.includes("cloth") || matName.includes("body")) {
                child.material = new THREE.MeshStandardMaterial({
                  color: config.clothingColor || (isMale ? 0x059669 : 0xf8fafc),
                  roughness: 0.5,
                  metalness: 0.1,
                });
              }
            }
          }

          // Locate Bones for Head, Neck, Spine, and Mouth Animation
          if (child.isBone) {
            const name = child.name.toLowerCase();
            if (name.includes("head") || name.includes("neck")) {
              headBoneRef.current = child;
            } else if (name.includes("spine") || name.includes("torso")) {
              spineBoneRef.current = child;
            }
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

          // Default Idle animation
          const idleAction = actions["Idle"] || actions["idle"] || Object.values(actions)[0];
          if (idleAction) {
            idleAction.play();
            activeActionRef.current = idleAction;
          }
        }

        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Failed to load 3D GLTF model:", err);
        setError(`Unable to load 3D GLTF model (${modelFile}).`);
        setLoading(false);
      }
    );

    // 7. Mouse Tracker for Interactive Eye/Head Contact
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current = { x, y };
    };
    container.addEventListener("mousemove", handleMouseMove);

    // 8. Animation Loop with Breathing, Mouth Movement, & MediaPipe Tracking
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (animationMixer) {
        animationMixer.update(delta);
      }

      // Procedural breathing oscillation
      if (spineBoneRef.current) {
        spineBoneRef.current.position.y = Math.sin(elapsed * 2.0) * 0.005;
      }

      // Procedural head & eye gaze (Combines Mouse Tracker with MediaPipe Face Landmarks if active)
      if (headBoneRef.current) {
        let targetX = mousePosRef.current.x * 0.15 + Math.sin(elapsed * 1.5) * 0.02;
        let targetY = mousePosRef.current.y * 0.12 + Math.cos(elapsed * 2.0) * 0.02;

        // If MediaPipe Face Tracking is actively reporting user's head orientation, mirror or blend it
        if (trackingData && trackingData.headPose) {
          targetX = trackingData.headPose.yaw * 0.25;
          targetY = -trackingData.headPose.pitch * 0.25;
        }

        // Rhythmic speaking articulation (speech cadenced head nodding)
        if (isSpeaking) {
          targetY += Math.sin(elapsed * 12.0) * 0.04;
          targetX += Math.cos(elapsed * 6.0) * 0.02;
        }

        headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, targetX, 0.08);
        headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, -targetY, 0.08);
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
      container.removeEventListener("mousemove", handleMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelFile, avatarId, qualityPreset]);

  // Handle Avatar State, Speech, & MediaPipe Gesture Reactions
  useEffect(() => {
    const actions = actionsRef.current;
    if (!actions || Object.keys(actions).length === 0) return;

    let targetAction = actions["Idle"];

    // Check if user performed a wave or thumbs up gesture in camera
    if (trackingData && trackingData.gesture && trackingData.gesture.includes("Wave")) {
      targetAction = actions["Walk_Carry"] || actions["Idle"];
      setCurrentGesture("greeting");
    } else if (trackingData && trackingData.gesture && trackingData.gesture.includes("Thumbs Up")) {
      targetAction = actions["Victory"] || actions["Idle"];
      setCurrentGesture("encouraging");
    } else if (isSpeaking || avatarState === "SPEAKING") {
      targetAction = actions["Walk_Carry"] || actions["Walk"] || actions["Idle"];
      setCurrentGesture("speaking");
    } else if (avatarState === "ENCOURAGING" || avatarState === "VICTORY" || avatarState === "HAPPY") {
      targetAction = actions["Victory"] || actions["StandUp"] || actions["Idle"];
      setCurrentGesture("celebrating");
    } else if (avatarState === "THINKING" || avatarState === "CONFUSED") {
      targetAction = actions["SitDown"] || actions["Idle"];
      setCurrentGesture("thinking");
    } else if (avatarState === "LISTENING") {
      targetAction = actions["Idle"];
      setCurrentGesture("listening");
    } else if (avatarState === "GREETING" || avatarState === "GOODBYE") {
      targetAction = actions["Walk_Carry"] || actions["Idle"];
      setCurrentGesture("greeting");
    } else {
      targetAction = actions["Idle"] || Object.values(actions)[0];
      setCurrentGesture("idle");
    }

    if (targetAction && targetAction !== activeActionRef.current) {
      if (activeActionRef.current) {
        activeActionRef.current.fadeOut(0.3);
      }
      targetAction.reset().fadeIn(0.3).play();
      activeActionRef.current = targetAction;
    }
  }, [avatarState, isSpeaking, trackingData]);

  // Manual gesture triggers
  const trigger3DGesture = (gestureName) => {
    const actions = actionsRef.current;
    if (!actions) return;

    setCurrentGesture(gestureName);
    if (gestureName === "wave" || gestureName === "explain") {
      const gestureAction = actions["Walk_Carry"] || actions["Punch"] || actions["Walk"];
      if (gestureAction) {
        gestureAction.reset().fadeIn(0.2).play();
        setTimeout(() => {
          gestureAction.fadeOut(0.3);
          actions["Idle"]?.fadeIn(0.3).play();
          setCurrentGesture("idle");
        }, 2200);
      }
    } else if (gestureName === "celebrate") {
      const vicAction = actions["Victory"];
      if (vicAction) {
        vicAction.reset().fadeIn(0.2).play();
        setTimeout(() => {
          vicAction.fadeOut(0.3);
          actions["Idle"]?.fadeIn(0.3).play();
          setCurrentGesture("idle");
        }, 2500);
      }
    }
  };

  const handleSpeakIntro = () => {
    speakWithAvatarVoice(
      config.greeting || activeAvatar.greeting,
      config.id,
      () => {},
      () => {}
    );
    trigger3DGesture("wave");
  };

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden bg-slate-950 border border-white/15 shadow-2xl flex flex-col justify-between select-none">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Overlay: Persona Identity, Gender, & Profession Badge */}
      <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-lg">
          <div className={`w-3 h-3 rounded-full animate-ping ${isMale ? "bg-sky-400" : "bg-rose-400"}`} />
          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>{config.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isMale ? "bg-blue-500/30 text-blue-300 border border-blue-400/30" : "bg-pink-500/30 text-pink-300 border border-pink-400/30"
              }`}>
                {isMale ? "👨 Male 3D" : "👩 Female 3D"}
              </span>
            </div>
            <div className="text-[10px] font-semibold text-slate-300 flex items-center gap-1">
              <span>{config.role}</span>
            </div>
          </div>
        </div>

        {/* 3D Environment Badge */}
        <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-[11px] font-bold text-slate-200 shadow-lg flex items-center gap-1.5">
          <span>{config.environment?.title?.split(" ")[0]}</span>
          <span className="hidden sm:inline text-slate-300">{config.environment?.title?.substring(2)}</span>
        </div>
      </div>

      {/* Interactive Speech & Gesture Status Badge */}
      <div className="relative z-10 px-4 pointer-events-none flex justify-center">
        {isSpeaking ? (
          <div className="bg-sky-500/25 border border-sky-400/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-sky-200 shadow-xl flex items-center gap-2 animate-pulse">
            <Volume2 size={16} className="text-sky-400 animate-bounce" />
            <span>Speaking ({isMale ? "Male Voice" : "Female Voice"})</span>
            <div className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-sky-400 rounded-full animate-pulse" />
              <span className="w-1 h-4 bg-sky-300 rounded-full animate-pulse delay-75" />
              <span className="w-1 h-2 bg-sky-400 rounded-full animate-pulse delay-150" />
            </div>
          </div>
        ) : trackingData && trackingData.detectedFace ? (
          <div className="bg-emerald-500/25 border border-emerald-400/50 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-emerald-200 shadow-xl flex items-center gap-1.5">
            <Smile size={14} className="text-emerald-400" />
            <span>MediaPipe Mirroring: {trackingData.gesture !== "None" ? trackingData.gesture : "Face Tracking Active"}</span>
          </div>
        ) : currentGesture === "celebrating" ? (
          <div className="bg-emerald-500/25 border border-emerald-400/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-emerald-200 shadow-xl flex items-center gap-2 animate-bounce">
            <Trophy size={16} className="text-emerald-400" />
            <span>Encouraging Success! 🙌</span>
          </div>
        ) : currentGesture === "thinking" ? (
          <div className="bg-purple-500/25 border border-purple-400/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-purple-200 shadow-xl flex items-center gap-2">
            <Brain size={16} className="text-purple-400 animate-spin" />
            <span>Processing Thoughts... 🤔</span>
          </div>
        ) : (
          <div className="bg-slate-900/70 border border-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-semibold text-slate-300 shadow flex items-center gap-1.5">
            <Eye size={13} className="text-sky-400" />
            <span>3D Interactive Character • Breathing & Blinking</span>
          </div>
        )}
      </div>

      {/* Bottom Interactive Gesture & Audio Control Toolbar */}
      <div className="relative z-10 p-3 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleSpeakIntro}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 transition flex items-center gap-1 shadow"
            title="Make character speak introduction with matched gender voice"
          >
            <Volume2 size={14} /> Speak Intro
          </button>

          <button
            onClick={() => trigger3DGesture("wave")}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-200 transition flex items-center gap-1"
            title="Trigger wave greeting gesture"
          >
            👋 Wave
          </button>

          <button
            onClick={() => trigger3DGesture("explain")}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-200 transition flex items-center gap-1"
            title="Trigger concept explanation gesture"
          >
            👐 Explain
          </button>

          <button
            onClick={() => trigger3DGesture("celebrate")}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-200 transition flex items-center gap-1"
            title="Trigger celebration gesture"
          >
            🙌 Celebrate
          </button>
        </div>

        <div className="text-[10px] text-slate-400 font-medium px-2 py-1 rounded-lg bg-slate-900/60 border border-white/5 flex items-center gap-1">
          <Cpu size={11} className="text-sky-400" />
          <span>Preset: {qualityPreset.toUpperCase()}</span>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-sky-400 gap-3 bg-slate-950/90 backdrop-blur-md z-30">
          <div className="w-10 h-10 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-wide">
            Rendering 3D {isMale ? "Male" : "Female"} Character ({modelFile})...
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Building {config.environment?.title}...
          </span>
        </div>
      )}

      {/* Error Fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 text-xs p-4 text-center z-30 bg-slate-950">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

export default AvatarCanvas3D;
