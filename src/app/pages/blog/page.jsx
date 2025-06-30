"use client";

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/posts?status=published');
        const result = await response.json();
        if (result.success) {
          setPosts(result.data);
          // Extract unique categories
          const uniqueCategories = [...new Set(result.data.map(p => p.category))];
          setCategories(['all', ...uniqueCategories]);
        }
      } catch (error) {
        console.error('Blog postlarini yuklashda xatolik:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(p => p.category === filter);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:to-slate-800 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span>📝</span>
              Bizning Blog
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              <span className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                Foydali Maqolalar
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
              Dasturlash, texnologiya va dizayn olamidagi so'nggi yangiliklar va qo'llanmalar.
            </p>
          </div>

          {/* Filter */}
          <div className="flex justify-center mb-12">
            <div className="bg-white dark:bg-slate-800 rounded-full p-1 shadow-lg border dark:border-slate-700 flex flex-wrap justify-center gap-1">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                    filter === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {category === 'all' ? 'Barchasi' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/pages/blog/${post.slug}`} passHref>
                <article className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border dark:border-slate-700 flex flex-col h-full cursor-pointer">
                  {post.image && (
                    <div className="relative overflow-hidden h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-slate-400">
                      <span>📅</span>
                      <span>{new Date(post.created_at).toLocaleDateString('uz-UZ')}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-slate-200 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">
                       <div className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Batafsil o'qish
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-600 dark:text-slate-300 mb-4">
                Maqolalar topilmadi
              </h3>
              <p className="text-gray-500 dark:text-slate-400">
                Ushbu kategoriyada hozircha maqolalar mavjud emas.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
