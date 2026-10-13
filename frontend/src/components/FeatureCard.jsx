function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-panel bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-sky-500/20 hover:border-sky-400/50 hover:-translate-y-1.5 transition duration-300 group">
      <div className="text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
        {icon}
      </div>

      <h3 className="text-white text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">
        {title}
      </h3>

      <p className="text-slate-300/80 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;