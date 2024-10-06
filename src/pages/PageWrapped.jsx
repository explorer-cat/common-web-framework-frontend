import React, { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import SubMenu from '../components/menus/SubMenu';
import MyAssetsPage from './myAssets/my-assets-page';
import MemberSettingPage from './admin/member-setting-page';
import BackTestLogPage from './myAssets/back-test-log-page';
import TradeLogPage from './tradeLog/trade-log-page';
import PositionSettingPage from './admin/position-setting-page';
const { Header, Content, Sider } = Layout;

const PageWrapped = ({ link }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();

  const renderSelecteScreen = () => {
    switch (link) {
      case '/upbit/backtest':
        return <BackTestLogPage />;
      case '/upbit/real-trade':
        return <BackTestLogPage />;
      case '/upbit/profit':
        return <BackTestLogPage />;
      case '/trade/log':
        return <TradeLogPage />;
      case '/trade/chart':
        return <TradeLogPage />;
      case '/trade/data':
        return <TradeLogPage />;
      case '/upbit/all':
        return <MyAssetsPage />;
      case '/upbit/assets':
        return <MyAssetsPage />;
      case '/files':
        return <div>Files Page</div>;
      case '/admin/member':
        return <MemberSettingPage />;
      case '/admin/role':
        return <PositionSettingPage />;
      case '/admin/common-code':
        return <MemberSettingPage />;
      default:
        return <div>Page not found</div>;
    }
  }


  return (
    <Layout>
      <Layout>
        <SubMenu />
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
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
export default PageWrapped;
