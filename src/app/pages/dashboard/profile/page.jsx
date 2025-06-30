"use client";

import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';
import toast, { Toaster } from 'react-hot-toast';
import { Save, Linkedin, Github, Twitter, Send, Instagram } from 'lucide-react';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/profile');
                const result = await response.json();
                if (result.success) {
                    setProfile(result.data);
                } else {
                    toast.error('Profil ma\'lumotlarini yuklashda xatolik.');
                }
            } catch (error) {
                console.error("Profil yuklashda xatolik:", error);
                toast.error('Server bilan bog\'lanishda xatolik.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        const loadingToast = toast.loading('Saqlanmoqda...');
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });
            const result = await response.json();
            toast.dismiss(loadingToast);
            if (result.success) {
                toast.success('Profil muvaffaqiyatli saqlandi!');
            } else {
                toast.error(result.error || 'Saqlashda xatolik yuz berdi.');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Saqlashda xatolik:", error);
            toast.error('Server bilan bog\'lanishda xatolik.');
        } finally {
            setSaving(false);
        }
    };

    if (loading || !profile) {
        return (
            <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
                <AppSidebar />
                <div className="flex-1 ml-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
            <AppSidebar />
            <Toaster position="top-center" />
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">👤 Profilni Tahrirlash</h1>
                            <p className="text-gray-600 dark:text-slate-400 mt-2">Shaxsiy ma'lumotlaringizni yangilang.</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 space-y-8">
                        {/* Asosiy ma'lumotlar */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">To'liq Ism</label>
                                <input type="text" name="name" id="name" value={profile.name || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600" />
                            </div>
                            <div>
                                <label htmlFor="profession" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Kasbingiz (Masalan, Fullstack Developer)</label>
                                <input type="text" name="profession" id="profession" value={profile.profession || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label>
                                <input type="email" name="email" id="email" value={profile.email || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600" />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Joylashuv</label>
                                <input type="text" name="location" id="location" value={profile.location || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600" />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Avatar Rasmi (URL)</label>
                                <input type="text" name="avatar" id="avatar" value={profile.avatar || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600" />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Biografiya</label>
                                <textarea name="bio" id="bio" rows="4" value={profile.bio || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600"></textarea>
                            </div>
                        </div>

                        {/* Ijtimoiy tarmoqlar */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">Ijtimoiy Tarmoqlar</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <label htmlFor="social_github" className="w-32 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"><Github size={18}/> GitHub</label>
                                    <input type="text" name="social_github" id="social_github" placeholder="GitHub URL" value={profile.social_github || ''} onChange={handleInputChange} className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="social_linkedin" className="w-32 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"><Linkedin size={18}/> LinkedIn</label>
                                    <input type="text" name="social_linkedin" id="social_linkedin" placeholder="LinkedIn URL" value={profile.social_linkedin || ''} onChange={handleInputChange} className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="social_twitter" className="w-32 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"><Twitter size={18}/> Twitter</label>
                                    <input type="text" name="social_twitter" id="social_twitter" placeholder="Twitter URL" value={profile.social_twitter || ''} onChange={handleInputChange} className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="social_telegram" className="w-32 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"><Send size={18}/> Telegram</label>
                                    <input type="text" name="social_telegram" id="social_telegram" placeholder="Telegram URL yoki username" value={profile.social_telegram || ''} onChange={handleInputChange} className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="social_instagram" className="w-32 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"><Instagram size={18}/> Instagram</label>
                                    <input type="text" name="social_instagram" id="social_instagram" placeholder="Instagram URL yoki username" value={profile.social_instagram || ''} onChange={handleInputChange} className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}