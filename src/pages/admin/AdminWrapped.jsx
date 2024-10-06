import React,{useEffect,useState} from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined, DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
     } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import {useDispatch, useSelector} from "react-redux";
import { utils } from '../../utils/utils';
import MemberSetting from "./member-setting-page";
import DeptSettingPage from './dept-setting-page';
import PositionSettingPage from './position-setting-page';
import SubMenu from '../../components/menus/SubMenu';
const { Header, Content, Sider } = Layout;

const AdminWrapped = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [menuKey,setMenuKey] = useState('');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const location = useLocation();
    const navigate = useNavigate();

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
    <Layout>
      {/* <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['관리자 설정']}
          items={items1}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
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
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              overflow:'auto',
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
export default AdminWrapped;
