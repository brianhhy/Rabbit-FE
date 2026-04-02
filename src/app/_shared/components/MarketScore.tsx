"use client";
import styled from "styled-components";
// import { getRabbitIndex } from "@/app/_api/bunnyAPI";
import { useEffect, useState } from "react";
import { DUMMY_RABBIT_INDEX } from "@/app/_dummy/bunny";
import HalfChart from "@/app/personal/mypage/[user_id]/_components/chart/HalfChart";

function MarketScore() {
    const [value, setValue] = useState<number | null>(null);

    useEffect(() => {
        // 더미 데이터 사용 (API 대체)
        setValue(DUMMY_RABBIT_INDEX);

        // // API 호출 (주석처리)
        // const fetchValue = async () => {
        //     try {
        //         const result = await getRabbitIndex();
        //         setValue(result.rabbit_index);
        //     } catch (err) {
        //         console.error("getRabbitIndex API 호출 실패:", err);
        //     }
        // };
        // fetchValue();
    }, []);

    if (value === null) return <div>로딩 중...</div>;

    const level =
        value >= 80 ? { label: "과열", color: "#ff5a5a" } :
        value >= 60 ? { label: "상승", color: "#60d394" } :
        value >= 40 ? { label: "중립", color: "#FFD700" } :
        value >= 20 ? { label: "하락", color: "#60a5fa" } :
                      { label: "침체", color: "#a78bfa" };

    const chartData = [
        { value, name: "점수" },
        { value: 100 - value, name: "남은 점수" },
    ];

    return (
        <Div>
            <ChartWrapper>
                <HalfChart
                    data={chartData}
                    colors={[level.color, "rgba(255,255,255,0.1)"]}
                    inner={40}
                    outer={70}
                />
                <ScoreOverlay>
                    <Score>{value}</Score>
                    <LevelLabel style={{ color: level.color }}>{level.label}</LevelLabel>
                </ScoreOverlay>
            </ChartWrapper>
        </Div>
    );
}

const Div = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 9rem;
    border-radius: 8px;
    background-color: rgba(240, 211, 251, 0.462);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 8px 32px rgba(176, 106, 179, 0.25),
        0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;

    &:hover {
        transform: scale(1.02);
        box-shadow: 0 12px 40px rgba(8, 5, 8, 0.35),
            0 6px 20px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
`;

const ChartWrapper = styled.div`
    position: relative;
    width: 160px;
    height: 100%;
`;

const ScoreOverlay = styled.div`
    position: absolute;
    bottom: 0.6rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    pointer-events: none;
`;

const Score = styled.div`
    font-family: var(--font-rockstar);
    font-size: 28px;
    font-weight: 800;
    line-height: 1;
    color: #fff;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
`;

const LevelLabel = styled.div`
    font-size: 11px;
    font-weight: 700;
`;

export default MarketScore;
