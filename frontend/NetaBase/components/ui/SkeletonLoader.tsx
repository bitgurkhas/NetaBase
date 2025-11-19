import { JSX } from "react";

// ============================================
// SKELETON CARD - Basic politician/news card
// ============================================
export const SkeletonCard = (): JSX.Element => {
  return (
    <div className="group rounded-xl overflow-hidden border border-gray-800">
      {/* Image skeleton */}
      <div className="relative h-64 sm:h-72 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-gray-700/50 to-transparent animate-shimmer"></div>
      </div>

      {/* Content skeleton */}
      <div className="bg-gray-950 p-4 sm:p-6">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-800 rounded mb-3 w-3/4"></div>

        {/* Subtitle skeleton */}
        <div className="h-4 bg-gray-800 rounded mb-4 w-1/2"></div>

        {/* Info skeletons */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-800 rounded w-2/3"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SKELETON PARTY CARD
// ============================================
export const SkeletonPartyCard = (): JSX.Element => {
  return (
    <div className="group bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
      {/* Color bar */}
      <div className="h-1 w-full bg-gray-800"></div>

      {/* Party logo area */}
      <div className="h-64 bg-slate-800 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-700/50 to-transparent animate-shimmer"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <div className="h-6 bg-gray-800 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        </div>

        {/* Members */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mb-4">
          <div className="h-4 bg-gray-800 rounded w-1/4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/4"></div>
        </div>

        {/* Button skeleton */}
        <div className="w-full h-10 bg-gray-800 rounded-lg"></div>
      </div>
    </div>
  );
};

// ============================================
// FULL PAGE SKELETON LOADER
// ============================================
interface SkeletonLoaderPageProps {
  itemCount?: number;
  showSearch?: boolean;
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
}

export const SkeletonLoaderPage = ({
  itemCount = 12,
  showSearch = true,
  title = "Nepali",
  subtitle = "Explore profiles and ratings of political leaders in Nepal",
  showFilters = false,
}: SkeletonLoaderPageProps): JSX.Element => {
  return (
    <main className="bg-black text-white min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-8 lg:py-10">
        {/* Header skeleton */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-800 rounded-full animate-pulse"></div>
            <div className="h-12 bg-gray-800 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-6 bg-gray-800 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Search and sort skeleton */}
        {showSearch && (
          <div className="mb-12 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 h-12 bg-gray-900 border border-gray-800 rounded-lg animate-pulse"></div>
              <div className="w-full sm:w-40 h-12 bg-gray-900 border border-gray-800 rounded-lg animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Filters skeleton */}
        {showFilters && (
          <div className="mb-12 flex flex-wrap gap-3 justify-center">
            <div className="h-10 bg-gray-900 border border-gray-800 rounded-lg w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-900 border border-gray-800 rounded-lg w-40 animate-pulse"></div>
          </div>
        )}

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: itemCount }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </section>
    </main>
  );
};

// ============================================
// SKELETON PARTIES PAGE
// ============================================
export const SkeletonPartiesPage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-black px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-16">
          <div className="h-12 bg-gray-800 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-800 rounded w-64 mb-6 animate-pulse"></div>
          <div className="h-1 w-24 bg-gray-800 rounded-full"></div>
        </div>

        {/* Party cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonPartyCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SIMPLE SKELETON GRID
// ============================================
interface SkeletonGridProps {
  itemCount?: number;
  type?: "card" | "party";
}

export const SkeletonGrid = ({
  itemCount = 12,
  type = "card",
}: SkeletonGridProps): JSX.Element => {
  if (type === "party") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: itemCount }).map((_, index) => (
          <SkeletonPartyCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: itemCount }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};
