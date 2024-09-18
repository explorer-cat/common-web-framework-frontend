import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Flex, Input, Typography, Button, Space, Modal, Select } from 'antd';
import { action } from "../../../actions/actions";
import { adminApi } from "../../../api/adminApi";




function PublicInputModal({ title = '추가', maxTextCount, placeHolder, successCallback, closeCallback }) {
    const dispatch = useDispatch();
    const [inputText, setInputText] = useState('')
    //확인 버튼 로딩 FLAG
    const [confirmLoading, setConfirmLoading] = useState(false);
    //부서 옵션 리스트
    const [deptOption, setDeptOption] = useState([])
    //직급 옵션 리스트
    const [positionOption, setPositionOption] = useState([])
    //권한 옵션 리스트
    const [authOption, setAuthOption] = useState([])

    const [deptTreeModal, setDeptTreeModal] = useState(false);


    const handleOk = () => {
        let msg = ''

        const requestData = {
            INPUT_TEXT: inputText,
        }

        if (requestData.INPUT_TEXT.length > 10) msg = "입력하세요."


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

        adminApi.insertSysPosition(requestData).then((result) => {

            //사용자 추가에 실패했을 경우 
            if (!result.success) {

                dispatch(action.toast.setToast({
                    visible: true,
                    type: "ERROR",
                    message: result.message
                }))


                setConfirmLoading(false)
            }

            //사용자 추가에 성공했을 경우
            if (result.success) {
                setTimeout(() => {
                    setInputText('');
                    setConfirmLoading(false);
                    //성공 콜백 함수 호출.
                    successCallback();
                    //성공 토스트 메시지 호출

                    dispatch(action.toast.setToast({
                        visible: true,
                        type: "SUCCESS",
                        // description :"성공성공",
                        message: "정상적으로 처리되었어요"
                    }))

                }, 1000);
            }
        })
    };

    const handleCancel = () => {
        //취소하면 입력했던 생성창 초기화.
        setInputText('');
        closeCallback();
    };



    return (
        <>

            <Modal
                title={title}
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

                ]}
            >
                <Input
                    count={{
                        show: maxTextCount ? true : false,
                        max: maxTextCount,
                    }}
                    value={inputText}
                    onChange={(e) => {
                        setInputText(e.target.value)
                    }}
                    style={{ margin: "12px 0px", height: 40 }}
                    placeHolder={placeHolder ? placeHolder : ''}
                    defaultValue=""
                />





            </Modal>
        </>
    );
}

export default PublicInputModal;
