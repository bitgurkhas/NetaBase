"use client";

import { useState, useEffect, useRef, ChangeEvent, JSX } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Users,
  AlertCircle,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import axios, { AxiosError } from "axios";
import {
  SortOption,
  PoliticiansApiResponse,
  StarRatingProps,
} from "@/types";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { usePoliticiansStore } from "@/store/usePoliticiansStore";

export default function Home(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const pageSize: number = 12;

  // Get params from URL
  const urlPage = parseInt(searchParams.get("page") || "1");
  const urlSearch = searchParams.get("search") || "";
  const urlSort = (searchParams.get("sort") || "name") as SortOption;

  // Local state for input
  const [searchInput, setSearchInput] = useState<string>(urlSearch);

  // Zustand store for data and cache
  const {
    politicians,
    pagination,
    loading,
    error,
    setPoliticians,
    setPagination,
    setLoading,
    setError,
    getCachedData,
    setCachedData,
    clearCache,
    reset,
  } = usePoliticiansStore();

  // Update URL with new params
  const updateURL = (page: number, search: string, sort: SortOption) => {
    const params = new URLSearchParams();
    
    if (page > 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (sort !== "name") params.set("sort", sort);
    
    const queryString = params.toString();
    const newURL = queryString ? `/?${queryString}` : "/";
    
    router.push(newURL, { scroll: false });
  };

  // Fetch politicians with caching
  useEffect(() => {
    const fetchPoliticians = async (): Promise<void> => {
      try {
        const params = new URLSearchParams();
        params.append("page_size", pageSize.toString());
        params.append("page", urlPage.toString());

        if (urlSearch.trim()) {
          params.append("search", urlSearch.trim());
        }

        const orderingMap: Record<SortOption, string> = {
          name: "name",
          name_desc: "-name",
          rating_high: "-average_rating_annotated",
          rating_low: "average_rating_annotated",
          age_old: "-age",
          age_young: "age",
        };
        params.append("ordering", orderingMap[urlSort] || "name");

        const cacheKey = params.toString();
        const cached = getCachedData(cacheKey);

        // Check if we have valid cached data
        if (cached) {
          setPoliticians(cached.data);
          setPagination(cached.pagination);
          setError(null);
          setLoading(false);
          return;
        }

        setLoading(true);

        const url: string = `${baseUrl}/api/politicians/?${params.toString()}`;
        const response = await axios.get<PoliticiansApiResponse>(url);
        const data = response.data;

        const results = data.results || [];
        const paginationData = {
          count: data.count || 0,
          next: data.next || null,
          previous: data.previous || null,
        };

        // Cache the response
        setCachedData(cacheKey, results, paginationData);

        setPoliticians(results);
        setPagination(paginationData);
        setError(null);
      } catch (err) {
        console.error("Error fetching politicians:", err);
        const errorMessage =
          err instanceof AxiosError
            ? err.message
            : "Failed to fetch politicians";
        setError(errorMessage);
        setPoliticians([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticians();
  }, [
    baseUrl,
    urlSearch,
    urlSort,
    urlPage,
    getCachedData,
    setCachedData,
    setPoliticians,
    setPagination,
    setError,
    setLoading,
  ]);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const handleSearchSubmit = (): void => {
    updateURL(1, searchInput, urlSort);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleCardClick = (slug: string): void => {
    router.push(`/politician/${slug}`);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchInput(e.target.value);
    if (searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  };

  const handleClearSearch = (): void => {
    setSearchInput("");
    updateURL(1, "", urlSort);
    clearCache();
  };

  const handleSortChange = (newSort: SortOption): void => {
    updateURL(1, urlSearch, newSort);
  };

  const handlePreviousPage = (): void => {
    if (pagination.previous && urlPage > 1) {
      updateURL(urlPage - 1, urlSearch, urlSort);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = (): void => {
    if (pagination.next) {
      updateURL(urlPage + 1, urlSearch, urlSort);
      window.scrollTo(0, 0);
    }
  };

  const totalPages: number = Math.ceil(pagination.count / pageSize);

  // Star Rating Component
  const StarRating = ({ rating, ratedBy }: StarRatingProps): JSX.Element => {
    const stars: JSX.Element[] = [];
    const numRating: number = parseFloat(rating.toString()) || 0;
    const fullStars: number = Math.floor(numRating);
    const hasHalfStar: boolean = numRating % 1 >= 0.25;
    const halfStarFill: string = ((numRating % 1) * 100).toFixed(0);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
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

  // Error State
  if (error && !loading) {
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

  // Main UI
  return (
    <main className="bg-black text-white min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-8 lg:py-10">
        <div className="text-center mb-10 sm:mb-12">
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

        {/* Search + Sort */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-4 text-gray-600"
                  size={20}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name or party..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full bg-gray-950 text-white pl-12 pr-12 py-3 sm:py-4 rounded-lg border border-gray-800 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600 transition text-sm sm:text-base placeholder-gray-600"
                />
                {searchInput && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute cursor-pointer right-4 top-4 text-gray-600 hover:text-gray-400 transition"
                    aria-label="Clear search"
                  >
                    <X size={25} />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearchSubmit}
                className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-950 border border-gray-800 hover:border-gray-700 hover:bg-gray-900 text-white rounded-lg transition-all duration-300 flex items-center justify-center"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>

            <select
              value={urlSort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="bg-gray-950 text-white px-4 py-3 sm:py-4 rounded-lg border border-gray-800 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600 transition cursor-pointer text-sm sm:text-base"
            >
              <option value="name">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="rating_high">Rating (High to Low)</option>
              <option value="rating_low">Rating (Low to High)</option>
              <option value="age_old">Age (Oldest First)</option>
              <option value="age_young">Age (Youngest First)</option>
            </select>
          </div>
        </div>

        {/* Grid - Show skeletons when loading, otherwise show politicians */}
        {loading && !politicians.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : politicians.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {politicians.map((p) => (
                <div
                  key={p.slug}
                  onClick={() => handleCardClick(p.slug)}
                  className="group cursor-pointer rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-pink-600"
                >
                  <div className="relative h-64 sm:h-72 bg-linear-to-br from-gray-800 to-gray-900 overflow-hidden">
                    {p.photo ? (
                      <Image
                        src={p.photo}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:brightness-125 transition duration-300"
                        priority={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <Users size={64} className="text-gray-700" />
                      </div>
                    )}

                    {p.average_rating &&
                      parseFloat(p.average_rating.toString()) > 0 && (
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg z-10">
                          <StarRating
                            rating={p.average_rating}
                            ratedBy={p.rated_by || 0}
                          />
                        </div>
                      )}

                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  </div>

                  <div className="bg-gray-950 p-4 sm:p-6">
                    <h3 className="font-bold text-lg sm:text-xl mb-1 line-clamp-2">
                      {p.name}
                    </h3>

                    {p.party_name && (
                      <p className="text-pink-400 text-xs sm:text-sm font-semibold mb-3">
                        {p.party_name}
                      </p>
                    )}

                    <div className="space-y-2 mb-4 text-xs sm:text-sm text-gray-400">
                      {p.age && (
                        <p>
                          <span className="text-gray-300 font-medium">
                            Age:
                          </span>{" "}
                          {p.age} years
                        </p>
                      )}

                      {p.views !== undefined && (
                        <p>
                          <span className="text-gray-300 font-medium">
                            Views:
                          </span>{" "}
                          {p.views}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={!pagination.previous}
                  className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-pink-600 hover:bg-gray-900 transition-all duration-300 text-sm sm:text-base"
                >
                  <ChevronLeft size={20} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-2 px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-gray-400 text-sm sm:text-base">
                  <span className="font-semibold text-white">
                    {urlPage}
                  </span>
                  <span>/</span>
                  <span>{totalPages}</span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!pagination.next}
                  className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-pink-600 hover:bg-gray-900 transition-all duration-300 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
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