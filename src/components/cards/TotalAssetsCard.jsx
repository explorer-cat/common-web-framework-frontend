import React, { useEffect, useState } from 'react';
import '../../styles/dashboard.css'
import '../../styles/card.css'
import { utils } from '../../utils/utils';
export function TotalAssetsCard({isLoading,isError,data = 0}) {
    const originKrw = 56200000;
    const totalValuationAmt = data;
    // const [totalValuationAmt, setTotalValuationAmt] = useState(data); // 전체 평가 금액
    const [percentage, setPercentage] = useState(0); // 원금 대비 현재 금액 퍼센트
    const [profitOrLossPercentage, setProfitOrLossPercentage] = useState(0); // 손익 퍼센트

    useEffect(() => {
        // 원금 대비 평가 금액 퍼센트 및 손익 퍼센트 계산
        if (originKrw > 0) {
            const percent = (totalValuationAmt / originKrw) * 100;
            const profitOrLossPercent = ((totalValuationAmt - originKrw) / originKrw) * 100;
            setPercentage(percent);
            setProfitOrLossPercentage(profitOrLossPercent);
        }
    }, [data,originKrw]);


    return (
        <div id="server_status" class="content_card_md">
            <div class="card_header">
                <span class="card_title">총 자산</span>
            </div>
            <div class="card_content" style={{
                display: 'flex',
                flexDirection: "column",
                alignItems: 'flex-start',
                gap: 6,
            }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>
                   {utils.formatToKRW(parseFloat(data),0)}원
                </span>

                <span style={{ fontSize: 13, fontWeight: 600, color: data > originKrw ? '#f04251' : '#3485FA' }}>
                    원금대비 {profitOrLossPercentage.toFixed(2)}%
                </span> 
            </div>
        </div>
    )
}

