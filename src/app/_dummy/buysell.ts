import { OrderBookData } from "@/app/_api/bunnyAPI";
import { DUMMY_BUNNIES } from "./bunny";

// 현재가 기준으로 매수/매도 호가 목록을 생성합니다.
function generateOrderBook(bunnyName: string, currentPrice: number): OrderBookData {
    const tickSize = currentPrice >= 50000 ? 100 : currentPrice >= 10000 ? 50 : 10;
    const orders: OrderBookData["orders"] = [];

    // 매도 호가: 현재가 위로 10단계 (높은 가격 → 낮은 가격 순)
    for (let i = 10; i >= 1; i--) {
        orders.push({
            price: currentPrice + tickSize * i,
            quantity: Math.round(10 + Math.random() * 90),
            type: "SELL",
        });
    }

    // 매수 호가: 현재가 아래로 10단계 (높은 가격 → 낮은 가격 순)
    for (let i = 1; i <= 10; i++) {
        orders.push({
            price: currentPrice - tickSize * i,
            quantity: Math.round(10 + Math.random() * 90),
            type: "BUY",
        });
    }

    return {
        bunnyName,
        orders,
        currentPrice,
        serverTime: new Date("2026-04-02T09:00:00").getTime(),
    };
}

// DUMMY_BUNNIES 전체에 대해 호가 더미 데이터를 생성합니다.
// 키: bunny_name → OrderBookData
export const DUMMY_ORDERBOOK: Record<string, OrderBookData> = Object.fromEntries(
    DUMMY_BUNNIES.map((bunny) => [
        bunny.bunny_name,
        generateOrderBook(bunny.bunny_name, bunny.current_price),
    ])
);

// 사용 예시:
// DUMMY_ORDERBOOK["MinjunBunny"]   → OrderBookData
// DUMMY_ORDERBOOK["JihoBunny"]     → OrderBookData
