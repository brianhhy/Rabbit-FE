import { create } from "zustand";
import axios from "axios";
import { webSocketService } from "../_utils/websocket";
import { DUMMY_BUNNIES, updateDummyBunny } from "../_dummy/bunny";
import {
  PriceTick,
  ClosingPriceUpdate,
  toNum,
  calcFluctuationRate,
} from "../_utils/websocket";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TEST_TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN;

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/** 버니(개발자 코인) 기본 정보 */
export interface Bunny {
    bunny_id: string;
    user_name: string;
    bunny_name: string;             // 종목 식별자 (라우팅·웹소켓 키)
    image: string;
    developer_type: string;         // GROWTH | STABLE | VALUE | POPULAR | BALANCE | BASIC
    bunny_type: string;             // A | B | C
    position: string;               // BACKEND | FRONTEND | FULLSTACK
    reliability: number;
    current_price: number;          // 실시간 현재가 (웹소켓으로 갱신)
    closing_price: number;          // 전일 종가 (자정 1회 갱신)
    market_cap: number;
    fluctuation_rate: number | null; // (현재가 - 종가) / 종가 × 100, 백엔드 계산값 우선
    growth: number;
    stability: number;
    value: number;
    popularity: number;
    balance: number;
    badges: string[];               // 기업 배지 목록 (KAKAO, TOSS, ...)
    like_count: number;
    ai_review: string;
    created_at: string;
}

/** 로그인한 유저 기준의 버니별 컨텍스트 (좋아요 여부, 보유 수량 등) */
export interface BunnyContext {
    is_liked: boolean;
    buyable_amount: number;         // 매수 가능 금액
    sellable_quantity: number;      // 매도 가능 수량
}

/** fetchBunnies / fetchAllBunnies 호출 파라미터 */
export interface FetchBunniesParams {
    sortType?: string;
    page?: number;
    size?: number;
}

/** 버니 목록 필터 상태 */
export interface Filters {
    bunnyType: number | null;
    position: number | null;
    bunnyTraits: number | null;
    badges: number[];               // 다중 선택 허용
}

// ─────────────────────────────────────────────
// 스토어 인터페이스
// ─────────────────────────────────────────────

interface BunnyState {
    /** 페이지네이션 버니 목록 (래빗 로켓 탑승 버니들) */
    bunnies: Bunny[];
    /** 전체 버니 목록 (GOT 탑승 버니 필터링용) */
    allBunnies: Bunny[];
    /** bunnyName → BunnyContext 맵 (유저별 컨텍스트) */
    bunnyContexts: Record<string, BunnyContext>;

    /** 각 fetch의 로딩·에러 상태 */
    status: {
        bunnies: {
            isLoading: boolean;
            error: string | null;
        },
        allBunnies: {
            isLoading: boolean;
            error: string | null;
        },
        bunnyContexts: {
            isLoading: boolean;
            error: string | null;
        }
    }

    // ── API 액션 ──────────────────────────────
    /** 페이지별 버니 목록 조회 (page=0이면 덮어씀, 이후 누적) */
    fetchBunnies: (params?: FetchBunniesParams) => Promise<void>;
    /** 전체 버니 목록 한 번에 조회 */
    fetchAllBunnies: (params?: FetchBunniesParams) => Promise<void>;
    /** 특정 버니의 유저 컨텍스트 조회 (좋아요·보유량) */
    fetchBunnyContext: (bunnyName: string) => Promise<void>;

    // ── 셀렉터 ───────────────────────────────
    getBunnyByName: (bunnyName: string) => Bunny | undefined;
    getBunnyContext: (bunnyName: string) => BunnyContext | undefined;
    getBunnyLikeCount: (bunnyName: string) => number;

    // ── 뮤테이션 ─────────────────────────────
    clearError: () => void;
    /** 좋아요 수 로컬 즉시 반영 (낙관적 업데이트) */
    updateBunnyLikeCount: (bunnyName: string, delta: number) => void;
    /** 보유량·좋아요 여부 등 컨텍스트 부분 업데이트 */
    updateBunnyContext: (bunnyName: string, context: Partial<BunnyContext>) => void;

    // ── 실시간 가격 웹소켓 제어 ───────────────
    /** 현재가·종가 웹소켓 구독 시작 */
    startPriceRealtime: (bunnyName: string) => Promise<void>;
    /** 현재가·종가 웹소켓 구독 해제 */
    stopPriceRealtime: (bunnyName: string) => void;
    isWebSocketConnected: () => boolean;

    // ── 필터 ─────────────────────────────────
    filters: Filters;
    setFilter: (key: string, value: number | number[] | null) => void;
}

// ─────────────────────────────────────────────
// 스토어 구현
// ─────────────────────────────────────────────

