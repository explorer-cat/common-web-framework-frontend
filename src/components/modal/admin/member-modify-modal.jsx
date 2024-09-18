import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { action } from "../../../actions/actions";
import { Flex, Input, Typography, Button, Space, Modal, Select, Switch } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { runes } from 'runes2';
import { adminApi } from "../../../api/adminApi";
import DeptTreeModal from "./dept-tree-modal";
import { utils } from "../../../utils/utils";
import { api } from "../../../utils/customAxios";
import { error } from "highcharts";


/*
 * 사용자 관리 화면에서만 사용하는 개별 모달창이므로 전역모달로 관리하지 않음. 
 */
function MemberModifyModal({ visible, selectedRowKeys, successCallback, onClose }) {
    const dispatch = useDispatch();
    //모달창 입력데이터 상태 관리.
    const [inputData, setInputData] = useState({
        email: '',
        password: '',
        name: '',
        ban: '',
    })
    const [loading,setLoading] = useState(true);
    //확인 버튼 로딩 FLAG
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        getMemberInfo();
        console.log('selectedRowKey',selectedRowKeys[0])
        
    }, [])

    const getMemberInfo = () => {
        api.get('/api/v1/member/getMember', { MBER_ID: selectedRowKeys[0] }).then(res => {
            const result = res.data;
            console.log('result', result)
            if (result['success']) {
                setInputData({
                    email: result.data[0].EMAIL
                    , password: ''
                    , name: result.data[0].NAME
                    , ban: result.data[0].ISBAN
                });
                setLoading(false);
            }
        }).catch(error => {
            dispatch(action.toast.setToast({
                visible: true,
                type: "ERROR",
                description: "구성원 정보를 요청하던중 오류가 발생했어요.",
                message: "오류 발생"
            }))
            onClose();
        });
    }

    const handleOk = () => {
        let msg = ''
        const requestData = {
            MBER_ID: selectedRowKeys[0],
            EMAIL: inputData.email,
            PASSWORD: inputData.password.length <= 0 ? null : inputData.password,
            NAME: inputData.name,
            BAN: inputData.ban,
        }
        if (requestData.NAME.length > 10) msg = "이름은 10자 이하만 가능합니다."
        if (!requestData.EMAIL || requestData.EMAIL.length <= 0) msg = "이메일을 입력해주세요."
        if (!utils.validateEmail(requestData.EMAIL)) msg = "이메일 형식을 확인해주세요."
        if (!requestData.NAME || requestData.NAME.length <= 0) msg = "사용자 이름을 입력해주세요."
        if (requestData.NAME.length > 10) msg = "사용자 이름은 10자 이하만 입력해주세요."
        if (msg !== '' || msg.length > 0) {
            dispatch(action.toast.setToast({
                visible: true,
                type: "ERROR",
                message: msg
            }))
            return false;
        }
        setConfirmLoading(true);

        api.post('/api/v1/member/updateMember', requestData).then(res => {
            const data = res.data;
            if (!data.success) {
                dispatch(action.toast.setToast({
                    visible: true,
                    type: "ERROR",
                    description: data.message,
                    message: "오류 발생"
                }))
                setConfirmLoading(false)
            }

            if (data.success) {
                //성공 토스트 메시지 호출
                dispatch(action.toast.setToast({
                    visible: true,
                    type: "SUCCESS",
                    message: "정상적으로 처리되었어요"
                }))
                setConfirmLoading(false);
                //성공 콜백 함수 호출.
                successCallback();
            }
        }).catch(error => {
            console.error(error);
            dispatch(action.toast.setToast({
                visible: true,
                type: "ERROR",
                description: "서버 요청중 오류가 발생했습니다.",
                message: "오류 발생"
            }))
            setConfirmLoading(false)
        })
    };

    const handleCancel = () => {
        onClose();
    };
    if(loading) {
        return null;
    } else {
        return (
            <>
                <Modal
                    title="사용자 정보 변경"
                    centered
                    open={true}
                    onCancel={handleCancel}
                    width={330}
                    footer={[
                        <Button key="back" onClick={handleCancel} style={{ width: "calc(50% - 4px)", height: 40 }}>
                            취소
                        </Button>,
                        <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk}
                            style={{ width: "calc(50% - 4px)", height: 40 }}>
                            확인
                        </Button>
                    ]}>
                    <div>
                        <Flex vertical gap={12}>
                            <div>
                                <span className="fs14 bold ">이메일</span>
                                <Input
                                    onChange={(e) => {
                                        setInputData({
                                            ...inputData,
                                            email: e.target.value,
                                        })
                                    }}
                                    disabled={true}
                                    value={inputData.email}
                                    placeHolder="example@email.com"
                                />
                            </div>
                            <div>
                                <span className="fs14 bold ">비밀번호</span>
                                <Input.Password
                                    value={inputData.password}
                                    onChange={(e) => {
                                        setInputData({
                                            ...inputData,
                                            password: e.target.value,
                                        })
                                    }}
                                    placeholder="비밀번호" />
                                <span
                                    className="fs12"
                                    style={{
                                        color: '#FD5757',
                                        paddingLeft: 2,
                                    }}>{inputData.password.length > 0 ? '' : '입력하지않으면 이전 패스워드 유지'}</span>
                            </div>
                            <div>
                                <span className="fs14 bold ">사용자 이름</span>
                                <Input
                                    count={{
                                        show: true,
                                        max: 10,
                                    }}
                                    value={inputData.name}
                                    onChange={(e) => {
                                        setInputData({
                                            ...inputData,
                                            name: e.target.value,
                                        })
                                    }}
                                    placeHolder="이름"
                                    defaultValue=""
                                />
                            </div>
                            <div className="flex_column" style={{ marginBottom: 20 }}>
                                <span className="fs14 bold margin_b_4">사용자 계정 상태</span>
                                <div className="flex" style={{ alignItems: 'center', marginTop: 4 }}>
                                    <Switch style={{ width: 40 }}
                                        checked={inputData.ban === 'N' ? false : true}
                                        onChange={(change) => {
    
                                            setInputData({
                                                ...inputData,
                                                ban: change ? 'Y' : 'N'
                                            })
                                        }} />
                                    <span style={{ paddingLeft: 10 }}>
                                        {inputData.ban === 'N' ? '정상' : '정지'}
                                    </span>
                                </div>
                            </div>
                        </Flex>
                    </div>
                </Modal>
            </>
        );
    }
}

export default MemberModifyModal;
