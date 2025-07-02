"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For demo purposes, hardcoded credentials - replace with actual API call
      if (email === "ibragimovzafar001@gmail.com" && password === "zafar27112004") {
        // Set auth token in localStorage and cookie
        const token = "demo_token_" + Date.now();
        localStorage.setItem("auth_token", token);
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 1 week

        toast.success("Muvaffaqiyatli kirildi");
        setTimeout(() => router.push("/pages/dashboard"), 1000);
      } else {
        toast.error("Email yoki parol noto'g'ri");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Tizimga kirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <Image
              src="/devVibe.svg"
              alt="DevVibe Logo"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard Kirish
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Tizimga kirish uchun ma'lumotlaringizni kiriting
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="example@gmail.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Parol
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-70"
            >
              {loading ? "Kirish..." : "Kirish"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-2"
            >
              <span>←</span> Bosh Sahifaga Qaytish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
