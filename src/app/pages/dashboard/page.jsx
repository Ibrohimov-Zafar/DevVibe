"use client";

import AppSidebar from '@/components/AppSidebar';
import { useProfile } from '@/context/ProfileContext';
import { PenTool, FolderOpen, MessageSquare, Eye, ArrowRight, Edit } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-slate-100">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('border-l-4', 'bg')}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { profile } = useProfile();
  const [stats, setStats] = useState({ posts: 0, portfolio: 0, testimonials: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, portfolioRes, testimonialsRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/portfolio'),
          fetch('/api/testimonials')
        ]);

        const postsData = await postsRes.json();
        const portfolioData = await portfolioRes.json();
        const testimonialsData = await testimonialsRes.json();

        setStats({
          posts: postsData.success ? postsData.data.length : 0,
          portfolio: portfolioData.success ? portfolioData.data.length : 0,
          testimonials: testimonialsData.success ? testimonialsData.data.length : 0,
        });

        if (postsData.success) {
          setRecentPosts(postsData.data.slice(0, 5)); // Show more recent posts
        }

      } catch (error) {
        console.error("Dashboard ma'lumotlarini yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditPost = (postId) => {
    // Navigate to posts page with edit mode
    window.location.href = `/pages/dashboard/posts?edit=${postId}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <AppSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">
              Xush kelibsiz, {profile ? profile.name.split(' ')[0] : 'Admin'}!
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">
              Bu yerdan saytning barcha qismlarini boshqarishingiz mumkin.
            </p>
          </div>

          {/* Stats Grid */}
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-28 animate-pulse"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard icon={PenTool} title="Jami Postlar" value={stats.posts} color="border-blue-500" />
              <StatCard icon={FolderOpen} title="Jami Portfoliolar" value={stats.portfolio} color="border-purple-500" />
              <StatCard icon={MessageSquare} title="Jami Fikrlar" value={stats.testimonials} color="border-green-500" />
            </div>
          )}

          {/* Recent Posts and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">So'nggi Postlar</h2>
                <Link 
                  href="/pages/dashboard/posts" 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Barchasini ko'rish →
                </Link>
              </div>
              <div className="space-y-3">
                {loading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50 animate-pulse h-16"></div>
                    ))
                ) : recentPosts.length > 0 ? (
                  recentPosts.map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-700 dark:text-slate-200 line-clamp-1">{post.title}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            post.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}>
                            {post.status === 'published' ? 'Nashr qilingan' : 
                             post.status === 'draft' ? 'Qoralama' : 'Arxiv'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
                          <span>{new Date(post.created_at).toLocaleDateString('uz-UZ')}</span>
                          {post.category && <span>• {post.category}</span>}
                          {post.tags && post.tags.length > 0 && (
                            <span>• {post.tags.slice(0, 2).join(', ')}{post.tags.length > 2 ? '...' : ''}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditPost(post.id)}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition opacity-0 group-hover:opacity-100"
                          title="Tahrirlash"
                        >
                          <Edit size={16} />
                        </button>
                        {post.status === 'published' && (
                          <a
                            href={`/pages/blog/${post.slug || post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition opacity-0 group-hover:opacity-100"
                            title="Ko'rish"
                          >
                            <Eye size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <PenTool className="h-12 w-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-slate-400 mb-4">Hozircha postlar mavjud emas.</p>
                    <Link 
                      href="/pages/dashboard/posts"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <PenTool size={16} />
                      Birinchi postni yarating
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">Tezkor Amallar</h2>
              <div className="space-y-3">
                <Link href="/pages/dashboard/posts" className="flex items-center justify-between w-full p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition font-medium">
                  <span>Yangi Post Qo'shish</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/pages/dashboard/portfolio" className="flex items-center justify-between w-full p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition font-medium">
                  <span>Yangi Portfolio Qo'shish</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/pages/dashboard/testimonials" className="flex items-center justify-between w-full p-4 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 transition font-medium">
                  <span>Mijoz Fikrini Qo'shish</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/pages/dashboard/skills" className="flex items-center justify-between w-full p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition font-medium">
                  <span>Ko'nikma Qo'shish</span>
                  <ArrowRight size={18} />
                </Link>
                <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition font-medium">
                  <span>Saytni Ko'rish</span>
                  <Eye size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
