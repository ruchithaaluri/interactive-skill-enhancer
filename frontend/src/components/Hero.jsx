function Hero() {
  return (
    <section className="min-h-[85vh] bg-slate-950 text-white flex items-center justify-center">

      <div className="text-center max-w-4xl">

        <h1 className="text-6xl font-bold mb-6">
          AI Powered Learning
        </h1>

        <h2 className="text-4xl text-sky-400 mb-8">
          Interactive Skill Enhancer
        </h2>

        <p className="text-slate-300 text-xl leading-9">

          A Virtual Reality learning platform for children with Autism,
          combining Artificial Intelligence, Speech Recognition,
          Emotion Detection, Face Tracking,
          Hand Tracking and Computer Vision.

        </p>

        <button
          className="mt-10 bg-sky-500 hover:bg-sky-600 px-8 py-4 rounded-xl text-lg"
        >
          Start Learning
        </button>

      </div>

    </section>
  );
}

export default Hero;