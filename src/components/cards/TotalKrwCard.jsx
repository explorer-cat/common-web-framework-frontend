import React, { useEffect, useState } from 'react';
import '../../styles/dashboard.css'
import '../../styles/card.css'
import { utils } from '../../utils/utils';

export function TotalKrwCard({isLoading, data = 0}) {
    const {balance,locked} = data;


    if(isLoading) {
        return (
            <div id="server_status" class="content_card_md">
                <div class="card_header">
                    <span class="card_title">보유원화</span>
                </div>
                <div class="card_content" style={{
                    display: 'flex',
                    flexDirection: "column",
                    alignItems: 'flex-start',
                    gap: 6,
                }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>
                        데이터를 불러오는중
                    </span>
                </div>
            </div>
        )
    } else {
        return (
            <div id="server_status" class="content_card_md">
                <div class="card_header">
                    <span class="card_title">보유원화</span>
                </div>
                <div class="card_content" style={{
                    display: 'flex',
                    flexDirection: "column",
                    alignItems: 'flex-start',
                    gap: 6,
                }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>
                        {utils.formatToKRW(parseFloat(balance + locked),0)}원
                    </span>
    
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f04251' }}>
                       {/* 전일대비 +4.24% */}
                    </span>
                </div>
            </div>
        )
    }
}

