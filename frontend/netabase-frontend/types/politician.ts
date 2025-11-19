export interface Politician {
  slug: string;
  name: string;
  photo?: string;
  party_name?: string;
  age?: number;
  views?: number;
  average_rating?: string | number;
  rated_by?: number;
  biography?: string;
  previous_party_history?: string;
  location?: string;
  party_position?: string;
  education?: string;
  criminal_record?: string;
  criticism?: string;
  is_active?: boolean;
}

export interface PoliticiansApiResponse {
  results: Politician[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface PaginationState {
  count: number;
  next: string | null;
  previous: string | null;
}

export type SortOption = 
  | "name" 
  | "name_desc" 
  | "rating_high" 
  | "rating_low" 
  | "age_old" 
  | "age_young";

export interface PoliticianInfoProps {
  politician: Politician;
}