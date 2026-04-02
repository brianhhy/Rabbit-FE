import {
    MyInfo,
    HoldBunny,
    MatchBunny,
    OrderBunny,
    BunnyStats,
} from "@/app/_api/userAPI";
import { BunnyInfo, BunnyHolder, ChartData } from "@/app/_api/bunnyAPI";

// ─────────────────────────────────────────────
// MyInfo — 내 정보 (getInfo 대체)
// ─────────────────────────────────────────────
export const DUMMY_MY_INFO: MyInfo = {
    user_id: "1",
    name: "박지호",
    birthdate: "1998-03-15",
    image: "/images/login/personalProfile.png",
    email: "jiho.park@rabbit.dev",
    position: "FULLSTACK",
    link: [
        {
            sns_id: "sns-001",
            type: "GITHUB",
            url: "https://github.com/jihopark-dev",
            favicon: "https://github.com/favicon.ico",
        },
        {
            sns_id: "sns-002",
            type: "LINKEDIN",
            url: "https://linkedin.com/in/jihopark-dev",
            favicon: "https://linkedin.com/favicon.ico",
        },
        {
            sns_id: "sns-003",
            type: "BLOG",
            url: "https://jihopark.dev",
            favicon: "https://jihopark.dev/favicon.ico",
        },
    ],
    education: [
        {
            education_id: "edu-001",
            school_name: "서울대학교",
            status: "졸업",
            major: "컴퓨터공학과",
            start_date: "2017-03-01",
            end_date: "2023-02-28",
            certificate_url: "",
        },
        {
            education_id: "edu-002",
            school_name: "한국과학기술원(KAIST)",
            status: "재학",
            major: "전산학부 석사",
            start_date: "2023-03-01",
            end_date: "2025-02-28",
            certificate_url: "",
        },
    ],
    career: [
        {
            career_id: "career-001",
            company_name: "카카오",
            status: "퇴사",
            position: "BACKEND",
            start_date: "2021-07-01",
            end_date: "2022-12-31",
            certificate_url: "",
        },
        {
            career_id: "career-002",
            company_name: "토스",
            status: "재직",
            position: "FULLSTACK",
            start_date: "2023-03-01",
            end_date: null,
            certificate_url: "",
        },
    ],
    certification: [
        {
            certification_id: "cert-001",
            name: "정보처리기사",
            ca: "한국산업인력공단",
            cdate: "2022-06-17",
            certificate_url: "",
        },
        {
            certification_id: "cert-002",
            name: "AWS Certified Solutions Architect",
            ca: "Amazon Web Services",
            cdate: "2023-09-10",
            certificate_url: "",
        },
    ],
    skill: [
        "TypeScript", "React", "Next.js",
        "Spring Boot", "Kotlin", "PostgreSQL",
        "Redis", "Docker", "Kubernetes",
    ],
};

// ─────────────────────────────────────────────
// BunnyInfo — 내 버니 정보 (getBunnyMe 대체)
// ─────────────────────────────────────────────
export const DUMMY_BUNNY_INFO: BunnyInfo = {
    bunny_type: "A",
    badges: ["KAKAO", "WOOWAHAN", "COUPANG"],
    reliability: 95,
    market_cap: 7200000,
    current_price: 72000,
    ai_feedback: `## 박지호 버니 AI 분석 리포트

**종합 평가: ★★★★★ 최우수**

### 강점
- **풀스택 역량**: 프론트엔드(React/Next.js)와 백엔드(Spring Boot/Kotlin) 양쪽 모두 실전 경험 보유
- **대기업 검증**: 카카오, 토스 등 국내 최상위 테크 기업에서의 근무 이력으로 높은 신뢰도 확보
- **클라우드 역량**: AWS 자격증 보유로 인프라 설계 능력 입증

### 성장 포인트
- 오픈소스 기여 이력을 쌓으면 \`글로벌 인지도\` 향상 기대
- 기술 블로그 운영을 통한 지식 공유 활동이 인기 지수를 더욱 높일 것

### 투자 의견
현재가 기준 시가총액 **720만 래빗**으로 풀스택 개발자 중 상위 5% 수준.
카카오·토스 배지 보유로 **장기 보유 적합** 등급.`,
    like_count: 317,
};

