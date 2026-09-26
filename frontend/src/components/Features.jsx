import FeatureCard from "./FeatureCard";
import {
  Bot,
  Mic,
  Smile,
  Hand,
  ScanFace,
  Cuboid,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: <Bot size={48} />,
      title: "AI Conversation",
      description:
        "Interactive conversations powered by Mistral AI.",
    },
    {
      icon: <Mic size={48} />,
      title: "Speech Recognition",
      description:
        "Real-time speech recognition using Groq Whisper.",
    },
    {
      icon: <Smile size={48} />,
      title: "Emotion Detection",
      description:
        "Recognize emotions with DeepFace.",
    },
    {
      icon: <Hand size={48} />,
      title: "Hand Tracking",
      description:
        "Interactive gesture recognition using MediaPipe.",
    },
    {
      icon: <ScanFace size={48} />,
      title: "Face Tracking",
      description:
        "Real-time facial landmark tracking.",
    },
    {
      icon: <Cuboid size={48} />,
      title: "3D VR Learning",
      description:
        "Immersive learning using React Three Fiber.",
    },
  ];

  return (
    <section className="bg-slate-950 py-20 px-8">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center text-white mb-4">
          Project Features
        </h2>

        <p className="text-center text-slate-400 mb-14">
          Technologies powering the Interactive Skill Enhancer
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;