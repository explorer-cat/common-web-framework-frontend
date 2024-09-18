import React,{useEffect,useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VerticalMenu from "../../components/menus/SubMenu";
import MemberSetting from "./member-setting-page";
import styled from 'styled-components'
import {useDispatch, useSelector} from "react-redux";
import DeptSettingPage from './dept-setting-page';
import PositionSettingPage from './position-setting-page';

const DivisionWrap = styled.div`
  display: flex;
  width : calc(100vw - 256px);
  overflow: auto;
  height: 100%;
  background:rgb(248, 249, 250);
`

const RightWrap = styled.div`
    margin: 32px;
    padding: 24px;
    height: calc(100% - 300px);
    width: 100%;
    background: #FFF;
    min-width: 1024px;
    border-radius:10px;
`
function AdminWrapped(props) {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log(location.pathname)
    },[])

    //verticalMenu에서 선택된 menu id를 콜백합니다.
    const callBackSelectedMenuValue = (value) => {
        console.log("value",value)
        navigate(value);
        // setSelectedMenu(value);
    }

    const renderSelecteScreen = () => {
        if(location.pathname === "/admin/member") {
            return (<MemberSetting/>)
        } else if(location.pathname === "/admin/dept") {
            return(<DeptSettingPage />)
        } else if(location.pathname === "/admin/position") {
            return(<PositionSettingPage />)
        }
    }


    return (
        <>
            <div style={{display: 'flex', width: "100%"}}>
                <VerticalMenu />
                <div id="" style={{padding: 0}}>
                    <DivisionWrap>
                        <RightWrap>
                            {renderSelecteScreen()}
                        </RightWrap>
                    </DivisionWrap>
                </div>
            </div>
        </>
    );


}

export default AdminWrapped;