// ─────────────────────────────────────────────
// BunnyHolder[] — 보유자 유형 분포 (getBunnyMe 응답 내 포함)
// ─────────────────────────────────────────────
export const DUMMY_BUNNY_HOLDERS: BunnyHolder[] = [
    { developerType: "GROWTH",  percentage: 32, count: 101 },
    { developerType: "VALUE",   percentage: 25, count: 79  },
    { developerType: "STABLE",  percentage: 18, count: 57  },
    { developerType: "BALANCE", percentage: 13, count: 41  },
    { developerType: "POPULAR", percentage:  8, count: 25  },
    { developerType: "BASIC",   percentage:  4, count: 13  },
];

// ─────────────────────────────────────────────
// HoldBunny[] — 보유 버니 목록 (getHoldBunnies 대체)
// ─────────────────────────────────────────────
export const DUMMY_HOLD_BUNNIES: HoldBunny[] = [
    {
        bunny_id: "bunny-001",
        bunny_name: "MinjunBunny",
        hold_quantity: 12,
        profit_or_loss: 18600,
        return_rate: 3.19,
        valuation: 582000,
        current_price: 48500,
        total_buy_amount: 563400,
        avg_price: 46950,
        price_diff_from_yesterday: 1500,
    },
    {
        bunny_id: "bunny-003",
        bunny_name: "JihoBunny",
        hold_quantity: 8,
        profit_or_loss: 16000,
        return_rate: 2.86,
        valuation: 576000,
        current_price: 72000,
        total_buy_amount: 560000,
        avg_price: 70000,
        price_diff_from_yesterday: 2000,
    },
    {
        bunny_id: "bunny-007",
        bunny_name: "DohyunBunny",
        hold_quantity: 5,
        profit_or_loss: 0,
        return_rate: 0.0,
        valuation: 312000,
        current_price: 62400,
        total_buy_amount: 312000,
        avg_price: 62400,
        price_diff_from_yesterday: 0,
    },
    {
        bunny_id: "bunny-011",
        bunny_name: "JaewonBunny",
        hold_quantity: 20,
        profit_or_loss: 34000,
        return_rate: 3.95,
        valuation: 894000,
        current_price: 44700,
        total_buy_amount: 860000,
        avg_price: 43000,
        price_diff_from_yesterday: 1700,
    },
    {
        bunny_id: "bunny-016",
        bunny_name: "SoheeBunny",
        hold_quantity: 3,
        profit_or_loss: 1500,
        return_rate: 0.70,
        valuation: 214500,
        current_price: 71500,
        total_buy_amount: 213000,
        avg_price: 71000,
        price_diff_from_yesterday: 500,
    },
    {
        bunny_id: "bunny-009",
        bunny_name: "HyunwuBunny",
        hold_quantity: 15,
        profit_or_loss: -22500,
        return_rate: -4.55,
        valuation: 472500,
        current_price: 31500,
        total_buy_amount: 495000,
        avg_price: 33000,
        price_diff_from_yesterday: -1500,
    },
];

// ─────────────────────────────────────────────
// BunnyStats — 보유 버니 통계 (getHoldBunniesStats 대체)
// ─────────────────────────────────────────────
export const DUMMY_BUNNY_STATS: BunnyStats = {
    timestamp: "2026-04-01T00:00:00",
    total_market_cap: "3051500",
    position: {
        frontend: 2,
        backend: 2,
        fullstack: 2,
        top: { type: "FULLSTACK", total_market_cap: 1470000 },
    },
    developer_type: {
        basic: 0,
        growth: 2,
        stable: 2,
        value: 1,
        popular: 1,
        balance: 0,
        top: { type: "GROWTH", total_market_cap: 1476000 },
    },
    coin_type: {
        a: 3,
        b: 2,
        c: 1,
        top: { type: "A", total_market_cap: 1782000 },
    },
};

// ─────────────────────────────────────────────
// OrderBunny[] — 미체결 주문 목록 (getOrders 대체)
// ─────────────────────────────────────────────
export const DUMMY_ORDERS: OrderBunny[] = [
    {
        order_id: "order-001",
        bunny_id: "bunny-002",
        bunny_name: "SeoyeonBunny",
        quantity: 10,
        unit_price: 35000,
        total_amount: 350000,
        final_amount: 350350,
        fee: 350,
        order_type: "BUY",
        ordered_at: "2026-04-01T10:23:41",
    },
    {
        order_id: "order-002",
        bunny_id: "bunny-005",
        bunny_name: "WoosungBunny",
        quantity: 5,
        unit_price: 54000,
        total_amount: 270000,
        final_amount: 269730,
        fee: 270,
        order_type: "SELL",
        ordered_at: "2026-04-01T11:05:17",
    },
    {
        order_id: "order-003",
        bunny_id: "bunny-012",
        bunny_name: "HaeunBunny",
        quantity: 7,
        unit_price: 58000,
        total_amount: 406000,
        final_amount: 406406,
        fee: 406,
        order_type: "BUY",
        ordered_at: "2026-04-01T13:47:02",
    },
];

