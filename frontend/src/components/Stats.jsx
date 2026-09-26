function Stats() {
  const stats = [
    { number: "6+", label: "AI Technologies" },
    { number: "100%", label: "Interactive Learning" },
    { number: "24/7", label: "AI Assistance" },
    { number: "3D", label: "Virtual Reality Experience" },
  ];

  return (
    <section className="bg-slate-900 py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index}>
            <h2 className="text-5xl font-bold text-sky-400">
              {stat.number}
            </h2>

            <p className="mt-3 text-slate-300">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;