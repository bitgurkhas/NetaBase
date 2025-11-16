import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import PoliticianInfo from "../components/PoliticianInfo";
import RatingsList from "../components/RatingsList";
import ReviewForm from "../components/ReviewForm";
import {
  handleReviewSubmit,
  handleReviewDelete,
} from "../utils/reviewHandlers";

export default function PoliticianDetail() {
  const [politician, setPolitician] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [score, setScore] = useState(1);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch politician details
        const politicianRes = await axios.get(`${baseUrl}/api/politicians/${slug}/`);
        setPolitician(politicianRes.data);

        // Fetch ratings for this politician
        const ratingsRes = await axios.get(`${baseUrl}/api/politicians/${slug}/ratings/`);
        
        // Handle paginated response
        const ratingsData = ratingsRes.data.results || ratingsRes.data;
        setRatings(ratingsData);

        // Find user's existing review
        const existingReview = ratingsData.find(
          (r) => String(r.user_id) === String(userId)
        );
        
        if (existingReview) {
          setUserReview(existingReview);
          setScore(existingReview.score);
          setComment(existingReview.comment || "");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load politician details.");
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchData();
    }
  }, [slug, baseUrl, userId]);

  const onSubmit = (e) => {
    handleReviewSubmit(
      e,
      { token, baseUrl, slug, userId, score, comment, userReview },
      { setSubmitting, setRatings, setUserReview, setIsEditingMode }
    );
  };

  const onDelete = () => {
    handleReviewDelete(
      { token, baseUrl, slug, userReview },
      { setRatings, setUserReview, setScore, setComment, setIsEditingMode }
    );
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onBack={() => navigate(-1)} />;
  if (!politician) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-300 bg-linear-to-br from-[#0a0b10] via-[#0f1118] to-[#0a0b10]">
        <p className="text-xl mb-6">Politician not found</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0b10] via-[#0f1118] to-[#0a0b10] text-gray-100 p-6 pb-20">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
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
        <RatingsList
          ratings={ratings}
          token={token}
          userId={userId}
          isEditingMode={isEditingMode}
          onEdit={() => setIsEditingMode(true)}
        />
        <ReviewForm
          userReview={userReview}
          isEditingMode={isEditingMode}
          score={score}
          comment={comment}
          submitting={submitting}
          onScoreChange={setScore}
          onCommentChange={setComment}
          onSubmit={onSubmit}
          onCancel={() => setIsEditingMode(false)}
          onEdit={() => setIsEditingMode(true)}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}