// ─────────────────────────────────────────────
// MatchBunny[] — 체결 내역 (getMatches 대체)
// ─────────────────────────────────────────────
export const DUMMY_MATCHES: MatchBunny[] = [
    {
        match_id: "match-001",
        bunny_name: "JihoBunny",
        quantity: 8,
        unit_price: 70000,
        total_amount: 560000,
        fee: 560,
        order_type: "BUY",
        matched_at: "2026-03-28T09:14:33",
    },
    {
        match_id: "match-002",
        bunny_name: "MinjunBunny",
        quantity: 12,
        unit_price: 46950,
        total_amount: 563400,
        fee: 563,
        order_type: "BUY",
        matched_at: "2026-03-29T14:22:10",
    },
    {
        match_id: "match-003",
        bunny_name: "HyunwuBunny",
        quantity: 5,
        unit_price: 33000,
        total_amount: 165000,
        fee: 165,
        order_type: "SELL",
        matched_at: "2026-03-30T16:05:55",
    },
    {
        match_id: "match-004",
        bunny_name: "JaewonBunny",
        quantity: 20,
        unit_price: 43000,
        total_amount: 860000,
        fee: 860,
        order_type: "BUY",
        matched_at: "2026-03-31T10:30:00",
    },
    {
        match_id: "match-005",
        bunny_name: "DohyunBunny",
        quantity: 5,
        unit_price: 62400,
        total_amount: 312000,
        fee: 312,
        order_type: "BUY",
        matched_at: "2026-04-01T08:50:21",
    },
    {
        match_id: "match-006",
        bunny_name: "SoheeBunny",
        quantity: 3,
        unit_price: 71000,
        total_amount: 213000,
        fee: 213,
        order_type: "BUY",
        matched_at: "2026-04-01T09:41:07",
    },
];

// ─────────────────────────────────────────────
// ChartData — 성장곡선 차트 (getChart 대체)
// ─────────────────────────────────────────────
export const DUMMY_CHART_DATA: ChartData = {
    bunny_name: "JihoBunny",
    interval: "DAILY",
    chart_data_list: [
        { date: "2026-03-01", high_price: 65000, low_price: 62000, closing_price: 63500, buy_quantity: 120, sell_quantity: 80,  trade_volume: 6350000  },
        { date: "2026-03-04", high_price: 64500, low_price: 61000, closing_price: 62000, buy_quantity: 90,  sell_quantity: 110, trade_volume: 5580000  },
        { date: "2026-03-06", high_price: 66000, low_price: 62500, closing_price: 65000, buy_quantity: 150, sell_quantity: 70,  trade_volume: 8450000  },
        { date: "2026-03-10", high_price: 67000, low_price: 64000, closing_price: 66500, buy_quantity: 200, sell_quantity: 60,  trade_volume: 13300000 },
        { date: "2026-03-13", high_price: 68000, low_price: 65000, closing_price: 67000, buy_quantity: 180, sell_quantity: 90,  trade_volume: 12060000 },
        { date: "2026-03-17", high_price: 69500, low_price: 66000, closing_price: 68500, buy_quantity: 220, sell_quantity: 75,  trade_volume: 15070000 },
        { date: "2026-03-20", high_price: 70000, low_price: 67500, closing_price: 69000, buy_quantity: 195, sell_quantity: 85,  trade_volume: 13455000 },
        { date: "2026-03-24", high_price: 71000, low_price: 68000, closing_price: 70500, buy_quantity: 240, sell_quantity: 60,  trade_volume: 16920000 },
        { date: "2026-03-27", high_price: 72000, low_price: 69500, closing_price: 71000, buy_quantity: 260, sell_quantity: 55,  trade_volume: 18460000 },
        { date: "2026-04-01", high_price: 73000, low_price: 70000, closing_price: 72000, buy_quantity: 317, sell_quantity: 48,  trade_volume: 22824000 },
    ],
};
