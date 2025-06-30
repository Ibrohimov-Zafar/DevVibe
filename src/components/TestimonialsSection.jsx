"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({ theme: 'light', language: 'uz' });

  useEffect(() => {
    const abortController = new AbortController();

    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings', { signal: abortController.signal });
        if (!response.ok) throw new Error('Sozlamalarni yuklashda xatolik');
        const result = await response.json();
        if (result.success) setSettings(result.data);
        else throw new Error(result.error || 'Sozlamalarni yuklashda xatolik');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Sozlamalarni yuklashda xatolik:', err);
          toast.error(settings.language === 'uz' ? 'Sozlamalarni yuklashda xatolik' : 'Error loading settings');
        }
      }
    };

    const fetchTestimonials = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/testimonials?approved=true', { signal: abortController.signal });
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        if (result.success) {
          // Ma'lumotlarni validatsiya qilish
          const validTestimonials = result.data.filter(
            (t) =>
              t.id &&
              t.name &&
              t.text &&
              typeof t.rating === 'number' &&
              t.rating >= 0 &&
              t.rating <= 5
          );
          setTestimonials(validTestimonials);
        } else {
          throw new Error(result.error || 'Mijozlar fikrini yuklashda xatolik');
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(settings.language === 'uz' ? 'Mijozlar fikrini yuklashda xatolik' : 'Error loading testimonials');
          console.error('Mijozlar fikrini yuklashda xatolik:', err);
          toast.error(settings.language === 'uz' ? 'Mijozlar fikrini yuklashda xatolik' : 'Error loading testimonials');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    fetchTestimonials();

    return () => {
      abortController.abort(); // Komponent o'chirilganda so'rovni bekor qilish
    };
  }, [settings.language]);

  const renderStars = (rating) => {
    const safeRating = Math.min(Math.max(Math.round(rating || 0), 0), 5); // 0-5 oralig'ida ekanligiga ishonch hosil qilish
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < safeRating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 animate-pulse"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700 mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{renderSkeleton()}</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-red-500 dark:text-red-400">
          {error}
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Agar fikrlar bo'lmasa, bo'limni ko'rsatmaymiz
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {settings.language === 'uz'
              ? 'Mijozlarimiz biz haqimizda nima deydi?'
              : 'What Our Clients Say About Us?'}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-400">
            {settings.language === 'uz'
              ? "Biz bilan ishlagan ba'zi baxtli mijozlarning fikrlari."
              : 'Hear from some of our happy clients.'}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.avatar || '/default-avatar.png'}
                  alt={testimonial.name || 'Client'}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png'; // Tasvir yuklanmasa, default avatar
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-slate-200">
                    {testimonial.name || 'Anonymous'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {testimonial.position || 'Client'}
                  </p>
                </div>
              </div>
              <div className="mb-4">{renderStars(testimonial.rating)}</div>
              <blockquote className="text-gray-700 dark:text-slate-300 italic">
                <p>"{testimonial.text}"</p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;