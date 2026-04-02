import { BunnyInfo, BunnyHolder } from "@/app/_api/bunnyAPI";
import { Bunny } from "@/app/_store/bunnyStore";

// ─────────────────────────────────────────────
// 내 버니 이름 (bunnyStore 조회 키, GrowthRate 차트 키와 동일)
// ─────────────────────────────────────────────
export const DUMMY_MY_BUNNY_NAME = "JihoBunny";

// ─────────────────────────────────────────────
// BunnyInfo — getBunnyMe() 대체
// ─────────────────────────────────────────────
export const DUMMY_MY_BUNNY_INFO: BunnyInfo = {
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
// BunnyHolder[] — getBunnyMe() 응답 내 holder_types 대체
// ─────────────────────────────────────────────
export const DUMMY_MY_BUNNY_HOLDERS: BunnyHolder[] = [
    { developerType: "GROWTH",  percentage: 32, count: 101 },
    { developerType: "VALUE",   percentage: 25, count: 79  },
    { developerType: "STABLE",  percentage: 18, count: 57  },
    { developerType: "BALANCE", percentage: 13, count: 41  },
    { developerType: "POPULAR", percentage:  8, count: 25  },
    { developerType: "BASIC",   percentage:  4, count: 13  },
];

// ─────────────────────────────────────────────
// Bunny — RadialGraph(오각형 차트)·개발자 유형 표시용
// bunnyStore에 없을 경우 fallback으로 사용
// ─────────────────────────────────────────────
export const DUMMY_MY_BUNNY_RADIAL: Bunny = {
    bunny_id: "bunny-003",
    user_name: "박지호",
    bunny_name: "JihoBunny",
    image: "/images/login/personalProfile.png",
    developer_type: "VALUE",
    bunny_type: "A",
    position: "FULLSTACK",
    reliability: 95,
    current_price: 72000,
    closing_price: 70000,
    market_cap: 7200000,
    fluctuation_rate: 2.86,
    growth: 77,
    stability: 85,
    value: 94,
    popularity: 68,
    balance: 80,
    badges: ["KAKAO", "WOOWAHAN", "COUPANG"],
    like_count: 317,
    ai_review: "높은 가치를 지닌 풀스택 개발자입니다.",
    created_at: "2026-04-01T10:15:00",
};
