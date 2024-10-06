import React, { useEffect, useState, useMemo, useCallback} from 'react';
// import TopMenu from '../components/menus/TopMenu';
// import SubMenu from '../components/menus/SubMenu';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css'
import '../../styles/card.css'
import styled from 'styled-components';
import { connectUpbitSocket, connectWS } from '../../socket/socket.js';
import { upbitApi } from '../../api/upbitApi.js';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import useMyWallet from '../stores/stores.js';
import { utils } from '../../utils/utils.js';
import CryptoTable from '../../components/table/CryptoTable.jsx';

const TitleContainer = styled.div`
  padding: 8px 4px 16px 4px;
`;


const Title = styled.h2`
  cursor: pointer;
  font-size: 1.5em;
color:white;
  &:hover {
    color: #3498db;
    text-decoration: underline;
  }
`;

function MyAssetsPage() {
    const [tabs, setTabs] = useState(['전체', '거래내역']); //대시보드 페이지의 탭리스트
    const [myAssetsData, setMyAssetsData] = useState({ isLoading: true, data: [] }); //내 보유자산
    const [krwAssets, setKrwAssets] = useState({ isLoading: true, data: {} }); //보유 원화 데이터
    const [myTradeCnt, setMyTradeCnt] = useState({ isLoading: true, data: {} }); //전체 매매 카운트
    const [TotalKrw, setTotalKrw] = useState(0);

    useEffect(() => {
        getMyAssets();  //내 현재 보유종목 조회
    }, [])



    useEffect(() => {
        // 각 오브젝트의 current_price * balance 값을 합산
        if (myAssetsData.data.length > 0) {
            const totalAssetValue = myAssetsData.data.reduce((accumulator, asset) => {
                const balance = parseFloat(asset.balance);
                const currentPrice = parseFloat(asset.current_price);
                const assetValue = balance * currentPrice;
                return accumulator + assetValue;
            }, 0);
            // 총 원화 보유금 계산
            const totalKrwBalance = totalAssetValue + parseFloat(krwAssets.data.balance);
            setTotalKrw(totalKrwBalance);
        }
    }, [krwAssets, myAssetsData])


    //현재 보유 종목 조회
    const getMyAssets = () => {
        upbitApi.getMyAssets().then((result) => {
            console.log('result', result);
            const krw_data = utils.findElementsByKey(result, "currency", "KRW")[0];
            if (krw_data) {
                setKrwAssets({ isLoading: false, data: krw_data });
            }
            let myAssetsList = utils.removeObjectsWithValue(result, "currency", ["KRW", 'XCORE', 'VTHO', 'GAS']);
            setMyAssetsData({ isLoading: false, data: myAssetsList });

            let prev_target = '';

            // Ensure the socket connection is made only once
            connectUpbitSocket((result) => {
                const updatedAssetsData = myAssetsList.map((item) => {
                    let target = item.unit_currency + "-" + item.currency;
                    //직전 소켓 데이터와 동일한 target이라면 렌더링 효율을 위해 패스함.
                    if (target == prev_target) {
                        return;
                    }
                    prev_target = target;

                    if (target === result.code) {
                        const balance = parseFloat(item.balance);
                        const avgBuyPrice = parseFloat(item.avg_buy_price);
                        const purchase_amt = balance * avgBuyPrice;
                        const valuation_amt = balance * result.trade_price;
                        const profitLoss = valuation_amt - purchase_amt;
                        const profit_loss = (profitLoss / purchase_amt) * 100;

                        return {
                            ...item,
                            change: result.change,
                            change_rate: result.change_rate,
                            opening_price: result.opening_price,
                            prev_price: item.current_price,
                            prev_trade_timestamp: item.trade_timestamp,
                            trade_timestamp: result.trade_timestamp,
                            current_price: result.trade_price,
                            purchase_amt: purchase_amt,
                            valuation_amt: valuation_amt,
                            profit_loss: profit_loss,
                            profit_loss_price: profitLoss
                        };
                    }
                    return item;
                });

                setMyAssetsData(prevState => ({
                    ...prevState,
                    data: updatedAssetsData
                }));
            });
        }).catch((error) => {
            if (error.message.includes("temporary number has already been")) {
                setMyAssetsData({ isLoading: false, isError: true, errorCode: 'sec', data: error.data });
            }
        });
    };


    // 현재 매수 중인 금액을 계산하는 함수
    const getTotalPurchaseAmt = useCallback(() => {
        if (myAssetsData.data.length > 0) {
            return myAssetsData.data.reduce(
                (acc, item) => acc + parseFloat(item.purchase_amt),
                0
            );
        }
        return 0;
    }, [myAssetsData]);

    // 주문 가능 원화를 계산하는 함수
    const getAvailableKrw = useCallback(() => {
        if (krwAssets) {
            return parseFloat(krwAssets.data.balance) + parseFloat(krwAssets.data.locked);
        }
        return 0;
    }, [krwAssets]);

    // 총 평가를 계산하는 함수
    const getTotalEvaluation = useMemo(() => {
        const totalPurchaseAmt = getTotalPurchaseAmt();
        const availableKrw = getAvailableKrw();
        const data = parseFloat(TotalKrw) - totalPurchaseAmt - availableKrw;
        return (
            <span className="summary_value">
                {utils.formatToKRW(totalPurchaseAmt + data)}원
            </span>
        );
    }, [getTotalPurchaseAmt, getAvailableKrw, TotalKrw]);

    // 총 평가 손익을 계산하는 함수
    const getTotalProfitLoss = useMemo(() => {
        const totalPurchaseAmt = getTotalPurchaseAmt();
        const availableKrw = getAvailableKrw();
        const data = parseFloat(TotalKrw) - totalPurchaseAmt - availableKrw;
        return (
            <span
                className="summary_value"
                style={{ color: data > 0 ? 'rgb(240, 66, 81)' : 'rgb(52, 133, 250)' }}
            >
                {data > 0 ? '+' : '-'}
                {utils.formatToKRW(Math.abs(data))}원
            </span>
        );
    }, [getTotalPurchaseAmt, getAvailableKrw, TotalKrw]);

    // 총 평가 수익률을 계산하는 함수
    const getTotalPercent = useMemo(() => {
        const totalPurchaseAmt = getTotalPurchaseAmt();
        const availableKrw = getAvailableKrw();
        const totalEvaluation = parseFloat(TotalKrw) - availableKrw;
        const totalProfitLoss = totalEvaluation - totalPurchaseAmt;
        const profitLossPercentage =
            totalEvaluation !== 0 ? (totalProfitLoss / totalEvaluation) * 100 : 0;
        return (
            <span
                className="summary_value"
                style={{
                    color: profitLossPercentage > 0 ? 'rgb(240, 66, 81)' : 'rgb(52, 133, 250)',
                }}
            >
                {profitLossPercentage > 0 ? '+' : '-'}
                {profitLossPercentage.toFixed(2)}%
            </span>
        );
    }, [getTotalPurchaseAmt, getAvailableKrw, TotalKrw]);

    return (
        <div className="dashboard_content" style = {{height: 609}}>
            {/* <TitleContainer>
                <Title>포트폴리오</Title>
            </TitleContainer> */}
            {/* <ContentsTab tabs={tabs} /> */}
            <div id="page_content">
                <div className="summary_box">
                    <div className="content_card_sm">
                        <span className="summary_label">총 보유자산</span>
                        <span className="summary_value">{utils.formatToKRW(parseFloat(TotalKrw), 0)}원</span>
                    </div>
                    <div className="content_card_sm">
                        <span className="summary_label">총 평가</span>
                        {getTotalEvaluation}
                    </div>
                    <div className="content_card_sm">
                        <span className="summary_label">현재 매수 중인 금액</span>
                        <span className="summary_value">{utils.formatToKRW(getTotalPurchaseAmt())}원</span>
                    </div>
                    <div className="content_card_sm">
                        <span className="summary_label">주문 가능 원화</span>
                        <span className="summary_value">{utils.formatToKRW(getAvailableKrw(), 0)}원</span>
                    </div>
                    <div className="content_card_sm">
                        <span className="summary_label">총 평가 손익</span>
                        {getTotalProfitLoss}
                    </div>
                    <div className="content_card_sm">
                        <span className="summary_label">총 평가 수익률</span>
                        {getTotalPercent}
                    </div>
                </div>

                <div class="padding_tb_20">
                    <span style={{ color: '#CCD0D3', fontSize: 17, fontWeight: 700 }}>보유 자산</span>
                </div>
                <div id="real_server" style={{ width: '100%', }}>
                    <CryptoTable
                        tableOption={{
                            options: {},
                            columns: ["", "보유자산", "보유수량", "매수평균가", "현재가", "매수금액", "평가금액", "평가손익"],
                            values: [
                                { id: "key", align: 'left', width: 3, hidden: false },
                                { id: "currency", align: 'left', width: 20, hidden: false }, //보유자산
                                { id: "balance", align: 'right', width: 17, hidden: false }, //보유자산개수
                                { id: "avg_buy_price", align: 'right', width: 15, hidden: false }, //매수평균가
                                { id: "current_price", align: 'right', width: 15, hidden: false }, //현재가
                                { id: "purchase_amt", align: 'right', width: 15, hidden: false }, //매수금액
                                { id: "valuation_amt", align: 'right', width: 15, hidden: false }, //평가금액
                                { id: "profit_loss", align: 'right', width: 20, hidden: false } //평가손익
                            ],
                        }}
                        rowsData={myAssetsData}
                    />


                </div>
            </div>
        </div>)

}



export default MyAssetsPage;
