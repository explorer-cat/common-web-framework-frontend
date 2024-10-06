import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';
import styled from 'styled-components';
import { Button, DatePicker, Flex, Spin, Table, Card, Modal, Input, Select, Divider, Pagination } from 'antd';
import { action } from "../../actions/actions";
import { useDispatch } from "react-redux";
import { api } from '../../utils/customAxios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import MemberModifyModal from '../../components/modal/admin/member-modify-modal';
import MemberCreateModal from '../../components/modal/admin/member-create-modal';
import TableComponent from '../../components/table/TableComponent';
import { utils } from '../../utils/utils';

dayjs.extend(customParseFormat);

const { confirm } = Modal;

const TitleContainer = styled.div`
  padding: 8px 4px 16px 4px;
`;

const Title = styled.h2`
  cursor: pointer;
  font-size: 1.5em;

  &:hover {
    color: #3498db;
    text-decoration: underline;
  }
`;

const Link = styled.a`
  text-decoration: none;
  color: inherit;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  padding: 0px 0px;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  margin-top: 12px;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  padding: 18px 12px;
  background: #f9f9f9;
  border-radius: 5px;
`;

const SearchSection = styled.div`
  display: flex;
  gap: 16px;
`;

const SearchContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  padding: 0px 5px;
`;

const StyledSearch = styled(Input)`
  width: 140px;
  font-size: 12px;
  height: 28px;
