import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Zap, Target } from "lucide-react";


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
  const [initiatives, setInitiatives] = useState([]);
  const [promises, setPromises] = useState([]);

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

        // Fetch initiatives and promises from politician detail response
        if (politicianRes.data.initiatives && Array.isArray(politicianRes.data.initiatives)) {
          setInitiatives(politicianRes.data.initiatives);
        }
        if (politicianRes.data.promises && Array.isArray(politicianRes.data.promises)) {
          setPromises(politicianRes.data.promises);
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
        
        {/* Initiatives and Promises Section */}
        {(initiatives.length > 0 || promises.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {initiatives.length > 0 && (
              <div className="bg-gradient-to-br from-[#1a1d2e] to-[#0f1118] border border-blue-500/20 rounded-xl p-6 shadow-lg hover:shadow-blue-500/10 transition-shadow">
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
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{initiative.title}</h3>
                        {initiative.description && (
                          <p className="text-sm text-gray-400">{initiative.description}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {promises.length > 0 && (
              <div className="bg-gradient-to-br from-[#1a1d2e] to-[#0f1118] border border-green-500/20 rounded-xl p-6 shadow-lg hover:shadow-green-500/10 transition-shadow">
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
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{promise.title}</h3>
                        {promise.description && (
                          <p className="text-sm text-gray-400 mb-2">{promise.description}</p>
                        )}
                        {promise.status && (
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                            promise.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                            promise.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-300' :
                            promise.status === 'pending' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {promise.status.charAt(0).toUpperCase() + promise.status.slice(1).replace('_', ' ')}
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