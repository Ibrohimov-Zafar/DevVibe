"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  PenTool,
  Briefcase,
  Search,
  Settings,
  User,
  FolderOpen,
  Zap,
  MessageSquare,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

const items = [
  {
    title: "Bosh sahifa",
    url: "/pages/dashboard",
    icon: Home,
  },
  {
    title: "Postlar",
    url: "/pages/dashboard/posts",
    icon: PenTool,
  },
  {
    title: "Portfolio",
    url: "/pages/dashboard/portfolio",
    icon: FolderOpen,
  },
  {
    title: "Loyihalar",
    url: "/pages/dashboard/projects",
    icon: Briefcase,
  },
  {
    title: "Ko'nikmalar",
    url: "/pages/dashboard/skills",
    icon: Zap,
  },
  {
    title: "Mijozlar fikri",
    url: "/pages/dashboard/testimonials",
    icon: MessageSquare,
  },
  {
    title: "Tajriba Yo'li",
    url: "/pages/dashboard/experience",
    icon: TrendingUp,
  },
  {
    title: "Qidiruv",
    url: "/pages/dashboard/search",
    icon: Search,
  },
  {
    title: "Profil",
    url: "/pages/dashboard/profile",
    icon: User,
  },
  {
    title: "Sozlamalar",
    url: "/pages/dashboard/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const { profile } = useProfile();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Clear auth token from localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect to login page
      toast.success("Muvaffaqiyatli chiqish qilindi");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Chiqishda xatolik yuz berdi");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-white to-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 shadow-lg transition-all duration-300 md:block hidden z-40">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:bg-none dark:text-white">
            🚹Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Admin Panel
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.url}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
                >
                  <item.icon className="h-5 w-5 text-gray-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:bg-slate-800/50 rounded-lg p-3 border dark:border-slate-600 mb-3">
            <Image
              src={profile?.avatar || "/dev.png"}
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-sm text-gray-800 dark:text-slate-200 font-medium">
                {profile ? profile.name : "Yuklanmoqda..."}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                {profile ? profile.email : "..."}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-300"
          >
            <LogOut size={16} />
            <span>{isLoggingOut ? "Chiqilmoqda..." : "Tizimdan Chiqish"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}