export const useBunnyStore = create<BunnyState>((set, get) => ({
    bunnies: [],
    allBunnies: [],
    bunnyContexts: {},

    status: {
        bunnies: { isLoading: false, error: null },
        allBunnies: { isLoading: false, error: null },
        bunnyContexts: { isLoading: false, error: null },
    },

    // ── fetchBunnies ──────────────────────────
    // 페이지 단위로 버니 목록을 가져온다.
    // page=0이면 목록을 새로 교체, 이후 페이지는 기존 목록에 누적(무한 스크롤용).
    // 현재는 더미 데이터 사용; API 전환 시 아래 주석 해제.
    fetchBunnies: async (params: FetchBunniesParams = {}) => {
        const page = params.page ?? 0;
        const size = params.size ?? 10;

        set((state) => ({
            status: {
                ...state.status,
                bunnies: { isLoading: true, error: null },
            },
        }));

        // 더미 데이터 사용 (API 대체)
        const start = page * size;
        const newBunnies = DUMMY_BUNNIES.slice(start, start + size);
        set((state) => ({
            bunnies: page === 0 ? newBunnies : [...get().bunnies, ...newBunnies],
            status: {
                ...state.status,
                bunnies: { isLoading: false, error: null },
            },
        }));

        // // API 호출 (주석처리)
        // try {
        //     const url = new URL(`${API_BASE_URL}/bunnies`, window.location.origin);
        //     url.searchParams.append('page', page.toString());
        //     url.searchParams.append('size', size.toString());
        //     url.searchParams.append('sortType', params.sortType ?? "");
        //     const response = await axios.get(url.toString(), {
        //         withCredentials: true,
        //         headers: { "Content-Type": "application/json", Authorization: `Bearer ${TEST_TOKEN}` },
        //     });
        //     const newBunnies: Bunny[] = response.data.content;
        //     set((state) => ({
        //         bunnies: page === 0 ? newBunnies : [...get().bunnies, ...newBunnies],
        //         status: { ...state.status, bunnies: { isLoading: false, error: null } },
        //     }));
        // } catch (error) {
        //     set((state) => ({
        //         status: { ...state.status, bunnies: { isLoading: false, error: error instanceof Error ? error.message : "알 수 없는 오류" } },
        //     }));
        // }
    },

    // ── fetchAllBunnies ───────────────────────
    // 전체 버니 목록을 한 번에 가져온다.
    // GOT 탑승 버니(created_at 기준 필터링)처럼 클라이언트에서 가공이 필요한 경우 사용.
    fetchAllBunnies: async () => {
        set((state) => ({
            status: {
                ...state.status,
                allBunnies: { isLoading: true, error: null },
            },
        }));

        // 더미 데이터 사용 (API 대체)
        set((state) => ({
            allBunnies: DUMMY_BUNNIES,
            status: {
                ...state.status,
                allBunnies: { isLoading: false, error: null },
            },
        }));

        // // API 호출 (주석처리)
        // try {
        //     const url = new URL(`${API_BASE_URL}/bunnies?filter=ALL`, window.location.origin);
        //     const response = await axios.get(url.toString(), {
        //         withCredentials: true,
        //         headers: { "Content-Type": "application/json", Authorization: `Bearer ${TEST_TOKEN}` },
        //     });
        //     const bunnies: Bunny[] = response.data.content;
        //     set((state) => ({
        //         allBunnies: bunnies,
        //         status: { ...state.status, allBunnies: { isLoading: false, error: null } },
        //     }));
        // } catch (error) {
        //     set((state) => ({
        //         status: { ...state.status, allBunnies: { isLoading: false, error: error instanceof Error ? error.message : "알 수 없는 오류" } },
        //     }));
        // }
    },

    // ── fetchBunnyContext ─────────────────────
    // 로그인한 유저의 특정 버니에 대한 컨텍스트(좋아요 여부, 매수 가능 금액, 매도 가능 수량)를 가져온다.
    // 트레이드 페이지 진입 시 호출.
    fetchBunnyContext: async (bunnyName: string) => {
        set((state) => ({
            status: {
                ...state.status,
                bunnyContexts: { isLoading: true, error: null },
            },
        }));

        try {
            const response = await axios.get(
                `${API_BASE_URL}/bunnies/${bunnyName}/user-context`,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${TEST_TOKEN}`,
                    },
                }
            );

            set((state) => ({
                bunnyContexts: {
                    ...state.bunnyContexts,
                    [bunnyName]: response.data,
                },
                status: {
                    ...state.status,
                    bunnyContexts: { isLoading: false, error: null },
                },
            }));
        } catch (error) {
            console.error('Bunny context 가져오기 실패:', error);
            set((state) => ({
                status: {
                    ...state.status,
                    bunnyContexts: {
                        isLoading: false,
                        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
                    },
                },
            }));
        }
    },

    // bunny_name으로 allBunnies에서 단일 버니 조회
    getBunnyByName: (bunnyName: string) => {
        const { allBunnies } = get();
        return allBunnies.find((bunny) => bunny.bunny_name === bunnyName);
    },

    // bunny_name으로 유저 컨텍스트 조회
    getBunnyContext: (bunnyName: string) => {
        const { bunnyContexts } = get();
        return bunnyContexts[bunnyName];
    },

    // 모든 에러 상태 초기화
    clearError: () =>
        set((state) => ({
            status: {
                bunnies: { ...state.status.bunnies, error: null },
                allBunnies: { ...state.status.allBunnies, error: null },
                bunnyContexts: { ...state.status.bunnyContexts, error: null },
            },
        })
    ),

    // ── updateBunnyContext ────────────────────
    // 매수·매도 완료 후 보유 수량·매수 가능 금액을 로컬에서 즉시 갱신(낙관적 업데이트).
    updateBunnyContext: (bunnyName: string, context: Partial<BunnyContext>) => {
        set((state) => ({
            bunnyContexts: {
                ...state.bunnyContexts,
                [bunnyName]: {
                    ...state.bunnyContexts[bunnyName],
                    ...context,
                },
            },
        }));
    },

    // ── updateBunnyLikeCount ──────────────────
    // 좋아요 버튼 클릭 시 bunnies·allBunnies 양쪽에 delta(+1 또는 -1)를 반영.
    // 더미 데이터도 동기화하여 페이지 이동 후에도 값이 유지되도록 한다.
    updateBunnyLikeCount: (bunnyName: string, delta: number) => {
        const { bunnies, allBunnies } = get();
        const updateList = (list: Bunny[]) =>
            list.map((bunny) =>
                bunny.bunny_name === bunnyName
                    ? { ...bunny, like_count: bunny.like_count + delta }
                    : bunny
            );

        const newLikeCount =
            (bunnies.find((b) => b.bunny_name === bunnyName) ??
             allBunnies.find((b) => b.bunny_name === bunnyName))?.like_count ?? 0;
        updateDummyBunny(bunnyName, { like_count: newLikeCount + delta });

        set({
            bunnies: updateList(bunnies),
            allBunnies: updateList(allBunnies),
        });
    },

    getBunnyLikeCount: (bunnyName: string) => {
        const { bunnies, allBunnies } = get();
        const bunny = bunnies.find((b) => b.bunny_name === bunnyName) ||
                     allBunnies.find((b) => b.bunny_name === bunnyName);
        return bunny ? bunny.like_count : 0;
    },

    // ── startPriceRealtime ────────────────────
    // 웹소켓으로 특정 버니의 현재가·종가를 실시간 구독한다.
    // 1) ws 연결 보장 → 2) 현재가 틱 구독 → 3) 종가(자정 1회) 구독
    // fluctuation_rate는 백엔드 원본값을 유지 (프론트에서 재계산하지 않음).
    startPriceRealtime: async (bunnyName: string) => {
        // 1) ws 연결 보장
        await webSocketService.connect();

        // 2) 현재가 틱 구독
        webSocketService.subscribeToCurrentPrice(bunnyName, (tick: PriceTick) => {
            const cur = toNum(tick.currentPrice);

            set((state) => {
                const updateList = (list: Bunny[]) =>
                    list.map((bunny) => {
                        if (bunny.bunny_name === bunnyName) {
                            console.log(`웹소켓 현재가 업데이트 ${bunnyName}:`, {
                                old_current_price: bunny.current_price,
                                new_current_price: cur,
                                original_fluctuation_rate: bunny.fluctuation_rate
                            });
                            return {
                                ...bunny,
                                current_price: cur,
                                // fluctuation_rate는 백엔드 원본 값 유지
                            };
                        }
                        return bunny;
                    });
                return {
                    bunnies: updateList(state.bunnies),
                    allBunnies: updateList(state.allBunnies),
                };
            });
        });

        // 3) 종가(자정 1회) 구독
        webSocketService.subscribeToClosingPrice(bunnyName, (close: ClosingPriceUpdate) => {
            const closing = toNum(close.closingPrice);

            set((state) => {
                const updateList = (list: Bunny[]) =>
                    list.map((bunny) => {
                        if (bunny.bunny_name === bunnyName) {
                            console.log(`웹소켓 종가 업데이트 ${bunnyName}:`, {
                                old_closing_price: bunny.closing_price,
                                new_closing_price: closing,
                                original_fluctuation_rate: bunny.fluctuation_rate
                            });
                            return {
                                ...bunny,
                                closing_price: closing,
                                // fluctuation_rate는 백엔드에서 새로 계산된 값을 REST API로 받아올 때까지 유지
                            };
                        }
                        return bunny;
                    });

                return {
                    bunnies: updateList(state.bunnies),
                    allBunnies: updateList(state.allBunnies),
                };
            });
        });
    },

    // 현재가·종가 구독 해제 (컴포넌트 언마운트 시 호출)
    stopPriceRealtime: (bunnyName: string) => {
        webSocketService.unsubscribeFromCurrentPrice(bunnyName);
        webSocketService.unsubscribeFromClosingPrice(bunnyName);
    },

    isWebSocketConnected: () => {
        return webSocketService.isConnected();
    },

    // ── 필터 ─────────────────────────────────
    // 버니 목록 필터 상태. SortButton 컴포넌트가 setFilter를 호출해 갱신.
    filters: {
        bunnyType: null,
        position: null,
        bunnyTraits: null,
        badges: [],
    },

    setFilter: (key, value) =>
        set((state) => ({
        filters: {
            ...state.filters,
            [key]: value,
        },
    })),
}));
