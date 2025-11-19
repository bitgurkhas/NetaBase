export interface ErrorResponse {
  message?: string;
  detail?: string;
  [key: string]: any;
}

export interface StarRatingProps {
  rating: string | number;
  ratedBy: number;
}