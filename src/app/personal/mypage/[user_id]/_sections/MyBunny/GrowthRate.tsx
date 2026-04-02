import Chart from "@/app/_shared/components/Chart";
import GlassBox from "@/app/personal/mypage/[user_id]/_components/GlassBox";
import { useState, useEffect } from "react";
import { ChartData } from "@/app/_api/bunnyAPI";
import { DUMMY_CHART_DATA } from "@/app/_dummy/chart";

function GrowthRate({ bunnyName }: { bunnyName: string }) {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchChartData = (period: string = "일") => {
        if (bunnyName === "") return;

        const interval =
            period === "일" ? "DAILY" : period === "주" ? "WEEKLY" : "MONTHLY";

        // 더미 데이터 사용 (API 대체)
        const data = DUMMY_CHART_DATA[bunnyName]?.[interval] ?? null;
        setChartData(data);

        // // API 호출 (주석처리)
        // setIsLoading(true);
        // try {
        //     const data = await getChart(bunnyName, interval);
        //     setChartData(data);
        // } catch (error) {
        //     console.error("성장 차트 데이터 가져오기 실패:", error);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    useEffect(() => {
        fetchChartData();
    }, []);

    const handlePeriodChange = (period: string) => {
        fetchChartData(period);
    };

    return (
        <GlassBox
            text="성장곡선"
            isNoti={false}
            color="#e3e1e1f8"
            backgroundColor="#010b20b6"
        >
            <Chart
                chartData={chartData}
                isLoading={isLoading}
                onPeriodChange={handlePeriodChange}
                isMypage={true}
            />
        </GlassBox>
    );
}

export default GrowthRate;
