"use client";

import { Star, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { FormEvent } from "react";
import { Rating } from "@/types";


interface ReviewFormProps {
  userReview: Rating | null;
  isEditingMode: boolean;
  score: number;
  comment: string;
  submitting: boolean;
  onScoreChange: (score: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ReviewForm({
  userReview,
  isEditingMode,
  score,
  comment,
  submitting,
  onScoreChange,
  onCommentChange,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
}: ReviewFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        {isEditingMode
          ? "Edit Your Review"
          : userReview
          ? "Your Review"
          : "Write a Review"}
      </h2>

      {!isEditingMode && userReview ? (
        <div className="space-y-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < userReview.score
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-600"
                }
              />
            ))}
            <span className="ml-2 text-gray-400">{userReview.score}/5</span>
          </div>
          {userReview.comment && (
            <p className="text-gray-300 italic">"{userReview.comment}"</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              <Edit size={18} /> Edit Review
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl font-medium shadow-lg hover:shadow-red-500/25 transition-all"
            >
              <Trash2 size={18} /> Delete Review
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 font-medium mb-3">
              Your Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={submitting}
                  onClick={() => onScoreChange(star)}
                  className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Star
                    size={32}
                    className={
                      star <= score
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-3">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              disabled={submitting}
              rows={4}
              placeholder="Share your thoughts..."
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-md resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Submitting..."
                : userReview
                ? "Update Review"
                : "Submit Review"}
            </button>
            {isEditingMode && (
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl font-medium text-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </motion.div>
  );
}