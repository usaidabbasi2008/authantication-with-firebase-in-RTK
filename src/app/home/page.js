"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";

const features = [
  { icon: "🎯", title: "Select", text: "Choose the AI models that fit your work." },
  { icon: "🧩", title: "Combine", text: "Mix different models into one smooth flow." },
  { icon: "🚀", title: "Integrate", text: "Connect everything and go live faster." },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, ready } = useSelector((s) => s.auth);
const [now, setNow] = useState(null);
  // login nahi hai to wapas login page par
  useEffect(() => {
    if (ready && !user) router.replace("/");
  }, [ready, user, router]);

  // live clock
useEffect(() => {
  setNow(new Date());
  const t = setInterval(() => setNow(new Date()), 1000);
  return () => clearInterval(t);
}, []);
if (!ready || !user || !now) return null;
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const name = user.name || user.email.split("@")[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* background blobs */}
      <div className="blob-a absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl" />
      <div className="blob-b absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-sky-300/40 blur-3xl" />
      <div className="blob-a absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-purple-300/30 blur-3xl" />

      {/* navbar */}
      <nav
        className="fade-up relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-5"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-lg">
            :)
          </div>
          <span className="font-semibold text-black">AI Labs</span>
        </div>

        <div className="flex items-center gap-3">
          {user.photo ? (
            <img
              src={user.photo}
              alt="profile"
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full border-2 border-white shadow"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-semibold text-white shadow">
              {name[0].toUpperCase()}
            </div>
          )}
          <button
            onClick={() => dispatch(logout())}
            className="rounded-lg border text-black bg-white/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition hover:bg-slate-900 hover:text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-16">
        {/* hero card */}
        <section
          className="fade-up rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-md md:p-12"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            <span className="live-dot h-2 w-2 rounded-full bg-green-500" />
            You are signed in
          </div>

          <h1 className="text-3xl text-black font-bold tracking-tight md:text-5xl">
            {greeting}, {name} <span className="wave-hand">👋</span>
          </h1>
          <p className="mt-3 text-slate-500">
            Welcome to this page. Glad to have you here.
          </p>

          <div className="mt-6 inline-block rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-lg">
            <div className="text-2xl font-semibold tabular-nums">
              {now.toLocaleTimeString()}
            </div>
            <div className="text-xs opacity-60">
              {now.toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </section>

        {/* feature cards */}
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="fade-up cursor-default rounded-2xl border border-white/60 bg-white/80 p-6 shadow-md backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{ animationDelay: `${0.4 + i * 0.15}s` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-2xl shadow">
                {f.icon}
              </div>
              <h3 className="text-lg text-black font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-black">{f.text}</p>
            </div>
          ))}
        </section>

        {/* account info */}
        <section
          className="fade-up mt-8 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-md backdrop-blur"
          style={{ animationDelay: "0.9s" }}
        >
          <h2 className="mb-4 text-lg text-black font-semibold">Your account</h2>
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div>
              <p className=" text-black">Name</p>
              <p className="font-medium text-black">{user.name || "Not set"}</p>
            </div>
            <div>
              <p className=" text-black ">Email</p>
              <p className="break-all text-black font-medium">{user.email}</p>
            </div>
            <div>
              <p className=" text-black">User ID</p>
              <p className="font-medium text-black">{user.uid.slice(0, 10)}...</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}