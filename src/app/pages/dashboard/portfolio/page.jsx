"use client";

import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';
import Image from 'next/image';

export default function DashboardPortfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    website_url: '',
    github_url: '',
    featured: false,
  });

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/portfolio');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result.success) {
        setPortfolios(result.data);
      } else {
        throw new Error(result.error || 'Portfolio yuklashda xatolik');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies
            .split(',')
            .map((tech) => tech.trim())
            .filter((tech) => tech),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.success) {
        setPortfolios([result.data, ...portfolios]);
        setFormData({
          title: '',
          description: '',
          image: '',
          technologies: '',
          website_url: '',
          github_url: '',
          featured: false,
        });
        setShowForm(false);
        alert('✅ Portfolio muvaffaqiyatli qo\'shildi!'); // TODO: react-hot-toast bilan almashtiring
      } else {
        throw new Error(result.error || 'Xatolik yuz berdi!');
      }
    } catch (err) {
      alert(`❌ ${err.message}`); // TODO: react-hot-toast bilan almashtiring
    } finally {
      setFormLoading(false);
    }
  };

  const deletePortfolio = async (id) => {
    if (!confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return;

    try {
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.success) {
        setPortfolios(portfolios.filter((item) => item.id !== id));
        alert('✅ Portfolio o\'chirildi!'); // TODO: react-hot-toast bilan almashtiring
      } else {
        throw new Error(result.error || 'O\'chirishda xatolik!');
      }
    } catch (err) {
      alert(`❌ ${err.message}`); // TODO: react-hot-toast bilan almashtiring
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-12 dark:text-slate-200">Yuklanmoqda...</div>;
    }
    if (error) {
      return <div className="text-center py-12 text-red-500 dark:text-red-400">Xatolik: {error}</div>;
    }
    if (portfolios.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-500 dark:text-slate-400 mb-2">
            Hali portfolio yo'q
          </h3>
          <p className="text-gray-400 dark:text-slate-500">
            Birinchi portfolioingizni qo'shing!
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
          >
            <Image
              src={portfolio.image || '/placeholder.png'}
              alt={portfolio.title}
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-200">
                  {portfolio.title}
                </h3>
                {portfolio.featured && (
                  <span className="text-yellow-500 text-sm">⭐</span>
                )}
              </div>
              <p className="text-gray-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                {portfolio.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {portfolio.technologies?.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {portfolio.website_url && (
                    <a
                      href={portfolio.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                    >
                      🌐 Website
                    </a>
                  )}
                  {portfolio.github_url && (
                    <a
                      href={portfolio.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800 dark:text-slate-300 dark:hover:text-slate-100 text-sm"
                    >
                      📂 GitHub
                    </a>
                  )}
                </div>
                <button
                  onClick={() => deletePortfolio(portfolio.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                >
                  🗑️ O'chirish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <AppSidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">
              📁 Portfolio Boshqaruvi
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2"
            >
              {showForm ? '➖ Bekor qilish' : '➕ Yangi Portfolio'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
              <h2 className="text-xl font-semibold mb-4 dark:text-slate-200">
                🆕 Yangi Portfolio Qo'shish
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Loyiha nomi"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                  <input
                    type="url"
                    placeholder="Rasm URL"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    required
                  />
                </div>
                <textarea
                  placeholder="Loyiha tavsifi"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    placeholder="Website URL"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={formData.website_url}
                    onChange={(e) =>
                      setFormData({ ...formData, website_url: e.target.value })
                    }
                  />
                  <input
                    type="url"
                    placeholder="GitHub URL"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={formData.github_url}
                    onChange={(e) =>
                      setFormData({ ...formData, github_url: e.target.value })
                    }
                  />
                </div>
                <input
                  type="text"
                  placeholder="Texnologiyalar (vergul bilan ajrating)"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies: e.target.value })
                  }
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm text-gray-600 dark:text-slate-300"
                  >
                    ⭐ Asosiy loyiha sifatida belgilash
                  </label>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 disabled:bg-green-400"
                  >
                    {formLoading ? '⏳ Saqlanmoqda...' : '💾 Saqlash'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
                  >
                    ❌ Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          )}

          {renderContent()}
        </div>
      </div>
    </div>
  );
}