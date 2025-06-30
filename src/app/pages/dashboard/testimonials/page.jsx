"use client";

import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';
import Image from 'next/image';

export default function DashboardTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    text: '',
    avatar: '',
    rating: 5,
    approved: true
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/testimonials');
      const result = await response.json();
      if (result.success) {
        setTestimonials(result.data);
      }
    } catch (error) {
      console.error('Testimonials yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const method = editingTestimonial ? 'PUT' : 'POST';
      const body = editingTestimonial 
        ? { ...formData, id: editingTestimonial.id }
        : formData;

      const response = await fetch('/api/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      
      if (result.success) {
        if (editingTestimonial) {
          setTestimonials(testimonials.map(item => item.id === editingTestimonial.id ? result.data : item));
        } else {
          setTestimonials([result.data, ...testimonials]);
        }
        resetForm();
        alert(`✅ Mijoz fikri ${editingTestimonial ? 'yangilandi' : 'qo\'shildi'}!`);
      }
    } catch (error) {
      alert('❌ Xatolik yuz berdi!');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', position: '', text: '', avatar: '', rating: 5, approved: true
    });
    setShowForm(false);
    setEditingTestimonial(null);
  };

  const editTestimonial = (testimonial) => {
    setFormData(testimonial);
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const deleteTestimonial = async (id) => {
    if (confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
      try {
        const response = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
          setTestimonials(testimonials.filter(item => item.id !== id));
          alert('✅ Mijoz fikri o\'chirildi!');
        }
      } catch (error) {
        alert('❌ O\'chirishda xatolik!');
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>⭐</span>
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <AppSidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">
              💬 Mijozlar Fikri
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2"
            >
              {showForm ? '➖ Bekor qilish' : '➕ Yangi Fikr'}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
              <h2 className="text-xl font-semibold mb-4 dark:text-slate-200">
                {editingTestimonial ? '✏️ Fikirni Tahrirlash' : '🆕 Yangi Fikr Qo\'shish'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Mijoz ismi"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Lavozim / Kompaniya"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                  />
                </div>
                
                <textarea
                  placeholder="Mijoz fikri"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  rows="4"
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    placeholder="Avatar URL"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={formData.avatar}
                    onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                  />
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 yulduz)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 yulduz)</option>
                    <option value={3}>⭐⭐⭐ (3 yulduz)</option>
                    <option value={2}>⭐⭐ (2 yulduz)</option>
                    <option value={1}>⭐ (1 yulduz)</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="approved"
                    checked={formData.approved}
                    onChange={(e) => setFormData({...formData, approved: e.target.checked})}
                  />
                  <label htmlFor="approved" className="text-sm text-gray-600 dark:text-slate-300">
                    ✅ Tasdiqlangan
                  </label>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 disabled:bg-green-400"
                  >
                    {formLoading ? '⏳ Saqlanmoqda...' : '💾 Saqlash'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
                  >
                    ❌ Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Testimonials List */}
          {loading ? (
            <div className="text-center py-12 dark:text-slate-200">Yuklanmoqda...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-500 dark:text-slate-400 mb-2">
                Hali mijozlar fikri yo'q
              </h3>
              <p className="text-gray-400 dark:text-slate-500">
                Birinchi mijoz fikrini qo'shing!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
                >
                  <div className="flex items-center mb-4">
                    {testimonial.avatar && (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-slate-200">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  <p className="text-gray-700 dark:text-slate-300 mb-4 line-clamp-3">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      testimonial.approved 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {testimonial.approved ? '✅ Tasdiqlangan' : '⏳ Kutilmoqda'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editTestimonial(testimonial)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        ✏️ Tahrirlash
                      </button>
                      <button
                        onClick={() => deleteTestimonial(testimonial.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑️ O'chirish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
