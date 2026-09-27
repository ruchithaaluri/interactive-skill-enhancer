function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-12 h-12 mb-3">
        <div className="absolute inset-0 rounded-full border-4 border-sky-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-sky-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
    </div>
  );
}

export default Loader;
