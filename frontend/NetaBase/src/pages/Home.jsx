import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, AlertCircle, Loader, Search, Star } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [politicians, setPoliticians] = useState([]);
  const [filteredPoliticians, setFilteredPoliticians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchPoliticians = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/politicians/`);
        if (!response.ok) throw new Error("Failed to fetch politicians");
        const data = await response.json();
        setPoliticians(data);
        setFilteredPoliticians(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching politicians:", err);
        setError(err.message || "Failed to fetch politicians");
        setPoliticians([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticians();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let filtered = [...politicians];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (politician) =>
          politician.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          politician.party_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Handle sorting
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "rating_high") {
      filtered.sort(
        (a, b) =>
          parseFloat(b.average_rating || 0) - parseFloat(a.average_rating || 0)
      );
    } else if (sortBy === "rating_low") {
      filtered.sort(
        (a, b) =>
          parseFloat(a.average_rating || 0) - parseFloat(b.average_rating || 0)
      );
    } else if (sortBy === "age_old") {
      filtered.sort((a, b) => (b.age || 0) - (a.age || 0));
    } else if (sortBy === "age_young") {
      filtered.sort((a, b) => (a.age || 0) - (b.age || 0));
    }

    setFilteredPoliticians(filtered);
  }, [searchTerm, sortBy, politicians]);

  const StarRating = ({ rating, ratedBy }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25;
    const halfStarFill = ((rating % 1) * 100).toFixed(0);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Full star
        stars.push(
          <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        // Partial star
        stars.push(
          <div key={i} className="relative inline-block">
            <Star size={20} className="text-gray-600" />
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${halfStarFill}%` }}
            >
              <Star size={20} className="fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(<Star key={i} size={20} className="text-gray-600" />);
      }
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex">{stars}</div>
        {ratedBy > 0 && (
          <span className="text-xs text-gray-400 ml-1">({ratedBy})</span>
        )}
      </div>
    );
  };

  const handleCardClick = (id) => {
    navigate(`/politician/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-400">Loading politicians...</p>
        </div>
      </div>
    );
  }

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

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-10 h-10 text-pink-600" />
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
              Nepali
              <span className="bg-linear-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                Politicians
              </span>
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
            Explore profiles and ratings of political leaders in Nepal
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-4 text-gray-600"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name or party..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-950 text-white pl-12 pr-4 py-3 sm:py-4 rounded-lg border border-gray-800 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600 transition text-sm sm:text-base placeholder-gray-600"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-950 text-white px-4 py-3 sm:py-4 rounded-lg border border-gray-800 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600 transition cursor-pointer text-sm sm:text-base"
            >
              <option value="name">Name (A-Z)</option>
              <option value="rating_high">Rating (High to Low)</option>
              <option value="rating_low">Rating (Low to High)</option>
              <option value="age_old">Age (Oldest First)</option>
              <option value="age_young">Age (Youngest First)</option>
            </select>
          </div>
        </div>

        {/* Politicians Grid */}
        {filteredPoliticians.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPoliticians.map((politician) => (
              <div
                key={politician.id}
                onClick={() => handleCardClick(politician.id)}
                className="group cursor-pointer rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-pink-600"
              >
                <div className="relative h-64 sm:h-72 bg-linear-to-br from-gray-800 to-gray-900 overflow-hidden">
                  {politician.photo ? (
                    <img
                      src={politician.photo}
                      alt={politician.name}
                      className="w-full h-full object-cover group-hover:brightness-125 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <Users size={64} className="text-gray-700" />
                    </div>
                  )}

                  {politician.average_rating > 0 && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                      <StarRating
                        rating={politician.average_rating}
                        ratedBy={politician.rated_by}
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </div>

                <div className="bg-gray-950 p-4 sm:p-6">
                  <h3 className="font-bold text-lg sm:text-xl mb-1 line-clamp-2">
                    {politician.name}
                  </h3>

                  {politician.party_name && (
                    <p className="text-pink-400 text-xs sm:text-sm font-semibold mb-3">
                      {politician.party_name}
                    </p>
                  )}

                  <div className="space-y-2 mb-4 text-xs sm:text-sm text-gray-400">
                    {politician.age && (
                      <p>
                        <span className="text-gray-300 font-medium">Age:</span>{" "}
                        {politician.age} years
                      </p>
                    )}

                    {politician.education && (
                      <p>
                        <span className="text-gray-300 font-medium">
                          Education:
                        </span>{" "}
                        {politician.education}
                      </p>
                    )}

                    {politician.party_position && (
                      <p>
                        <span className="text-gray-300 font-medium">
                          Position:
                        </span>{" "}
                        {politician.party_position}
                      </p>
                    )}
                  </div>

                  {politician.biography && (
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-4">
                      {politician.biography}
                    </p>
                  )}

                  {(politician.criminal_record || politician.criticism) && (
                    <div className="pt-3 border-t border-gray-800 space-y-1 text-xs">
                      {politician.criminal_record && (
                        <p className="text-red-400">
                          <span className="font-semibold">Record:</span>{" "}
                          {politician.criminal_record}
                        </p>
                      )}
                      {politician.criticism && (
                        <p className="text-yellow-400">
                          <span className="font-semibold">Criticism:</span>{" "}
                          {politician.criticism}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              No politicians found matching your search.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
