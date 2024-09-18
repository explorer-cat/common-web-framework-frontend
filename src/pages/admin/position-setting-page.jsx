import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import SelectTable from "../../components/table/TableComponent";
import { ExclamationCircleFilled } from '@ant-design/icons';
import styled from 'styled-components'
import {Button, Flex, Spin, Table, Card, Modal, Input, Select, ConfigProvider , Divider, Pagination } from 'antd';
import {action} from "../../actions/actions";
import {useDispatch, useSelector} from "react-redux";
import {adminApi} from "../../api/adminApi";
import {utils} from "../../utils/utils";
import { LoadingOutlined } from '@ant-design/icons';
import { SizeContextProvider } from 'antd/es/config-provider/SizeContext';
import PublicInputModal from '../../components/modal/admin/position-create-modal';
import PositionCreateModal from '../../components/modal/admin/position-create-modal';


const { confirm } = Modal;
const { Search } = Input;


const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  height:60px;
  padding : 12px 20px;
  background-color:#e6f4ff;
  border-radius:12px;
`

const SearchGroup = styled.div`
    display:flex;
    align-items: flex-start;
    height: 32px;
    width:100%;
    margin:20px 0px;
    // padding:12px 0px;
    border-radius:12px;
    .row {
        display:flex;
        flex-direction: column;
        // align-items: center;
        gap:12px;
        font-size:14px;
        font-weight:600;
    }
