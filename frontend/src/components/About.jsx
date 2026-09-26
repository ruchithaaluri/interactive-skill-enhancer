import {
  User,
  HeartHandshake,
  School,
} from "lucide-react";

function About() {
  const users = [
    {
      icon: <User size={50} />,
      title: "Children",
      text: "Interactive activities designed for children with Autism Spectrum Disorder.",
    },
    {
      icon: <HeartHandshake size={50} />,
      title: "Parents",
      text: "Monitor learning progress and support development from home.",
    },
    {
      icon: <School size={50} />,
      title: "Therapists",
      text: "Track emotions, communication, and social interaction improvements.",
    },
  ];

  return (
    <section className="bg-slate-950 py-20 px-8">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-white text-center">
          Who Can Use This?
        </h2>

        <p className="text-slate-400 text-center mt-4 mb-16">
          Designed for everyone involved in a child's learning journey.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {users.map((user, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-8 text-center hover:scale-105 transition"
            >
              <div className="text-sky-400 flex justify-center mb-5">
                {user.icon}
              </div>

              <h3 className="text-white text-2xl font-semibold mb-3">
                {user.title}
              </h3>

              <p className="text-slate-300">
                {user.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default About;
