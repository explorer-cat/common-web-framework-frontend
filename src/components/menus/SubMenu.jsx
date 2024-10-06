import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Switch, Layout, theme } from 'antd';
import {
  LaptopOutlined, NotificationOutlined, UserOutlined, DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Header, Content, Sider } = Layout;

const SubMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const items = [
    getItem('체결 내역 관리', '100', <UserOutlined />, [
      getItem('백테스팅 내역', '101'),
      getItem('실제매매 내역', '102'),
      getItem('슬리피지/수익률', '103'),
    ]),
    getItem('모니터링', '200', <DesktopOutlined />, [
      getItem('자동매매 AI', '201'),
      getItem('차트분석', '202'),
      getItem('데이터수집', '203'),
    ]),
    getItem('포트폴리오', '300', <UserOutlined />, [
      getItem('전체', '301'),
      getItem('암호화폐', '302'),
      getItem('주식', '303'),
    ]),
    getItem('관리자 설정', '500', <UserOutlined />, [
      getItem('사용자 관리', '501'),
      getItem('권한 관리', '502'),
      getItem('공통 코드 관리', '503'),
    ]),
  ];

  const onClick = (e) => {
    switch (e.key) {
      case '101':
        navigate('/upbit/backtest');
        break;
      case '102':
        navigate('/upbit/real-trade');
        break;
      case '103':
        navigate('/upbit/profit');
        break;
      case '201':
        navigate('/trade/log');
        break;
      case '202':
        navigate('/trade/chart');
        break;
      case '203':
        navigate('/trade/data');
        break;
      case '301':
        navigate('/upbit/all');
        break;
      case '302':
        navigate('/upbit/assets');
        break;
      case '303':
        navigate('/upbit/assets');
        break;
      case '501':
        navigate('/admin/member');
        break;
      case '502':
        navigate('/admin/role');
        break;
      case '503':
        navigate('/admin/common-code');
        break;
      default:
        break;
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{ background: colorBgContainer, width: collapsed ? 80 : 200 }} // Adjust the width here
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="light"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['100', '200', '300', '500']} // Add this line to keep all menus open
        mode="inline"
        items={items}
        onClick={onClick}
        style={{ fontSize: '14px' }} // Adjust the font size here
      />
    </Sider>
  );
};

export default SubMenu;