`;

function BackTestLogPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dateFormat = 'YYYY/MM/DD';
  const today = dayjs().format(dateFormat);
  const oneYearAgo = dayjs().subtract(1, 'month').format(dateFormat);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [backTestList, setbackTestList] = useState([]);
  const [orderLogList, setOrderLogList] = useState([]);
  const [backTestDataLoading, setbackTestDataLoading] = useState(false);
  const [orderLogDataLoading, setOrderLogDataLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [createStDate, setCreateStDate] = useState(oneYearAgo);
  const [createEdDate, setCreateEdDate] = useState(today);
  const [type, setType] = useState('ALL');
  const [pageSize, setPageSize] = useState(20);
  const [pageNum, setPageNum] = useState(1);
  const [pageTotalCnt, setPageTotalCnt] = useState(0);

  const cache = useMemo(() => new Map(), []);

  useEffect(() => {
    if (backTestList.length > 0) {
      addEventClickRow();
    }
  }, [backTestList]);

  useEffect(() => {
    setSelectedRowKeys([]);

    loadOrderLogListData({
      SEARCH_KEYWORD: searchInput,
      START_CREATE_DT: createStDate,
      END_CREATE_DT: createEdDate,
      IS_BAN: type,
      PAGE_NUM: pageNum,
      PAGE_SIZE: pageSize
    });

    loadbackTestListData({
      SEARCH_KEYWORD: searchInput,
      START_CREATE_DT: createStDate,
      END_CREATE_DT: createEdDate,
      IS_BAN: type,
      PAGE_NUM: pageNum,
      PAGE_SIZE: pageSize
    });
    
  }, [pageNum]);

  useEffect(() => {
    window.addEventListener('keydown', handleEnterPress);

    return () => {
      window.removeEventListener('keydown', handleEnterPress);
    };
  }, [searchInput, createStDate, createEdDate, type]);

  const loadbackTestListData = useCallback(async (requestData, useCache = true) => {
    // setMberDataLoading(true);

    if (!requestData) {
      requestData = {
        SEARCH_KEYWORD: searchInput,
        START_DATE: createStDate,
        END_DATE: createEdDate,
        TYPE: type,
        PAGE_NUM: pageNum,
        PAGE_SIZE: pageSize
      };
    }
    const cacheKey = JSON.stringify({backTestLog : requestData});

    if (useCache) {
      if (cache.has(cacheKey)) {
        const cachedData = cache.get(cacheKey);
        setPageTotalCnt(cachedData.total);
        setbackTestList(cachedData.list);
        setbackTestDataLoading(false);
        return;
      }
    }

    try {
      const res = await api.get('/api/v1/upbit/getBackTestLogList', requestData);
      const result = res.data;
      if (result.success) {
        const data = result.pageInfo.paging;
        cache.set(cacheKey, { total: data.total, list: data.list });
        setPageTotalCnt(data.total);
        setbackTestList(data.list);
      }
    } catch (error) {
      dispatch(action.toast.setToast({
        visible: true,
        type: "ERROR",
        description: "서버 요청 중 문제가 발생했습니다.",
        message: "오류 발생"
      }));
    } finally {
      setbackTestDataLoading(false);
    }
  }, [searchInput, createStDate, createEdDate, type, pageNum, pageSize, cache, dispatch]);

  const loadOrderLogListData = useCallback(async (requestData, useCache = true) => {
    // setMberDataLoading(true);

    if (!requestData) {
      requestData = {
        SEARCH_KEYWORD: searchInput,
        START_DATE: createStDate,
        END_DATE: createEdDate,
        TYPE: type,
        PAGE_NUM: pageNum,
        PAGE_SIZE: pageSize
      };
    }
    const cacheKey = JSON.stringify({orderLog : requestData});

    if (useCache) {
      if (cache.has(cacheKey)) {
        const cachedData = cache.get(cacheKey);
        setPageTotalCnt(cachedData.total);
        setOrderLogList(cachedData.list);
        setOrderLogDataLoading(false);
        return;
      }
    }

    try {
      const res = await api.get('/api/v1/upbit/getOrderList', requestData);
      const result = res.data;
      if (result.success) {
        const data = result.pageInfo.paging;
        cache.set(cacheKey, { total: data.total, list: data.list });
        setPageTotalCnt(data.total);
        setOrderLogList(data.list);
      }
    } catch (error) {
      dispatch(action.toast.setToast({
        visible: true,
        type: "ERROR",
        description: "서버 요청 중 문제가 발생했습니다.",
        message: "오류 발생"
      }));
    } finally {
      setOrderLogDataLoading(false);
    }
  }, [searchInput, createStDate, createEdDate, type, pageNum, pageSize, cache, dispatch]);


  const handleEnterPress = useCallback((event) => {
    if (event.key === 'Enter') {
      clickSearchData();
    }
  }, [searchInput, createStDate, createEdDate, type]);

  const handlePageChange = useCallback((pageNumber) => {
    setPageNum(pageNumber);
  }, []);

  const handleClick = (e) => {
    const targetRow = e.target.closest(".ant-table-row");
    const label = targetRow?.querySelector(".ant-table-cell > label");
    if (label) {
      label.click();
    }
  };

  const addEventClickRow = () => {
    const rows = document.querySelectorAll(".ant-table-cell:not(.ant-table-selection-column)");

    rows.forEach(row => {
      row.addEventListener('click', handleClick);
    });
  };

  const handleSearchDataInit = useCallback(async () => {
    setSearchInput('');
    setCreateStDate(oneYearAgo);
    setCreateEdDate(today);
    setType('ALL');
    setPageNum(1);

    await loadbackTestListData({
      SEARCH_KEYWORD: '',
      START_DATE: oneYearAgo,
      END_DATE: today,
      TYPE: type,
      PAGE_NUM: 1,
      PAGE_SIZE: pageSize
    });

    await loadOrderLogListData({
      SEARCH_KEYWORD: '',
      START_DATE: oneYearAgo,
      END_DATE: today,
      TYPE: type,
      PAGE_NUM: 1,
      PAGE_SIZE: pageSize
    });

  }, [oneYearAgo, today, pageSize, loadbackTestListData,loadOrderLogListData]);

  const clickSearchData = () => {
    loadbackTestListData();
    loadOrderLogListData();
  };

  const order_columns = useMemo(() => [
    { label: 'ORDER_SEQ', key: 'ORDER_SEQ', width: '0%', textAlign: 'left', hidden: true },
    { label: '자산명', key: 'TICKER', width: '25%', textAlign: 'left', formatter: (value) => `${utils.getTickerName(value)}(${value})` },
    { label: '매수/매도', key: 'TYPE', width: '10%', textAlign: 'center', formatter: (value) => value === 'bid' ? <div style={{ color: '#F04251' }}>매수</div> : <div style={{ color: '#3485FA' }}>매도</div> },
    { label: '체결단가', key: 'ENTER_PRICE', width: '15%', textAlign: 'left', formatter: (value) => !value || value < 0 ? '-' : `${utils.formatToKRW(value, 2)}원` },
    { label: '체결액', key: 'ENTER_PRICE_KRW', width: '15%', textAlign: 'left', formatter: (value) => !value || value < 0 ? '-' : `${utils.formatToKRW(value, 2)}원` },
    { label: '체결일', key: 'ENTER_DATE', width: '25%', textAlign: 'left' },
  ], []);


  const columns = useMemo(() => [
    { label: 'BT_SEQ', key: 'BT_SEQ', width: '0%', textAlign: 'left', hidden: true },
    { label: '자산명', key: 'TICKER', width: '20%', textAlign: 'left', formatter: (value) => `${utils.getTickerName(value)}(${value})` },
    { label: '매수/매도', key: 'TYPE', width: '10%', textAlign: 'center', formatter: (value) => value === 'BUY' ? <div style={{ color: '#F04251' }}>매수</div> : <div style={{ color: '#3485FA' }}>매도</div> },
    { label: '예상체결가', key: 'ENTER_PRICE', width: '20%', textAlign: 'left', formatter: (value) => `${utils.formatToKRW(value, 2)}원` },
    { label: '체결일', key: 'ENTER_DATE', width: '20%', textAlign: 'left' },
  ], []);

  return (
    <>
      <SearchContainer>
        <SearchSection>
          <SearchContent>
            <label>자산명</label>
            <StyledSearch
              placeholder="검색어 입력"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onPressEnter={clickSearchData}
            />
          </SearchContent>
          <SearchContent>
            <label>체결일자</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <DatePicker

                format={dateFormat}
                value={dayjs(createStDate, dateFormat)}
                onChange={(date, dateString) => {
                  if (dateString > createEdDate) {
                    setCreateEdDate(date.format(dateFormat));
                  }
                  setCreateStDate(date ? date.format(dateFormat) : '');
                }}
                style={{ width: 125, height: 28, fontSize: 12 }}
              />
              <DatePicker
                format={dateFormat}
                value={dayjs(createEdDate, dateFormat)}
                onChange={(date, dateString) => {
                  if (dateString < createStDate) {
                    setCreateStDate(date.format(dateFormat));
                  }
                  setCreateEdDate(date ? date.format(dateFormat) : '');
                }}
                style={{ width: 125, height: 28 }}
              />
            </div>
          </SearchContent>
          <SearchContent>
            <label>계정상태</label>
            <Select
              style={{ height: 28, width: 80 }}
              value={type}
              onChange={value => setType(value)}>
              <Select.Option value="ALL">전체</Select.Option>
              <Select.Option value="BUY">매수</Select.Option>
              <Select.Option value="SELL">매도</Select.Option>
            </Select>
          </SearchContent>
        </SearchSection>
        <ButtonGroup>
          <Button style={{ fontSize: 12 }} size={'small'} onClick={clickSearchData}>검색</Button>
          <Button style={{ fontSize: 12 }} size={'small'} onClick={handleSearchDataInit}>초기화</Button>
        </ButtonGroup>
      </SearchContainer>
      <ButtonGroup style={{ marginBottom: 12, padding: "0px 12px" }}>
        {/* <Button style = {{fontSize:12}} size = {'small'} onClick={clickAddMember}>회원 추가</Button> */}
        {/* <Button style = {{fontSize:12}} size = {'small'} onClick={clickModifyMember}>회원 수정</Button> */}
        {/* <Button style = {{fontSize:12}} size = {'small'} onClick={clickDeleteMember}>회원 삭제</Button> */}
      </ButtonGroup>
      {/* <Card> */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <div>
          <TableComponent
            showCheckbox={false}
            columns={columns}
            data={backTestList}
            loading={backTestDataLoading}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
          />
        </div>

        <div>
          <TableComponent
            showCheckbox={false}
            columns={order_columns}
            data={orderLogList}
            loading={orderLogDataLoading}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
          />
        </div>
      </div>
      <Pagination
            size={'small'}
            current={pageNum}
            pageSize={pageSize}
            total={pageTotalCnt}
            onChange={handlePageChange}
          />
    </>
  );
}

export default BackTestLogPage;
