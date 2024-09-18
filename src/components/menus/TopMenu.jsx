import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import styled from 'styled-components'

const SubMenuWrap = styled.div`
  display: flex;
  height: 40px;
  padding: 0px 14px;
  background-color: #f6f6f8;
  justify-content: flex-start;
  align-items: center;
`

const MenuBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const MenuList = styled.ul`
  display: flex;
  flex-direction: row;
  width: auto !important;
  height: 100%;
  width: auto !important;
  box-sizing: border-box;
  border-bottom: 1px solid #EAEAEA;
  // padding-left: 8px;

  li {
    float: left;
    width: fit-content;
    height: 100%;
    line-height: 55px;
    cursor: pointer;
    overflow: hidden;
    text-decoration: none;
    color: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    margin: 0 24px;
    transition: all 0.3s ease;
  }


  .selected {
    border-bottom: 2px solid #0098fe;
    height: 100%;
    text-decoration: none;
    text-align: center;
    color: #0098fe;
    box-sizing: border-box;
  }

`
const LogoDiv = styled.div`
  width:50px;
  height:100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
function TopMenu(props) {
    const navigate = useNavigate();

    return (
        <>
        <SubMenuWrap>
            <MenuBox>
                <LogoDiv>
                    <img alt=""
                         id="top_logo"
                         style={{width: 24, height: 24}}
                         src="../assets/images/white_menu.png"/>
                </LogoDiv>
                <MenuList>
                    <li id="companySetting" className = {props.selected === 0 ? "selected" : ""}>자동매매</li>
                    <li id="memberSetting" className = {props.selected === 1 ? "selected" : ""}>관리자</li>
                </MenuList>
            </MenuBox>
        </SubMenuWrap>
        </>
    );
}

export default TopMenu;
