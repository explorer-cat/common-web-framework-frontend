import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';
import styled from 'styled-components'
import { Button, DatePicker, Flex, Spin, Table, Card, Modal, Input, Select, ConfigProvider, Divider, Pagination } from 'antd';
import { action } from "../../actions/actions";
import { useDispatch, useSelector } from "react-redux";
import { utils } from "../../utils/utils";
import MemberModifyModal from '../../components/modal/admin/member-modify-modal';
import MemberCreateModal from '../../components/modal/admin/member-create-modal';
import { LoadingOutlined } from '@ant-design/icons';
import { SizeContextProvider } from 'antd/es/config-provider/SizeContext';
import TableComponent from '../../components/table/TableComponent';
import { SubnodeOutlined, SearchOutlined, UndoOutlined} from '@ant-design/icons';
import { api } from '../../utils/customAxios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
const { confirm } = Modal;
dayjs.extend(customParseFormat);

const TitleContainer = styled.div`
  padding: 8px 4px 16px 4px;
`;

const Title = styled.h2`
  cursor: pointer;
  font-size: 1.5em;

  &:hover {
    color: #3498db; /* hover 시 색상 변경 */
    text-decoration: underline;
  }
`;

const Link = styled.a`
  text-decoration: none;
  color: inherit; /* 부모 요소의 색상을 상속 */
`;
const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    padding:12px 0px;
    justify-content: flex-end;
    width:100%;
`
const SearchContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    padding: 18px 12px;
    min-width: 960px;
    background: #f9f9f9;
    border-radius:5px;
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
    //background: #f9f9f9;
    padding: 0px 5px;
    //border-radius: 8px;
`
const StyledSearch = styled(Input)`
    // display: flex;
    width: 180px;
    font-size:12px;
    height:26px;
    // align-items: center;
    // padding-left: 15px;
`;

