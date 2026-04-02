import { create } from 'zustand';
// import axios from 'axios';
import { DUMMY_FUND_BUNNIES } from '../_dummy/bunny';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const TEST_TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN;

export interface FetchFundBunniesParams {
    sortType?: string;
    page?: number;
    size?: number;
}

export interface FundBunny {
    fund_bunny_id: string;
    bunny_name: string;
    image: string;
    bunny_type: string;
    target_bny: number;
    collected_bny: number;
    remaining_bny: number;
    created_at: string;
    end_at: string;
}

interface FundingState {
    fundBunnies: FundBunny[];
    bunnies: FundBunny[]; // fetchBunnies에서 사용할 별도 상태
    isLoading: boolean;
    error: string | null;
    fetchFundBunnies: (params?: FetchFundBunniesParams) => Promise<void>;
    clearFundBunnies: () => void;
    clearError: () => void;
}

export const useFundingStore = create<FundingState>((set, get) => ({
    fundBunnies: [],
    bunnies: [],
    isLoading: false,
    error: null,

    fetchFundBunnies: async (params: FetchFundBunniesParams = {}) => {
        const { sortType = 'newest', page = 0 } = params;

        // // API 호출 (주석처리)
        // const url = new URL(`${API_BASE_URL}/fund-bunnies`, window.location.origin);
        // ...

        let sorted = [...DUMMY_FUND_BUNNIES];
        if (sortType === 'oldest') {
            sorted = sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        } else if (sortType === 'mostInvested') {
            sorted = sorted.sort((a, b) => b.collected_bny - a.collected_bny);
        } else if (sortType === 'leastInvested') {
            sorted = sorted.sort((a, b) => a.collected_bny - b.collected_bny);
        } else {
            sorted = sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        if (page === 0) {
            set({ fundBunnies: sorted, isLoading: false });
        } else {
            const currentFundBunnies = get().fundBunnies;
            set({ fundBunnies: [...currentFundBunnies, ...sorted], isLoading: false });
        }
    },

    clearFundBunnies: () => set({ fundBunnies: [] }),

    clearError: () => set({ error: null }),
}));

