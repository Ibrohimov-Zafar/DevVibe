"use client";

import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';

export default function DashboardProjects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    endDate: '',
    progress: 0,
    budget: '',
    client: '',
    technologies: '',
    team_members: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error('Loyihalarni yuklashda xatolik:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies.split(',').map(tech => tech.trim()),
          team_members: formData.team_members.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)),
          budget: parseFloat(formData.budget) || 0,
          progress: parseInt(formData.progress) || 0
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setProjects([...projects, result.data]);
        setFormData({
          name: '', description: '', status: 'planning', priority: 'medium',
          startDate: '', endDate: '', progress: 0, budget: '', client: '',
          technologies: '', team_members: ''
        });
        setShowForm(false);
        alert('✅ Loyiha muvaffaqiyatli qo\'shildi!');
      }
    } catch (error) {
      alert('❌ Xatolik yuz berdi!');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
      try {
        const response = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
          setProjects(projects.filter(project => project.id !== id));
          alert('✅ Loyiha o\'chirildi!');
        }
      } catch (error) {
        alert('❌ O\'chirishda xatolik!');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🚀 Loyihalar Boshqaruvi</h1>
              <p className="text-gray-600 mt-2">Loyihalaringizni kuzatib boring va boshqaring</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2"
            >
              ➕ Yangi Loyiha
            </button>
          </div>

          {/* Add Form */}
          {showForm && (
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">🆕 Yangi Loyiha Qo'shish</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Loyiha nomi"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Mijoz nomi"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.client}
                    onChange={(e) => setFormData({...formData, client: e.target.value})}
                  />
                </div>
                
                <textarea
                  placeholder="Loyiha tavsifi"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="planning">📋 Rejalashtirish</option>
                    <option value="in-progress">🔄 Jarayonda</option>
                    <option value="completed">✅ Tugallangan</option>
                    <option value="on-hold">⏸️ To'xtatilgan</option>
                  </select>
                  
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">🟢 Past</option>
                    <option value="medium">🟡 O'rta</option>
                    <option value="high">🔴 Yuqori</option>
                  </select>
                  
                  <input
                    type="number"
                    placeholder="Budjet ($)"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="date"
                    placeholder="Boshlanish sanasi"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                  <input
                    type="date"
                    placeholder="Tugash sanasi"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Progress (%)"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.progress}
                    onChange={(e) => setFormData({...formData, progress: e.target.value})}
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Texnologiyalar (vergul bilan ajrating)"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                />
                
                <input
                  type="text"
                  placeholder="Jamoa a'zolari (vergul bilan ajrating)"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.team_members}
                  onChange={(e) => setFormData({...formData, team_members: e.target.value})}
                />
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
                  >
                    {loading ? '⏳ Saqlanmoqda...' : '💾 Saqlash'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
                  >
                    ❌ Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                    {project.name}
                  </h3>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status === 'completed' ? '✅' :
                       project.status === 'in-progress' ? '🔄' :
                       project.status === 'on-hold' ? '⏸️' : '📋'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                      {project.priority === 'high' ? '🔴' :
                       project.priority === 'medium' ? '🟡' : '🟢'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">👤 Mijoz:</span>
                    <span className="font-medium">{project.client}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">💰 Budjet:</span>
                    <span className="font-medium">${project.budget}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">📅 Muddat:</span>
                    <span className="font-medium">
                      {new Date(project.startDate).toLocaleDateString('uz-UZ')} - 
                      {new Date(project.endDate).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies?.slice(0, 3).map((tech, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => deleteProject(project.id)}
                  className="w-full text-red-500 hover:text-red-700 text-sm font-medium py-2 border border-red-200 rounded-lg hover:bg-red-50 transition duration-200"
                >
                  🗑️ Loyihani O'chirish
                </button>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                Hali loyiha yo'q
              </h3>
              <p className="text-gray-400">
                Birinchi loyihangizni qo'shing!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
