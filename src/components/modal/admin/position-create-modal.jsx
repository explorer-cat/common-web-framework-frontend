import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Flex, Input, Typography, Button, Space, Modal, Select,InputNumber } from 'antd';
import { action } from "../../../actions/actions";
import { adminApi } from "../../../api/adminApi";




function PositionCreateModal({placeHolder, successCallback, closeCallback }) {
    const dispatch = useDispatch();
    const [positionName, setPositionName] = useState('')
    const [positionOrder, setPositionOrder] = useState('')

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
            POSITION_NAME: positionName,
            POSITION_ORDER : positionOrder
        }
        if (requestData.POSITION_NAME.length <= 0) {
            msg = "직급명을 입력해주세요"
        } 

        if (requestData.POSITION_ORDER <= 0) {
            requestData.POSITION_ORDER = 0;
        }

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
                    setPositionName('');
                    setPositionOrder('');
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
        setPositionName('');
        setPositionOrder('');
        closeCallback();
    };



    return (
        <>

            <Modal
                title={'직급 추가'}
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
                <div className="fs12">직급명</div>
                <Input
                    count={{
                        show: true,
                        max: 10,
                    }}
                    placeholder="직급명"
                    value={positionName}
                    onChange={(e) => {
                        setPositionName(e.target.value);
                    }}
                    style={{ margin: "4px 0px", height: 40 }}
                    placeHolder={placeHolder ? placeHolder : ''}
                    defaultValue=""
                />

                <div className="fs12  margin_t_8">직급 정렬 순서</div>
                <InputNumber centered  style={{ margin: "4px 0px", height: 40, alignItems:'center',paddingTop:4 }} value={positionOrder} min={0} max={100000} defaultValue={0} onChange={(value) => setPositionOrder(value)} />

            </Modal>
        </>
    );
}

export default PositionCreateModal;
