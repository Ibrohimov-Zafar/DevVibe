"use client";

import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { useSearchParams } from 'next/navigation';

export default function DashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: '',
    tags: '',
    status: 'draft',
    featured: false
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchPosts();
    
    // Check if there's an edit parameter in URL
    const editId = searchParams.get('edit');
    if (editId) {
      // Find the post to edit when posts are loaded
      const postToEdit = posts.find(post => post.id.toString() === editId);
      if (postToEdit) {
        editPost(postToEdit);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // Handle edit mode when posts are loaded
    const editId = searchParams.get('edit');
    if (editId && posts.length > 0) {
      const postToEdit = posts.find(post => post.id.toString() === editId);
      if (postToEdit) {
        editPost(postToEdit);
      }
    }
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const result = await response.json();
      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error('Postlarni yuklashda xatolik:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingPost ? 'PUT' : 'POST';
      const body = editingPost 
        ? { ...formData, id: editingPost.id, tags: formData.tags.split(',').map(tag => tag.trim()) }
        : { ...formData, tags: formData.tags.split(',').map(tag => tag.trim()) };

      const response = await fetch('/api/posts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      
      if (result.success) {
        if (editingPost) {
          setPosts(posts.map(post => post.id === editingPost.id ? result.data : post));
        } else {
          setPosts([...posts, result.data]);
        }
        resetForm();
        alert(`✅ Post ${editingPost ? 'yangilandi' : 'qo\'shildi'}!`);
      }
    } catch (error) {
      alert('❌ Xatolik yuz berdi!');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', content: '', excerpt: '', image: '', 
      category: '', tags: '', status: 'draft', featured: false
    });
    setShowForm(false);
    setEditingPost(null);
  };

  const editPost = (post) => {
    setFormData({
      ...post,
      tags: post.tags?.join(', ') || ''
    });
    setEditingPost(post);
    setShowForm(true);
    
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('post-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const deletePost = async (id) => {
    if (confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
      try {
        const response = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
          setPosts(posts.filter(post => post.id !== id));
          alert('✅ Post o\'chirildi!');
        }
      } catch (error) {
        alert('❌ O\'chirishda xatolik!');
      }
    }
  };

  const filteredPosts = filter === 'all' ? posts : posts.filter(post => post.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">📝 Postlar Boshqaruvi</h1>
              <p className="text-gray-600 mt-2">Blog postlarini yarating va boshqaring</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2"
            >
              ➕ Yangi Post
            </button>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {['all', 'draft', 'published', 'archived'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  filter === status 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status === 'all' ? '🌟 Hammasi' : 
                 status === 'draft' ? '📝 Qoralama' :
                 status === 'published' ? '✅ Nashr qilingan' : '📁 Arxiv'}
              </button>
            ))}
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div id="post-form" className="bg-white p-6 rounded-xl shadow-lg mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {editingPost ? '✏️ Post Tahrirlash' : '🆕 Yangi Post Qo\'shish'}
                </h2>
                {editingPost && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    ID: {editingPost.id}
                  </span>
                )}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Post sarlavhasi"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Kategoriya"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
                
                <input
                  type="url"
                  placeholder="Rasm URL"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
                
                <textarea
                  placeholder="Qisqa tavsif"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  required
                />
                
                <textarea
                  placeholder="Post matni"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="6"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Teglar (vergul bilan ajrating)"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  />
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="draft">📝 Qoralama</option>
                    <option value="published">✅ Nashr qilish</option>
                    <option value="archived">📁 Arxiv</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  <label htmlFor="featured" className="text-sm text-gray-600">
                    ⭐ Asosiy post sifatida belgilash
                  </label>
                </div>
                
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
                    onClick={resetForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
                  >
                    ❌ Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Posts List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                {post.image && (
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' :
                      post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status === 'published' ? '✅ Nashr' :
                       post.status === 'draft' ? '📝 Qoralama' : '📁 Arxiv'}
                    </span>
                    {post.featured && <span className="text-yellow-500">⭐</span>}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags?.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString('uz-UZ')}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editPost(post)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        ✏️ Tahrir
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        🗑️ O'chir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                {filter === 'all' ? 'Hali post yo\'q' : `${filter} holatida postlar yo'q`}
              </h3>
              <p className="text-gray-400">Birinchi postingizni yarating!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
