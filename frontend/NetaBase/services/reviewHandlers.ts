import Swal from "sweetalert2";
import api from "./api";
import { AxiosError } from "axios";
import { ErrorResponse, Rating, RatingsApiResponse, ReviewDeleteParams, ReviewDeleteSetters, ReviewSubmitParams, ReviewSubmitSetters } from "@/types";


export async function handleReviewSubmit(
  e: React.FormEvent<HTMLFormElement>,
  { slug, userId, score, comment, userReview }: ReviewSubmitParams,
  { setSubmitting, setRatings, setUserReview, setIsEditingMode }: ReviewSubmitSetters
): Promise<void> {
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
      score: parseInt(score.toString()),
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
    const { data } = await api.get<RatingsApiResponse | Rating[]>(
      `/api/politicians/${slug}/ratings/`
    );
    const ratingsData: Rating[] = Array.isArray(data) 
      ? data 
      : data.results || [];
    
    setRatings(ratingsData);

    const updatedReview = ratingsData.find(
      (r) => String(r.user_id) === String(userId)
    );
    setUserReview(updatedReview || null);
    setIsEditingMode(false);
  } catch (err) {
    console.error("Error submitting review:", err);

    // Handle specific error cases
    let errorMessage = "Failed to submit review. Please try again.";

    if (err instanceof AxiosError) {
      const errorResponse = err.response?.data as ErrorResponse | undefined;

      if (err.response?.status === 401) {
        errorMessage = "Please login to submit a review";
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to perform this action";
      } else if (errorResponse?.message) {
        errorMessage = errorResponse.message;
      } else if (errorResponse?.detail) {
        errorMessage = errorResponse.detail;
      } else if (errorResponse) {
        // Handle validation errors
        const errors = Object.entries(errorResponse)
          .map(
            ([key, value]) =>
              `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
          )
          .join("\n");
        errorMessage = errors || errorMessage;
      }
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
  { slug, userReview }: ReviewDeleteParams,
  { setRatings, setUserReview, setScore, setComment, setIsEditingMode }: ReviewDeleteSetters
): Promise<void> {
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
      const { data } = await api.get<RatingsApiResponse | Rating[]>(
        `/api/politicians/${slug}/ratings/`
      );
      const ratingsData: Rating[] = Array.isArray(data)
        ? data
        : data.results || [];
      
      setRatings(ratingsData);
      setUserReview(null);
      setScore(1);
      setComment("");
      setIsEditingMode(false);
    } catch (err) {
      console.error("Error deleting review:", err);

      let errorMessage = "Failed to delete review. Please try again.";

      if (err instanceof AxiosError) {
        const errorResponse = err.response?.data as ErrorResponse | undefined;

        if (err.response?.status === 401) {
          errorMessage = "Please login to delete your review";
        } else if (err.response?.status === 403) {
          errorMessage = "You don't have permission to delete this review";
        } else if (err.response?.status === 404) {
          errorMessage = "Review not found";
        } else if (errorResponse?.message) {
          errorMessage = errorResponse.message;
        } else if (errorResponse?.detail) {
          errorMessage = errorResponse.detail;
        }
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