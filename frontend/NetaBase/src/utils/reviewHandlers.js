import axios from "axios";
import Swal from "sweetalert2";

export async function handleReviewSubmit(
  e,
  { token, baseUrl, slug, userId, score, comment, userReview },
  { setSubmitting, setRatings, setUserReview, setIsEditingMode }
) {
  e.preventDefault();

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Authentication Required",
      text: "You must be logged in to post a review",
      confirmButtonColor: "#2563eb",
    });
    return;
  }

  try {
    setSubmitting(true);
    const headers = { Authorization: `Bearer ${token}` };
    const payload = {
      score: parseInt(score),
      comment: comment || null,
    };

    if (userReview) {
      // Update existing review
      await axios.put(`${baseUrl}/api/ratings/${userReview.id}/`, payload, {
        headers,
      });
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Your review has been updated successfully",
        confirmButtonColor: "#10b981",
      });
    } else {
      // Create new review
      await axios.post(`${baseUrl}/api/politicians/${slug}/ratings/`, payload, {
        headers,
      });
      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Your review has been submitted successfully",
        confirmButtonColor: "#10b981",
      });
    }

    // Refresh ratings list
    const { data } = await axios.get(
      `${baseUrl}/api/politicians/${slug}/ratings/`
    );
    const ratingsData = data.results || data;
    setRatings(ratingsData);
    
    const updatedReview = ratingsData.find(
      (r) => String(r.user_id) === String(userId)
    );
    setUserReview(updatedReview);
    setIsEditingMode(false);
  } catch (err) {
    console.error("Error submitting review:", err);
    const errorMessage = err.response?.data?.message || 
                        err.response?.data?.detail || 
                        "Failed to submit review. Please try again.";
    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMessage,
      confirmButtonColor: "#ef4444",
    });
  } finally {
    setSubmitting(false);
  }
}

export async function handleReviewDelete(
  { token, baseUrl, slug, userReview },
  { setRatings, setUserReview, setScore, setComment, setIsEditingMode }
) {
  if (!userReview) return;

  const result = await Swal.fire({
    title: "Delete Review?",
    text: "Are you sure you want to delete your review? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${baseUrl}/api/ratings/${userReview.id}/`, { headers });

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your review has been deleted successfully",
        confirmButtonColor: "#10b981",
      });

      // Refresh ratings list
      const { data } = await axios.get(
        `${baseUrl}/api/politicians/${slug}/ratings/`
      );
      const ratingsData = data.results || data;
      setRatings(ratingsData);
      setUserReview(null);
      setScore(1);
      setComment("");
      setIsEditingMode(false);
    } catch (err) {
      console.error("Error deleting review:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          "Failed to delete review. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      });
    }
  }
}