import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import styled from 'styled-components'
import {Button, Flex, Spin, Table, Card, Modal, Input, Select, ConfigProvider , Divider, Pagination } from 'antd';
import {action} from "../../actions/actions";
import {useDispatch, useSelector} from "react-redux";
import {adminApi} from "../../api/adminApi";
import {utils} from "../../utils/utils";
import DeptTree from '../../components/tree/DeptTree';


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
const InfoItem = styled.div`
    display:flex;
    gap:0px;
    align-items: center;
    font-size:14px;
    font-weight:bold;
    // margin-bottom:14px;
    padding:15px 0px;
    border-bottom: 1px solid rgb(221, 221, 221);
`

const SearchGroup = styled.div`
    display:flex;
    align-items: flex-start;
    height: 32px;
    width:100%;
    margin-bottom:20px;
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
const sampleDept = [
    { "key": "1", "path": "기획부", "title": "기획부" },
    {
      "key": "2",
      "path": "개발부",
      "title": "개발부",
      "children": [
        { "key": "3", "path": "개발부/서비스 개발팀", "title": "서비스 개발팀" },
        {
          "key": "4",
          "path": "개발부/서비스 운영팀",
          "title": "서비스 운영팀",

          "children": [
            {
              "key": "5",
              "path": "개발부/서비스 운영팀/인프라팀",
              "title": "인프라팀",
              "children": [
                {
                  "key": "123",
                  "path": "개발부/서비스 운영팀/인프라팀/OA파트",
                  "title": "OA파트",

                },
                { "key": "63", "path": "개발부/서비스 운영팀/인프라팀/인프라2파트", "title": "인프라2파트" },
              ]
            },
          ]
        },
      ]
    },
    { "key": "8", "path": "디자인부", "title": "디자인부" },


    {
      "key": "9",
      "path": "영업부",
      "title": "영업부",
      "children": [
        {
          "key": "10",
          "path": "영업부/마케팅팀",
          "title": "마케팅팀",
          "children": [
            { "key": "11", "path": "영업부/마케팅팀/온라인 마케팅", "title": "온라인 마케팅" },
            { "key": "12", "path": "영업부/마케팅팀/오프라인 마케팅", "title": "오프라인 마케팅" }
          ]
        },
        { "key": "13", "path": "영업부/영업지원팀", "title": "영업지원팀" },
      ]
    },
    // 새로운 부서와 팀 추가
    {
      "key": "14",
      "path": "인사부",
      "title": "인사부",
      "children": [
        // 새로운 사람 추가
        { "key": "15", "path": "인사부/채용팀", "title": "채용팀" },
        {
          "key": "16",
          "path": "인사부/평가팀",
          "title": "평가팀",
        }
      ]
    },
    {
      "key": "17",
      "path": "재무부",
      "title": "재무부",
      "children": [
        { "key": "18", "path": "재무부/회계팀", "title": "회계팀" },
        { "key": "19", "path": "재무부/세무팀", "title": "세무팀" },
        // 새로운 사람 추가


      ]
    },
  ];

function DeptSettingPage(props) {
    const dispatch = useDispatch();
    const [selectDept, setSelectDept] = useState({});
    const [selectMember, setSelectMember] = useState({});
    const [inputDeptName,setInputDeptName] = useState('')
    const [inputDeptColor,setInputDeptColor] = useState('')
    const [activeSaveBtn,setActiveSaveBtn] = useState(false)


    useEffect(()=> {
        //기존 이름과 부서 컬러가 다른경우에만 변경사항 저장버튼을 활성화함.
        if(selectDept.title === inputDeptName) {
            setActiveSaveBtn(true)
        } else {
            setActiveSaveBtn(false)
        }
    },[inputDeptName,inputDeptColor])

    useEffect(()=> {
        setInputDeptName(selectDept.title)
    },[selectDept])


    const clickInsertDept = () => {
        const requestData = {
            DEPT_NAME : inputDeptName,
            PARENT_DEPT_SEQ : selectDept.key,
        }

        adminApi.insertDept(requestData).then((result) => {

            //사용자 추가에 실패했을 경우
            if (!result.success) {
                if (result.code === "DUPLICATED_DEPT") {
                    dispatch(action.toast.setToast({
                        visible:true,
                        type : "ERROR",
                        message : "중복된 부서명이에요."
                    }))
                } else {
                    console.error(result.message);
                    return false;
                }
            }

            //사용자 추가에 성공했을 경우
            if (result.success) {
                dispatch(action.toast.setToast({
                    visible:true,
                    type : "SUCCESS",
                    message : "정상적으로 처리되었어요"
                }))
            }
        })
    }
   /**
   * deptTarget : 클릭한 팀 정보
   */
  const clickDeptCallback = (deptTarget) => {
    //선택되어있는 정보가 있는 경우에만 dept정보를 state에 세팅함.
    console.log("deptTarget",deptTarget)
    setSelectDept(deptTarget)

  }

  /**
   * memberTarget : 클릭한 멤버 정보
   */
  const clickMemberCallback = (memberTarget) => {
    //선택되어있는 정보가 있는 경우에만 member정보를 state에 세팅함.
    setSelectMember(memberTarget);
  }



    //신규 구성원 생성에 성공했을 경우.

    return (
        <>

            <Card
                title="조직(팀) 관리"
                bordered={false}
                style={{
                    width: '100%',
                    height: '100%',
                    // height: 'calc(100vh - 50px)',
                    backgroundColor: '#FAFAFA'
                }}
            >
                <div className="flex">
                    <div style = {{width:300}}>
                        <DeptTree
                            type={0}
                            deptTreeData={sampleDept}
                            clickDeptCallback={clickDeptCallback}
                            clickMemberCallback={clickMemberCallback}
                        />
                    </div>
                    <div className = "flex_column" style = {{ margin:"0px 12px",borderRadius:20,width:'100%'}}>
                        <ButtonGroup>
                            <Button type="primary" onClick = {clickInsertDept}>하위 부서 추가</Button>
                            <Button type="primary" disabled = {activeSaveBtn}>변경사항 저장</Button>
                            <Button danger >삭제</Button>
                        </ButtonGroup>
                        {/* <Divider style = {{margin:0,borderColor:'#ddd'}}/> */}

                        <div style = {{padding:"20px 20px 20px 20px"}}>선택된 부서 : {selectDept.title}
                          <div style = {{padding:20}}>
                          <InfoItem>
                              <div style = {{width:100}}>SEQ</div>
                              <Input placeholder= {selectDept.key} style = {{minWidth:250}} disabled/>
                          </InfoItem>
                          <InfoItem>
                              <div style = {{width:100}}>부서위치</div>
                              <Input placeholder={selectDept.path} style = {{width:300}} disabled/>
                          </InfoItem>
                          <InfoItem>
                          <div style = {{width:100}}>부서명</div>
                              <Input  onChange = {(e) => setInputDeptName(e.target.value)} value = {inputDeptName} placeholder="Basic usage" style = {{width:300}} />
                          </InfoItem>
                          {/* <InfoItem>
                          <div style = {{width:100}}>부서 컬러</div>
                              <Input   onChange = {(e) => setInputDeptColor(e.target.value)} value ={inputDeptColor} placeholder="#C93DED" style = {{width:300}} />
                          </InfoItem> */}
                          </div>
                        </div>
                    </div>
                </div>


            </Card>

        </>
    );


}

export default DeptSettingPage;
