"use client";

import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';
import toast, { Toaster } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Download, FileText, Database, Calendar, TrendingUp } from 'lucide-react';

export default function DashboardSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    posts: 0,
    portfolio: 0,
    testimonials: 0,
    skills: 0,
    contacts: 0,
    projects: 0
  });
  const [chartData, setChartData] = useState({
    postsChart: [],
    skillsChart: [],
    projectsChart: [],
    monthlyStats: []
  });

  useEffect(() => {
    fetchSettings();
    fetchDashboardData();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
      } else {
        toast.error('Sozlamalarni yuklashda xatolik');
      }
    } catch (error) {
      console.error('Sozlamalarni yuklashda xatolik:', error);
      toast.error('Server bilan bog\'lanishda xatolik');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [postsRes, portfolioRes, testimonialsRes, skillsRes, projectsRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/portfolio'),
        fetch('/api/testimonials'),
        fetch('/api/skills'),
        fetch('/api/projects')
      ]);

      const [postsData, portfolioData, testimonialsData, skillsData, projectsData] = await Promise.all([
        postsRes.json(),
        portfolioRes.json(),
        testimonialsRes.json(),
        skillsRes.json(),
        projectsRes.json()
      ]);

      // Update stats
      setStats({
        posts: postsData.success ? postsData.data.length : 0,
        portfolio: portfolioData.success ? portfolioData.data.length : 0,
        testimonials: testimonialsData.success ? testimonialsData.data.length : 0,
        skills: skillsData.success ? skillsData.data.length : 0,
        contacts: Math.floor(Math.random() * 50) + 10, // Demo data
        projects: projectsData.success ? projectsData.data.length : 0
      });

      // Prepare chart data
      if (postsData.success) {
        const postsChart = postsData.data.reduce((acc, post) => {
          const status = post.status || 'draft';
          const existing = acc.find(item => item.name === status);
          if (existing) {
            existing.value += 1;
          } else {
            acc.push({ name: status, value: 1 });
          }
          return acc;
        }, []);

        setChartData(prev => ({
          ...prev,
          postsChart: postsChart
        }));
      }

      if (skillsData.success) {
        const skillsChart = skillsData.data.reduce((acc, skill) => {
          const category = skill.category || 'Other';
          const existing = acc.find(item => item.name === category);
          if (existing) {
            existing.value += 1;
          } else {
            acc.push({ name: category, value: 1 });
          }
          return acc;
        }, []);

        setChartData(prev => ({
          ...prev,
          skillsChart: skillsChart
        }));
      }

      if (projectsData.success) {
        const projectsChart = projectsData.data.reduce((acc, project) => {
          const status = project.status || 'planning';
          const existing = acc.find(item => item.name === status);
          if (existing) {
            existing.value += 1;
          } else {
            acc.push({ name: status, value: 1 });
          }
          return acc;
        }, []);

        // Monthly stats demo data
        const monthlyStats = [
          { month: 'Jan', posts: 5, portfolio: 2, testimonials: 3 },
          { month: 'Feb', posts: 8, portfolio: 3, testimonials: 5 },
          { month: 'Mar', posts: 12, portfolio: 4, testimonials: 7 },
          { month: 'Apr', posts: 15, portfolio: 6, testimonials: 9 },
          { month: 'May', posts: 10, portfolio: 5, testimonials: 8 },
          { month: 'Jun', posts: 18, portfolio: 7, testimonials: 12 }
        ];

        setChartData(prev => ({
          ...prev,
          projectsChart: projectsChart,
          monthlyStats: monthlyStats
        }));
      }

    } catch (error) {
      console.error('Dashboard ma\'lumotlarini yuklashda xatolik:', error);
    }
  };

  const updateSetting = async (key, value) => {
    if (!settings) return;
    
    const loadingToast = toast.loading('Saqlanmoqda...');
    setLoading(true);

    // Create deep copy of settings
    const updatedSettings = JSON.parse(JSON.stringify(settings));
    
    // Handle nested updates
    const keys = key.split('.');
    if (keys.length === 2) {
      updatedSettings[keys[0]][keys[1]] = value;
    } else {
      updatedSettings[key] = value;
    }
    
    setSettings(updatedSettings);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });

      const result = await response.json();
      toast.dismiss(loadingToast);
      
      if (result.success) {
        setSettings(result.data);
        toast.success('✅ Saqlandi!');
      } else {
        toast.error(`❌ Xatolik: ${result.error}`);
        fetchSettings();
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('❌ Server bilan bog\'lanishda xatolik!');
      fetchSettings();
    } finally {
      setLoading(false);
    }
  };

  // Add export functions
  const exportToCSV = (data, filename) => {
    const csvContent = convertToCSV(data);
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  const exportToJSON = (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`✅ ${filename} yuklab olindi!`);
  };

  const generateFullReport = async () => {
    const loadingToast = toast.loading('Hisobot tayyorlanmoqda...');
    
    try {
      const [postsRes, portfolioRes, testimonialsRes, skillsRes, projectsRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/portfolio'),
        fetch('/api/testimonials'),
        fetch('/api/skills'),
        fetch('/api/projects')
      ]);

      const [postsData, portfolioData, testimonialsData, skillsData, projectsData] = await Promise.all([
        postsRes.json(),
        portfolioRes.json(),
        testimonialsRes.json(),
        skillsRes.json(),
        projectsRes.json()
      ]);

      const report = {
        generated_at: new Date().toISOString(),
        summary: {
          total_posts: postsData.success ? postsData.data.length : 0,
          total_portfolio: portfolioData.success ? portfolioData.data.length : 0,
          total_testimonials: testimonialsData.success ? testimonialsData.data.length : 0,
          total_skills: skillsData.success ? skillsData.data.length : 0,
          total_projects: projectsData.success ? projectsData.data.length : 0,
        },
        data: {
          posts: postsData.success ? postsData.data : [],
          portfolio: portfolioData.success ? portfolioData.data : [],
          testimonials: testimonialsData.success ? testimonialsData.data : [],
          skills: skillsData.success ? skillsData.data : [],
          projects: projectsData.success ? projectsData.data : [],
        }
      };

      toast.dismiss(loadingToast);
      exportToJSON(report, `full-report-${new Date().toISOString().split('T')[0]}`);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('❌ Hisobot yaratishda xatolik!');
      console.error('Error generating report:', error);
    }
  };

  const exportAnalytics = async () => {
    const analytics = {
      generated_at: new Date().toISOString(),
      stats: stats,
      charts_data: chartData,
      settings: settings
    };

    exportToJSON(analytics, `analytics-${new Date().toISOString().split('T')[0]}`);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (!settings) {
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
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">⚙️ Sozlamalar va Statistika</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">Tizim sozlamalari va dastur statistikalari</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'export', label: '📥 Ma\'lumotlarni Yuklab Olish' },
              { id: 'general', label: '🌟 Umumiy' },
              { id: 'notifications', label: '🔔 Bildirishnomalar' },
              { id: 'privacy', label: '🔒 Maxfiylik' },
              { id: 'display', label: '🎨 Ko\'rinish' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">📥 Ma'lumotlarni Yuklab Olish</h3>
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                  Dastur ma'lumotlarini turli formatlarda yuklab oling va tahlil qiling.
                </p>

                {/* Quick Export Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg">To'liq Hisobot</h4>
                        <p className="text-blue-100 text-sm">Barcha ma'lumotlar JSON formatida</p>
                      </div>
                      <Database size={32} className="opacity-80" />
                    </div>
                    <button
                      onClick={generateFullReport}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-4 rounded-lg font-semibold transition"
                    >
                      <Download size={16} className="inline mr-2" />
                      Yuklab Olish
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg">Analitika</h4>
                        <p className="text-green-100 text-sm">Statistika va chart ma'lumotlari</p>
                      </div>
                      <TrendingUp size={32} className="opacity-80" />
                    </div>
                    <button
                      onClick={exportAnalytics}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-4 rounded-lg font-semibold transition"
                    >
                      <Download size={16} className="inline mr-2" />
                      Yuklab Olish
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg">Backup</h4>
                        <p className="text-purple-100 text-sm">Zaxira nusxasi uchun</p>
                      </div>
                      <Calendar size={32} className="opacity-80" />
                    </div>
                    <button
                      onClick={() => {
                        const backupData = {
                          timestamp: new Date().toISOString(),
                          stats: stats,
                          settings: settings
                        };
                        exportToJSON(backupData, `backup-${new Date().toISOString().split('T')[0]}`);
                      }}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-4 rounded-lg font-semibold transition"
                    >
                      <Download size={16} className="inline mr-2" />
                      Yuklab Olish
                    </button>
                  </div>
                </div>

                {/* Detailed Export Options */}
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 dark:text-slate-200 mb-4">🔧 Batafsil Eksport</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Posts Export */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border dark:border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText size={20} className="text-blue-500" />
                          <span className="font-medium">Postlar ({stats.posts})</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/posts');
                              const result = await response.json();
                              if (result.success) {
                                exportToCSV(result.data, 'posts-data');
                              }
                            } catch (error) {
                              toast.error('Xatolik yuz berdi!');
                            }
                          }}
                          className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm font-medium hover:bg-blue-200 transition"
                        >
                          CSV
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/posts');
                              const result = await response.json();
                              if (result.success) {
                                exportToJSON(result.data, 'posts-data');
                              }
                            } catch (error) {
                              toast.error('Xatolik yuz berdi!');
                            }
                          }}
                          className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded text-sm font-medium hover:bg-green-200 transition"
                        >
                          JSON
                        </button>
                      </div>
                    </div>

                    {/* Portfolio Export */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border dark:border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText size={20} className="text-purple-500" />
                          <span className="font-medium">Portfolio ({stats.portfolio})</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/portfolio');
                              const result = await response.json();
                              if (result.success) {
                                exportToCSV(result.data, 'portfolio-data');
                              }
                            } catch (error) {
                              toast.error('Xatolik yuz berdi!');
                            }
                          }}
                          className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm font-medium hover:bg-blue-200 transition"
                        >
                          CSV
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/portfolio');
                              const result = await response.json();
                              if (result.success) {
                                exportToJSON(result.data, 'portfolio-data');
                              }
                            } catch (error) {
                              toast.error('Xatolik yuz berdi!');
                            }
                          }}
                          className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded text-sm font-medium hover:bg-green-200 transition"
                        >
                          JSON
                        </button>
                      </div>
                    </div>

                    {/* Skills Export */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border dark:border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText size={20} className="text-yellow-500" />
                          <span className="font-medium">Ko'nikmalar ({stats.skills})</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/skills');
                              const result = await response.json();
                              if (result.success) {
                                exportToCSV(result.data, 'skills-data');
                              }
                            } catch (error) {
                              toast.error('Xatolik yuz berdi!');
                            }
                          }}
                          className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm font-medium hover:bg-blue-200 transition"
                        >
                          CSV
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/skills');
                              const result = await response.json();
                              if (result.success) {
                                exportToJSON(result.data, 'skills-data');
                              }
                            } catch (error) {
                              toast.error('Xatolik yuz berdi!');
                            }
                          }}
                          className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded text-sm font-medium hover:bg-green-200 transition"
                        >
                          JSON
                        </button>
                      </div>
                    </div>

                    {/* Testimonials Export */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border dark:border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText size={20} className="text-green-500" />
                          <span className="font-medium">Mijozlar Fikri ({stats.testimonials})</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/testimonials');
                              const result = await response.json();
                              if (result.success) {
                                exportToCSV(result.data, 'testimonials-data');
                              }
                            } catch (error) {
                              toast.error('Xatolik yuz berdi!');
                            }
                          }}
                          className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm font-medium hover:bg-blue-200 transition"
                        >
                          CSV
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/testimonials');
                              const result = await response.json();
                              if (result.success) {
                                exportToJSON(result.data, 'testimonials-data');
                              }
                            } catch (error) {
                              toast.error('Xatolik yuz berdi!');
                            }
                          }}
                          className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded text-sm font-medium hover:bg-green-200 transition"
                        >
                          JSON
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Export History */}
                <div className="mt-6 bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 dark:text-slate-200 mb-4">📋 Eksport Ma'lumotlari</h4>
                  <div className="text-sm text-gray-600 dark:text-slate-400 space-y-2">
                    <p>• CSV formatida jadval ma'lumotlarni Excel/Google Sheets da ochish mumkin</p>
                    <p>• JSON formatida dasturlash uchun qulay strukturali ma'lumotlar</p>
                    <p>• To'liq hisobot barcha ma'lumotlarni o'z ichiga oladi</p>
                    <p>• Analitika faqat statistika va chart ma'lumotlarini export qiladi</p>
                    <p>• Backup sozlamalar va asosiy statistikani saqlaydi</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Jami Postlar</p>
                      <p className="text-3xl font-bold">{stats.posts}</p>
                    </div>
                    <div className="text-4xl opacity-80">📝</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Portfolio Loyihalari</p>
                      <p className="text-3xl font-bold">{stats.portfolio}</p>
                    </div>
                    <div className="text-4xl opacity-80">💼</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Mijozlar Fikri</p>
                      <p className="text-3xl font-bold">{stats.testimonials}</p>
                    </div>
                    <div className="text-4xl opacity-80">💬</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">Ko'nikmalar</p>
                      <p className="text-3xl font-bold">{stats.skills}</p>
                    </div>
                    <div className="text-4xl opacity-80">⚡</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-100">Kontakt Xabarlar</p>
                      <p className="text-3xl font-bold">{stats.contacts}</p>
                    </div>
                    <div className="text-4xl opacity-80">📧</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100">Loyihalar</p>
                      <p className="text-3xl font-bold">{stats.projects}</p>
                    </div>
                    <div className="text-4xl opacity-80">🚀</div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Posts Status Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">📝 Postlar Holati</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.postsChart}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.postsChart.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Skills Categories Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">⚡ Ko'nikmalar Kategoriyasi</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.skillsChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Activity */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">📈 Oylik Faollik</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="posts" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="portfolio" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="testimonials" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* System Information */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">🔧 Tizim Ma'lumotlari</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">Versiya</div>
                    <div className="font-semibold">v1.0.0</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl mb-2">🌐</div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">Framework</div>
                    <div className="font-semibold">Next.js 14</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl mb-2">🗄️</div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">Database</div>
                    <div className="font-semibold">PostgreSQL</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl mb-2">🔄</div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">Oxirgi Yangilanish</div>
                    <div className="font-semibold">Bugun</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">🌟 Umumiy Sozlamalar</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-slate-200">Mavzu</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Interfeys mavzusini tanlang</p>
                    </div>
                    <select
                      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={settings.theme}
                      onChange={(e) => updateSetting('theme', e.target.value)}
                      disabled={loading}
                    >
                      <option value="light">🌞 Yorug'</option>
                      <option value="dark">🌙 Qorong'u</option>
                      <option value="auto">⚡ Avtomatik</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-slate-200">Til</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Interfeys tilini tanlang</p>
                    </div>
                    <select
                      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={settings.language}
                      onChange={(e) => updateSetting('language', e.target.value)}
                      disabled={loading}
                    >
                      <option value="uz">🇺🇿 O'zbek</option>
                      <option value="en">🇺🇸 English</option>
                      <option value="ru">🇷🇺 Русский</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">🔔 Bildirishnoma Sozlamalari</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-slate-200">Email Bildirishnomalar</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Email orqali bildirishnomalar olish</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.notifications.email}
                        onChange={(e) => updateSetting('notifications.email', e.target.checked)}
                        disabled={loading}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-slate-200">Push Bildirishnomalar</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Brauzer orqali bildirishnomalar</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.notifications.push}
                        onChange={(e) => updateSetting('notifications.push', e.target.checked)}
                        disabled={loading}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">🔒 Maxfiylik Sozlamalari</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-slate-200">Profil Ko'rinishi</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Profilingiz kimlar tomonidan ko'rilishi</p>
                    </div>
                    <select
                      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => updateSetting('privacy.profileVisibility', e.target.value)}
                      disabled={loading}
                    >
                      <option value="public">🌍 Hammaga</option>
                      <option value="friends">👥 Do'stlarga</option>
                      <option value="private">🔒 Shaxsiy</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">🎨 Ko'rinish Sozlamalari</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-slate-200">Sahifadagi Postlar Soni</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Bir sahifada ko'rsatiladigan postlar soni</p>
                    </div>
                    <select
                      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={settings.display.postsPerPage}
                      onChange={(e) => updateSetting('display.postsPerPage', parseInt(e.target.value))}
                      disabled={loading}
                    >
                      <option value={5}>5 ta</option>
                      <option value={10}>10 ta</option>
                      <option value={20}>20 ta</option>
                      <option value={50}>50 ta</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-slate-200">Animatsiyalar</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Interfeys animatsiyalarini yoqish/o'chirish</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.display.showAnimations}
                        onChange={(e) => updateSetting('display.showAnimations', e.target.checked)}
                        disabled={loading}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-slate-700/50 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>Maslahat:</strong> Sozlamalar avtomatik ravishda saqlanadi. Ma'lumotlarni muntazam ravishda yuklab olib backup qiling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



