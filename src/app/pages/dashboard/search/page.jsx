"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Eye, ExternalLink, Download, Grid, List, SortAsc, SortDesc } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import Link from "next/link"; // Next.js uchun Link komponenti

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    posts: [],
    portfolio: [],
    skills: [],
    testimonials: [],
  });
  const [allData, setAllData] = useState({
    posts: [],
    portfolio: [],
    skills: [],
    testimonials: [],
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({ featured: "all", status: "all" });

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [postsRes, portfolioRes, skillsRes, testimonialsRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/portfolio"),
          fetch("/api/skills"),
          fetch("/api/testimonials"),
        ]);

        const postsData = await postsRes.json();
        const portfolioData = await portfolioRes.json();
        const skillsData = await skillsRes.json();
        const testimonialsData = await testimonialsRes.json();

        const data = {
          posts: postsData.success ? postsData.data : [],
          portfolio: portfolioData.success ? portfolioData.data : [],
          skills: skillsData.success ? skillsData.data : [],
          testimonials: testimonialsData.success ? testimonialsData.data : [],
        };
        setAllData(data);
        setSearchResults(data); // Boshida barcha ma'lumotlarni ko'rsatish
      } catch (error) {
        console.error("Error fetching all data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setSearchResults(allData); // Agar qidiruv bo'sh bo'lsa, barcha ma'lumotlarni ko'rsatish
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();

    const filteredPosts = allData.posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(lowercasedQuery) ||
        post.description?.toLowerCase().includes(lowercasedQuery) ||
        post.category?.toLowerCase().includes(lowercasedQuery)
    );

    const filteredPortfolio = allData.portfolio.filter(
      (item) =>
        item.title?.toLowerCase().includes(lowercasedQuery) ||
        item.description?.toLowerCase().includes(lowercasedQuery) ||
        item.category?.toLowerCase().includes(lowercasedQuery)
    );

    const filteredSkills = allData.skills.filter(
      (skill) =>
        skill.name?.toLowerCase().includes(lowercasedQuery) ||
        skill.description?.toLowerCase().includes(lowercasedQuery) ||
        skill.category?.toLowerCase().includes(lowercasedQuery)
    );

    const filteredTestimonials = allData.testimonials.filter(
      (testimonial) =>
        testimonial.name?.toLowerCase().includes(lowercasedQuery) ||
        testimonial.text?.toLowerCase().includes(lowercasedQuery) ||
        testimonial.position?.toLowerCase().includes(lowercasedQuery)
    );

    setSearchResults({
      posts: filteredPosts,
      portfolio: filteredPortfolio,
      skills: filteredSkills,
      testimonials: filteredTestimonials,
    });
  };

  const getAllResults = () => {
    const allResults = [
      ...searchResults.posts.map((item) => ({ ...item, type: "post" })),
      ...searchResults.portfolio.map((item) => ({ ...item, type: "portfolio" })),
      ...searchResults.skills.map((item) => ({ ...item, type: "skill" })),
      ...searchResults.testimonials.map((item) => ({ ...item, type: "testimonial" })),
    ];

    return allResults.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        case "name":
          aValue = a.title || a.name || "";
          bValue = b.title || b.name || "";
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const getFilteredResults = () => {
    const allResults = getAllResults();

    return allResults.filter((item) => {
      if (filters.featured !== "all") {
        if (filters.featured === "true" && !item.featured) return false;
        if (filters.featured === "false" && item.featured) return false;
      }

      if (filters.status !== "all" && item.status && item.status !== filters.status) {
        return false;
      }

      return true;
    });
  };

  const exportResults = () => {
    const results = getFilteredResults();
    const csvContent = convertToCSV(results);
    downloadFile(
      csvContent,
      `search-results-${new Date().toISOString().split("T")[0]}.csv`,
      "text/csv"
    );
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";

    const headers = ["Type", "Title/Name", "Description", "Category", "Status", "Date", "Featured"];
    const csvRows = [
      headers.join(","),
      ...data.map((item) => [
        item.type,
        `"${item.title || item.name || ""}"`,
        `"${(item.description || item.text || "").substring(0, 100)}..."`,
        item.category || item.position || "",
        item.status || "",
        new Date(item.createdAt || "").toLocaleDateString(),
        item.featured ? "Yes" : "No",
      ].join(",")),
    ];

    return csvRows.join("\n");
  };

  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case "post":
        return "📝";
      case "portfolio":
        return "💼";
      case "skill":
        return "⚡";
      case "testimonial":
        return "💬";
      default:
        return "📄";
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case "post":
        return "bg-blue-100 text-blue-800";
      case "portfolio":
        return "bg-purple-100 text-purple-800";
      case "skill":
        return "bg-green-100 text-green-800";
      case "testimonial":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalResults =
    searchResults.posts.length +
    searchResults.portfolio.length +
    searchResults.skills.length +
    searchResults.testimonials.length;

  return (
    <>
      <AppSidebar />
      <div className="md:ml-64 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:to-slate-800 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <SearchIcon size={16} />
              Qidiruv
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              Keng Qidiruv
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
              Postlar, portfolio, ko'nikmalar va mijozlar fikrlari bo'ylab qidiring
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Nimani qidiryapsiz?..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <SearchIcon size={20} /> Qidirish
              </button>
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              >
                {viewMode === "table" ? <Grid size={20} /> : <List size={20} />}
                <span className="hidden md:inline">{viewMode === "table" ? "Grid" : "Jadval"}</span>
              </button>
              <button
                type="button"
                onClick={exportResults}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <Download size={20} />
                <span className="hidden md:inline">Export</span>
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sana bo'yicha</option>
                <option value="name">Nom bo'yicha</option>
                <option value="type">Tur bo'yicha</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition flex items-center gap-2 dark:text-white"
              >
                {sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
                {sortOrder === "asc" ? "O‘sish" : "Kamayish"}
              </button>

              <select
                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                value={filters.featured}
                onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
              >
                <option value="all">Barcha</option>
                <option value="true">Asosiy</option>
                <option value="false">Oddiy</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">Barcha holat</option>
                <option value="published">Nashr qilingan</option>
                <option value="draft">Qoralama</option>
              </select>
            </div>
          </form>

          {/* Results Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200">
                Qidiruv Natijalari ({totalResults})
              </h2>
              {loading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{searchResults.posts.length}</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">Postlar</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{searchResults.portfolio.length}</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">Portfolio</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{searchResults.skills.length}</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">Ko'nikmalar</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{searchResults.testimonials.length}</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">Fikrlar</div>
              </div>
            </div>
          </div>

          {/* Results */}
          {viewMode === "table" ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Tur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Sarlavha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Tavsif</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Sana</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Holat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                    {getFilteredResults().map((item, index) => (
                      <tr key={`${item.type}-${item.id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getResultIcon(item.type)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultColor(item.type)}`}>
                              {item.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-slate-100 line-clamp-2">
                            {item.title || item.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                            {(item.description || item.text || item.bio || "").substring(0, 100)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-400">
                          {new Date(item.createdAt || "").toLocaleDateString("uz-UZ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {item.featured && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                ⭐ Asosiy
                              </span>
                            )}
                            {item.status && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.status === "published"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "draft"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            {item.type === "post" && item.status === "published" && (
                              <Link
                                href={`/pages/blog/${item.slug || item.id}`}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                              >
                                <Eye size={16} />
                              </Link>
                            )}
                            {item.website_url && (
                              <a
                                href={item.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 dark:text-green-400"
                              >
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredResults().map((item, index) => (
                <div
                  key={`${item.type}-${item.id}-${index}`}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getResultIcon(item.type)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultColor(item.type)}`}>
                        {item.type}
                      </span>
                    </div>
                    {item.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ TOP
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-2 line-clamp-2">
                    {item.title || item.name}
                  </h3>

                  <p className="text-gray-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                    {item.description || item.text || item.bio}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
                    <span>{new Date(item.createdAt || "").toLocaleDateString("uz-UZ")}</span>
                    <div className="flex items-center gap-2">
                      {item.type === "post" && item.status === "published" && (
                        <Link
                          href={`/pages/blog/${item.slug || item.id}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          <Eye size={16} />
                        </Link>
                      )}
                      {item.website_url && (
                        <a
                          href={item.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 dark:text-green-400"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && totalResults === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-600 dark:text-slate-300 mb-4">
                Hech narsa topilmadi
              </h3>
              <p className="text-gray-500 dark:text-slate-400 mb-8">
                {searchQuery ? `"${searchQuery}" bo'yicha natija yo'q` : "Ma'lumotlar yuklanmoqda..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}