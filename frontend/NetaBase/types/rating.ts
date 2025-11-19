
export interface Rating {
  id: number;
  user_id: number;
  username: string | null;
  score: number;
  comment?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface UserReview {
  score: number;
  comment?: string;
}
export interface RatingsApiResponse {
  results?: Rating[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export interface ReviewSubmitParams {
  slug: string;
  userId: number | undefined;
  score: number;
  comment: string;
  userReview: Rating | null;
}

export interface ReviewSubmitSetters {
  setSubmitting: (value: boolean) => void;
  setRatings: (ratings: Rating[]) => void;
  setUserReview: (review: Rating | null) => void;
  setIsEditingMode: (value: boolean) => void;
}

export interface ReviewDeleteParams {
  slug: string;
  userReview: Rating | null;
}

export interface ReviewDeleteSetters {
  setRatings: (ratings: Rating[]) => void;
  setUserReview: (review: Rating | null) => void;
  setScore: (score: number) => void;
  setComment: (comment: string) => void;
  setIsEditingMode: (value: boolean) => void;
}

export interface RatingsListProps {
  ratings: Rating[];
  userId: number | undefined;
  isEditingMode: boolean;
  onEdit: () => void;
}
