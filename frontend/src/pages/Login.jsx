import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogIn, AlertCircle, Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || "Invalid email or password. Please check your credentials.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Main Glassmorphic Login Card */}
      <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-400/30 text-sky-400 mb-3 shadow-lg shadow-sky-500/10">
            <LogIn size={28} />
          </div>
          <h1 className="text-white text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
            Welcome Back
            <Sparkles size={20} className="text-sky-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">Sign in to continue your interactive learning journey</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs sm:text-sm font-medium animate-fadeIn">
            <AlertCircle size={18} className="shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-950/70 text-white border border-slate-700/80 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3.5 rounded-xl bg-slate-950/70 text-white border border-slate-700/80 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-60 text-white font-bold p-3.5 rounded-xl transition shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 text-sm mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-slate-400 text-center text-sm mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-sky-400 font-bold hover:text-sky-300 hover:underline transition">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;