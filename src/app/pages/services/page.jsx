"use client";

import Navigation from "@/components/Navbar";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    description: "",
    timeline: "",
  });

  const services = [
    {
      id: 1,
      title: "Web Development",
      description: "Zamonaviy va responsive web saytlar yaratish",
      icon: "💻",
      price: "$500 - $5000",
      duration: "2-8 hafta",
      features: [
        "Responsive dizayn",
        "Modern UI/UX",
        "SEO optimizatsiyasi",
        "Mobile-first yondashuv",
        "Performance optimizatsiya",
        "Cross-browser compatibility",
      ],
      technologies: ["React", "Next.js", "Node.js", "MongoDB"],
      popular: true,
    },
    {
      id: 2,
      title: "E-commerce Solutions",
      description: "To'liq funksional onlayn do'kon yaratish",
      icon: "🛒",
      price: "$1000 - $10000",
      duration: "3-12 hafta",
      features: [
        "Mahsulot katalogi",
        "To'lov tizimi integratsiyasi",
        "Buyurtma boshqaruvi",
        "Inventar nazorati",
        "Mijozlar paneli",
        "Admin dashboard",
      ],
      technologies: ["React", "Node.js", "Stripe", "PostgreSQL"],
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "iOS va Android uchun mobil ilovalar",
      icon: "📱",
      price: "$800 - $8000",
      duration: "4-16 hafta",
      features: [
        "Cross-platform development",
        "Native performance",
        "Push notifications",
        "Offline functionality",
        "App Store optimization",
        "Backend integration",
      ],
      technologies: ["React Native", "Flutter", "Firebase"],
    },
    {
      id: 4,
      title: "API Development",
      description: "RESTful va GraphQL API yaratish",
      icon: "⚡",
      price: "$300 - $3000",
      duration: "1-6 hafta",
      features: [
        "RESTful API design",
        "GraphQL implementation",
        "Authentication & Authorization",
        "Rate limiting",
        "API documentation",
        "Testing & monitoring",
      ],
      technologies: ["Node.js", "Express", "GraphQL", "MongoDB"],
    },
    {
      id: 5,
      title: "UI/UX Design",
      description: "Foydalanuvchi interfeysi va tajriba dizayni",
      icon: "🎨",
      price: "$200 - $2000",
      duration: "1-4 hafta",
      features: [
        "User research",
        "Wireframing",
        "Prototyping",
        "Visual design",
        "Usability testing",
        "Design system",
      ],
      technologies: ["Figma", "Adobe XD", "Sketch", "InVision"],
    },
    {
      id: 6,
      title: "Maintenance & Support",
      description: "Loyihalarni qo'llab-quvvatlash va yangilash",
      icon: "🔧",
      price: "$50 - $500/oy",
      duration: "Doimiy",
      features: [
        "Bug fixes",
        "Security updates",
        "Performance monitoring",
        "Content updates",
        "Feature enhancements",
        "24/7 support",
      ],
      technologies: ["Monitoring tools", "CI/CD", "Cloud platforms"],
    },
  ];

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const loadingToast = toast.loading("So'rov yuborilmoqda...");

    // API uchun ma'lumotlarni tayyorlash
    const apiData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      budget: formData.budget,
      message: formData.description,
      subject: `Taklif so'rovi: ${formData.service}`,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success("✅ So'rovingiz muvaffaqiyatli yuborildi!");
        setShowQuoteForm(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          budget: "",
          description: "",
          timeline: "",
        });
      } else {
        toast.error(`❌ Xatolik: ${result.error || "Noma'lum xato"}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("❌ So'rovni yuborishda kutilmagan xatolik yuz berdi.");
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  // Enhanced mouse tracking for 3D effects
  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX - window.innerWidth / 2) / 100,
      y: (e.clientY - window.innerHeight / 2) / 100,
    });
  };

  return (
    <>
      <Toaster position="top-center" />
      <Navigation />
      
      {/* Revolutionary Hero Section */}
      <section 
        className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-blue-950 relative overflow-hidden pt-20"
        onMouseMove={handleMouseMove}
      >
        {/* Advanced 3D Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Geometric Shapes */}
          <div 
            className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-float-slow"
            style={{
              transform: `translate3d(${mousePosition.x * 2}px, ${mousePosition.y * 2}px, 0) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
            }}
          ></div>
          <div 
            className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-float-medium"
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

          {/* 3D Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: '50px 50px',
                transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`
              }}
            ></div>
          </div>

          {/* Floating Icons */}
          {['💻', '🚀', '🎨', '⚡', '🛒', '📱'].map((icon, index) => (
            <div
              key={index}
              className="absolute text-4xl opacity-20 animate-float-slow"
              style={{
                left: `${10 + (index * 15)}%`,
                top: `${20 + (index * 10)}%`,
                animationDelay: `${index * 0.5}s`,
                transform: `translate3d(${mousePosition.x * (index + 1)}px, ${mousePosition.y * (index + 1)}px, 0)`
              }}
            >
              {icon}
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          {/* Hero Content */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-full text-sm font-bold mb-8 shadow-2xl animate-pulse-slow">
              <span className="text-xl animate-spin-slow">⚡</span>
              Professional Services
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black text-white mb-8 leading-none relative">
              <span 
                className="block transform-gpu"
                style={{
                  textShadow: '0 0 40px rgba(59, 130, 246, 0.5), 0 0 80px rgba(59, 130, 246, 0.3)',
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`
                }}
              >
                CREATIVE
              </span>
              <span 
                className="block text-cyan-400 transform-gpu relative"
                style={{
                  transform: `perspective(1000px) rotateX(${-mousePosition.y * 0.05}deg) rotateY(${-mousePosition.x * 0.05}deg)`
                }}
              >
                SOLUTIONS
                <div className="absolute -top-8 -right-16 text-5xl animate-float-fast">✨</div>
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              G'oyangizdan 
              <span className="font-bold text-cyan-400"> professional loyihagacha</span>
              <br />
              <span className="font-bold text-purple-400">to'liq xizmatlar ekotizimi</span>
            </p>

            {/* 3D CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => setShowQuoteForm(true)}
                className="group relative bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white px-12 py-6 rounded-2xl font-bold text-lg transition-all duration-500 transform-gpu hover:scale-110 hover:-translate-y-2 shadow-2xl"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-2xl group-hover:animate-bounce">🚀</span>
                  Bepul Maslahat
                  <div className="group-hover:translate-x-2 transition-transform text-xl">→</div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
              </button>
              
              <a
                href="/pages/portfolio"
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 px-12 py-6 rounded-2xl font-bold text-lg transition-all duration-500 transform-gpu hover:scale-110 hover:-translate-y-2"
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl group-hover:animate-spin">💼</span>
                  Ishlarimni Ko'ring
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Services Grid */}
      <section className="py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-xl text-blue-800 dark:text-blue-300 px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg">
              <span className="text-xl animate-pulse">🛠️</span>
              Services Portfolio
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-6">
              <span className="text-blue-600 dark:text-cyan-400">Xizmatlar</span>
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
              Har bir xizmat - bu sizning muvaffaqiyatingiz uchun qadam
            </p>
          </div>

          {/* Enhanced Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`group perspective-1000 transform transition-all duration-700 hover:-translate-y-8 ${
                  service.popular ? 'scale-105' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-700 transform-gpu hover:scale-105 hover:rotate-y-12 border border-white/20 dark:border-slate-700/50 overflow-hidden ${
                    service.popular ? 'ring-4 ring-cyan-400/50' : ''
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {service.popular && (
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-xl font-black text-sm animate-pulse shadow-lg">
                      ⭐ POPULAR
                    </div>
                  )}

                  <div className="relative z-10 p-8">
                    {/* 3D Icon */}
                    <div className="text-6xl mb-6 group-hover:animate-bounce transform-gpu group-hover:scale-125 transition-all duration-500">
                      {service.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Price and Duration */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-xl">
                        <div className="text-sm text-gray-600 dark:text-slate-400">💰 Narx</div>
                        <div className="text-lg font-bold text-blue-600 dark:text-cyan-400">
                          {service.price}
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-xl">
                        <div className="text-sm text-gray-600 dark:text-slate-400">⏱️ Muddat</div>
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {service.duration}
                        </div>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-800 dark:text-cyan-300 text-xs px-3 py-1 rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {service.technologies.length > 3 && (
                        <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs px-3 py-1 rounded-full">
                          +{service.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <span className="flex items-center justify-center gap-2">
                        <span>👁️</span>
                        Batafsil Ko'rish
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Process Section */}
          <div className="mb-20">
            <h2 className="text-5xl font-bold text-center text-gray-800 dark:text-white mb-16">
              <span className="text-purple-600 dark:text-purple-400">Ish Jarayoni</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: 1, title: "Maslahat", desc: "Loyiha talablarini chuqur tahlil qilamiz", icon: "💬", color: "from-blue-500 to-cyan-500" },
                { step: 2, title: "Rejalashtirish", desc: "Texnik hujjatlar va kreativ dizayn", icon: "📋", color: "from-purple-500 to-pink-500" },
                { step: 3, title: "Ishlab chiqish", desc: "Professional dasturlash va test qilish", icon: "⚡", color: "from-green-500 to-emerald-500" },
                { step: 4, title: "Topshirish", desc: "To'liq sinovdan o'tkazish va ishga tushirish", icon: "🚀", color: "from-orange-500 to-red-500" },
              ].map((item, index) => (
                <div key={index} className="group text-center">
                  <div className="relative mb-8">
                    {/* Connection Line */}
                    {index < 3 && (
                      <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-slate-600 z-0"></div>
                    )}
                    
                    {/* Icon Container */}
                    <div className={`relative bg-gradient-to-r ${item.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl text-white shadow-2xl transform group-hover:scale-110 transition-all duration-500 z-10`}>
                      {item.icon}
                    </div>
                    
                    {/* Step Number */}
                    <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${item.color} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg`}>
                      {item.step}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 rounded-3xl text-white p-12 text-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20"></div>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                ></div>
              ))}
            </div>

            <div className="relative z-10">
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Loyihangizni 
                <span className="text-cyan-400"> Boshlashga Tayyormisiz?</span>
              </h2>
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                Bepul maslahat va professional loyiha bahosi uchun bog'laning
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => setShowQuoteForm(true)}
                  className="group bg-white text-purple-600 hover:bg-gray-100 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
                >
                  <span className="text-2xl group-hover:animate-bounce">💬</span>
                  Bepul Maslahat
                </button>
                <a
                  href="/pages/contact"
                  className="group border-2 border-white text-white hover:bg-white hover:text-purple-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <span className="text-2xl group-hover:animate-pulse">📞</span>
                  Bog'lanish
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-4xl mb-2">{selectedService.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedService.title}
                  </h2>
                  <p className="text-gray-600">
                    {selectedService.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Narx oralig'i</div>
                  <div className="text-lg font-bold text-blue-600">
                    {selectedService.price}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">
                    Bajarilish muddati
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {selectedService.duration}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  🔧 Xizmat imkoniyatlari:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedService.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  💻 Texnologiyalar:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedService.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setShowQuoteForm(true);
                    setFormData({
                      ...formData,
                      service: selectedService.title,
                    });
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  💬 Taklif So'rash
                </button>
                <a
                  href="/pages/contact"
                  className="flex-1 border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition text-center"
                >
                  📞 Bog'lanish
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  💬 Bepul Taklif So'rash
                </h2>
                <button
                  onClick={() => setShowQuoteForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Ismingiz"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />

                <input
                  type="tel"
                  placeholder="Telefon"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />

                <select
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  required
                >
                  <option value="">Xizmatni tanlang</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                >
                  <option value="">Budjet oralig'ini tanlang</option>
                  <option value="$500-$1000">$500 - $1000</option>
                  <option value="$1000-$3000">$1000 - $3000</option>
                  <option value="$3000-$5000">$3000 - $5000</option>
                  <option value="$5000+">$5000+</option>
                </select>

                <textarea
                  placeholder="Loyiha haqida batafsil ma'lumot..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {formLoading ? "Yuborilmoqda..." : "📤 Yuborish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuoteForm(false)}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition"
                  >
                    ❌ Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Custom Enhanced Styles */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-3deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        
        .perspective-1000 { perspective: 1000px; }
        .transform-gpu { transform: translateZ(0); }
        .rotate-y-12 { transform: rotateY(12deg); }
        
        .backdrop-blur-2xl { backdrop-filter: blur(40px); }
        .backdrop-blur-xl { backdrop-filter: blur(24px); }
      `}</style>
    </>
  );
}
