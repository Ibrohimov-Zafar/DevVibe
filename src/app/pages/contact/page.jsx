"use client";

import Navigation from "@/components/Navbar";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast"; // Toaster'ni import qilamiz

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    service: "",
    budget: "",
  });

  const [loading, setLoading] = useState(false);
  const [activeContact, setActiveContact] = useState("form");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Xabar yuborilmoqda...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success("✅ Xabaringiz muvaffaqiyatli yuborildi!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          service: "",
          budget: "",
        });
      } else {
        toast.error(`❌ Xatolik: ${result.error || "Noma'lum xato"}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("❌ Xabarni yuborishda kutilmagan xatolik yuz berdi.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      id: "email",
      title: "Email",
      description: "Bizga yozing",
      value: "ibragimovzafar001@gmail.com",
      icon: "📧",
      color: "blue",
      action: "mailto:ibragimovzafar001@gmail.com",
    },
    {
      id: "phone",
      title: "Telefon",
      description: "Qo'ng'iroq qiling",
      value: "+998 88 000 14 29",
      icon: "📱",
      color: "green",
      action: "tel:+998901234567",
    },
    {
      id: "telegram",
      title: "Telegram",
      description: "Tezkor javob",
      value: "@Ibragimov_Zafar",
      icon: "💬",
      color: "purple",
      action: "https://t.me/Ibragimov_Zafar",
    },
    {
      id: "location",
      title: "Joylashuv",
      description: "Bizning manzil",
      value: "Toshkent, O'zbekiston",
      icon: "📍",
      color: "red",
      action: "https://maps.google.com",
    },
  ];

  const faqs = [
    {
      question: "Loyiha qancha vaqt oladi?",
      answer:
        "Loyiha murakkabligiga qarab 1-12 hafta vaqt ketishi mumkin. Oddiy landing page 1-2 hafta, murakkab web aplikatsiya 8-12 hafta.",
    },
    {
      question: "Narxlar qancha?",
      answer:
        "Narxlar loyiha murakkabligiga qarab $300 dan $10,000 gacha. Bepul maslahat va taklif uchun bog'laning.",
    },
    {
      question: "Qo'llab-quvvatlash xizmati bormi?",
      answer:
        "Ha, loyiha topshiruvdan keyin 3 oy bepul qo'llab-quvvatlash va keyin oylik xizmat to'lovi bilan.",
    },
    {
      question: "Qanday texnologiyalar ishlatiladi?",
      answer:
        "React, Next.js, Node.js, MongoDB, PostgreSQL va boshqa zamonaviy texnologiyalar.",
    },
  ];

  return (
    <>
      <Toaster position="top-center" /> {/* Bildirishnomalar uchun */}
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span>📞</span>
              Bog'lanish
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              <span className="text-gray-900 dark:text-slate-100">Keling</span>
              <br />
              Gaplashaylik
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
              Loyihangiz haqida gaplashishga tayyor. Qo'ng'iroq qiling, yozing
              yoki to'g'ridan-to'g'ri kelishingiz mumkin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Methods */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                💬 Bog'lanish Usullari
              </h2>

              <div className="space-y-4">
                {contactMethods.map((method) => (
                  <a
                    key={method.id}
                    href={method.action}
                    target={
                      method.action.startsWith("http") ? "_blank" : "_self"
                    }
                    rel={
                      method.action.startsWith("http")
                        ? "noopener noreferrer"
                        : ""
                    }
                    className={`block bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-${method.color}-500`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`text-3xl bg-${method.color}-100 p-3 rounded-full`}
                      >
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {method.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {method.description}
                        </p>
                        <p className={`font-medium text-${method.color}-600`}>
                          {method.value}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
                <h3 className="font-semibold text-gray-800 mb-4">
                  ⚡ Tezkor Ma'lumot
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-gray-600">
                      24 soat ichida javob
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-gray-600">
                      Bepul maslahat
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-gray-600">
                      Professional yondashuv
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setActiveContact("form")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      activeContact === "form"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    📝 Xabar Yuborish
                  </button>
                  <button
                    onClick={() => setActiveContact("meeting")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      activeContact === "meeting"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    📅 Uchrashuv
                  </button>
                </div>

                {activeContact === "form" ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      📝 Bizga Yozing
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                          type="text"
                          placeholder="Ismingiz *"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email manzilingiz *"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                          type="tel"
                          placeholder="Telefon raqamingiz"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.service}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              service: e.target.value,
                            })
                          }
                        >
                          <option value="">Xizmat turini tanlang</option>
                          <option value="web-development">
                            Web Development
                          </option>
                          <option value="mobile-app">Mobile App</option>
                          <option value="ecommerce">E-commerce</option>
                          <option value="api-development">
                            API Development
                          </option>
                          <option value="ui-ux-design">UI/UX Design</option>
                          <option value="consulting">Telegram Bot</option>
                          <option value="consulting">No code</option>
                          <option value="consulting">Consulting</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                          type="text"
                          placeholder="Mavzu *"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subject: e.target.value,
                            })
                          }
                          required
                        />
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.budget}
                          onChange={(e) =>
                            setFormData({ ...formData, budget: e.target.value })
                          }
                        >
                          <option value="">Budjet oralig'i</option>
                          <option value="$500-1000">$500 - $1,000</option>
                          <option value="$1000-3000">$1,000 - $3,000</option>
                          <option value="$3000-5000">$3,000 - $5,000</option>
                          <option value="$5000+">$5,000+</option>
                        </select>
                      </div>

                      <textarea
                        placeholder="Loyiha haqida batafsil yozing... *"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="5"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                      />

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "⏳ Yuborilmoqda..." : "📤 Xabar Yuborish"}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-6">📅</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Uchrashuv Belgilash
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Loyihangizni batafsil muhokama qilish uchun video call
                      yoki offline uchrashuvni rejalashtiraylik.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href="https://calendly.com/zafaribragimov"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                      >
                        📅 Online Uchrashuv
                      </a>
                      <a
                        href="tel:+998901234567"
                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                      >
                        📞 Qo'ng'iroq Qiling
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              ❓ Ko'p So'raladigan Savollar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              📍 Bizning Joylashuvimiz
            </h2>

            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Toshkent, O'zbekiston
              </h3>
              <p className="text-gray-600 mb-4">
                Bizning ofisimiz Toshkent shahrining markazida joylashgan.
                Offline uchrashuvlar uchun oldindan vaqt belgilashingiz kerak.
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
              >
                🗺️ Xaritada Ko'rish
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">⏰ Ish Vaqtlarim</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">📅 Ish Kunlari</h3>
                <p className="opacity-90">Dushanba - Juma</p>
                <p className="opacity-90">09:00 - 18:00</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📞 Tezkor Javob</h3>
                <p className="opacity-90">Email: 2 soat ichida</p>
                <p className="opacity-90">Telegram: 30 daqiqa</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🚨 Shoshilinch</h3>
                <p className="opacity-90">24/7 mavjud</p>
                <p className="opacity-90">Qo'shimcha to'lov bilan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
