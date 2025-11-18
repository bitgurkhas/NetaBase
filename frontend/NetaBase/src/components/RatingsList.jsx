import { Star, Edit } from "lucide-react";
import { motion } from "framer-motion";

export default function RatingsList({
  ratings,
  userId,
  isEditingMode,
  onEdit,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        Ratings ({ratings.length})
      </h2>
      {ratings.length > 0 ? (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <motion.div
              key={rating.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-start"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-300">{rating.username}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < rating.score
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-600"
                      }
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">
                    {rating.score}/5
                  </span>
                </div>
                {rating.comment && (
                  <p className="mt-2 text-gray-300 italic">
                    "{rating.comment}"
                  </p>
                )}
              </div>
              {/* Only show edit button if: user is logged in, this is their review, and not already editing */}
              {userId &&
                String(rating.user_id) === String(userId) &&
                !isEditingMode && (
                  <button
                    onClick={onEdit}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm transition-colors ml-4 shrink-0"
                  >
                    <Edit size={16} /> Edit
                  </button>
                )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No ratings yet. Be the first!</p>
      )}
    </motion.div>
  );
}