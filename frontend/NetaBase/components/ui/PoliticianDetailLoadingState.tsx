import { motion } from "framer-motion";

export default function PoliticianDetailLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0b10] via-[#0f1118] to-[#0a0b10] text-gray-100 p-6 pb-20">
      {/* Back Button Skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse" />
        <div className="w-16 h-5 bg-gray-700/50 rounded animate-pulse" />
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Politician Info Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Photo Skeleton */}
            <div className="w-48 h-48 bg-gray-700/50 rounded-3xl animate-pulse shrink-0" />

            <div className="flex-1 space-y-4 w-full">
              {/* Name Skeleton */}
              <div className="space-y-2">
                <div className="h-12 bg-gray-700/50 rounded-lg animate-pulse w-3/4" />
                <div className="h-7 bg-gray-700/50 rounded-lg animate-pulse w-1/2" />
              </div>

              {/* Rating Skeleton */}
              <div className="w-24 h-10 bg-gray-700/50 rounded-2xl animate-pulse" />
            </div>
          </div>

          {/* Biography Skeleton */}
          <div className="mt-8 space-y-3">
            <div className="h-6 bg-gray-700/50 rounded animate-pulse w-32" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-700/50 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-700/50 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4" />
            </div>
          </div>

          {/* Previous Party History Skeleton */}
          <div className="mt-6 backdrop-blur-md bg-linear-to-r from-blue-900/20 to-purple-900/20 border border-white/10 rounded-2xl p-5">
            <div className="h-5 bg-gray-700/50 rounded animate-pulse w-48 mb-2" />
            <div className="h-4 bg-gray-700/50 rounded animate-pulse w-full" />
          </div>

          {/* Basic Information Skeleton */}
          <div className="mt-8">
            <div className="h-6 bg-gray-700/50 rounded animate-pulse w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Age Card */}
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-700/50 rounded animate-pulse w-12" />
                  <div className="h-6 bg-gray-700/50 rounded animate-pulse w-16" />
                </div>
              </div>

              {/* Location Card */}
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-700/50 rounded animate-pulse w-16" />
                  <div className="h-6 bg-gray-700/50 rounded animate-pulse w-32" />
                </div>
              </div>

              {/* Party Position Card */}
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 md:col-span-2">
                <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-700/50 rounded animate-pulse w-24" />
                  <div className="h-6 bg-gray-700/50 rounded animate-pulse w-48" />
                </div>
              </div>

              {/* Education Card */}
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse" />
                  <div className="h-3 bg-gray-700/50 rounded animate-pulse w-20" />
                </div>
                <div className="space-y-2 ml-8">
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-5/6" />
                </div>
              </div>
            </div>
          </div>

          {/* Concerns Skeleton */}
          <div className="mt-8 p-6 backdrop-blur-md bg-red-900/20 border border-red-500/30 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-700/50 rounded animate-pulse" />
              <div className="h-6 bg-gray-700/50 rounded animate-pulse w-24" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700/50 rounded animate-pulse w-32 mb-2" />
              <div className="space-y-2 ml-6">
                <div className="h-3 bg-gray-700/50 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-700/50 rounded animate-pulse w-4/5" />
              </div>
            </div>
          </div>

          {/* Status Badge Skeleton */}
          <div className="mt-6">
            <div className="w-32 h-8 bg-gray-700/50 rounded-full animate-pulse" />
          </div>
        </motion.div>

        {/* Initiatives Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-linear-to-br from-[#1a1d2e] to-[#0f1118] border border-blue-500/20 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gray-700/50 rounded animate-pulse" />
            <div className="h-7 bg-gray-700/50 rounded animate-pulse w-32" />
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-blue-500/5 rounded-lg border border-blue-400/10"
              >
                <div className="w-2 h-2 bg-gray-700/50 rounded-full mt-2 shrink-0 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-700/50 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-700/50 rounded animate-pulse w-full" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Promises Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-linear-to-br from-[#1a1d2e] to-[#0f1118] border border-green-500/20 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gray-700/50 rounded animate-pulse" />
            <div className="h-7 bg-gray-700/50 rounded animate-pulse w-28" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-green-500/5 rounded-lg border border-green-400/10"
              >
                <div className="w-2 h-2 bg-gray-700/50 rounded-full mt-2 shrink-0 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-700/50 rounded animate-pulse w-2/3" />
                  <div className="h-3 bg-gray-700/50 rounded animate-pulse w-full" />
                  <div className="w-24 h-6 bg-gray-700/50 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ratings List Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <div className="h-7 bg-gray-700/50 rounded animate-pulse w-48 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700/50 rounded-full animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700/50 rounded animate-pulse w-32" />
                      <div className="h-3 bg-gray-700/50 rounded animate-pulse w-24" />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className="w-5 h-5 bg-gray-700/50 rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700/50 rounded animate-pulse w-full" />
                  <div className="h-3 bg-gray-700/50 rounded animate-pulse w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Review Form Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <div className="h-7 bg-gray-700/50 rounded animate-pulse w-40 mb-6" />
          <div className="space-y-6">
            <div>
              <div className="h-4 bg-gray-700/50 rounded animate-pulse w-24 mb-3" />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="w-8 h-8 bg-gray-700/50 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-700/50 rounded animate-pulse w-32 mb-3" />
              <div className="h-24 bg-gray-700/50 rounded-lg animate-pulse" />
            </div>
            <div className="h-12 bg-gray-700/50 rounded-xl animate-pulse w-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
