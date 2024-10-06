import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Card } from 'antd';
import { useDispatch } from "react-redux";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { api } from '../../utils/customAxios';
import { action } from '../../actions/actions';
import { utils } from '../../utils/utils';

dayjs.extend(customParseFormat);

const TitleContainer = styled.div`
  padding: 8px 4px 16px 4px;
`;

const Title = styled.h2`
  cursor: pointer;
  font-size: 1.5em;
  color: #111;

  &:hover {
    color: #3498db;
    text-decoration: underline;
  }
`;

const LogsContainer = styled.div`
  display: flex;
  height: calc(100% - 75px); /* Adjusted to leave space for the title */
  width: 100%;
`;

const LogBox = styled.div`
  flex: 1;
  padding: 16px;
  background-color: black;
  color: #ffffff; /* Change font color to white */
  font-family: monospace;
  font-size: 12px;
  overflow-y: auto; /* Enable vertical scrolling */
  height: 100%; /* Ensure it takes the full height */
  border-right: 1px solid #333;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #444; 
  }

  &::-webkit-scrollbar-track {
    background: #222; 
  }
`;

const logStyle = {
  paddingBottom: "4px", // Reduced spacing between logs
};

function TradeLogPage() {
  const dispatch = useDispatch();

  const [generalLogs, setGeneralLogs] = useState([]);
  const [coinList, setAllCoinList] = useState([]);
  const [tradeLogs, setTradeLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState('.'); // State for the moving dots
  const logBoxRefs = [useRef(null), useRef(null)];
  const endOfGeneralLogsRef = useRef(null);
  const endOfTradeLogsRef = useRef(null);
  
  const cache = useMemo(() => new Map(), []);

  useEffect(() => {
    try {
        utils.getUpbitCoinListAll((result) => {
            console.log('result',result);
            const filteredCoins = result.filter(coin => coin.includes('KRW'));
            console.log('filteredCoins',filteredCoins)
            setAllCoinList(filteredCoins);
            setLoading(false);
        });  
    } catch(e) {
        console.error(e);
    } 
},[])


  useEffect(() => {
    let cnt = 0; // 초기 값을 0으로 설정

    const interval = setInterval(() => {
        if (cnt >= coinList.length) { // cnt가 coinList의 길이에 도달하면 0으로 리셋
            cnt = 0;
        }
        
      setGeneralLogs((prevLogs) => {
        const newLog = {
          time: new Date().toLocaleTimeString(),
          message: ` AI Checking ${utils.getTickerName(coinList[cnt])} (${coinList[cnt]})`
        };
        endOfGeneralLogsRef.current.scrollIntoView({ behavior: 'smooth' });
        return [...prevLogs, newLog]; // 이전 로그를 유지하고 새로운 로그 추가
      });

        cnt++; // cnt를 증가
    }, 200);

    const intervalCoin = setInterval(() => {
      getTradeLogList();
    }, 5000);


    return () => clearInterval(interval,intervalCoin);
  }, [coinList]);

  useEffect(() => {
    if (logBoxRefs[0].current) {
      logBoxRefs[0].current.scrollTop = logBoxRefs[0].current.scrollHeight;
    }
  }, [generalLogs]);

  useEffect(() => {
    if (logBoxRefs[1].current) {
      logBoxRefs[1].current.scrollTop = logBoxRefs[1].current.scrollHeight;
    }
  }, [tradeLogs]);

  // Effect for updating the moving dots
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length < 3) {
          return prevDots + '.';
        }
        return '.';
      });
    }, 500); // Update every 500ms

    return () => clearInterval(dotInterval);
  }, []);

  const getTradeLogList = async (requestData, useCache = true) => {
    setLoading(true);
    if (!requestData) {
      requestData = {
        PAGE_NUM: 1,
        PAGE_SIZE: 9999,
      };
    }
    const cacheKey = JSON.stringify(requestData);

    if (useCache) {
      if (cache.has(cacheKey)) {
        const cachedData = cache.get(cacheKey);
        setTradeLogs(cachedData.list);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await api.get('/api/v1/upbit/getTradeLogList', requestData);
      const result = res.data;
      if (result.success) {
        const data = result.pageInfo.paging;
        cache.set(cacheKey, { total: data.total, list: data.list });
        setTradeLogs(data.list.reverse());
        endOfTradeLogsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      dispatch(action.toast.setToast({
        visible: true,
        type: "ERROR",
        description: "서버 요청 중 문제가 발생했습니다.",
        message: "오류 발생",
      }));
    } finally {
      setLoading(false);
    }
  };

  const formatKoreanDate = (date) => {
    const year = dayjs(date).year();
    const month = dayjs(date).month() + 1;
    const day = dayjs(date).date();
    const hour = dayjs(date).hour();
    const ampm = hour < 12 ? '오전' : '오후';
    const formattedHour = hour % 12 || 12;
    return `${year}년 ${month}월 ${day}일 ${ampm} ${formattedHour}:${dayjs(date).minute().toString().padStart(2, '0')}:${dayjs(date).second().toString().padStart(2, '0')}`;
  };

  return (
    <>
      <TitleContainer>
        <Title>Scheduler Logs</Title>
      </TitleContainer>
      <LogsContainer>
        <LogBox ref={logBoxRefs[0]}>
          {generalLogs.map((log, index) => (
            <div key={index} style={logStyle}>
                <span style={{ color: 'darkgray' }}>
                   [{log.time}]
                 </span>
                  {log.message}
              </div>
          ))}
          <div style={logStyle} ref={endOfGeneralLogsRef}>
             자동매매 AI 분석이 진행중입니다.{dots} {/* Displaying the moving dots */}
          </div>
        </LogBox>
        <LogBox ref={logBoxRefs[1]}>
          {tradeLogs.map((log, index) => (
            <div key={index} style={logStyle}>
              <span style={{ color: 'darkgray' }}>
                [{formatKoreanDate(log.ENTER_DATE)}]
              </span>
              <span style={{ color: log.TYPE === "bid" ? '#F04251' : "#3485FA" }}>
                {log.TYPE === "bid" ? " 매수 " : " 매도 "} 
              </span>
              {utils.getTickerName(log.TICKER)} ({log.TICKER})
              {log.ENTER_PRICE !== 'null' ? " 체결금액 " + utils.formatToKRW(log.ENTER_PRICE)+"원" : ''}
            </div>
          ))}
          <div style={logStyle} ref={endOfTradeLogsRef}>대기중{dots}</div>
        </LogBox>
      </LogsContainer>
    </>
  );
}

export default TradeLogPage;



