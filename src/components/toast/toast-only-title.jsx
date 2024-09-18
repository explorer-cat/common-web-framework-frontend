import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import styled from 'styled-components'
import { Alert, Space } from 'antd';
import {useDispatch, useSelector} from "react-redux";
import { action } from '../../actions/actions';


const Toast = styled.div `
    position: absolute;
    min-width: 300px;
    left: 50%;
    top: 80%;
    transform: translate(-50%, -50%);
    z-index: 1500;
    border-radius:10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 추가 */
`

function ToastOnlyTitle() {
    const navigate = useNavigate();
    const redux = useSelector(state => state.toast);
    const dispatch = useDispatch();

    useEffect(()=> {
        console.log("redux.visible : ",redux);
        if(redux.visible) {
            const timer = setTimeout(() => {
                dispatch(action.toast.setToast({ visible: false })); // 특정 시간(예: 3초 후)에 토스트를 숨김
            }, redux.timer ? redux.timer : 3000); // 3초 후에 토스트를 숨김

            return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 제거
        }
    }, [redux, dispatch]);


    if(redux.visible) {
        return (
            <Toast>
                {redux.type === "ERROR" ?  <Alert message= {redux.message}  description={redux.description} type="error" showIcon /> : null}
                {redux.type === "SUCCESS" ?  <Alert message = {redux.message} description={redux.description} type="success" showIcon /> : null}
                {redux.type === "WARNING" ?  <Alert message = {redux.message} description={redux.description} type="warning" showIcon /> : null}
  
            </Toast>
  
  );
    }
}

export default ToastOnlyTitle;
