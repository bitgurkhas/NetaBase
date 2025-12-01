"use client";

import { useEffect, useState } from "react";
import { Newspaper, AlertCircle, Calendar, Building2, User, ExternalLink } from "lucide-react";
import axios from "axios";
import { SkeletonLoaderPage, SkeletonCard } from "@/components/ui/SkeletonLoader";

interface NewsItem {
  title?: string;
  heading?: string;
  description?: string;
  link: string;
  image?: string;
  image_url?: string;
  category?: string;
  pub_date?: string;
  published_date?: string;
  source?: string;
  author?: string;
}

interface NewsApiResponse {
  count: number;
  results: NewsItem[];
}

export default function PoliticsNewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "with-image">("all");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get<NewsApiResponse>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/`
        );
        setNews(response.data.results || []);
      } catch (err) {
        console.error("Error fetching news");
        setError("Failed to load politics news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const stripHtml = (html: string): string => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateText = (text: string, length: number = 150): string => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString || dateString === "N/A") return "Recently";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <SkeletonLoaderPage
        itemCount={12}
        showSearch={false}
        title="Political"
        subtitle="Latest updates and stories from Nepal's political landscape"
        showFilters={true}
      />
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center p-6 bg-red-900/20 border border-red-700 rounded-lg max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-400 mb-2">Error</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  const filteredNews = news.filter((item) => {
    if (filter === "with-image") {
      return item.image || item.image_url;
    }
    return true;
  });

  // ============================================
  // MAIN UI
  // ============================================
  return (
    <main className="bg-black text-white min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-8 lg:py-10">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Newspaper className="w-10 h-10 text-pink-600" />
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
              Political
              <span className="bg-linear-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent"> News</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
            Latest updates and stories from Nepal's political landscape
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 rounded-lg border transition-all duration-300 text-sm sm:text-base ${
              filter === "all"
                ? "bg-pink-600 border-pink-600 text-white"
                : "bg-gray-950 border-gray-800 text-gray-400 hover:border-pink-600 hover:text-white"
            }`}
          >
            All News ({news.length})
          </button>

          <button
            onClick={() => setFilter("with-image")}
            className={`px-6 py-3 rounded-lg border transition-all duration-300 text-sm sm:text-base ${
              filter === "with-image"
                ? "bg-pink-600 border-pink-600 text-white"
                : "bg-gray-950 border-gray-800 text-gray-400 hover:border-pink-600 hover:text-white"
            }`}
          >
            With Images ({news.filter(item => item.image || item.image_url).length})
          </button>
        </div>

        {/* Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredNews.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-pink-600"
              >
                {/* Image */}
                <div className="relative h-64 sm:h-72 bg-linear-to-br from-gray-800 to-gray-900 overflow-hidden">
                  {(item.image || item.image_url) ? (
                    <img
                      src={item.image || item.image_url}
                      alt={item.title || item.heading || "News image"}
                      className="w-full h-full object-cover group-hover:brightness-125 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <Newspaper size={64} className="text-gray-700" />
                    </div>
                  )}

                  {item.category && (
                    <div className="absolute top-3 left-3 bg-pink-600 px-3 py-1 rounded-full text-xs font-semibold z-10">
                      {item.category}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </div>

                {/* Content */}
                <div className="bg-gray-950 p-4 sm:p-6">
                  <h3 className="font-bold text-lg sm:text-xl mb-3 line-clamp-2 group-hover:text-pink-400 transition-colors">
                    {item.title || item.heading}
                  </h3>

                  <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-3">
                    {truncateText(stripHtml(item.description || ""), 120)}
                  </p>

                  {/* Meta */}
                  <div className="space-y-2 mb-4 text-xs sm:text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-pink-600" />
                      <span>{formatDate(item.pub_date || item.published_date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-pink-600" />
                      <span>{item.source || "OnlineKhabar"}</span>
                    </div>

                    {item.author && (
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-pink-600" />
                        <span className="truncate">{item.author}</span>
                      </div>
                    )}
                  </div>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-pink-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Read Full Story</span>
                    <ExternalLink size={16} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No political news found</p>
          </div>
        )}
      </section>
    </main>
  );
}