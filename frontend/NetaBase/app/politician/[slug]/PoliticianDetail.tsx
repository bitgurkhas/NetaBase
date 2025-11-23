"use client";

import { useState, useEffect, JSX } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Zap, Target, Star, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import api from "@/services/api";
import { Rating, Politician } from "@/types";
import PoliticianInfo from "@/components/PoliticianInfo";
import RatingsList from "@/components/rating/RatingsList";
import ErrorState from "@/components/ui/ErrorState";
import PoliticianDetailLoadingSkeleton from "@/components/ui/PoliticianDetailLoadingState";
import { useAuthStore } from "@/hooks/useAuthStore";

interface Initiative {
  title: string;
  description?: string;
}

interface PoliticianPromise {
  title: string;
  description?: string;
  status?: "completed" | "in_progress" | "pending" | "failed";
}

interface RatingsResponse {
  results?: Rating[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export default function PoliticianDetail(): JSX.Element {
  const [politician, setPolitician] = useState<Politician | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userReview, setUserReview] = useState<Rating | null>(null);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [promises, setPromises] = useState<PoliticianPromise[]>([]);
  const [hoveredScore, setHoveredScore] = useState<number>(0);

  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug as string;

  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const politicianRes = await api.get<Politician>(
          `/api/politicians/${slug}/`
        );
        setPolitician(politicianRes.data);

        const ratingsRes = await api.get<RatingsResponse | Rating[]>(
          `/api/politicians/${slug}/ratings/`
        );

        const ratingsData: Rating[] = Array.isArray(ratingsRes.data)
          ? ratingsRes.data
          : ratingsRes.data.results || [];

        setRatings(ratingsData);

        if (userId) {
          const existingReview = ratingsData.find(
            (r) => String(r.user_id) === String(userId)
          );

          if (existingReview) {
            setUserReview(existingReview);
            setScore(existingReview.score);
          }
        }

        if (
          politicianRes.data.initiatives &&
          Array.isArray(politicianRes.data.initiatives)
        ) {
          setInitiatives(politicianRes.data.initiatives);
        }
        if (
          politicianRes.data.promises &&
          Array.isArray(politicianRes.data.promises)
        ) {
          setPromises(politicianRes.data.promises);
        }
      } catch (err: unknown) {
        console.error("Error fetching data:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load politician details.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug, userId]);

  const onSubmitRating = async (selectedScore: number): Promise<void> => {
    if (!userId) {
      alert("Please log in to rate this politician");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { score: selectedScore };

      if (userReview) {
        await api.put(`/api/ratings/${userReview.id}/`, payload);
      } else {
        await api.post(`/api/politicians/${slug}/ratings/`, payload);
      }

      const ratingsRes = await api.get<RatingsResponse | Rating[]>(
        `/api/politicians/${slug}/ratings/`
      );

      const ratingsData: Rating[] = Array.isArray(ratingsRes.data)
        ? ratingsRes.data
        : ratingsRes.data.results || [];

      setRatings(ratingsData);
      setScore(selectedScore);

      const existingReview = ratingsData.find(
        (r) => String(r.user_id) === String(userId)
      );

      if (existingReview) {
        setUserReview(existingReview);
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteRating = async (): Promise<void> => {
    if (!userReview) return;

    if (!confirm("Are you sure you want to delete your rating?")) return;

    setSubmitting(true);
    try {
      await api.delete(`/api/ratings/${userReview.id}/`);

      setUserReview(null);
      setScore(0);

      const ratingsRes = await api.get<RatingsResponse | Rating[]>(
        `/api/politicians/${slug}/ratings/`
      );

      const ratingsData: Rating[] = Array.isArray(ratingsRes.data)
        ? ratingsRes.data
        : ratingsRes.data.results || [];

      setRatings(ratingsData);
    } catch (err) {
      console.error("Error deleting rating:", err);
      alert("Failed to delete rating");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClassName = (status?: string): string => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300";
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-300";
      case "pending":
        return "bg-blue-500/20 text-blue-300";
      default:
        return "bg-red-500/20 text-red-300";
    }
  };

  const formatStatus = (status?: string): string => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  };

  const calculateAverageRating = (): number => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.score, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  };

  if (loading) return <PoliticianDetailLoadingSkeleton />;
  if (error) return <ErrorState error={error} onBack={() => router.back()} />;
  if (!politician) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-300 bg-linear-to-br from-[#0a0b10] via-[#0f1118] to-[#0a0b10]">
        <p className="text-xl mb-6">Politician not found</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>
    );
  }

  const avgRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0b10] via-[#0f1118] to-[#0a0b10] text-gray-100 p-6 pb-20">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-all group"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-medium">Back</span>
      </motion.button>

      <div className="max-w-5xl mx-auto space-y-8">
        <PoliticianInfo politician={politician} />

        {avgRating > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-linear-to-br from-[#1a1d2e] to-[#0f1118] border border-yellow-500/20 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Overall Rating</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-yellow-400">{avgRating}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={star <= Math.round(avgRating) ? "text-yellow-400" : "text-gray-600"}
                        fill={star <= Math.round(avgRating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{ratings.length}</p>
                <p className="text-gray-400 text-sm">Total Ratings</p>
              </div>
            </div>
          </motion.div>
        )}

        {(initiatives.length > 0 || promises.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {initiatives.length > 0 && (
              <div className="bg-linear-to-br from-[#1a1d2e] to-[#0f1118] border border-blue-500/20 rounded-xl p-6 shadow-lg hover:shadow-blue-500/10 transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <Target size={24} className="text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Initiatives</h2>
                </div>
                <div className="space-y-3">
                  {initiatives.map((initiative, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-blue-500/5 rounded-lg border border-blue-400/10"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">
                          {initiative.title}
                        </h3>
                        {initiative.description && (
                          <p className="text-sm text-gray-400">
                            {initiative.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {promises.length > 0 && (
              <div className="bg-linear-to-br from-[#1a1d2e] to-[#0f1118] border border-green-500/20 rounded-xl p-6 shadow-lg hover:shadow-green-500/10 transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <Zap size={24} className="text-green-400" />
                  <h2 className="text-2xl font-bold text-white">Promises</h2>
                </div>
                <div className="space-y-3">
                  {promises.map((promise, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-green-500/5 rounded-lg border border-green-400/10"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">
                          {promise.title}
                        </h3>
                        {promise.description && (
                          <p className="text-sm text-gray-400 mb-2">
                            {promise.description}
                          </p>
                        )}
                        {promise.status && (
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusClassName(
                              promise.status
                            )}`}
                          >
                            {formatStatus(promise.status)}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-linear-to-br from-[#1a1d2e] to-[#0f1118] border border-purple-500/20 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Rate this Politician</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSubmitRating(star)}
                  onMouseEnter={() => setHoveredScore(star)}
                  onMouseLeave={() => setHoveredScore(0)}
                  disabled={submitting}
                  className={`transition-all ${
                    star <= (hoveredScore || score)
                      ? "text-yellow-400"
                      : "text-gray-500 hover:text-yellow-300"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Star
                    size={32}
                    fill={star <= (hoveredScore || score) ? "currentColor" : "none"}
                  />
                </motion.button>
              ))}
            </div>

            {userReview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-green-500/10 border border-green-400/30 rounded-lg"
              >
                <div>
                  <p className="text-sm text-gray-300">Your Rating</p>
                  <p className="text-lg font-semibold text-green-400">{score} out of 5 stars</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onDeleteRating}
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                  Delete
                </motion.button>
              </motion.div>
            )}

            {!userReview && (
              <p className="text-sm text-gray-400 text-center">
                {userId ? "Click on the stars to rate this politician" : "Log in to rate this politician"}
              </p>
            )}
          </div>
        </motion.div>

        <RatingsList
          ratings={ratings}
          userId={userId}
          isEditingMode={false}
          onEdit={() => {}}
        />
      </div>
    </div>
  );
}