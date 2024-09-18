import React, { useEffect, useState } from 'react';
import '../../styles/dashboard.css'
import '../../styles/card.css'

export function TotalTradeCard() {
    return (
        <div id="total_trade_money" class="content_card_md">
        <div class="card_header">
            <span class="card_title">총 거래대금</span>
        </div>
        <div class="card_content" style={{
            display: 'flex',
            flexDirection: "column",
            alignItems: 'flex-start',
            gap: 6,
        }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>
                50,500,240원
            </span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
                수수료 <span style={{ color: '#3485FA', fontSize: 13, fontWeight: 600 }}>-1,142,900원</span>
            </span>
        </div>
    </div>
    )
}

