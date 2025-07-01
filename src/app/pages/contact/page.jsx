"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    service: "Web Development",
    budget: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(
          "Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz."
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          service: "Web Development",
          budget: "",
          message: "",
        });
      } else {
        setError(
          result.error ||
            "Xabar yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring."
        );
      }
    } catch (err) {
      setError("Server bilan bog'lanishda xatolik. Internet ulanishingizni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  // On-scroll animation effect
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
  }, []);

  return (
    <>
      <Navigation />
      <div className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center text-center pt-20 px-4 animate-fade-in">
          <div className="absolute inset-0 bg-grid-blue-500/10 [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)]"></div>
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-black mb-4 animate-fade-in-up">
              Aloqada Bo'ling
            </h1>
            <p
              className="max-w-3xl mx-auto text-lg text-slate-300 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              G'oyalaringizni hayotga tatbiq etish uchun shu yerdaman. Keling,
              loyihangizni muhokama qilamiz va ajoyib natijalarga erishamiz.
            </p>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Info */}
            <div className="animate-on-scroll animate-fade-in-right">
              <h2 className="text-3xl font-bold mb-8 text-cyan-400">
                Bog'lanish Ma'lumotlari
              </h2>
              <p className="text-slate-300 mb-12">
                Savollaringiz bormi yoki loyiha taklif qilmoqchimisiz? Quyidagi
                ma'lumotlar orqali men bilan bog'laning yoki formani to'ldiring.
              </p>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-4 rounded-full text-cyan-400 text-2xl">
                    📧
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Elektron Pochta</h3>
                    <a
                      href="mailto:ibragimovzafar001@gmail.com"
                      className="text-slate-300 hover:text-cyan-400 transition-colors"
                    >
                      ibragimovzafar001@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-4 rounded-full text-cyan-400 text-2xl">
                    📱
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Telefon</h3>
                    <a
                      href="tel:+998880001429"
                      className="text-slate-300 hover:text-cyan-400 transition-colors"
                    >
                      +998 88 000 14 29
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-4 rounded-full text-cyan-400 text-2xl">
                    💬
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Telegram</h3>
                    <a
                      href="https://t.me/zafaribragimov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-cyan-400 transition-colors"
                    >
                      @zafaribragimov
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-4 rounded-full text-cyan-400 text-2xl">
                    📍
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Manzil</h3>
                    <p className="text-slate-300">Toshkent, O'zbekiston</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-slate-800/50 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl shadow-blue-500/10 animate-on-scroll animate-fade-in-left">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Ismingiz
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Email Manzilingiz
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Xizmat Turi
                    </label>
                    <select
                      name="service"
                      id="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all appearance-none"
                    >
                      <option>Web Development</option>
                      <option>Mobile Development</option>
                      <option>UI/UX Design</option>
                      <option>Telegram Bot</option>
                      <option>Boshqa</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="budget"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Byudjet (ixtiyoriy)
                    </label>
                    <input
                      type="text"
                      name="budget"
                      id="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Mavzu
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Xabar
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Yuborilmoqda...
                      </>
                    ) : (
                      <>
                        <span className="group-hover:animate-bounce">🚀</span>
                        Xabarni Yuborish
                      </>
                    )}
                  </button>
                </div>
              </form>
              {success && (
                <div className="mt-6 text-center bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}
              {error && (
                <div className="mt-6 text-center bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <style jsx global>{`
        .bg-grid-blue-500\/10::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-on-scroll {
          opacity: 0;
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .animate-on-scroll.animate-fade-in-left {
          transform: translateX(50px);
        }
        .animate-on-scroll.animate-fade-in-right {
          transform: translateX(-50px);
        }

        .animate-on-scroll.is-visible {
          opacity: 1;
          transform: translate(0, 0);
        }

        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
      `}</style>
    </>
  );
} 