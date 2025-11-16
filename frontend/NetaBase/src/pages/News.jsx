// NewsWidget.jsx
import React, { useEffect, useState } from "react";
import "../style/News.css";

export default function PoliticsNewsWidget() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:8000/api/news/ratopati-politics/")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setNews(data.data || []);
        } else {
          setError(data.error || "Failed to fetch news");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setError("Failed to load politics news");
        setLoading(false);
      });
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
      {/* Header */}
      <div className="news-widget-header">
        <div className="header-content">
          <div className="header-icon">📰</div>
          <div className="header-text">
            <h1>Nepali <span>Politics</span></h1>
            <p>Explore the latest political news and updates from Nepal</p>
          </div>
        </div>
        <div className="article-count">{news.length} Articles</div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All News
        </button>
        <button
          className={`filter-btn ${filter === "with-image" ? "active" : ""}`}
          onClick={() => setFilter("with-image")}
        >
          With Images
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
              {/* Image Section */}
              {(item.image || item.image_url) && (
                <div className="news-card-image">
                  <img
                    src={item.image || item.image_url}
                    alt={item.title}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="image-overlay"></div>
                </div>
              )}

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
                  {truncateText(stripHtml(item.description), 150)}
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