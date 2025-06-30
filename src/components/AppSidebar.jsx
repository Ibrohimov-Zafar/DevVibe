"use client";

import Link from "next/link";
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
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext"; // useEffect va useState o'rniga buni import qilamiz
import Image from "next/image";

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
  const { profile } = useProfile(); // Ma'lumotni context'dan olamiz

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 border-r border-gray-200 dark:border-slate-700 shadow-lg transition-all duration-300 md:block hidden z-40">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
                >
                  <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border dark:border-slate-600">
            <Image
              src={profile?.avatar || '/zafar.jpg'}
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-300 font-medium">
                {profile ? profile.name : 'Yuklanmoqda...'}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                {profile ? profile.email : '...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}