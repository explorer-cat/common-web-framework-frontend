import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { adminApi } from "../../../api/adminApi";
import { Button, Modal, Space } from 'antd';
import DeptTree from "../../tree/DeptTree";
import { action } from "../../../actions/actions";


const sampleAll = [
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
                "children": [
                  { "key": "203", "type": -1, "name": "변학도", "position": "사원", "title": "" },
                  { "key": "204", "type": -1, "name": "향단이", "position": "대리", "title": "파트장" }
                ]
              },
              { "key": "63", "path": "개발부/서비스 운영팀/인프라팀/인프라2파트", "title": "인프라2파트" },
            ]
          },
          { "key": "6", "path": "개발부/서비스 운영팀/QA팀", "title": "QA팀" },
          { "key": "50", "path": "개발부/서비스 운영팀/QA팀", "type": -1, "name": "홍길동 ", "position": "차장", "title": "팀장" },
          { "key": "51", "path": "개발부/서비스 운영팀/QA팀", "type": -1, "name": "이몽룡", "position": "과장", "title": "파트장" },
          { "key": "52", "path": "개발부/서비스 운영팀/QA팀", "type": -1, "name": "성춘향", "position": "대리", "title": "" },
          { "key": "53", "path": "개발부/서비스 운영팀/QA팀", "type": -1, "name": "변학도", "position": "사원", "title": "" },
          { "key": "54", "path": "개발부/서비스 운영팀/QA팀", "type": -1, "name": "향단이", "position": "부장", "title": "" }
        ]
      },
    ]
  },
  { "key": "8", "path": "디자인부", "title": "디자인부" },
  // 새로운 사람 추가
  { "key": "30", "type": -1, "name": "거북이", "position": "과장", "title": "" },
  { "key": "31", "type": -1, "name": "두루미", "position": "사원", "title": "" },
  { "key": "32", "type": -1, "name": "이우", "position": "대리", "title": "" },

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
        "children": [
          { "key": "40", "type": -1, "name": "디지비", "position": "과장", "title": "" },
          { "key": "41", "type": -1, "name": "데이터", "position": "사원", "title": "" },
          { "key": "42", "type": -1, "name": "시스템", "position": "대리", "title": "" }
        ]
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
      { "key": "20", "type": -1, "name": "홍길순", "position": "과장", "title": "" },
      { "key": "21", "type": -1, "name": "전우치", "position": "사원", "title": "" },
      { "key": "22", "type": -1, "name": "임꺽정", "position": "대리", "title": "" }

    ]
  },
];

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

/*
 * 사용자 관리 화면에서만 사용하는 개별 모달창이므로 전역모달로 관리하지 않음. 
 */
function DeptTreeModal({ selectValue, successCallback, closeCallback }) {
  const dispatch = useDispatch();
  const [selectDept, setSelectDept] = useState(selectValue?.dept?.title?.length > 0 ? selectValue.dept : {});
  const [selectMember, setSelectMember] = useState({});


  useEffect(() => {

    console.log("selectValue", selectValue)
    //부서 리스트 조회
    adminApi.getSysDept().then((result) => {
      // setDeptOption(result.data)
    })


  }, [])

  /**
   * deptTarget : 클릭한 팀 정보
   */
  const clickDeptCallback = (deptTarget) => {
    //선택되어있는 정보가 있는 경우에만 dept정보를 state에 세팅함.
    setSelectDept(deptTarget)
  }

  /**
   * memberTarget : 클릭한 멤버 정보
   */
  const clickMemberCallback = (memberTarget) => {
    //선택되어있는 정보가 있는 경우에만 member정보를 state에 세팅함.
    setSelectMember(memberTarget);
  }

  useEffect(() => {
    console.log("selectValue", selectValue)
  }, [])

  return (
    <>
      <Modal
        title="팀/부서 선택"
        open={true}
        onOk={
          () => {

            //한개라도 선택된 selected가 존재해야함.
            if (document.querySelector(".ant-modal-body .ant-tree-node-selected")) {
              successCallback(
                {
                  dept: selectDept,
                  member: selectMember
                })
            } else {
                dispatch(action.toast.setToast({
                  visible:true,
                  type : "WARNING",
                  // description :"구성원 정보를 요청하던중 오류가 발생했어요.",
                  message : "선택된 팀/부서가 없어요"
              }))
              return false;
            }
          }
        }
        onCancel={closeCallback}
        okText="확인"
        cancelText="취소"
        width={350}
      >
        <DeptTree
          type={0}
          selectValue={selectValue}
          deptTreeData={sampleDept}
          clickDeptCallback={clickDeptCallback}
          clickMemberCallback={clickMemberCallback}
        />
      </Modal>
    </>
  );
}

export default DeptTreeModal;
