function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-sky-500/20 hover:-translate-y-2 transition duration-300">
      <div className="text-sky-400 text-5xl mb-4">
        {icon}
      </div>

      <h3 className="text-white text-2xl font-semibold mb-3">
        {title}
      </h3>

      <p className="text-slate-300">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;