import Swal from "sweetalert2";
import api from "../services/api";

export async function handleReviewSubmit(
  e,
  { slug, userId, score, comment, userReview },
  { setSubmitting, setRatings, setUserReview, setIsEditingMode }
) {
  e.preventDefault();

  // Check if user is logged in
  if (!userId) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login to submit a review",
      confirmButtonColor: "#3b82f6",
    });
    return;
  }

  try {
    setSubmitting(true);
    const payload = {
      score: parseInt(score),
      comment: comment || null,
    };

    if (userReview) {
      // Update existing review
      await api.put(`/api/ratings/${userReview.id}/`, payload);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Your review has been updated successfully",
        confirmButtonColor: "#10b981",
      });
    } else {
      // Create new review
      await api.post(`/api/politicians/${slug}/ratings/`, payload);
      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Your review has been submitted successfully",
        confirmButtonColor: "#10b981",
      });
    }

    // Refresh ratings list
    const { data } = await api.get(`/api/politicians/${slug}/ratings/`);
    const ratingsData = data.results || data;
    setRatings(ratingsData);

    const updatedReview = ratingsData.find(
      (r) => String(r.user_id) === String(userId)
    );
    setUserReview(updatedReview);
    setIsEditingMode(false);
  } catch (err) {
    console.error("Error submitting review:", err);

    // Handle specific error cases
    let errorMessage = "Failed to submit review. Please try again.";

    if (err.response?.status === 401) {
      errorMessage = "Please login to submit a review";
    } else if (err.response?.status === 403) {
      errorMessage = "You don't have permission to perform this action";
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.detail) {
      errorMessage = err.response.data.detail;
    } else if (err.response?.data) {
      // Handle validation errors
      const errors = Object.entries(err.response.data)
        .map(
          ([key, value]) =>
            `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
        )
        .join("\n");
      errorMessage = errors || errorMessage;
    }

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
  { slug, userReview },
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
      await api.delete(`/api/ratings/${userReview.id}/`);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your review has been deleted successfully",
        confirmButtonColor: "#10b981",
      });

      // Refresh ratings list
      const { data } = await api.get(`/api/politicians/${slug}/ratings/`);
      const ratingsData = data.results || data;
      setRatings(ratingsData);
      setUserReview(null);
      setScore(1);
      setComment("");
      setIsEditingMode(false);
    } catch (err) {
      console.error("Error deleting review:", err);

      let errorMessage = "Failed to delete review. Please try again.";

      if (err.response?.status === 401) {
        errorMessage = "Please login to delete your review";
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to delete this review";
      } else if (err.response?.status === 404) {
        errorMessage = "Review not found";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      });
    }
  }
}
