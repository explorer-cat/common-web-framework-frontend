import { utils } from "../utils/utils";

let socketUpbit; // 소켓
let reconnectInterval = null; // 재연결 타이머

function connectWS(symbol, callback) {
    // 기존에 연결된 소켓이 있을 경우 닫아준다.
    if (socketUpbit) {
        console.log("Closing existing WebSocket connection...");
        socketUpbit.close();
    }

    socketUpbit = new WebSocket("wss://api.upbit.com/websocket/v1");
    socketUpbit.binaryType = 'arraybuffer';

    // 소켓 연결이 열렸을 때
    socketUpbit.onopen = function () {
        console.log("WebSocket connection opened.",symbol);
        upbitfilterRequest(`[
            {"ticket":"UNIQUE_TICKET"},
            {"type":"ticker","codes":${JSON.stringify(symbol)}}
        ]`);

        // 재연결 타이머 초기화
        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
        }
    };

    // 메시지를 수신했을 때
    socketUpbit.onmessage = async function (e) {
        try {
            let enc = new TextDecoder("utf-8");
            let arr = new Uint8Array(e.data);
            let str_d = enc.decode(arr);
            let response = JSON.parse(str_d);
            // console.log('response', response);
            return callback(response);
        } catch (error) {
            console.error('Error processing message', error);
        }
    };

    // 소켓 연결이 닫혔을 때
    socketUpbit.onclose = function (event) {
        console.warn('WebSocket closed:', event);

        // 소켓이 닫힌 경우 재연결 시도
        attemptReconnect(symbol, callback);
    };

    // 소켓 연결 오류 처리
    socketUpbit.onerror = function (error) {
        console.error('WebSocket Error:', error);

        // 오류 발생 시에도 재연결 시도
        attemptReconnect(symbol, callback);
    };
}

// 웹소켓 요청
function upbitfilterRequest(filter) {
    if (socketUpbit == undefined) {
        console.error('No active WebSocket connection');
        return;
    }
    socketUpbit.send(filter);
}

// 재연결 시도
function attemptReconnect(symbol, callback) {
    if (reconnectInterval) return; // 이미 재연결이 진행 중인 경우 중복 방지

    console.log("Attempting to reconnect in 5 seconds...");
    reconnectInterval = setInterval(() => {
        console.log("Reconnecting...");
        connectWS(symbol, callback);
    }, 5000); // 5초 후 재연결 시도
}

// 업비트 소켓 연결
function connectUpbitSocket(callback) {
    // 비동기 작업이 완료되면 WebSocket 연결 요청
    utils.getUpbitCoinListAll((symbol) => {
        console.log('symbol',symbol)
        // let ticker = symbol.map(v => v.market);  // 티커 목록 생성

        console.log('Coin list retrieved. Requesting connection...');
        // 티커 목록을 이용해 WebSocket 연결 요청
        connectWS(symbol, (data) => {
            return callback(data);
        });
    });
}

export { connectUpbitSocket };
