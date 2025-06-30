"use client";

import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';

export default function DashboardExperience() {
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    icon: '🚀',
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/experience');
      const result = await response.json();
      if (result.success) {
        setExperiences(result.data);
      }
    } catch (error) {
      console.error('Tajriba yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const method = editingExperience ? 'PUT' : 'POST';
      const body = editingExperience ? { ...formData, id: editingExperience.id } : formData;
      const response = await fetch('/api/experience', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (result.success) {
        fetchExperiences(); // Re-fetch all experiences to get the sorted list
        resetForm();
      }
    } catch (error) {
      alert('Xatolik yuz berdi!');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ year: '', title: '', description: '', icon: '🚀' });
    setShowForm(false);
    setEditingExperience(null);
  };

  const handleEdit = (exp) => {
    setFormData(exp);
    setEditingExperience(exp);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
      try {
        const response = await fetch(`/api/experience?id=${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
          fetchExperiences();
        } else {
          alert(result.error || 'O\'chirishda xatolik!');
        }
      } catch (error) {
        alert('O\'chirishda xatolik!');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <AppSidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">📈 Tajriba Yo'li</h1>
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
              {showForm ? '➖ Bekor qilish' : '➕ Yangi Qo\'shish'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Yil (masalan, 2024)" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                  <input type="text" placeholder="Sarlavha" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                  <input type="text" placeholder="Ikona (emoji)" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <textarea placeholder="Tavsif" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" rows="3" />
                <div className="flex gap-4">
                  <button type="submit" disabled={formLoading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-green-400">
                    {formLoading ? 'Saqlanmoqda...' : 'Saqlash'}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold">Bekor qilish</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            {loading ? <p>Yuklanmoqda...</p> : (
              <ul className="space-y-4">
                {experiences.map(exp => (
                  <li key={exp.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{exp.icon}</span>
                      <div>
                        <p className="font-bold">{exp.year} - {exp.title}</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{exp.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(exp)} className="text-blue-500 hover:text-blue-700">Tahrir</button>
                      <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:text-red-700">O'chirish</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}