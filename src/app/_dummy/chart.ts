import { ChartData, ChartDataItem } from "@/app/_api/bunnyAPI";
import { DUMMY_BUNNIES } from "./bunny";

// 기준가 주변에서 현실적인 OHLCV 캔들 하나를 생성합니다.
function makeCandle(
    date: string,
    basePrice: number,
    volatility: number
): ChartDataItem {
    const change = basePrice * volatility * (Math.random() - 0.5) * 2;
    const open = Math.round(basePrice + change * 0.3);
    const close = Math.round(basePrice + change);
    const high = Math.round(Math.max(open, close) * (1 + Math.random() * volatility * 0.5));
    const low = Math.round(Math.min(open, close) * (1 - Math.random() * volatility * 0.5));
    const trade_volume = Math.round(1000 + Math.random() * 9000);
    const buy_quantity = Math.round(trade_volume * (0.4 + Math.random() * 0.2));
    const sell_quantity = trade_volume - buy_quantity;

    return {
        date,
        high_price: high,
        low_price: low,
        closing_price: close,
        buy_quantity,
        sell_quantity,
        trade_volume,
    };
}

// n일 전부터 오늘까지 날짜 배열을 생성합니다.
function datesBefore(count: number, stepDays: number): string[] {
    const dates: string[] = [];
    const today = new Date("2026-04-01");
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i * stepDays);
        dates.push(d.toISOString().slice(0, 10));
    }
    return dates;
}

// 버니 하나에 대해 DAILY / WEEKLY / MONTHLY 차트 데이터를 생성합니다.
function generateChartData(bunnyName: string, basePrice: number): Record<string, ChartData> {
    const dailyDates = datesBefore(30, 1);
    const weeklyDates = datesBefore(12, 7);
    const monthlyDates = datesBefore(12, 30);

    const walk = (dates: string[], volatility: number): ChartDataItem[] => {
        let price = basePrice;
        return dates.map((date) => {
            const candle = makeCandle(date, price, volatility);
            price = candle.closing_price;
            return candle;
        });
    };

    return {
        DAILY: {
            bunny_name: bunnyName,
            interval: "DAILY",
            chart_data_list: walk(dailyDates, 0.04),
        },
        WEEKLY: {
            bunny_name: bunnyName,
            interval: "WEEKLY",
            chart_data_list: walk(weeklyDates, 0.07),
        },
        MONTHLY: {
            bunny_name: bunnyName,
            interval: "MONTHLY",
            chart_data_list: walk(monthlyDates, 0.12),
        },
    };
}

// DUMMY_BUNNIES 전체에 대해 차트 더미 데이터를 생성합니다.
// 키: bunny_name → interval → ChartData
export const DUMMY_CHART_DATA: Record<string, Record<string, ChartData>> =
    Object.fromEntries(
        DUMMY_BUNNIES.map((bunny) => [
            bunny.bunny_name,
            generateChartData(bunny.bunny_name, bunny.current_price),
        ])
    );

// 사용 예시:
// DUMMY_CHART_DATA["MinjunBunny"]["DAILY"]   → ChartData
// DUMMY_CHART_DATA["JihoBunny"]["WEEKLY"]    → ChartData
// DUMMY_CHART_DATA["HaeunBunny"]["MONTHLY"]  → ChartData
