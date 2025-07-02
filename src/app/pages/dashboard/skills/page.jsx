"use client";

import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

export default function SkillsPage() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [filter, setFilter] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        icon: '',
        level: 50,
        category: 'Frontend',
        description: '',
        experience: '',
        projects_count: 0,
        color: 'from-blue-400 to-blue-600',
        featured: false
    });

    const iconOptions = ['⚛️', '🔄', '🟢', '🟨', '🔷', '🐍', '🍃', '🐘', '🎨', '📂', '🔧', '📱', '🌐', '⚡', '💻'];
    
    const colorOptions = [
        { name: 'Blue', value: 'from-blue-400 to-blue-600' },
        { name: 'Purple', value: 'from-purple-400 to-purple-600' },
        { name: 'Green', value: 'from-green-400 to-green-600' },
        { name: 'Yellow', value: 'from-yellow-400 to-yellow-600' },
        { name: 'Red', value: 'from-red-400 to-red-600' },
        { name: 'Indigo', value: 'from-indigo-400 to-indigo-600' },
        { name: 'Pink', value: 'from-pink-400 to-pink-600' },
        { name: 'Gray', value: 'from-gray-400 to-gray-600' }
    ];

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/skills');
            const data = await res.json();
            if (data.success) {
                setSkills(data.data);
            } else {
                toast.error("Ko'nikmalarni yuklashda xatolik");
            }
        } catch (error) {
            console.error('Error fetching skills:', error);
            toast.error("Ko'nikmalarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        const loadingToast = toast.loading(editingSkill ? "Yangilanmoqda..." : "Qo'shilmoqda...");
        
        try {
            const method = editingSkill ? 'PUT' : 'POST';
            const body = editingSkill 
                ? { ...formData, id: editingSkill.id }
                : formData;

            const res = await fetch('/api/skills', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            
            toast.dismiss(loadingToast);
            if (data.success) {
                toast.success(editingSkill ? "Muvaffaqiyatli yangilandi!" : "Muvaffaqiyatli qo'shildi!");
                resetForm();
                fetchSkills();
            } else {
                toast.error(data.error || "Xatolik yuz berdi");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Server bilan bog'lanishda xatolik");
        } finally {
            setFormLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            icon: '',
            level: 50,
            category: 'Frontend',
            description: '',
            experience: '',
            projects_count: 0,
            color: 'from-blue-400 to-blue-600',
            featured: false
        });
        setShowForm(false);
        setEditingSkill(null);
    };

    const editSkill = (skill) => {
        setFormData(skill);
        setEditingSkill(skill);
        setShowForm(true);
    };

    const deleteSkill = async (id) => {
        if (confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
            const loadingToast = toast.loading("O'chirilmoqda...");
            try {
                const response = await fetch(`/api/skills?id=${id}`, { method: 'DELETE' });
                const result = await response.json();
                toast.dismiss(loadingToast);
                if (result.success) {
                    setSkills(skills.filter(skill => skill.id !== id));
                    toast.success('✅ Ko\'nikma o\'chirildi!');
                } else {
                    toast.error(result.error || 'O\'chirishda xatolik!');
                }
            } catch (error) {
                toast.dismiss(loadingToast);
                toast.error('❌ O\'chirishda xatolik!');
            }
        }
    };

    const filteredSkills = filter === 'all' 
        ? skills 
        : filter === 'featured' 
        ? skills.filter(skill => skill.featured)
        : skills.filter(skill => skill.category === filter);

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
            <AppSidebar />
            <Toaster position="top-center" />
            
            <div className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">⚡ Ko'nikmalar Boshqaruvi</h1>
                            <p className="text-gray-600 dark:text-slate-400 mt-2">Dasturlash tillari va texnologiyalarni boshqaring</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2"
                        >
                            <Plus size={18} />
                            {showForm ? 'Bekor qilish' : 'Yangi Ko\'nikma'}
                        </button>
                    </div>

                    {/* Filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {['all', 'featured', 'Frontend', 'Backend', 'Database', 'DevOps', 'Mobile'].map((filterType) => (
                            <button
                                key={filterType}
                                onClick={() => setFilter(filterType)}
                                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                                    filter === filterType 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                {filterType === 'all' ? '🌟 Hammasi' : 
                                 filterType === 'featured' ? '⭐ Asosiy' :
                                 filterType === 'Frontend' ? '🎨 Frontend' :
                                 filterType === 'Backend' ? '⚙️ Backend' : 
                                 filterType === 'Database' ? '🗄️ Database' :
                                 filterType === 'DevOps' ? '🔧 DevOps' : '📱 Mobile'}
                            </button>
                        ))}
                    </div>

                    {/* Add/Edit Form */}
                    {showForm && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-200 mb-4">
                                {editingSkill ? '✏️ Ko\'nikma Tahrirlash' : '🆕 Yangi Ko\'nikma Qo\'shish'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Ko'nikma nomi"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                    
                                    <select
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                        required
                                    >
                                        <option value="">Icon tanlang</option>
                                        {iconOptions.map(icon => (
                                            <option key={icon} value={icon}>{icon} {icon}</option>
                                        ))}
                                    </select>
                                    
                                    <select
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option value="Frontend">🎨 Frontend</option>
                                        <option value="Backend">⚙️ Backend</option>
                                        <option value="Database">🗄️ Database</option>
                                        <option value="DevOps">🔧 DevOps</option>
                                        <option value="Mobile">📱 Mobile</option>
                                    </select>
                                </div>
                                
                                <textarea
                                    placeholder="Ko'nikma tavsifi"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                            Darajasi ({formData.level}%)
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            className="w-full"
                                            value={formData.level}
                                            onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
                                        />
                                    </div>
                                    
                                    <input
                                        type="text"
                                        placeholder="Tajriba (masalan: 2+ years)"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                    />
                                    
                                    <input
                                        type="number"
                                        placeholder="Loyihalar soni"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        value={formData.projects_count || 0}
                                        onChange={(e) => setFormData({...formData, projects_count: e.target.value === '' ? 0 : parseInt(e.target.value)})}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Rang tanlang</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() => setFormData({...formData, color: color.value})}
                                                className={`p-3 rounded-lg bg-gradient-to-r ${color.value} text-white text-sm font-medium ${
                                                    formData.color === color.value ? 'ring-2 ring-blue-500' : ''
                                                }`}
                                            >
                                                {color.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                                    />
                                    <label htmlFor="featured" className="text-sm text-gray-600 dark:text-slate-400">
                                        ⭐ Asosiy ko'nikma sifatida belgilash
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

                    {/* Skills Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 animate-pulse">
                                    <div className="h-12 w-12 bg-gray-200 dark:bg-slate-600 rounded-full mb-4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded mb-4"></div>
                                    <div className="h-16 w-16 bg-gray-200 dark:bg-slate-600 rounded-full mx-auto mb-4"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredSkills.map((skill) => (
                                <div key={skill.id} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-slate-700">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-4xl">{skill.icon}</div>
                                            {skill.featured && (
                                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                                                    ⭐ TOP
                                                </span>
                                            )}
                                        </div>
                                        
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-2">{skill.name}</h3>
                                        <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{skill.description}</p>
                                        
                                        {/* Progress Circle */}
                                        <div className="relative w-16 h-16 mx-auto mb-4">
                                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                                                <circle
                                                    cx="32"
                                                    cy="32"
                                                    r="28"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                    className="text-gray-200 dark:text-slate-700"
                                                />
                                                <circle
                                                    cx="32"
                                                    cy="32"
                                                    r="28"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                    strokeDasharray={`${1.76 * (skill.level || 50)} ${176}`}
                                                    strokeLinecap="round"
                                                    className="text-blue-500 transition-all duration-1000"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-sm font-bold text-gray-700 dark:text-slate-300">{skill.level || 50}%</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 dark:text-slate-400">📂 Kategoriya:</span>
                                                <span className="font-medium text-gray-800 dark:text-slate-200">{skill.category || 'Frontend'}</span>
                                            </div>
                                            {skill.experience && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500 dark:text-slate-400">⏱️ Tajriba:</span>
                                                    <span className="font-medium text-gray-800 dark:text-slate-200">{skill.experience}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 dark:text-slate-400">🚀 Loyihalar:</span>
                                                <span className="font-medium text-gray-800 dark:text-slate-200">{skill.projects_count || 0}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => editSkill(skill)}
                                                className="flex-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2 px-3 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition text-sm"
                                            >
                                                <Edit size={14} className="inline mr-1" />
                                                Tahrir
                                            </button>
                                            <button
                                                onClick={() => deleteSkill(skill.id)}
                                                className="flex-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-2 px-3 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition text-sm"
                                            >
                                                <Trash2 size={14} className="inline mr-1" />
                                                O'chir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredSkills.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">⚡</div>
                            <h3 className="text-xl font-semibold text-gray-500 dark:text-slate-400 mb-2">
                                {filter === 'all' ? 'Hali ko\'nikma yo\'q' : `${filter} kategoriyasida ko'nikma yo'q`}
                            </h3>
                            <p className="text-gray-400 dark:text-slate-500 mb-4">Birinchi ko'nikmangizni qo'shing!</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
                            >
                                Ko'nikma Qo'shish
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
