import { api } from '../utils/customAxios';
import { utils } from "../utils/utils";
export const upbitApi = {}
const path = '/api/v1/upbit'

upbitApi.getMyAssets = async (parameter) => {
    return new Promise((resolve, reject) => {
        try {
            api.get(path + '/getMyAssets', parameter).then(res => {
                if (res.data) {
                    let data = JSON.parse(res.data.data[0].myAssets);

                    if (data) {
                        //업비트 API ERROR 반환을 확인함.
                        if (utils.isHasObjectKey(data, "error")) {
                            reject({ error: true, message: data.error.message,data: JSON.parse(res.data.data[0].sec)});
                            return;
                        } 

                            const excludeCurrencies = ['KRW', 'XCORE','VTHO'];

                            let coinTicker = data
                            .filter(item => !excludeCurrencies.includes(item.currency)) // 제외할 currency 값을 포함하지 않는 항목 필터링
                            .map(item => 'KRW-'+item.currency); // 나머지 항목에서 currency 값 추출
                        
                            //보유 자산의 현재 가격을 요청합니다.
                            upbitApi.getUpbitTicker({ticker:coinTicker.join(',')}).then((result) => {
                                // 첫 번째 리스트에서 currency에 해당하는 데이터를 필터링하여 업데이
                                const updatedMarketData = data.map(marketItem => {
                                    const currency = 'KRW-' + marketItem.currency
                                    const currencyItem = result.find(c => c.market === currency);

                                    if (currencyItem) {
                                        const balance = parseFloat(marketItem.balance);
                                        const avgBuyPrice = parseFloat(marketItem.avg_buy_price);
                                        const purchase_amt = balance * avgBuyPrice;
                                        const valuation_amt = balance * currencyItem.trade_price;
                                        const profitLoss = valuation_amt - purchase_amt;
                                        const profit_loss = (profitLoss / purchase_amt) * 100;
                                        return {
                                            ...marketItem
                                            , opening_price: currencyItem.opening_price
                                            , current_price: currencyItem.trade_price
                                            , change: currencyItem.change
                                            , change_price: currencyItem.change_price
                                            , change_rate: currencyItem.change_rate
                                            , purchase_amt: purchase_amt //매수금액
                                            , valuation_amt: valuation_amt//utils.formatToKRW(valuation_amt)+'원'
                                            , profit_loss: profit_loss // 평가손익 퍼센트
                                            , profit_loss_price: profitLoss //평가손익 원화
                                        };
                                    }
                                    return marketItem;
                                });
                                console.log('updatedMarketData',updatedMarketData)
                                resolve(updatedMarketData)
                            }).catch((error) => {
                                // 여기서 reject 된 에러를 처리할 수 있습니다.
                                reject({ error: true, message: error});
                                return;
                            });
                        
                    }
                } else {
                    reject({ error: true, message: 'api response is empty'});
                    return;
                }
            })
        } catch (err) {
            reject({ error: true, message: err});
            return;
        }
    })
}


upbitApi.getMyTradeCnt = async (parameter) => {
    return new Promise((resolve, reject) => {
        try {
            api.get(path + '/getMyTradeCnt', parameter).then(res => {
                if (res.data) {
                    console.log("API RESULT : ", res.data);
                    resolve(res.data)
                } else {
                    reject({ error: true, message: 'api response is empty'});  
                }
            })
        } catch (err) {
            reject({ error: true, message: err});
        }
    })
}

upbitApi.getUpbitTicker = async (parameter) => {
    return new Promise((resolve, reject) => {
        try {
            api.get(path + '/getUpbitTicker', parameter).then(res => {
                if (res.data) {
                    const data = JSON.parse(res.data.data[0].data);
                    if (data) {
                        //업비트 API ERROR 반환을 확인함.
                        if (utils.isHasObjectKey(data, "error")) {
                            reject({ error: true, message: data.error.message });
                        } else {
                            console.log('assets',data)
                            resolve(data)
                        }
                    }
                } else {
                    reject({ error: true, message: 'api response is empty'});
                }
            })
        } catch (err) {
            reject({ error: true, message: err});
        }
    })
}