import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import About from "../components/About";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Particle3DBackground from "../components/Particle3DBackground";

function Home() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen bg-[#02040a] text-slate-100 overflow-x-hidden">
      <Particle3DBackground mode="aurora" theme="starlight" />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Stats />
        <About />
        <Footer />
      </div>
    </div>
  );
}

export default Home;