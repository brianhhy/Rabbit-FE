"use client";

import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Image from "next/image";

export default function MobileGuard({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth <= 1024);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const handleCopyLink = () => {
        const url = window.location.href.replace(/^https?:\/\/[^/]+/, "https://rabbit.goodrelation.xyz");
        navigator.clipboard.writeText(url);
    };

    if (!mounted) return <>{children}</>;
    if (!isMobile) return <>{children}</>;

    return (
        <Overlay>
            <LogoArea>
                <Image src="/images/logo_pastel.png" alt="Rabbit" width={100} height={34} />
            </LogoArea>

            <Content>
                <Headline>
                    더 큰 화면으로,<br />더 자세하게 거래해요
                </Headline>

                <MonitorWrapper>
                    <MonitorFrame>
                        <MonitorScreen>
                            <Image
                                src="/images/mockup.png"
                                alt="Rabbit PC 화면"
                                fill
                                style={{ objectFit: "cover" }}
                            />
                        </MonitorScreen>
                    </MonitorFrame>
                    <MonitorStand />
                    <MonitorBase />
                </MonitorWrapper>

                <SubText>PC로 접속해주세요</SubText>
            </Content>

            <BottomArea>
                <CopyButton onClick={handleCopyLink}>
                    Rabbit PC 링크 복사하기
                </CopyButton>
            </BottomArea>
        </Overlay>
    );
}

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(160deg, #e8f0ff 0%, #f5f0ff 50%, #ffffff 100%);
    animation: ${fadeIn} 0.3s ease;
`;

const LogoArea = styled.div`
    width: 100%;
    padding: 1.4rem 1.6rem;
    display: flex;
    align-items: center;
`;

const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 0 2rem;
    text-align: center;
`;

const Headline = styled.h1`
    font-size: 1.6rem;
    font-weight: 800;
    line-height: 1.5;
    color: #111;
    margin: 0;
`;

const MonitorWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const MonitorFrame = styled.div`
    width: 280px;
    height: 190px;
    border-radius: 14px;
    border: 10px solid #d0d5e0;
    background: #e8edf5;
    overflow: hidden;
    box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.10),
        inset 0 2px 6px rgba(255,255,255,0.6);
    position: relative;
`;

const MonitorScreen = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const MonitorStand = styled.div`
    width: 40px;
    height: 28px;
    background: linear-gradient(to bottom, #c8cdd8, #b0b5c0);
    clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
`;

const MonitorBase = styled.div`
    width: 90px;
    height: 10px;
    background: linear-gradient(to bottom, #c0c5d0, #a8adb8);
    border-radius: 4px;
`;

const SubText = styled.p`
    font-size: 0.95rem;
    color: #666;
    font-weight: 500;
    margin: 0;
`;

const BottomArea = styled.div`
    width: 100%;
    padding: 1.2rem 1.4rem 2.4rem;
`;

const CopyButton = styled.button`
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #4a7eff, #7c4dff);
    color: #fff;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(74, 126, 255, 0.35);
    transition: opacity 0.2s;

    &:active {
        opacity: 0.85;
    }
`;
