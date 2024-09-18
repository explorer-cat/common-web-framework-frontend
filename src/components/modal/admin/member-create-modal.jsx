import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { action } from "../../../actions/actions";
import { Flex, Input, Typography, Button, Space, Modal, Select } from 'antd';
import { utils } from "../../../utils/utils";
import { api } from "../../../utils/customAxios";

/*
 * 사용자 관리 화면에서만 사용하는 개별 모달창이므로 전역모달로 관리하지 않음. 
 */
function MemberCreateModal({ successCallback, closeCallback }) {
    const dispatch = useDispatch();
    //모달창 입력데이터 상태 관리.
    const [inputData, setInputData] = useState({
        email: '',
        password: '',
        name: '',
        dept: '',
        position: '',
        auth: '',
    })
    //확인 버튼 로딩 FLAG
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleOk = () => {
        let msg = ''

        const requestData = {
            EMAIL: inputData.email,
            PASSWORD: inputData.password,
            NAME: inputData.name,
            BAN: 'N'
        }

        if (requestData.NAME.length > 10) msg = "이름은 10자 이하만 가능합니다."
        if (!requestData.EMAIL || requestData.EMAIL.length <= 0) msg = "이메일을 입력해주세요."
        if (!utils.validateEmail(requestData.EMAIL)) msg = "이메일 형식을 확인해주세요."
        if (!requestData.PASSWORD || requestData.PASSWORD.length <= 0) msg = "비밀번호를 입력해주세요."
        if (!requestData.NAME || requestData.NAME.length <= 0) msg = "사용자 이름을 입력해주세요."
        if (requestData.NAME.length > 10) msg = "사용자 이름은 10자 이하만 입력해주세요."

        //validate
        if (msg !== '' || msg.length > 0) {
            dispatch(action.toast.setToast({
                visible: true,
                type: "ERROR",
                message: msg
            }))
            return false;
        }

        setConfirmLoading(true)

        api.post('/api/v1/member/insertMember', requestData)
            .then(res => {
                const data = res.data;
                //사용자 추가에 실패했을 경우 
                if (!data.success) {
                    dispatch(action.toast.setToast({
                        visible: true,
                        type: "ERROR",
                        message: data.message
                    }))
                    setConfirmLoading(false)
                }

                if (data.success) {
                    setTimeout(() => {
                        setConfirmLoading(false);
                        //성공 콜백 함수 호출.
                        successCallback();
                        //성공 토스트 메시지 호출
                        dispatch(action.toast.setToast({
                            visible: true,
                            type: "SUCCESS",
                            message: "정상적으로 처리되었어요"
                        }))

                    }, 1000);
                }
            }).catch(error => {
                console.error("Error occurred:", error);

            })
    }
    
    const handleCancel = () => {
        //취소하면 입력했던 생성창 초기화.
        setInputData({
            email: '',
            password: '',
            name: '',
            dept: {},
            position: '',
            auth: '',
        }
        );
        closeCallback();
    };

    return (
        <Modal
            title="신규 구성원 생성"
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
                            placeholder="password" />
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
                </Flex>
            </div>
        </Modal>
    );
}

export default MemberCreateModal;
