"use client";

import Navigation from "@/components/Navbar";
import { Globe } from "@/components/magicui/globe";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LanguageProvider } from '@/context/LanguageContext';

function HomePageContent() {
  const [portfolios, setPortfolios] = useState([]);
  const [posts, setPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [statsInView, setStatsInView] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchPortfolios();
    fetchPosts();
    fetchTestimonials();

    // Enhanced mouse movement tracking for 3D effects
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("/api/portfolio");
      const result = await response.json();
      if (result.success) {
        setPortfolios(result.data.slice(0, 4));
      }
    } catch (error) {
      console.error("Portfolio yuklashda xatolik:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const result = await response.json();
      if (result.success) {
        setPosts(
          result.data.filter((post) => post.status === "published").slice(0, 3)
        );
      }
    } catch (error) {
      console.error("Postlar yuklashda xatolik:", error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials?approved=true");
      const result = await response.json();
      if (result.success) {
        setTestimonials(result.data);
      }
    } catch (error) {
      console.error("Mijozlar fikrini yuklashda xatolik:", error);
    }
  };

  // Stats counter animation
  const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!statsInView) return;

      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [end, duration, statsInView]);

    return (
      <span>
        {count}
        {suffix}
      </span>
    );
  };

  return (
    <>
      <Navigation  />

      {/* Revolutionary 3D Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden pt-20">
        {/* Advanced 3D Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating 3D Elements */}
          <div
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float-slow"
            style={{
              transform: `translate3d(${mousePosition.x * 2}px, ${mousePosition.y * 2}px, 0) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
            }}
          ></div>
          <div
            className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-float-medium"
            style={{
              transform: `translate3d(${-mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px, 0) rotateX(${-mousePosition.y * 0.1}deg) rotateY(${-mousePosition.x * 0.1}deg)`,
            }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float-fast"
            style={{
              transform: `translate3d(${mousePosition.x}px, ${-mousePosition.y}px, 0) rotateX(${mousePosition.y * 0.15}deg) rotateY(${mousePosition.x * 0.15}deg)`,
            }}
          ></div>

          {/* Geometric Shapes */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-cyan-400/30 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 border border-purple-400/30 rotate-12 animate-pulse"></div>

          {/* Particle Effect */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Enhanced Globe with 3D Effect */}
        <div className="absolute inset-0 z-0">
          <div className="transform-gpu perspective-1000">
            <Globe className="opacity-15 scale-110 animate-pulse-slow" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
          <div className="w-full text-center">
            {/* Floating Badge with 3D Effect */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium mb-12 shadow-2xl transform-gpu hover:scale-105 transition-all duration-500">
              <span className="text-2xl animate-wave">👋</span>
              <span className="font-light">Salom, Biz</span>
              <span className="font-bold text-cyan-400">
                DevVibe Jamoasi
              </span>
            </div>

            {/* 3D Typography - Fixed for dark theme */}
            <h1 className="text-7xl md:text-9xl font-black text-white mb-8 leading-none relative">
              <span
                className="block transform-gpu text-white"
                style={{
                  textShadow: "0 0 40px rgba(59, 130, 246, 0.5), 0 0 80px rgba(59, 130, 246, 0.3)",
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`,
                }}
              >
                DevVibe
              </span>
              <span
                className="block text-cyan-400 transform-gpu relative"
                style={{
                  transform: `perspective(1000px) rotateX(${-mousePosition.y * 0.05}deg) rotateY(${-mousePosition.x * 0.05}deg)`,
                }}
              >
                TEAMS
                <div className="absolute -top-8 -right-12 text-4xl animate-float-fast">✨</div>
                <div className="absolute -bottom-4 -left-8 text-3xl animate-bounce-slow">🚀</div>
              </span>
            </h1>

            {/* Enhanced Description - Fixed for dark theme */}
            <p className="text-xl md:text-3xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed font-light">
              Sizning{" "}
              <span className="font-bold text-cyan-400">
                raqamli orzularingizni
              </span>{" "}
              <br className="hidden md:block" />
              zamonaviy texnologiyalar bilan{" "}
              <span className="font-bold text-purple-400">
                haqiqatga aylantiramiz
              </span>
            </p>

            {/* 3D Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
              <a
                href="/pages/contact"
                className="group relative bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white px-12 py-6 rounded-2xl font-bold text-lg transition-all duration-500 transform-gpu hover:scale-110 hover:-translate-y-2 shadow-2xl hover:shadow-cyan-500/25"
                style={{
                  boxShadow:
                    "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-2xl group-hover:animate-bounce">🚀</span>
                  Loyiha Boshlash
                  <div className="group-hover:translate-x-2 transition-transform text-xl">
                    →
                  </div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
              </a>

              <a
                href="/pages/portfolio"
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 px-12 py-6 rounded-2xl font-bold text-lg transition-all duration-500 transform-gpu hover:scale-110 hover:-translate-y-2"
                style={{
                  boxShadow:
                    "0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                }}
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl group-hover:animate-spin">💼</span>
                  Ishlarimizni Ko\'ring
                </span>
              </a>
            </div>

            {/* 3D Stats Cards */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
              onMouseEnter={() => setStatsInView(true)}
            >
              {[
                {
                  value: 2,
                  suffix: "+",
                  label: "Yillik",
                  sublabel: "Tajriba",
                  icon: "⚡",
                  color: "from-cyan-400 to-blue-500",
                },
                {
                  value: 25,
                  suffix: "+",
                  label: "Loyihalar",
                  sublabel: "Muvaffaqiyatli",
                  icon: "🎯",
                  color: "from-purple-400 to-pink-500",
                },
                {
                  value: 100,
                  suffix: "%",
                  label: "Mijoz",
                  sublabel: "Mamnuniyati",
                  icon: "😊",
                  color: "from-emerald-400 to-teal-500",
                },
                {
                  value: 24,
                  suffix: "/7",
                  label: "Yordam",
                  sublabel: "Doimo",
                  icon: "🛡️",
                  color: "from-orange-400 to-red-500",
                },
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div
                    className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-700 transform-gpu hover:scale-110 hover:-translate-y-4 hover:rotate-3"
                    style={{
                      boxShadow:
                        "0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`}
                    ></div>
                    <div className="relative z-10 text-center">
                      <div className="text-4xl mb-4 group-hover:animate-bounce">
                        {stat.icon}
                      </div>
                      <div className="text-4xl md:text-5xl font-black text-white mb-2">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-gray-300 font-bold text-lg">
                        {stat.label}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {stat.sublabel}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center animate-float-slow">
            <div className="text-white/60 text-sm mb-2 font-light">
              Pastga suring
            </div>
            <div className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
              <div className="w-1 h-4 bg-white/60 rounded-full mt-3 animate-scroll-smooth"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Skills Section - Fixed for dark theme */}
      <section className="py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-xl text-blue-800 dark:text-blue-300 px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg">
              <span className="text-xl animate-pulse">💪</span>
              Professional Skills
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-6">
              <span className="text-blue-600 dark:text-cyan-400">
                 Professional Skills
              </span>
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
              Zamonaviy texnologiyalar bilan professional yechimlar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[
              {
                name: "React",
                icon: "⚛️",
                level: 95,
                color: "from-blue-400 via-cyan-500 to-blue-600",
                glow: "shadow-blue-500/25",
              },
              {
                name: "Next.js",
                icon: "🔄",
                level: 92,
                color: "from-gray-600 via-gray-700 to-black",
                glow: "shadow-gray-500/25",
              },
              {
                name: "Node.js",
                icon: "🟢",
                level: 88,
                color: "from-green-400 via-emerald-500 to-green-600",
                glow: "shadow-green-500/25",
              },
              {
                name: "JavaScript",
                icon: "🟨",
                level: 96,
                color: "from-yellow-400 via-amber-500 to-orange-500",
                glow: "shadow-yellow-500/25",
              },
              {
                name: "TypeScript",
                icon: "🔷",
                level: 85,
                color: "from-blue-500 via-indigo-600 to-blue-700",
                glow: "shadow-blue-600/25",
              },
              {
                name: "Python",
                icon: "🐍",
                level: 82,
                color: "from-green-500 via-teal-600 to-blue-600",
                glow: "shadow-teal-500/25",
              },
              {
                name: "MongoDB",
                icon: "🍃",
                level: 87,
                color: "from-green-400 via-green-600 to-emerald-700",
                glow: "shadow-green-600/25",
              },
              {
                name: "PostgreSQL",
                icon: "🐘",
                level: 83,
                color: "from-blue-600 via-indigo-700 to-purple-600",
                glow: "shadow-indigo-500/25",
              },
            ].map((skill, index) => (
              <div key={index} className="group perspective-1000">
                <div
                  className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl transition-all duration-700 transform-gpu hover:scale-110 hover:-translate-y-6 border border-white/20 dark:border-slate-700/50 ${skill.glow} hover:shadow-2xl`}
                >
                  {/* Animated Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-all duration-500`}
                  ></div>

                  <div className="relative z-10 text-center">
                    <div className="text-6xl mb-6 group-hover:animate-bounce transform-gpu group-hover:scale-125 transition-all duration-500">
                      {skill.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-6 text-xl group-hover:text-2xl transition-all duration-300">
                      {skill.name}
                    </h3>

                    {/* 3D Circular Progress */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <svg
                        className="w-24 h-24 transform-gpu group-hover:rotate-180 transition-transform duration-1000"
                        viewBox="0 0 100 100"
                      >
                        <defs>
                          <linearGradient
                            id={`gradient-${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              className="text-blue-400"
                              stopColor="currentColor"
                            />
                            <stop
                              offset="50%"
                              className="text-purple-500"
                              stopColor="currentColor"
                            />
                            <stop
                              offset="100%"
                              className="text-pink-500"
                              stopColor="currentColor"
                            />
                          </linearGradient>
                          <filter id={`glow-${index}`}>
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          className="text-gray-200 dark:text-slate-700"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={`url(#gradient-${index})`}
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${2.51 * skill.level} 251`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 group-hover:animate-pulse"
                          filter={`url(#glow-${index})`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-black text-gray-700 dark:text-white group-hover:text-2xl transition-all duration-300">
                          {skill.level}%
                        </span>
                      </div>
                    </div>

                    {/* 3D Progress Bar */}
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-1000 group-hover:animate-pulse rounded-full shadow-lg`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Portfolio Preview - Fixed for dark theme */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* 3D Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10"></div>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            ></div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-2xl">
              <span className="text-xl animate-pulse">🎨</span>
              Featured Projects
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6">
              <span className="text-purple-400">
                Portfolio Loyihalarimiz
              </span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto font-light">
              Har bir loyiha - bu innovatsiya va kreativlikning uyg'unligi
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {portfolios.map((portfolio, index) => (
              <div key={portfolio.id} className="group perspective-1000">
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 transform-gpu hover:scale-105 hover:-translate-y-8 hover:rotate-y-12 border border-white/20">
                  {/* 3D Image Container */}
                  <div className="relative overflow-hidden h-80">
                    <Image
                      src={portfolio.image}
                      alt={portfolio.title}
                      width={600}
                      height={320}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />

                    {/* Overlay with 3D Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex gap-3">
                          {portfolio.website_url && (
                            <a
                              href={portfolio.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white/20 backdrop-blur-xl text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg transform hover:scale-110"
                            >
                              <span className="text-xl">🌐</span>
                              <span className="font-bold">Live Demo</span>
                            </a>
                          )}
                          {portfolio.github_url && (
                            <a
                              href={portfolio.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white/20 backdrop-blur-xl text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg transform hover:scale-110"
                            >
                              <span className="text-xl">💻</span>
                              <span className="font-bold">Source</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {portfolio.featured && (
                      <div className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-xl font-black text-sm animate-pulse shadow-lg">
                        ⭐ FEATURED
                      </div>
                    )}
                  </div>

                  {/* Content with Glass Effect - Fixed for dark theme */}
                  <div className="p-8 bg-gradient-to-br from-white/10 to-white/5">
                    <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-all duration-500">
                      {portfolio.title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                      {portfolio.description}
                    </p>

                    {/* 3D Tech Stack */}
                    <div className="flex flex-wrap gap-3">
                      {portfolio.technologies?.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl text-cyan-300 px-4 py-2 rounded-xl text-sm font-bold hover:scale-110 hover:from-cyan-400/30 hover:to-purple-400/30 transition-all duration-300 border border-cyan-500/30 shadow-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="/pages/portfolio"
              className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-400 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-500 transform-gpu hover:scale-110 hover:-translate-y-2 shadow-2xl"
            >
              <span className="text-2xl group-hover:animate-spin">🎨</span>
              <span>Barcha Loyihalar</span>
              <div className="group-hover:translate-x-2 transition-transform text-2xl">
                →
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-cyan-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-gradient-to-r from-gray-900 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                <span>💬</span>
                Mijozlar Fikri
              </div>
              <h2 className="text-5xl font-bold mb-4">
               Mijozlarimiz biz haqimizda Nima <span className="text-white">Deyishadi</span>
              </h2>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 text-center">
                <div className="mb-8">
                  <Image
                    src={
                      testimonials[currentTestimonial].avatar || "/zafar.jpg"
                    }
                    alt={testimonials[currentTestimonial].name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full mx-auto mb-6 border-4 border-white/20 object-cover"
                  />
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <span key={i} className="text-yellow-400 text-2xl">
                          ⭐
                        </span>
                      )
                    )}
                  </div>
                  <blockquote className="text-2xl font-medium leading-relaxed mb-6 italic">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  <div>
                    <div className="font-bold text-xl">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-white/70">
                      {testimonials[currentTestimonial].position}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8 gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? "bg-white scale-125"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview - Fixed for dark theme */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span>📝</span>
              Blog
            </div>
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Jamoamiz haqida so\'nggi{" "}
              <span className="text-green-600 dark:text-green-400">
                Maqolalar
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              Texnologiya va dasturlash haqida foydali ma'lumotlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <Link key={post.id} href={`/pages/blog/${post.slug}`} passHref>
                <article className="group bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border dark:border-slate-600 flex flex-col h-full cursor-pointer">
                  {post.image && (
                    <div className="relative overflow-hidden h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-800 dark:text-slate-200 px-3 py-1 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-slate-400">
                      <span>📅</span>
                      <span>
                        {new Date(
                          post.published_at || post.created_at
                        ).toLocaleDateString("uz-UZ")}
                      </span>
                      <span>•</span>
                      <span>{post.author}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-slate-200 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags?.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                      <div className="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        O'qish
                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 dark:text-slate-500 text-sm">
                        <span>👁️</span>
                        <span>{Math.floor(Math.random() * 1000) + 100}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <a
              href="/pages/blog"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <span className="group-hover:animate-pulse">📚</span>
              Barcha Maqolalar
              <div className="group-hover:translate-x-1 transition-transform">
                →
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section - Fixed for dark theme */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Loyihangizni <br />
              <span className="text-yellow-300">
                Hayotga Keltiring!
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Sizning g&apos;oyangizni professional web loyihaga aylantiramiz.
              <br />
              Bugun boshlang va muvaffaqiyatga erishing!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <a
              href="/pages/contact"
              className="group bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-3"
            >
              <span className="group-hover:animate-bounce">💬</span>
              Bepul Maslahat
            </a>
            <a
              href="/pages/portfolio"
              className="group border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <span className="group-hover:animate-spin">👀</span>
              Ishlarimni Ko&apos;ring
            </a>
          </div>

          {/* Contact Info Quick Access */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-2">📧</div>
              <div className="font-semibold">Email</div>
              <div className="text-sm opacity-80 break-all">
                ibragimovzafar001@gmail.com
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-2">📱</div>
              <div className="font-semibold">Telefon</div>
              <div className="text-sm opacity-80">+998 88 000 14 29</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-2">💬</div>
              <div className="font-semibold">Telegram</div>
              <div className="text-sm opacity-80">@zafaribragimov</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Fixed for dark theme */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">💻</div>
                <h3 className="text-2xl font-bold text-white">
                  Zafar Ibragimov
                </h3>
              </div>
              <p className="text-gray-400 dark:text-slate-400 mb-6 leading-relaxed max-w-md">
                Professional Full Stack Developer. Sizning raqamli
                muvaffaqiyatingiz uchun zamonaviy yechimlar va kreativ goyalar.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-gray-800 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                >
                  <span className="text-xl">📱</span>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 dark:bg-slate-800 hover:bg-purple-600 dark:hover:bg-purple-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                >
                  <span className="text-xl">💼</span>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 dark:bg-slate-800 hover:bg-green-600 dark:hover:bg-green-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                >
                  <span className="text-xl">📧</span>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 dark:bg-slate-800 hover:bg-blue-500 dark:hover:bg-blue-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                >
                  <span className="text-xl">💬</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg text-white">
                🔗 Tezkor Havolalar
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Men Haqimda", href: "/pages/about" },
                  { name: "Xizmatlar", href: "/pages/services" },
                  { name: "Portfolio", href: "/pages/portfolio" },
                  { name: "Blog", href: "/pages/blog" },
                  { name: "Aloqa", href: "/pages/contact" },
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 dark:text-slate-400 hover:text-white dark:hover:text-slate-200 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg text-white">
                📞 Aloqa Malumotlari
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">📧</span>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-400 dark:text-slate-400 text-sm">
                      ibragimovzafar001@gmail.com
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">📱</span>
                  <div>
                    <div className="font-medium">Telefon</div>
                    <div className="text-gray-400 dark:text-slate-400 text-sm">
                      +998 88 000 14 29
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">📍</span>
                  <div>
                    <div className="font-medium">Joylashuv</div>
                    <div className="text-gray-400 dark:text-slate-400 text-sm">
                      Toshkent, O&apos;zbekiston
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-slate-400 mb-4 md:mb-0">
              &copy; 2025 Zafar Ibragimov. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-gray-400 dark:text-slate-400 hover:text-white dark:hover:text-slate-200 transition-colors text-sm"
              >
                Maxfiylik Siyosati
              </a>
              <a
                href="#"
                className="text-gray-400 dark:text-slate-400 hover:text-white dark:hover:text-slate-200 transition-colors text-sm"
              >
                Foydalanish Shartlari
              </a>
              <div className="flex items-center gap-2 text-gray-400 dark:text-slate-400 text-sm">
                <span>💚</span>
                <span>Ozbekistonda ishlab chiqilgan</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Enhanced Styles */}
      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes scroll-smooth {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(20px);
            opacity: 0;
          }
        }

        @keyframes wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-15deg);
          }
          75% {
            transform: rotate(15deg);
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-scroll-smooth {
          animation: scroll-smooth 3s infinite;
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-gpu {
          transform: translateZ(0);
        }
        .rotate-y-12 {
          transform: rotateY(12deg);
        }

        .backdrop-blur-2xl {
          backdrop-filter: blur(40px);
        }
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomePageContent />
    </LanguageProvider>
  );
}
