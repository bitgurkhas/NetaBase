import { create } from 'zustand';
import { Politician, SortOption, PaginationState } from '@/types';

interface CacheEntry {
  data: Politician[];
  pagination: PaginationState;
  timestamp: number;
}

interface PoliticiansState {
  // Data
  politicians: Politician[];
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  
  // Cache
  cache: Map<string, CacheEntry>;
  
  // Actions
  setPoliticians: (politicians: Politician[]) => void;
  setPagination: (pagination: PaginationState) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Cache actions
  getCachedData: (key: string) => CacheEntry | null;
  setCachedData: (key: string, data: Politician[], pagination: PaginationState) => void;
  clearCache: () => void;
  reset: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000;

export const usePoliticiansStore = create<PoliticiansState>((set, get) => ({
  // Initial state
  politicians: [],
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
  loading: true,
  error: null,
  cache: new Map(),

  // Setters
  setPoliticians: (politicians) => set({ politicians }),
  setPagination: (pagination) => set({ pagination }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Cache methods
  getCachedData: (key) => {
    const cache = get().cache;
    const cached = cache.get(key);
    
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > CACHE_DURATION) {
      // Cache expired
      cache.delete(key);
      return null;
    }
    
    return cached;
  },

  setCachedData: (key, data, pagination) => {
    const cache = get().cache;
    cache.set(key, {
      data,
      pagination,
      timestamp: Date.now(),
    });
    set({ cache: new Map(cache) });
  },

  clearCache: () => set({ cache: new Map() }),

  reset: () => set({
    politicians: [],
    pagination: {
      count: 0,
      next: null,
      previous: null,
    },
    loading: true,
    error: null,
  }),
}));