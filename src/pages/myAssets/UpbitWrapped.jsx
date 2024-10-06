import React, { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import { useDispatch, useSelector } from "react-redux";
import { utils } from '../../utils/utils';
import MyAssetsPage from './my-assets-page';
import BackTestLogPage from './back-test-log-page';
import TopMenu from '../../components/menus/TopMenu';
import SubMenu from '../../components/menus/SubMenu';

const { Header, Content, Sider } = Layout;



const UpbitWrapped = () => {
  // const [loading,setLoading] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [allCoinList, setAllCoinList] = useState([]);


  const renderSelecteScreen = () => {
    if (location.pathname === "/upbit/assets") {
      return (<MyAssetsPage />)
    }
    if (location.pathname === "/upbit/backtest") {
      return (<BackTestLogPage />)
    }
  }



  return (
    <Layout>
      {/* <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <TopMenu />
      </Header> */}
      <Layout>
        <SubMenu />
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>자동매매</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              overflow: 'auto',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderSelecteScreen()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default UpbitWrapped;
