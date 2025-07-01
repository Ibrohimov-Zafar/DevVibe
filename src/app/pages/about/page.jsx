"use client";

import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navbar";
import Image from "next/image";

// Raqamlarni animatsiya bilan chiqaruvchi komponent
const AnimatedCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const duration = 2000;

  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className="font-bold">
      {count}
      {suffix}
    </span>
  );
};

export default function AboutPage() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ projects: 0, experience: 2 });
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);

  // Animatsiyalar uchun "on-scroll" effektini qo'shish
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [loading]); // loading tugagach ishga tushadi

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, portfolioRes, skillsRes, experiencesRes] =
          await Promise.all([
            fetch("/api/profile"),
            fetch("/api/portfolio"),
            fetch("/api/skills"),
            fetch("/api/experience"),
          ]);

        const profileData = await profileRes.json();
        const portfolioData = await portfolioRes.json();
        const skillsData = await skillsRes.json();
        const experiencesData = await experiencesRes.json();

        if (profileData.success) {
          setProfile(profileData.data);
        }
        if (portfolioData.success) {
          setStats((prev) => ({ ...prev, projects: portfolioData.data.length }));
        }
        if (skillsData.success) {
          setSkills(skillsData.data);
        }
        if (experiencesData.success) {
          setExperiences(experiencesData.data);
        }
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xl">
          Profil ma'lumotlarini yuklab bo'lmadi.
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 text-white overflow-x-hidden">
        {/* Hero Section */}
        <section
          className="relative min-h-screen flex items-center justify-center text-center pt-20 px-4 animate-fade-in"
        >
          <div className="absolute inset-0 bg-grid-purple-500/10 [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)]"></div>
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className="relative mb-8 animate-scale-in"
              style={{ animationDelay: "0.2s" }}
            >
              <Image
                src={profile.avatar || "/dev.png"}
                alt={profile.name}
                width={200}
                height={200}
                className="rounded-full object-cover border-4 border-purple-500/50 shadow-2xl shadow-purple-500/20"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-cyan-400 p-3 rounded-full shadow-lg">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
            <h1
              className="text-5xl md:text-7xl font-black mb-4 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              {profile.name}
            </h1>
            <p
              className="text-xl md:text-2xl text-purple-300 font-medium mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              {profile.profession}
            </p>
            <p
              className="max-w-3xl text-lg text-slate-300 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.8s" }}
            >
              {profile.bio}
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div
                className="bg-white/5 p-8 rounded-2xl border border-white/10 animate-on-scroll"
              >
                <div className="text-5xl text-cyan-400 mb-4">
                  <AnimatedCounter value={stats.projects} suffix="+" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300">
                  Tugallangan Loyihalar
                </h3>
              </div>
              <div
                className="bg-white/5 p-8 rounded-2xl border border-white/10 animate-on-scroll"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-5xl text-purple-400 mb-4">
                  <AnimatedCounter value={2} suffix="+ Yil" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300">
                  Dasturlash Tajribasi
                </h3>
              </div>
              <div
                className="bg-white/5 p-8 rounded-2xl border border-white/10 animate-on-scroll"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-5xl text-pink-400 mb-4">
                  <AnimatedCounter value={100} suffix="%" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300">
                  Mijozlar Mamnuniyati
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Timeline Section */}
        <section className="py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Tugatgan  <span className="text-purple-400">Loyihalarimiz</span>
              </h2>
              <p className="text-lg text-slate-300">
                Tajriba va bilimlarimning xronologiyasi
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500/50 via-cyan-500/50 to-transparent"></div>
              {experiences.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center w-full mb-8 animate-on-scroll ${
                    index % 2 === 0
                      ? "justify-start animate-fade-in-right"
                      : "justify-end animate-fade-in-left"
                  }`}
                >
                  <div
                    className={`w-1/2 ${
                      index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                    }`}
                  >
                    <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg">
                      <p className="text-purple-300 font-bold text-lg mb-2">
                        {item.year}
                      </p>
                      <h3 className="text-xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-400">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border-2 border-cyan-400 text-xl">
                    {item.icon || "⭐"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-32 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Texnologiyalar <span className="text-cyan-400">Steki</span>
              </h2>
              <p className="text-lg text-slate-300">
                Jamoamiz mukammal egallagan dasturlash tillari
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {skills.map((skill, index) => (
                <div
                  key={skill.id}
                  className="group bg-white/5 p-6 rounded-2xl border border-white/10 text-center transition-all duration-300 hover:border-purple-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 animate-on-scroll animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce">
                    {skill.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-200">
                    {skill.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-on-scroll">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Keling, birgalikda ajoyib narsa yaratamiz!
              </h2>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                Sizning g'oyangiz bormi? Biz uni hayotga tatbiq etishga yordam
                berishga tayyormiz. Keling, bog'lanamiz va loyihangizni
                muhokama qilamiz.
              </p>
              <a
                href="/pages/contact"
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                <span className="group-hover:animate-bounce">🚀</span>
                Bog'lanish
                <div className="group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </a>
            </div>
          </div>
        </section>
      </div>
      <style jsx global>{`
        .bg-grid-purple-500\/10::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.6s ease-out forwards; }
        
        .animate-on-scroll {
          opacity: 0;
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.animate-fade-in-left { transform: translateX(100px); }
        .animate-on-scroll.animate-fade-in-right { transform: translateX(-100px); }
        .animate-on-scroll:not(.animate-fade-in-left):not(.animate-fade-in-right) { transform: translateY(30px); }
        
        .animate-on-scroll.is-visible {
          opacity: 1;
          transform: translate(0, 0);
        }
      `}</style>
    </>
  );
}