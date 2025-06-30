"use client";

import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navbar";

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX - window.innerWidth / 2) / 100,
      y: (e.clientY - window.innerHeight / 2) / 100,
    });
  };

  useEffect(() => {
    fetchPortfolios();

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("/api/portfolio");
      const result = await response.json();
      if (result.success) {
        setPortfolios(result.data);
      }
    } catch (error) {
      console.error("Portfolio yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolios =
    filter === "featured" ? portfolios.filter((p) => p.featured) : portfolios;

  const openModal = (portfolio) => {
    setSelectedPortfolio(portfolio);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedPortfolio(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <Navigation />

      {/* Revolutionary Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-blue-950 relative overflow-hidden pt-20">
        {/* Advanced 3D Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating 3D Elements */}
          <div
            className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-float-slow"
            style={{
              transform: `translate3d(${mousePosition.x * 2}px, ${mousePosition.y * 2}px, 0) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
            }}
          ></div>
          <div
            className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-float-medium"
            style={{
              transform: `translate3d(${-mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px, 0)`,
            }}
          ></div>
          <div
            className="absolute bottom-32 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-400/30 to-teal-500/30 rounded-full blur-3xl animate-float-fast"
            style={{
              transform: `translate3d(${mousePosition.x}px, ${-mousePosition.y}px, 0)`,
            }}
          ></div>

          {/* 3D Portfolio Icons */}
          {["💼", "🎨", "🚀", "💻", "⚡", "🌟"].map((icon, index) => (
            <div
              key={index}
              className="absolute text-4xl opacity-20 animate-float-slow"
              style={{
                left: `${15 + index * 12}%`,
                top: `${25 + index * 8}%`,
                animationDelay: `${index * 0.7}s`,
                transform: `translate3d(${mousePosition.x * (index + 1)}px, ${mousePosition.y * (index + 1)}px, 0)`,
              }}
            >
              {icon}
            </div>
          ))}

          {/* Geometric Grid */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: "60px 60px",
                transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`,
              }}
            ></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          {/* Hero Content */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-full text-sm font-bold mb-8 shadow-2xl animate-pulse-slow">
              <span className="text-xl animate-spin-slow">💼</span>
              Creative Portfolio
            </div>

            <h1 className="text-7xl md:text-9xl font-black text-white mb-8 leading-none relative">
              <span
                className="block transform-gpu"
                style={{
                  textShadow:
                    "0 0 40px rgba(147, 51, 234, 0.5), 0 0 80px rgba(147, 51, 234, 0.3)",
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`,
                }}
              >
                CREATIVE
              </span>
              <span
                className="block text-purple-400 transform-gpu relative"
                style={{
                  transform: `perspective(1000px) rotateX(${-mousePosition.y * 0.05}deg) rotateY(${-mousePosition.x * 0.05}deg)`,
                }}
              >
                PORTFOLIO
                <div className="absolute -top-8 -right-16 text-5xl animate-float-fast">
                  🎨
                </div>
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Har bir loyiha - bu{" "}
              <span className="font-bold text-purple-400">
                kreativlik va innovatsiyaning
              </span>
              <br />
              <span className="font-bold text-cyan-400">
                mukammal uyg'unligi
              </span>
            </p>

            {/* 3D Filter Buttons */}
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() => setFilter("all")}
                className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform-gpu hover:scale-110 hover:-translate-y-2 ${
                  filter === "all"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl"
                    : "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl group-hover:animate-bounce">🌟</span>
                  Hammasi
                </span>
                {filter === "all" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                )}
              </button>

              <button
                onClick={() => setFilter("featured")}
                className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform-gpu hover:scale-110 hover:-translate-y-2 ${
                  filter === "featured"
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-2xl"
                    : "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl group-hover:animate-pulse">⭐</span>
                  Asosiy
                </span>
                {filter === "featured" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Portfolio Grid */}
      <section className="py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200"></div>
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl animate-pulse">💼</span>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Portfolio Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {filteredPortfolios.map((portfolio, index) => (
                <div
                  key={portfolio.id}
                  className="group perspective-1000 transform transition-all duration-700 hover:-translate-y-8"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-700 transform-gpu hover:scale-105 hover:rotate-y-12 border border-white/20 dark:border-slate-700/50 overflow-hidden cursor-pointer"
                    onClick={() => openModal(portfolio)}
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                    {/* 3D Image Container */}
                    <div className="relative overflow-hidden h-64">
                      <img
                        src={portfolio.image}
                        alt={portfolio.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />

                      {/* Overlay with 3D Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-6 left-6 right-6">
                          <button className="w-full bg-white/20 backdrop-blur-xl text-white py-3 px-6 rounded-xl font-bold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg">
                            <span className="flex items-center justify-center gap-2">
                              <span className="text-xl">👁️</span>
                              Batafsil Ko'rish
                            </span>
                          </button>
                        </div>
                      </div>

                      {portfolio.featured && (
                        <div className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-xl font-black text-sm animate-pulse shadow-lg">
                          ⭐ TOP PROJECT
                        </div>
                      )}
                    </div>

                    {/* Content with Glass Effect */}
                    <div className="relative z-10 p-8">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {portfolio.title}
                      </h3>
                      <p className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
                        {portfolio.description}
                      </p>

                      {/* 3D Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {portfolio.technologies
                          ?.slice(0, 3)
                          .map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-medium hover:scale-110 transition-transform duration-300"
                            >
                              {tech}
                            </span>
                          ))}
                        {portfolio.technologies?.length > 3 && (
                          <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                            +{portfolio.technologies.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Action Links */}
                      <div className="flex justify-between items-center">
                        <div className="flex gap-3">
                          {portfolio.website_url && (
                            <a
                              href={portfolio.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm flex items-center gap-1 hover:scale-110 transition-all duration-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>🌐</span>
                              Demo
                            </a>
                          )}
                          {portfolio.github_url && (
                            <a
                              href={portfolio.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-300 font-medium text-sm flex items-center gap-1 hover:scale-110 transition-all duration-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>📂</span>
                              Code
                            </a>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 dark:text-slate-500">
                          {new Date(
                            portfolio.created_at || portfolio.createdAt
                          ).toLocaleDateString("uz-UZ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Empty State */}
          {!loading && filteredPortfolios.length === 0 && (
            <div className="text-center py-20">
              <div className="relative inline-block">
                <div className="text-8xl mb-6 animate-bounce">🎨</div>
                <div className="absolute -top-4 -right-4 text-3xl animate-spin-slow">
                  ✨
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-600 dark:text-slate-300 mb-4">
                {filter === "featured"
                  ? "Asosiy loyihalar topilmadi"
                  : "Hali loyiha yo'q"}
              </h3>
              <p className="text-gray-500 dark:text-slate-400 mb-8 text-lg">
                {filter === "featured"
                  ? "Hozircha asosiy loyihalar belgilanmagan."
                  : "Tez orada yangi loyihalar qo'shiladi!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="/pages/contact"
                  className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-3"
                >
                  <span className="text-xl group-hover:animate-bounce">💬</span>
                  Loyiha Buyurtma Qiling
                </a>
                <a
                  href="/pages/services"
                  className="group border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <span className="text-xl group-hover:animate-pulse">⚡</span>
                  Xizmatlarni Ko'ring
                </a>
              </div>
            </div>
          )}

          {/* Enhanced Technologies Section */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 border border-white/20 dark:border-slate-700/50">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                <span className="text-purple-600 dark:text-purple-400">
                  Texnologiyalar
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-slate-300">
                Loyihalarimda ishlatilgan zamonaviy texnologiyalar
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { name: "React", icon: "⚛️", color: "from-blue-400 to-cyan-500" },
                { name: "Next.js", icon: "🔄", color: "from-gray-600 to-slate-800" },
                { name: "Node.js", icon: "🟢", color: "from-green-400 to-emerald-500" },
                { name: "MongoDB", icon: "🍃", color: "from-green-500 to-teal-600" },
                { name: "PostgreSQL", icon: "🐘", color: "from-blue-600 to-indigo-700" },
                { name: "Tailwind", icon: "🎨", color: "from-cyan-400 to-blue-500" },
              ].map((tech, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-700 dark:to-slate-800 p-6 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 border border-gray-100 dark:border-slate-600"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                  ></div>

                  <div className="relative text-center">
                    <div className="text-4xl mb-3 group-hover:animate-bounce transform group-hover:scale-125 transition-all duration-500">
                      {tech.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm group-hover:text-lg transition-all duration-300">
                      {tech.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Modal */}
      {selectedPortfolio && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="relative">
              <img
                src={selectedPortfolio.image}
                alt={selectedPortfolio.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-xl text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <span className="text-xl">✕</span>
              </button>
              {selectedPortfolio.featured && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-2xl font-black shadow-lg animate-pulse">
                  ⭐ TOP LOYIHA
                </div>
              )}
            </div>

            <div className="p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {selectedPortfolio.title}
              </h2>
              <p className="text-gray-600 dark:text-slate-300 text-xl leading-relaxed mb-8">
                {selectedPortfolio.description}
              </p>

              <div className="mb-8">
                <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  🛠️ Ishlatilgan texnologiyalar:
                </h4>
                <div className="flex flex-wrap gap-4">
                  {selectedPortfolio.technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg hover:scale-110 transition-transform duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                {selectedPortfolio.website_url && (
                  <a
                    href={selectedPortfolio.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 px-8 rounded-2xl font-bold text-lg text-center transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <span className="text-2xl group-hover:animate-bounce">🌐</span>
                      Websiteni Ko'rish
                    </span>
                  </a>
                )}
                {selectedPortfolio.github_url && (
                  <a
                    href={selectedPortfolio.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex-1 bg-gray-800 dark:bg-slate-700 hover:bg-gray-900 dark:hover:bg-slate-600 text-white py-5 px-8 rounded-2xl font-bold text-lg text-center transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <span className="text-2xl group-hover:animate-pulse">📂</span>
                      GitHub Code
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Enhanced Styles */}
      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(-3deg);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
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
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
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
      `}</style>
    </>
  );
}
