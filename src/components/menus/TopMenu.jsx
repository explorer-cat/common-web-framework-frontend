import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import styled from 'styled-components'
import { Breadcrumb, Layout, Menu, theme } from 'antd';

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

const items1 = ['내 포트폴리오', '자동매매 AI', '관리자 설정'].map((key) => ({
  key,
  label: `${key}`,
}));



function TopMenu(props) {
    const navigate = useNavigate();

    return (
        <>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
        </>
    );
}

export default TopMenu;
