
import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Switch } from 'antd';
import SubMenu from 'antd/es/menu/SubMenu';
const items = [
  {
    key: 'adminSetting',
    label: '관리자 메뉴',
    icon: <SettingOutlined />,
    children: [
      {
        key: '500',
        label: '사용자 관리',
      },
      {
        key: '501',
        label: '권한 관리',
      },
      {
        key: '502',
        label: '소속 관리',
      },
    ],
  },
  {
    key: 'logSetting',
    label: '로그관리',
    icon: <MailOutlined />,
    children: [
      {
        key: 'log1',
        label: '사용자 로그',
        type: 'group',
        children: [
          {
            key: '1',
            label: '접근 로그',
          },
          {
            key: '2',
            label: 'API 호출로그',
          },
        ],
      },
      {
        key: 'log2',
        label: '에러 로그',
        type: 'group',
        children: [
          {
            key: '3',
            label: '화면 에러 로그',
          },
          {
            key: '4',
            label: '서버 에러 로그',
          },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: '5',
        label: 'Option 5',
      },
      {
        key: '6',
        label: 'Option 6',
      },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          {
            key: '7',
            label: 'Option 7',
          },
          {
            key: '8',
            label: 'Option 8',
          },
        ],
      },
    ],
  },
  {
    type: 'divider',
  },
];
const VerticalMenu = () => {
  const [theme, setTheme] = useState('dark');
  const [current, setCurrent] = useState('1');
  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light');
  };
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <>
      {/* <Switch
        checked={theme === 'dark'}
        onChange={changeTheme}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      /> */}
      <br />
      <br />
      <Menu
        theme={theme}
        onClick={onClick}
        style={{
          width: 256,
        }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />
    </>
  );
};

export default VerticalMenu;