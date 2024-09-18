import React, { useEffect, useState } from 'react';
import '../../styles/dashboard.css'
import '../../styles/card.css'

export function TotalMesuMedoCard({props}) {
    const {isLoading, data} = props;
    console.log("myTradeCnt",props)
    if(isLoading) {
        return(<div>로딩중</div>)
    } else {
        return (
            <div id="total_mesu_medo" class="content_card_md">
            <div class="card_header">
                <span class="card_title">총 매매횟수</span>
            </div>
            <div class="card_content" style={{
                display: 'flex',
                flexDirection: "column",
                alignItems: 'flex-start',
                gap: 6,
            }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>
                    매수 {data.ask}  |  매도 {data.bid}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                    평균 슬리피지 <span style={{ color: '#f04251', fontSize: 13, fontWeight: 600 }}>+0.5%</span>
                </span>
            </div>
        </div>
        )
    }
}

