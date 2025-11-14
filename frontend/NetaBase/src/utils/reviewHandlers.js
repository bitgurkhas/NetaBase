import axios from "axios";
import Swal from "sweetalert2";

export async function handleReviewSubmit(
  e,
  { token, baseUrl, id, userId, score, comment, userReview },
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
      politician: parseInt(id),
      score: parseInt(score),
      comment,
    };

    if (userReview) {
      await axios.put(`${baseUrl}/ratings/${userReview.id}/`, payload, {
        headers,
      });
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Your review has been updated successfully",
        confirmButtonColor: "#10b981",
      });
    } else {
      await axios.post(`${baseUrl}/ratings/`, payload, { headers });
      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Your review has been submitted successfully",
        confirmButtonColor: "#10b981",
      });
    }

    const { data } = await axios.get(
      `${baseUrl}/ratings/politician_ratings/?politician_id=${id}`
    );
    setRatings(data);
    const updatedReview = data.find(
      (r) => String(r.user_id) === String(userId)
    );
    setUserReview(updatedReview);
    setIsEditingMode(false);
  } catch (err) {
    console.error("Error submitting review:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to submit review. Please try again.",
      confirmButtonColor: "#ef4444",
    });
  } finally {
    setSubmitting(false);
  }
}

export async function handleReviewDelete(
  { token, baseUrl, id, userReview },
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
      await axios.delete(`${baseUrl}/ratings/${userReview.id}/`, { headers });

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your review has been deleted successfully",
        confirmButtonColor: "#10b981",
      });

      const { data } = await axios.get(
        `${baseUrl}/ratings/politician_ratings/?politician_id=${id}`
      );
      setRatings(data);
      setUserReview(null);
      setScore(1);
      setComment("");
      setIsEditingMode(false);
    } catch (err) {
      console.error("Error deleting review:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete review. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    }
  }
}
