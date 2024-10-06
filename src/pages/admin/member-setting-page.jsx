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

function MemberSettingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dateFormat = 'YYYY/MM/DD';
  const today = dayjs().format(dateFormat);
  const oneYearAgo = dayjs().subtract(6, 'month').format(dateFormat);
  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [memberList, setMemberList] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [modifyModal, setModifyModal] = useState(false);
  const [mberDataLoading, setMberDataLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [createStDate, setCreateStDate] = useState(oneYearAgo);
  const [createEdDate, setCreateEdDate] = useState(today);
  const [isBanOption, setIsBanOption] = useState('ALL');
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [pageTotalCnt, setPageTotalCnt] = useState(0);

  const cache = useMemo(() => new Map(), []);

  useEffect(() => {
    if (memberList.length > 0) {
      addEventClickRow();
    }
  }, [memberList]);

  useEffect(() => {
    loadMemberData();
  }, []);

  useEffect(()=> {
    console.log('selectedRowKeys',selectedRowKeys)
  },[selectedRowKeys])

  useEffect(() => {
    setSelectedRowKeys([]);
    
    loadMemberData({
      SEARCH_KEYWORD: searchInput,
      START_CREATE_DT: createStDate,
      END_CREATE_DT: createEdDate,
      IS_BAN: isBanOption,
      PAGE_NUM: pageNum,
      PAGE_SIZE: pageSize
    });
  }, [pageNum]);

  useEffect(() => {
    window.addEventListener('keydown', handleEnterPress);

    return () => {
      window.removeEventListener('keydown', handleEnterPress);
    };
  }, [searchInput, createStDate, createEdDate, isBanOption]);

  const loadMemberData = useCallback(async (requestData,useCache = true) => {
    // setMberDataLoading(true);

    if (!requestData) {
      requestData = {
        SEARCH_KEYWORD: searchInput,
        START_CREATE_DT: createStDate,
        END_CREATE_DT: createEdDate,
        IS_BAN: isBanOption,
        PAGE_NUM: pageNum,
        PAGE_SIZE: pageSize
      };
    }
    const cacheKey = JSON.stringify(requestData);

    if(useCache) {
      if (cache.has(cacheKey)) {
        const cachedData = cache.get(cacheKey);
        setPageTotalCnt(cachedData.total);
        setMemberList(cachedData.list);
        setMberDataLoading(false);
        return;
      }
    }
    
    try {
      const res = await api.get('/api/v1/member/getMemberList', requestData);
      const result = res.data;
      if (result.success) {
        const data = result.pageInfo.paging;
        cache.set(cacheKey, { total: data.total, list: data.list });
        setPageTotalCnt(data.total);
        setMemberList(data.list);
      }
    } catch (error) {
      dispatch(action.toast.setToast({
        visible: true,
        type: "ERROR",
        description: "서버 요청 중 문제가 발생했습니다.",
        message: "오류 발생"
      }));
    } finally {
      setMberDataLoading(false);
    }
  }, [searchInput, createStDate, createEdDate, isBanOption, pageNum, pageSize, cache, dispatch]);

  const handleEnterPress = useCallback((event) => {
    if (event.key === 'Enter') {
      clickSearchData();
    }
  }, [searchInput, createStDate, createEdDate, isBanOption]);

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
    setIsBanOption('ALL');
    setPageNum(1);

    await loadMemberData({
      SEARCH_KEYWORD: '',
      START_CREATE_DT: oneYearAgo,
      END_CREATE_DT: today,
      IS_BAN: 'ALL',
      PAGE_NUM: 1,
      PAGE_SIZE: pageSize
    });
  }, [oneYearAgo, today, pageSize, loadMemberData]);

  const clickSearchData = () => {
    loadMemberData();
  };

  const clickAddMember = () => {
    setCreateModal(true);
  };

  const clickModifyMember = () => {
    if (selectedRowKeys.length === 0) {
      dispatch(action.toast.setToast({
        visible: true,
        type: "WARNING",
        message: "수정할 구성원을 선택해주세요"
      }));
      return false;
    }
    
    if (selectedRowKeys.length > 1) {
      dispatch(action.toast.setToast({
        visible: true,
        type: "WARNING",
        message: "한명의 구성원만 선택해주세요"
      }));
      return false;
    }
    
    setModifyModal(true);
  };

  const closeModal = () => {
    setCreateModal(false);
    setModifyModal(false);
  };

  const successCallback = () => {
    loadMemberData(null,false);
    setCreateModal(false);
    setModifyModal(false);
  }

  const clickDeleteMember = () => {
    if (selectedRowKeys.length <= 0) {
      dispatch(action.toast.setToast({
        visible: true,
        type: "WARNING",
        message: "삭제할 구성원을 선택해주세요"
      }));
      return;
    }
    confirm({
      title: '삭제 확인',
      icon: <ExclamationCircleFilled />,
      content: '선택하신 사용자를 삭제하시겠어요?',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk() {
        return new Promise((resolve, reject) => {
          api.post('/api/v1/member/removeMember', { MBER_ID: selectedRowKeys })
            .then(async (res) => {
              const result = res.data;
              if (result.success) {
                await loadMemberData(null,false);
                setSelectedRowKeys([]);
                dispatch(action.toast.setToast({
                  visible: true,
                  type: "SUCCESS",
                  message: "정상적으로 처리되었어요"
                }));
                resolve(true);
              }
            }).catch(error => {
              dispatch(action.toast.setToast({
                visible: true,
                type: "ERROR",
                description: "서버 요청 중 문제가 발생했어요.",
                message: "오류 발생"
              }));
              // reject("삭제 실패");
            });
        });
      },
    });
  };

  const columns = useMemo(() => [
    { label: 'MBER_ID', key: 'MBER_ID', width: '0%', textAlign: 'left', hidden: true },
    { label: '이름', key: 'NAME', width: '15%', textAlign: 'left' },
    { label: '이메일', key: 'EMAIL', width: '20%', textAlign: 'left' },
    { label: '부서', key: 'DEPT', width: '10%', textAlign: 'left' },
    { label: '계정상태', key: 'ISBAN', width: '15%', textAlign: 'left' },
    { label: '가입일', key: 'CREATE_DT', width: '20%', textAlign: 'left' },
    { label: '최종접속일', key: 'LAST_AC_DT', width: '20%', textAlign: 'left' },
  ], []);

  return (
    <>
      <SearchContainer>
        <SearchSection>
          <SearchContent>
            <label>이름</label>
            <StyledSearch
              placeholder="검색어 입력"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onPressEnter={clickSearchData}
            />
          </SearchContent>
          <SearchContent>
            <label>가입일자</label>
            <div style = {{display:'flex', alignItems:'center',gap:12}}>
              <DatePicker
              
                format={dateFormat}
                value={dayjs(createStDate, dateFormat)}
                onChange={(date,dateString) =>  {
                  if(dateString > createEdDate) {
                    setCreateEdDate(date.format(dateFormat));
                  }
                  setCreateStDate(date ? date.format(dateFormat) : '');
                }}
                style = {{width:125,height:28,fontSize:12}}
              />
              <DatePicker
                format={dateFormat}
                value={dayjs(createEdDate, dateFormat)}
                onChange={(date,dateString) => {
                  if(dateString < createStDate) {
                    setCreateStDate(date.format(dateFormat));
                  }
                  setCreateEdDate(date ? date.format(dateFormat) : '');
                }}
                style = {{width:125,height:28}}
              />
            </div>
          </SearchContent>
          <SearchContent>
            <label>계정상태</label>
            <Select
              style = {{height:28,width:80}}
              value={isBanOption}
              onChange={value => setIsBanOption(value)}>
              <Select.Option value="ALL">전체</Select.Option>
              <Select.Option value="ACTIVE">활성</Select.Option>
              <Select.Option value="INACTIVE">비활성</Select.Option>
            </Select>
          </SearchContent>
        </SearchSection>
        <ButtonGroup>
          <Button style = {{fontSize:12}} size = {'small'} onClick={clickSearchData}>검색</Button>
          <Button style = {{fontSize:12}} size = {'small'} onClick={handleSearchDataInit}>초기화</Button>
        </ButtonGroup>
      </SearchContainer>
      <ButtonGroup style = {{marginBottom:12,padding:"0px 12px"}}>
          <Button style = {{fontSize:12}} size = {'small'} onClick={clickAddMember}>회원 추가</Button>
          <Button style = {{fontSize:12}} size = {'small'} onClick={clickModifyMember}>회원 수정</Button>
          <Button style = {{fontSize:12}} size = {'small'} onClick={clickDeleteMember}>회원 삭제</Button>
      </ButtonGroup>
      {/* <Card> */}
        <TableComponent
          style = {{height:400}}
          columns={columns}
          data={memberList}
          loading={mberDataLoading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          
        />
        <Pagination
          size ={'small'}
          current={pageNum}
          pageSize={pageSize}
          total={pageTotalCnt}
          onChange={handlePageChange}
        />
      {/* </Card> */}
      {createModal && <MemberCreateModal successCallback = {successCallback}  onClose={closeModal} />}
      {modifyModal && <MemberModifyModal successCallback = {successCallback}  onClose={closeModal} selectedRowKeys={selectedRowKeys} />}

    </>
  );
}

export default MemberSettingPage;
