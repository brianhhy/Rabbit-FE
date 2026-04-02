"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import FundBunnyCard from "./FundBunnyCard";
import { useFundingStore } from "../../../_store/fundingStore";

export default function EndingSoon() {
    const router = useRouter();
    const { fundBunnies } = useFundingStore();

    type EndingBunny = {
        fund_bunny_id: string;
        bunny_name: string;
        bunny_type: string;
        end_at: string;
        collected_bny: number;
        target_bny: number;
        avatarSrc: string;
    };

    const [endingSoonBunnies, setEndingSoonBunnies] = useState<EndingBunny[]>([]);

    useEffect(() => {
        const bunniesArray = Array.isArray(fundBunnies) ? fundBunnies : [];
        const now = new Date();

        const result = bunniesArray
            .filter((bunny) => bunny.end_at && bunny.end_at.trim() !== "")
            .map((bunny) => {
                try {
                    const timeLeft = new Date(bunny.end_at).getTime() - now.getTime();
                    return { ...bunny, timeLeftMs: timeLeft };
                } catch {
                    return null;
                }
            })
            .filter((b): b is NonNullable<typeof b> => b !== null && b.timeLeftMs > 0)
            .sort((a, b) => a.timeLeftMs - b.timeLeftMs)
            .slice(0, 3)
            .map((bunny) => ({
                fund_bunny_id: bunny.fund_bunny_id,
                bunny_name: bunny.bunny_name,
                bunny_type: bunny.bunny_type,
                end_at: bunny.end_at,
                collected_bny: bunny.collected_bny,
                target_bny: bunny.target_bny,
                avatarSrc: bunny.image || "/images/personal/funding/astronaut.png",
            }));

        setEndingSoonBunnies(result);
    }, [fundBunnies]);

    return (
        <EndingSoonContainer>
            <HeaderSection>
                <EndingSoonText>
                    마감까지 단{" "}
                    <EndingSoonHighlight>하루! </EndingSoonHighlight>
                    지금 바로 버니들을 만나보세요
                </EndingSoonText>
                <ViewAllLink
                    onClick={() => router.push("/personal/funding/list")}
                >
                    전체보기 &gt;
                </ViewAllLink>
            </HeaderSection>
            <EndingSoonDesc>
                아직 상장되지 못한 버니들이 당신의 선택을 기다리고 있어요.
                <br />
                놓치면 다음 기회는 없을지도 몰라요!
            </EndingSoonDesc>

            <CardsContainer>
                {endingSoonBunnies.length > 0 ? (
                    endingSoonBunnies.map((data) => (
                        <FundBunnyCard
                            key={data.fund_bunny_id}
                            fundBunnyId={data.fund_bunny_id}
                            bunnyName={data.bunny_name}
                            bunnyType={data.bunny_type}
                            endAt={data.end_at}
                            currentAmount={data.collected_bny}
                            targetBny={data.target_bny}
                            avatarSrc={data.avatarSrc}
                            countdownColor="#fb123d"
                            showCountdown={true}
                        />
                    ))
                ) : (
                    <NoDataText>마감 임박한 버니가 없습니다.</NoDataText>
                )}
            </CardsContainer>
        </EndingSoonContainer>
    );
}

const EndingSoonContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    z-index: 3;
    flex: 1;
    margin-top: 5rem;
`;

const HeaderSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 75rem;
    padding: 0 1.25rem;
    margin-bottom: 20px;
    position: relative;

    cursor: default;
`;

const EndingSoonText = styled.div`
    font-size: 36px;
    font-weight: 700;
    color: #ffffff;
    text-align: center;

    cursor: default;
`;

const EndingSoonHighlight = styled.span`
    font-family: "rockstar";
    font-size: 37px;
    font-weight: 900;
    color: #ed2020;
    text-shadow: 6px 6px 6px rgba(48, 0, 0, 0.178);
`;

const EndingSoonDesc = styled.div`
    font-size: 17px;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    line-height: 1.5;
`;

const ViewAllLink = styled.div`
    position: absolute;
    bottom: 0.3rem;
    right: 1rem;
    font-size: 16px;
    font-weight: 400;
    color: #cdcdcd;
    cursor: pointer;
    &:hover {
        color: #ffffff;
        font-weight: 600;
    }
`;

const CardsContainer = styled.div`
    display: flex;
    gap: 5rem;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    margin-top: 60px;
    z-index: 3;
    width: 100%;
    max-width: 80rem;
`;

const NoDataText = styled.div`
    color: #cccccc;
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    padding: 2rem;
`;