`
const columns = [
    {
        title: 'SEQ',
        dataIndex: 'POSITION_SEQ',
        width: 0,
        hidden : true,
    },
    {
        title: '직급',
        dataIndex: 'POSITION_NAME',
        width: 40,
        // sorter: true,
    },
    {
        title: '정렬 순서',
        dataIndex: 'POSITION_ORDER',
        width: 40,
        sorter: true,
    },
    {
        title: '업데이트일',
        dataIndex: 'UPDATED',
        width: 60,
        sorter: (a, b) => a.UPDATED - b.UPDATED,
        
    },
    {
        title: '',
        dataIndex: '',
        width: 300,
        // sorter: (a, b) => a.CREATED - b.CREATED,
        
    },
];
function PositionSettingPage(props) {
    const dispatch = useDispatch();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [reload, setReload] = useState(false);
    const [data, setData] = useState({});
    const [dataCnt,setDataCnt] = useState(0);
    const [createModal, setCreateModal] = useState(false)
    const [modifyModal, setModifyModal] = useState(false)
    const [selectedRowObject, setSelectedRowObject] = useState({});
    const [searchOption, setSearchOption] = useState('ALL');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [page,setPage] = useState(1)
    const [pageSize,setPageSize] = useState(15)

    //현재 테이블에 체크되어있는 솔팅정보
    const [tableSort, setTableSort]  = useState(null)

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };



    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const loadPositionData = (requestData) => {
        return new Promise((resolve) => {
            adminApi.getSysPosition(requestData).then((result) => {
           
                console.log("result : ",result)
                
                result.data.positionMap.forEach((item, index) => {
                    item['key'] = item.SEQ;
                });
    

                setData(result.data);
                //총 row 개수 세팅
                setLoading(false);
                resolve(true)
            })
        })

    }

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


    useEffect(() => {
        if (data.length > 0) {
            addEventClickRow();
        }
    }, [data])



    useEffect(() => {
        //
        const requestData = {
            SEARCH_TYPE : searchOption,
            SEARCH_KEYWORD : searchKeyword,
            PAGE : page,
            PAGE_SIZE : pageSize,
        }

        loadPositionData(requestData);
    }, []);

    //테이블 검색 
    const clickSearchTable = async (value, _e, info) => {
        //검색버튼을 눌렀다면 현재 키워드를 state에 세팅을함
        // -> 검색 결과 이후 페이징할때마다 해당 키워드에 대한 페이징 정보를 가져와야하기떄문
        // -> 인풋박스가 변경될때마다 state에 저장하지 않는 이유는 인풋박스에 키워드만 적고 검색 버튼을
        // -> 누르지 않았을 경우에는 페이징이 전체 처리가 되어야함.
        setSearchKeyword(value)
        let requestData = {};
         
        //검색어가 하나도 없는 상태로 눌렀을 경우 전체 검색으로 간주.
        if(value.length <= 0 || value === '') {
            setPage(1)

            requestData = {
                SEARCH_TYPE : 'ALL',
                SEARCH_KEYWORD : value,
                PAGE : 1,
                PAGE_SIZE : 15,
            }
        }  else {
            requestData = {
                SEARCH_TYPE : searchOption,
                SEARCH_KEYWORD : value,
                PAGE : page,
                PAGE_SIZE : pageSize,
            }
    
        }


       await loadPositionData(requestData);

       dispatch(action.toast.setToast({
        visible:true,
        type : "SUCCESS",
        timer : 2000,
        message : "검색이 완료되었어요"
     }))

    }

    const clickAddPosition = () => {
        setCreateModal(true)
    }

    const clickModifyMember = () => {
        if(selectedRowKeys.length === 0) {
            dispatch(action.toast.setToast({
                visible:true,
                type : "WARNING",
                message : "수정할 구성원을 선택해주세요"
            }))
            return;
        }

        if(selectedRowKeys.length > 1) {
            dispatch(action.toast.setToast({
                visible:true,
                type : "WARNING",
                message : "한명의 구성원만 선택해주세요"
            }))
            return;
        }
        setSelectedRowObject(utils.findObjectByProperty(data.positionMap,"SEQ",selectedRowKeys[0]));
        setModifyModal(true)
    }

    const closeModal = () => {
        setCreateModal(false)
        setModifyModal(false)
    }


    const clickDeleteMember = () => {
        if(selectedRowKeys.length <= 0) {
            dispatch(action.toast.setToast({
                visible:true,
                type : "WARNING",
                message : "삭제할 구성원을 선택해주세요"
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

                    const requestData = {
                        SEQ : selectedRowKeys.toString()
                    }
                    adminApi.deleteMember(requestData).then((result)=> {
                        if(result.success) {
                            //현재 세팅되어있는 데이터에서 삭제한 SEQ ROW만 화면에서 지워줌.
                            const removeList = utils.removeObjectsWithValue(data.positionMap, "SEQ", selectedRowKeys)
                            setData({
                                ...data,
                                positionMap : removeList,
                            });
                            dispatch(action.toast.setToast({
                                visible:true,
                                type : "SUCCESS",
                                // description :"성공성공",
                                message : "정상적으로 처리되었어요"
                            }))
                            resolve(true)
                        }
                    })

                  }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {
              console.log('Cancel');
            },
          });

    }


    //테이블 onChange 관련 이벤트 
    const handleTableChange = (pagination, filters, sorter) => {
    // 서버에 새로 요청하지 않고 현재 Data status 안에서만 필터함.
    // data < 여기에 데이터가 있음.
        let { field, order } = sorter;

        //스트링 기준 정렬이 아닌 SEQ를 기준으로 정렬이 필요한 친구들.
        if (field === 'POSITION_NAME') {
            field = 'POSITION_SEQ';
        }
        let sortedData = [...data.positionMap]; // data 배열을 복사하여 새로운 배열 생성
        
        if (order === 'descend') {
        
            sortedData.sort((a, b) => {
                if (a[field] < b[field]) {
                    return 1;
                }
                if (a[field] > b[field]) {
                    return -1;
                }
                return 0;
            });
        } else if (order === 'ascend') {
            sortedData.sort((a, b) => {
                if (a[field] < b[field]) {
                    return -1;
                }
                if (a[field] > b[field]) {
                    return 1;
                }
                return 0;
            });
        } else {

        // 기본적으로 SEQ를 기준으로 오름차순으로 정렬
        sortedData.sort((a, b) => a.POSITION_SEQ - b.POSITION_SEQ);
        }


    
    setData({
        ...data,
         positionMap : sortedData,
    })


    }

    //신규 구성원 생성,수정에 성공했을 경우 콜백
    const successModalCallback = async () => {
        // 그냥 테이블을 init 해버림.
        const requestData = {
            SEARCH_TYPE : searchOption,
            SEARCH_KEYWORD : searchKeyword,
            PAGE : page,
            PAGE_SIZE : pageSize,
        }

        await loadPositionData(requestData); //멤버 테이블 리플래쉬
        setCreateModal(false);//모달창 종료
        setModifyModal(false);//모달창 종료

    }

    //신규 구성원 생성에 성공했을 경우.

    return (
        <>
             {/* 사용자 정보화면 개별 모달창 관리. */}
            {createModal ? <PositionCreateModal   
                successCallback = {successModalCallback} 
                closeCallback = {closeModal} /> : null }
            {/* {modifyModal ? <MemberModifyModal selectedValue = {selectedRowObject} successCallback = {successModalCallback} closeCallback = {closeModal} /> : null } */}
 

          <Card
                title="직급/직책 관리"
                bordered={false}
                style={{
                width: '100%',
                height: '100%',
                // height: 'calc(100vh - 50px)',
                backgroundColor:'#FAFAFA'
            }}
            >
            <ButtonGroup>
                <Button type="primary" onClick = {clickAddPosition}>직급 추가</Button>
                <Button type="primary" onClick = {clickModifyMember}>직급 정보 수정</Button>
                <Button danger onClick = {clickDeleteMember}>삭제</Button>
                {/* <span>전체 사용자 : <span className = "bold fs14">{data.length} </span>명</span> */}
            </ButtonGroup>
            <SearchGroup>
                <div className = 'row' style = {{width:460}}>
                        <div style = {{alignItems:'center'}} class = "flex gap12">
                            {/* <span>검색 : </span> */}
                                <ConfigProvider
                                theme={{
                                    components: {
                                    Select: {
                                        fontSize : 13,
                                    },
                                    Input : {
                                        fontSize: 13,
                                    }
                                    },
                                }}>
                                <Select
                                    defaultValue="ALL"
                                    style={{
                                        width: 120,
                                    }}
                                    onChange={(value) => {
                                        setSearchOption(value)
                                    }}
                                    optionFontSize = {12}
                                    options={[
                                        {
                                            value: 'ALL',
                                            label: '전체',
                                        },
                                    ]}
                                    />
                                <Search
                                    placeholder="검색어를 입력하세요"
                                    allowClear
                                    onSearch={clickSearchTable}
                                    style={{
                                        width: 260,
                                    }}
                                    />
                                </ConfigProvider>
                        </div>
                </div>
            </SearchGroup>
            <Divider />
            <div className = "flex"
            style = {{
                padding:"8px 0px",
                // padding
                width: '100%',
                justifyContent: 'space-between',
            }}>
                <div className = "flex fs16" style = {{height:40,alignItems:'center',paddingLeft:8}}>
                    {/* {searchKeyword.length > 0 ?   <span>찾은 사용자 : <span className = "bold fs14"> {data.dataCnt} </span> 명</span> :  <span>전체 : <span className = "bold fs14"> {data.totalCnt} </span> 명</span>}  */}
                    <Pagination
                    total={searchKeyword.length > 0 ? data.dataCnt : data.totalCnt}
                    current = {page} //현재
                    onChange={async (pageNum)=>{
                        //클릭한 페이지 세팅
                        setPage(pageNum)

                        //페이지 넘어가면 선택했던것들 초기화.
                        setSelectedRowKeys([])


                        await loadPositionData({
                            SEARCH_TYPE : searchOption,
                            SEARCH_KEYWORD : searchKeyword,
                            PAGE : pageNum,
                            PAGE_SIZE : pageSize,
                        })
                    }}
                    // disabled
                    defaultCurrent={1} 
                    defaultPageSize = {15}
                />
                </div>
                {/* <Pagination
                    total={searchKeyword.length > 0 ? data.dataCnt : data.totalCnt}
                    current = {page} //현재
                    onChange={async (pageNum)=>{
                        //클릭한 페이지 세팅
                        setPage(pageNum)

                        //페이지 넘어가면 선택했던것들 초기화.
                        setSelectedRowKeys([])


                        await loadPositionData({
                            SEARCH_TYPE : searchOption,
                            SEARCH_KEYWORD : searchKeyword,
                            PAGE : pageNum,
                            PAGE_SIZE : pageSize,
                        })
                    }}
                    // disabled
                    defaultCurrent={1} 
                    // pageSizeOptions = {[20]}
                    defaultPageSize = {15}
                /> */}
            </div>

            <ConfigProvider
                theme={{
                    token: {
                        opacityLoading : 0.8,
                    /* here is your global tokens */
                    },
                }}
                >
            {/*테이블 버튼 기능 영역*/}
            <div id = "admin-position-table-container" style = {{minWidth:1400}}>
            <Table
             loading={loading ? { indicator: 
            
                <Spin
                indicator={
                  <LoadingOutlined
                    style={{
                      fontSize: 24,
                    }}
                    spin
                  />
                }
              />

            } : false}

                rowSelection={rowSelection}
                columns={columns}
                size={"small"}
                scroll={{
                    // x: 2000,
                    y: 500,
                  }}
                  pagination = {false}
                  onChange={handleTableChange}
                // pagination={{
                //     pageSize: 15,

                    //페이지네이션 이벤트가 발생한다면 테이블의 이벤트 리스너들을 다시 불러옴.
                    // onChange: () => {
                    //     //페이지네이션이 바뀌면 체크해놨던거 다 해제.
                    //     setSelectedRowKeys([])
                    //     //전체 테이블 리로드
                    //     setReload(!reload)
                    // }
                // }}
                dataSource={data.positionMap}/>
            </div>
        </ConfigProvider>
        </Card>

        </>
    );


}

export default PositionSettingPage;
