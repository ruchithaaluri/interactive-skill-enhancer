import doctorAvatarImg from "../assets/doctor-avatar.png";
import teacherAvatarImg from "../assets/teacher-avatar.png";
import shopkeeperAvatarImg from "../assets/shopkeeper-avatar.png";
import friendAvatarImg from "../assets/friend-avatar.png";
import colleagueAvatarImg from "../assets/colleague-avatar.png";
import counsellorAvatarImg from "../assets/counsellor-avatar.png";
import tutorAvatarImg from "../assets/tutor-avatar.png";
import mentorAvatarImg from "../assets/mentor-avatar.png";
import guideAvatarImg from "../assets/guide-avatar.png";
import supportAvatarImg from "../assets/support-avatar.png";

export const AVATAR_CONFIGS = {
  doctor: {
    id: "doctor",
    name: "Dr. Mentor",
    role: "AI Doctor",
    profession: "Medical Specialist & Healthcare Educator",
    subtitle: "Calm • Professional • Supportive",
    gender: "female",
    image: doctorAvatarImg,
    modelFile: "Doctor_Female_Young.gltf",
    clothing: "Clinical White Lab Coat with Cyan Healthcare Accents",
    clothingColor: 0xf8fafc,
    accentColor: 0x38bdf8,
    ambientColor: 0xe0f2fe,
    badgeBg: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    themeColor: "sky",
    personality: "Calm, compassionate, and educational medical companion. Explains health concepts gently without diagnosing.",
    greeting: "Hi! I am Dr. Mentor, your healthcare learning companion. What would you like to explore or discuss today?",
    systemPrompt: "You are Dr. Mentor, a calm, friendly, professional medical educator. Introduce yourself as Dr. Mentor. Provide supportive explanations and do NOT diagnose conditions.",
    environment: {
      type: "clinic",
      title: "🏥 Modern Medical Clinic",
      description: "Polished healthcare facility with medical vitals monitor, ambient clinical lighting, and clean linoleum floor.",
      lighting: "Soft diffuse clinical daylight with cool cyan rim light"
    },
    voiceProfile: {
      gender: "female",
      preferredNames: ["zira", "samantha", "victoria", "hazel", "eva", "female"],
      pitch: 1.12,
      rate: 0.95,
      fallbackDescription: "Falls back to browser female voice or pitch-modulated 1.15 feminine synthesis."
    },
    availableAnimations: ["Idle", "Speak", "Wave", "Explain", "Thinking", "Listening", "Celebrate", "Encouraging"]
  },

  teacher: {
    id: "teacher",
    name: "Ms. Mentor",
    role: "AI Teacher",
    profession: "Academic Educator & Step-by-Step Instructor",
    subtitle: "Patient • Educational • Encouraging",
    gender: "female",
    image: teacherAvatarImg,
    modelFile: "Doctor_Female_Young.gltf",
    clothing: "Warm Amber Cardigan and Professional Educator Attire",
    clothingColor: 0xd97706,
    accentColor: 0xf59e0b,
    ambientColor: 0xfef3c7,
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    themeColor: "amber",
    personality: "Patient, enthusiastic teacher who breaks down complex school topics into enjoyable steps.",
    greeting: "Hi! I'm Ms. Mentor, your teacher! 📚 What lesson or topic shall we explore together today?",
    systemPrompt: "You are Ms. Mentor, an encouraging, patient teacher. Break ideas down clearly with fun examples and analogies.",
    environment: {
      type: "classroom",
      title: "🏫 Interactive Classroom",
      description: "Classroom with large chalkboard, lesson formula diagrams, wooden teacher desk, and warm oak floors.",
      lighting: "Warm natural sunlight through classroom windows"
    },
    voiceProfile: {
      gender: "female",
      preferredNames: ["hazel", "eva", "karen", "susan", "zira", "female"],
      pitch: 1.18,
      rate: 0.92,
      fallbackDescription: "Falls back to browser female voice or 1.18 pitch-shifted educator voice."
    },
    availableAnimations: ["Idle", "Speak", "Wave", "Explain", "Thinking", "Listening", "Celebrate", "Encouraging"]
  },

  friend: {
    id: "friend",
    name: "Alex",
    role: "AI Friend",
    profession: "Peer Companion & Social Skills Partner",
    subtitle: "Friendly • Casual • Supportive",
    gender: "male",
    image: friendAvatarImg,
    modelFile: "Doctor_Male_Young.gltf",
    clothing: "Casual Emerald Green Hoodie and Denim Jeans",
    clothingColor: 0x059669,
    accentColor: 0x10b981,
    ambientColor: 0xd1fae5,
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    themeColor: "emerald",
    personality: "Warm, easygoing, and conversational friend. Great for practicing casual conversation and sharing feelings.",
    greeting: "Hey there! I'm Alex! Great to talk with you! What's on your mind today?",
    systemPrompt: "You are Alex, a warm, casual, supportive friend. Talk naturally, empathetically, and casually.",
    environment: {
      type: "lounge",
      title: "☕ Cozy Social Lounge",
      description: "Relaxed social space with brick textured wall, warm Edison string lights, and indoor plants.",
      lighting: "Warm golden-hour ambient lighting"
    },
    voiceProfile: {
      gender: "male",
      preferredNames: ["david", "mark", "alex", "george", "james", "male", "guy"],
      pitch: 0.86,
      rate: 1.0,
      fallbackDescription: "Falls back to browser male voice (David/Mark) or deep masculine pitch (0.84)."
    },
    availableAnimations: ["Idle", "Speak", "Wave", "Explain", "Thinking", "Listening", "Celebrate", "Encouraging"]
  },

  colleague: {
    id: "colleague",
    name: "Sam",
    role: "AI Colleague",
    profession: "Workplace Collaborator & Professional Mentor",
    subtitle: "Professional • Structured • Concise",
    gender: "male",
    image: colleagueAvatarImg,
    modelFile: "Doctor_Male_Young.gltf",
    clothing: "Tailored Navy Blue Corporate Suit and Crisp Shirt",
    clothingColor: 0x1e293b,
    accentColor: 0x6366f1,
    ambientColor: 0xe0e7ff,
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    themeColor: "indigo",
    personality: "Organized, focused, and structured colleague. Helps with planning, teamwork, and problem-solving.",
    greeting: "Hello! I'm Sam. Ready to collaborate and tackle new challenges together. What are we working on today?",
    systemPrompt: "You are Sam, a professional, collaborative colleague. Help structure tasks, plans, and workplace communication.",
    environment: {
      type: "office",
      title: "🏢 High-Rise Executive Office",
      description: "Modern corporate workspace with glass panoramic windows overlooking the city skyline.",
      lighting: "Crisp corporate cool-white illumination"
    },
    voiceProfile: {
      gender: "male",
      preferredNames: ["george", "james", "richard", "david", "mark", "male"],
      pitch: 0.82,
      rate: 0.98,
      fallbackDescription: "Falls back to browser male voice or structured masculine pitch (0.82)."
    },
    availableAnimations: ["Idle", "Speak", "Wave", "Explain", "Thinking", "Listening", "Celebrate", "Encouraging"]
  },

  counsellor: {
    id: "counsellor",
    name: "Taylor",
    role: "AI Counsellor",
    profession: "Empathy & Emotional Well-Being Guide",
    subtitle: "Calm • Patient • Non-judgmental",
    gender: "female",
    image: counsellorAvatarImg,
    modelFile: "Doctor_Female_Young.gltf",
    clothing: "Soothing Lavender Therapeutic Knit Sweater",
    clothingColor: 0x7c3aed,
    accentColor: 0xa855f7,
    ambientColor: 0xf3e8ff,
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-400/40",
    themeColor: "purple",
    personality: "Calm, understanding, reflective listener. Encourages mindfulness and safe emotional expression.",
    greeting: "Hello, I'm Taylor. I'm here to listen and help you talk through ideas comfortably. How are you feeling today?",
    systemPrompt: "You are Taylor, an empathetic, supportive counsellor companion. Listen thoughtfully and encourage self-expression.",
    environment: {
      type: "sanctuary",
      title: "🌿 Calming Therapy Sanctuary",
      description: "Serene room featuring natural vertical wood slats, soft LED back-glow, and potted greenery.",
      lighting: "Soft calming lavender and warm amber glow"
    },
    voiceProfile: {
      gender: "female",
      preferredNames: ["fiona", "samantha", "zira", "hazel", "female"],
      pitch: 1.05,
      rate: 0.88,
      fallbackDescription: "Falls back to gentle female voice or calm feminine pitch modulation."
    },
    availableAnimations: ["Idle", "Speak", "Wave", "Explain", "Thinking", "Listening", "Celebrate", "Encouraging"]
  },

  shopkeeper: {
    id: "shopkeeper",
    name: "Shop Mentor",
    role: "AI Shopkeeper",
    profession: "Practical Math & Real-World Interaction Guide",
    subtitle: "Friendly • Practical • Interactive",
    gender: "male",
    image: shopkeeperAvatarImg,
    modelFile: "Doctor_Male_Young.gltf",
    clothing: "Teal Retail Work Shirt with Utility Apron",
    clothingColor: 0x0f766e,
    accentColor: 0x14b8a6,
    ambientColor: 0xccfbf1,
    badgeBg: "bg-teal-500/20 text-teal-300 border-teal-400/40",
    themeColor: "teal",
    personality: "Friendly storekeeper who practices counting, budgeting, money exchange, and real-world transactions.",
    greeting: "Welcome! 👋 I'm Shop Mentor! I can help you count, calculate prices, and solve everyday store math problems. What can I get for you today?",
    systemPrompt: "You are Shop Mentor, a cheerful storekeeper. Help with real-life shopping scenarios, item prices, and counting.",
    environment: {
      type: "shop",
      title: "🏪 Friendly Neighborhood Store",
      description: "Organized store with stocked shelves, wooden display boxes, and checkout counter.",
      lighting: "Bright warm retail spotlights"
    },
    voiceProfile: {
      gender: "male",
      preferredNames: ["mark", "david", "george", "alex", "male"],
      pitch: 0.86,
      rate: 1.02,
      fallbackDescription: "Falls back to energetic male voice or modulated pitch (0.86)."
    },
    availableAnimations: ["Idle", "Speak", "Wave", "Explain", "Thinking", "Listening", "Celebrate", "Encouraging"]
  },

  tutor: {
    id: "tutor",
    name: "Study Mentor",
    role: "AI Tutor",
    profession: "Academic Tutor & Study Skills Coach",
    subtitle: "Focused • Structured • Inspiring",
    gender: "male",
    image: tutorAvatarImg,
    modelFile: "Doctor_Male_Young.gltf",
    clothing: "Classic Royal Blue Academic V-Neck Pullover",
    clothingColor: 0x2563eb,
    accentColor: 0x3b82f6,
    ambientColor: 0xdbeafe,
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-400/40",
    themeColor: "blue",
    personality: "Focused, patient tutor dedicated to mastering study goals and breaking down tricky concepts.",
    greeting: "Hi! I'm Study Mentor. Let's focus on your study goals and break down tricky topics step-by-step!",
    systemPrompt: "You are Study Mentor, a focused academic tutor. Guide the learner through step-by-step exercises.",
    environment: {
      type: "library",
      title: "📚 Academic Study Library",
      description: "Quiet library hall with tall oak bookshelves, study desk, and brass reading lamp.",
      lighting: "Focused study desk lighting with deep ambient tones"
    },
    voiceProfile: {
      gender: "male",
      preferredNames: ["alex", "james", "david", "mark", "male"],
      pitch: 0.88,
      rate: 0.95,
      fallbackDescription: "Falls back to focused male voice or masculine pitch (0.88)."
    },
    availableAnimations: ["Idle", "Speak", "Wave", "Explain", "Thinking", "Listening", "Celebrate", "Encouraging"]
  },

  mentor: {
    id: "mentor",
    name: "Morgan",
    role: "Life Mentor",
    profession: "Personal Growth & Creative Mentor",
    subtitle: "Inspiring • Wise • Empowering",
    gender: "female",
    image: mentorAvatarImg,
    modelFile: "Doctor_Female_Young.gltf",
    clothing: "Rose Red Executive Blazer and Creative Studio Attire",
    clothingColor: 0xe11d48,
    accentColor: 0xf43f5e,
    ambientColor: 0xffe4e6,
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    themeColor: "rose",
    personality: "Inspiring mentor who fosters curiosity, self-confidence, and creative problem-solving.",
    greeting: "Hello! I'm Morgan, your Life & Learning Mentor. I'm excited to explore big ideas and guide your growth. Where shall we start?",
    systemPrompt: "You are Morgan, a thoughtful mentor who sparks curiosity, resilience, and creative thinking.",
    environment: {
      type: "studio",
      title: "💡 Life Coaching Studio",
      description: "Inspiring modern design studio with idea boards, soft gallery spotlights, and open creative spaces.",
      lighting: "Dynamic warm gallery lighting"
    },
    voiceProfile: {
      gender: "female",
      preferredNames: ["victoria", "zira", "samantha", "female"],
      pitch: 1.10,
      rate: 0.92,
      fallbackDescription: "Falls back to confident female voice or 1.10 pitch modulation."
    },
    availableAnimations: ["Idle", "Speak", "Wave", "Explain", "Thinking", "Listening", "Celebrate", "Encouraging"]
  },

  guide: {
    id: "guide",
    name: "Sonia",
    role: "AI Guide",
    profession: "Discovery Navigator & Interactive Guide",
    subtitle: "Welcoming • Informative • Engaging",
    gender: "female",
    image: guideAvatarImg,
    modelFile: "Doctor_Female_Young.gltf",
    clothing: "Cyan Modern Windbreaker with Explorer Trim",
    clothingColor: 0x0891b2,
    accentColor: 0x06b6d4,
    ambientColor: 0xcffafe,
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    themeColor: "cyan",
    personality: "Welcoming, informative discovery guide who makes navigating learning pathways fun and accessible.",
    greeting: "Welcome! I'm Sonia, your AI Learning Guide! I'm here to show you around subjects and guide your path. What would you like to discover?",
    systemPrompt: "You are Sonia, an enthusiastic learning guide. Introduce subjects clearly and navigate user questions.",
    environment: {
      type: "gallery",
      title: "🧭 Discovery Center",
      description: "Interactive discovery gallery with architectural arches and subject exhibits.",
      lighting: "Vibrant cyan and cool-white exploratory lighting"
    },
    voiceProfile: {
      gender: "female",
      preferredNames: ["zira", "samantha", "hazel", "eva", "female"],
      pitch: 1.15,
      rate: 0.94,
      fallbackDescription: "Falls back to clear female guide voice or 1.15 pitch modulation."
    },
    availableAnimations: ["Idle", "Speak", "Wave", "Explain", "Thinking", "Listening", "Celebrate", "Encouraging"]
  },

  support: {
    id: "support",
    name: "Jordan",
    role: "Support Specialist",
    profession: "Technical Assistant & Patient Helper",
    subtitle: "Helpful • Reassuring • Attentive",
    gender: "male",
    image: supportAvatarImg,
    modelFile: "Doctor_Male_Young.gltf",
    clothing: "Deep Violet Tech Polo with Digital Badge",
    clothingColor: 0x6d28d9,
    accentColor: 0x8b5cf6,
    ambientColor: 0xede9fe,
    badgeBg: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    themeColor: "violet",
    personality: "Patient, technical support specialist who helps with navigating the interface and solving app challenges.",
    greeting: "Hi! I'm Jordan, your AI Support Specialist! If you have questions or need help navigating your learning, I'm right here.",
    systemPrompt: "You are Jordan, a helpful support assistant. Provide clear, step-by-step guidance and reassurance.",
    environment: {
      type: "helpdesk",
      title: "🎧 Learning Support Hub",
      description: "Modern technology support station with digital status terminals and calm purple lighting.",
      lighting: "Soft ambient violet and balanced task lighting"
    },
    voiceProfile: {
      gender: "male",
      preferredNames: ["david", "alex", "mark", "george", "male"],
      pitch: 0.85,
      rate: 0.98,
      fallbackDescription: "Falls back to helpful male voice or 0.85 masculine pitch modulation."
    },
    availableAnimations: ["Idle", "Speak", "Wave", "Explain", "Thinking", "Listening", "Celebrate", "Encouraging"]
  }
};

export const DEFAULT_AVATAR_ID = "doctor";
