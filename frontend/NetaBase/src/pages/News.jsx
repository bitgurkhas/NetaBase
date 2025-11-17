import { useEffect, useState } from "react";
import axios from "axios";
import "../style/News.css";

export default function PoliticsNewsWidget() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/news/ratopati-politics/`
        );
        
        if (response.data.status === "success") {
          setNews(response.data.data || []);
        } else {
          setError(response.data.error || "Failed to fetch news");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load politics news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateText = (text, length = 150) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const formatDate = (dateString) => {
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

  if (loading) {
    return (
      <div className="news-widget loading-container">
        <div className="spinner"></div>
        <p>Loading political news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-widget error-container">
        <p className="error-text">⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="news-widget-container">
      {/* Filter Section */}
      <div className="filter-section">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All News ({news.length})
        </button>
        <button
          className={`filter-btn ${filter === "with-image" ? "active" : ""}`}
          onClick={() => setFilter("with-image")}
        >
          With Images ({news.filter(item => item.image || item.image_url).length})
        </button>
      </div>

      {/* News Grid */}
      <div className="news-grid">
        {news
          .filter((item) => {
            if (filter === "with-image") {
              return item.image || item.image_url;
            }
            return true;
          })
          .map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card"
            >
              {/* Image Section - Always Show */}
              <div className="news-card-image">
                {(item.image || item.image_url) ? (
                  <>
                    <img
                      src={item.image || item.image_url}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%231a1a1a' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='%234b5563' text-anchor='middle' dy='.3em'%3E📰%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="image-overlay"></div>
                  </>
                ) : (
                  <div className="no-image-placeholder">
                    <span>📰</span>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="news-card-content">
                {/* Category Badge */}
                <div className="category-badge">
                  {item.category && item.category !== "N/A"
                    ? item.category
                    : "Politics"}
                </div>

                {/* Title */}
                <h3 className="news-title">{item.title || item.heading}</h3>

                {/* Description */}
                <p className="news-description">
                  {truncateText(stripHtml(item.description), 120)}
                </p>

                {/* Meta Information */}
                <div className="news-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📅</span>
                    {formatDate(item.pub_date || item.published_date)}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">🏢</span>
                    {item.source || "Ratopati"}
                  </span>
                </div>

                {/* Author */}
                {item.author && item.author !== "Ratopati" && (
                  <div className="news-author">
                    <span className="author-icon">✍️</span>
                    {item.author}
                  </div>
                )}

                {/* Read More Button */}
                <div className="read-more-btn">
                  Read Full Story →
                </div>
              </div>
            </a>
          ))}
      </div>

      {/* No Results */}
      {news.filter((item) => {
        if (filter === "with-image") {
          return item.image || item.image_url;
        }
        return true;
      }).length === 0 && (
        <div className="no-results">
          <p>📭 No political news found</p>
        </div>
      )}
    </div>
  );
}