function MemberSettingPage(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dateFormat = 'YYYY/MM/DD';
    const today = dayjs().format(dateFormat);
    const oneYearAgo = dayjs().subtract(1, 'year').format(dateFormat);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //선택한 사용자 MBER_ID
    const [memberList, setMemberList] = useState([]); //테이블 사용자 정보
    const [createModal, setCreateModal] = useState(false); //사용자 생성 정보 팝업창
    const [modifyModal, setModifyModal] = useState(false); //사용자 수정 정보 팝업창 
    const [mberDataLoading, setMberDataLoading] = useState(false); //사용자 정보 요청 테이블 로딩
    const [searchInput, setSearchInput] = useState(''); //검색창 키워드검색
    const [createStDate, setCreateStDate] = useState(oneYearAgo); //검색창 시작일 
    const [createEdDate, setCreateEdDate] = useState(today); //검색창 종료일
    const [isBanOption, setIsBanOption] = useState('ALL'); //사용자 계정 활성화 여부
    const [paging, setPaging] = useState({
        pageNum : 1, //현재 페이지
        pageSize : 10, //테이블에 출력할 row 수
        total : 0, //총 조회 개수
    })
    
    useEffect(() => {
        if (memberList.length > 0) {
            addEventClickRow();
        }
    }, [memberList])

    useEffect(() => {
        //사용자 정보 요청
        loadMemberData();
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleEnterPress);
    
        return () => {
            window.removeEventListener('keydown', handleEnterPress);
        };
    }, [searchInput, createStDate, createEdDate, isBanOption]);


    const loadMemberData = (requestData = {
        SEARCH_KEYWORD : searchInput,
        START_CREATE_DT : createStDate,
        END_CREATE_DT : createEdDate,
        IS_BAN : isBanOption,
        PAGE_NUM : paging.pageNum,
        PAGE_SIZE : paging.pageSize
    }) => {
        setMberDataLoading(true);
        
        api.get('/api/v1/member/getMemberList', requestData).then(res => {
            const result = res.data;
            if (result['success']) {
                const data = result.pageInfo.paging;
                setMemberList(data.list);
                setPaging({
                     ...paging
                    ,total : data.total
                })
                setMberDataLoading(true);
            }
        }).catch(error => {
            setMberDataLoading(false);
            dispatch(action.toast.setToast({
                visible: true,
                type: "ERROR",
                description: "서버 요청중 문제가 발생했습니다.",
                message: "오류 발생"
            }))
        });
    };

    // 엔터 이벤트 핸들러 함수
    const handleEnterPress = (event) => {
        console.log('event',event.key)
        if (event.key === 'Enter') {
            clickSearchData();
        }
    };

    const handlePageChange = async (pageNumber) => {
        //pageNumber의 페이지 데이터를 호출
        loadMemberData({
            SEARCH_KEYWORD : searchInput,
            START_CREATE_DT : createStDate,
            END_CREATE_DT : createEdDate,
            IS_BAN : isBanOption,
            PAGE_NUM : pageNumber,
            PAGE_SIZE : paging.pageSize
        });
        //현재 페이지 상태를 업데이트
        setPaging({
            ...paging
           ,pageNum : pageNumber
       });
      };

    const handleClick = (e) => {
        const targetRow = e.target.closest(".ant-table-row");
        const label = targetRow?.querySelector(".ant-table-cell > label");
        if (label) {
            label.click();
        }
    };

    const addEventClickRow = () => {
        //체크박스 rows에는 이벤트를 부여하지 않을것임.
        const rows = document.querySelectorAll(".ant-table-cell:not(.ant-table-selection-column)");

        rows.forEach(row => {
            row.addEventListener('click', (e) => {
                handleClick(e)
            });
        });
    }
    //검색 정보 초기화
    const handleSearchDataInit = async () => {
        setSearchInput('');
        setCreateStDate(oneYearAgo);
        setCreateEdDate(today);
        setIsBanOption('ALL');

        await loadMemberData({
            SEARCH_KEYWORD : '',
            START_CREATE_DT : oneYearAgo,
            END_CREATE_DT : today,
            IS_BAN : 'ALL'
        });
    }
    //테이블 검색
    const clickSearchData = () => {
        loadMemberData();
    }

    const clickAddMember = () => {
        setCreateModal(true)
    }

    const clickModifyMember = () => {
        if (selectedRowKeys.length === 0) {
            dispatch(action.toast.setToast({
                visible: true,
                type: "WARNING",
                message: "수정할 구성원을 선택해주세요"
            }))
            return false;
        }

        if (selectedRowKeys.length > 1) {
            dispatch(action.toast.setToast({
                visible: true,
                type: "WARNING",
                message: "한명의 구성원만 선택해주세요"
            }))
            return false;
        }
        setModifyModal(true)
    }

    const closeModal = () => {
        setCreateModal(false)
        setModifyModal(false)
    }

    const clickDeleteMember = () => {
        if (selectedRowKeys.length <= 0) {
            dispatch(action.toast.setToast({
                visible: true,
                type: "WARNING",
                message: "삭제할 구성원을 선택해주세요"
            }))
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
                                await loadMemberData();

                                dispatch(action.toast.setToast({
                                    visible: true,
                                    type: "SUCCESS",
                                    message: "정상적으로 처리되었어요"
                                }))
                                resolve(true);
                            }
                        }).catch(error => {
                            dispatch(action.toast.setToast({
                                visible: true,
                                type: "ERROR",
                                description: "서버 요청중 문제가 발생했어요.",
                                message: "오류 발생"
                            }))
                            reject();
                        })
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }
    // 선택된 행의 키를 받아 상태 업데이트
    const handleSelectRows = (selectedRows) => {
        console.log('selectedRows', selectedRows)
        setSelectedRowKeys(selectedRows);
    };

    //신규 구성원 생성,수정에 성공했을 경우 콜백
    const successModalCallback = async () => {
        await loadMemberData(); //멤버 테이블 리플래쉬
        setCreateModal(false);//모달창 종료
        setModifyModal(false);//모달창 종료
    }

    const columns = [
        { label: 'MBER_ID', key: 'MBER_ID', width: '0%', textAlign: 'left', hidden: true },
        { label: '이름', key: 'NAME', width: '15%', textAlign: 'left' },
        { label: '이메일', key: 'EMAIL', width: '20%', textAlign: 'left' },
        { label: '부서', key: 'DEPT', width: '10%', textAlign: 'left' },
        { label: '계정상태', key: 'ISBAN', width: '15%', textAlign: 'left' },
        { label: '가입일', key: 'CREATE_DT', width: '20%', textAlign: 'left' },
        { label: '최종접속일', key: 'LAST_AC_DT', width: '20%', textAlign: 'left' },
    ];

    return (
        <>
            <TitleContainer>
                <Title>
                <Link onClick={()=> navigate('/admin/member')}>사용자 관리</Link>
                </Title>
            </TitleContainer>
            {/* 사용자 정보화면 개별 모달창 관리. */}
            {createModal ? <MemberCreateModal successCallback={successModalCallback} closeCallback={closeModal} /> : null}
            {modifyModal ? <MemberModifyModal selectedRowKey={selectedRowKeys} successCallback={successModalCallback} closeCallback={closeModal} /> : null}

            <div>
                {/* <Divider style={{ margin: 5 }} /> */}
                <SearchContainer>
                    {/* 시작영역 */}
                    <SearchSection>
                        <SearchContent>
                            <span><SearchOutlined /> 이름/부서명 검색</span>
                            <StyledSearch value = {searchInput}
                             placeholder="검색어를 입력하세요" 
                             allowClear onChange={(e)=>{
                                setSearchInput(e.target.value);
                            }} />
                        </SearchContent>
                        <SearchContent>
                            <span><SearchOutlined /> 가입일</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <DatePicker style={{ height: 26 }}
                                    value = {dayjs(createStDate, dateFormat)}
                                    placeholder='YYYY-MM-DD'
                                    onChange={(date, dateString) => {
                                        if (dateString > createEdDate) {
                                            setCreateEdDate(dateString);
                                        }
                                        setCreateStDate(dateString);
                                    }} /> ~
                                <DatePicker style={{ height: 26 }}
                                    value = {dayjs(createEdDate, dateFormat)}
                                    onChange={(date, dateString) => {
                                        if (dateString < createStDate) {
                                            setCreateStDate(dateString);
                                        }
                                        setCreateEdDate(dateString);
                                    }} />
                            </div>
                        </SearchContent>
                        <SearchContent>
                            <span><SearchOutlined /> 계정상태</span>
                            <Select size = "small" defaultValue="ALL" style={{ width: 120, height:26 }} onChange={(value) => {
                                setIsBanOption(value);
                            }}
                             value = {isBanOption}
                            //  optionFontSize={10} 
                             options={[
                                 { value: 'ALL', label: '전체'}
                                ,{ value: 'N', label: '활성화'}
                                ,{ value: 'Y', label: '비활성화'}
                                ]} />
                        </SearchContent>
                    </SearchSection>
                    <SearchSection>
                        <Divider type='vertical' style={{ marginTop: 19, height: 30 }} />
                        <SearchContent style = {{flexDirection:'row'}}>
                            <Button icon={<UndoOutlined />} style={{ marginTop: 14 }} onClick={handleSearchDataInit}>
                                조건초기화
                            </Button>
                            <Button icon={<SearchOutlined />} style={{ marginTop: 14 }} onClick={clickSearchData}>
                                검색
                            </Button>
                        </SearchContent>
                    </SearchSection>
                    {/* 종료영역 */}
                </SearchContainer>

                <ButtonGroup>
                    <Button type="primary" size={'small'} onClick={clickAddMember}><span style={{ fontSize: 12 }}>사용자 추가</span></Button>
                    <Button type="primary" size={'small'} onClick={clickModifyMember}><span style={{ fontSize: 12 }}>사용자 수정</span></Button>
                    <Button danger size={'small'} onClick={clickDeleteMember}><span style={{ fontSize: 12 }}>사용자 삭제</span></Button>
                </ButtonGroup>

                {/* <Divider style={{ margin: 5 }} /> */}
                {/* 여기 검색 박스 영역을 구성하고싶어 이쁘게 해줘*/}
                <TableComponent 
                loading = {mberDataLoading} 
                data={memberList} 
                columns={columns}  
                onSelectRows={handleSelectRows} 
                // dataTotalCnt = {}    //총 데이터 개수
                // pageSize={pageSize}  //한 화면에 몇개 출력
                // currentPage = {pageNum}  //현재 페이지 1,2,3
                pageInfo = {paging}
                handlePageChange={(pageNum)=> handlePageChange(pageNum)} //페이징버튼을 눌렀을때 이벤트
                // total = {totalMemberCnt}
                 />
            </div>
        </>
    );


}

export default MemberSettingPage;
