// import React,{useEffect,useState} from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import styled from 'styled-components'
// import {useDispatch, useSelector} from "react-redux";
// import TradeLogPage from './trade-log-page';
// import { utils } from '../../utils/utils';

// const DivisionWrap = styled.div`
//   display: flex;
// //   width : calc(100vw - 256px);
// width:100vw;
// height:100vh;
//   overflow: auto;
// //   height: 100%;
//   background:rgb(248, 249, 250);
// `

// const RightWrap = styled.div`
//     // margin: 32px;
//     // padding: 24px;
//     // height: calc(100% - 300px);
//     width: 100%;
//     background: #17171c;
//     min-width: 1024px;
//     // border-radius:10px;
// `
// function TradeWrapped(props) {
//     const dispatch = useDispatch();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [allCoinList,setAllCoinList] = useState([]);
    
//     useEffect(() => {
//         try {
//             utils.getUpbitCoinListAll((result) => {
//                 const filteredCoins = result.filter(coin => coin.includes('KRW'));
//                 setAllCoinList(filteredCoins);
//             });
            
//         } catch(e) {
//             console.error(e);
//         } 
        
//     },[])

    

//     //verticalMenu에서 선택된 menu id를 콜백합니다.
//     const callBackSelectedMenuValue = (value) => {
//         console.log("value",value)
//         navigate(value);
//         // setSelectedMenu(value);
//     }

//     const renderSelecteScreen = () => {
//         if(location.pathname === "/trade/log") {
//             return (<TradeLogPage coinList = {allCoinList}/>)
//         } 
//     }


//     return (
//         <>
//             <div style={{display: 'flex', width: "100%"}}>
//                 {/* <VerticalMenu /> */}
//                 <div id="" style={{padding: 0}}>
//                     <DivisionWrap>
//                         <RightWrap>
//                             {renderSelecteScreen()}
//                         </RightWrap>
//                     </DivisionWrap>
//                 </div>
//             </div>
//         </>
//     );


// }

// export default TradeWrapped;

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
import TradeLogPage from './trade-log-page';
import { utils } from '../../utils/utils';
import SubMenu from '../../components/menus/SubMenu';

const { Header, Content, Sider } = Layout;


const TradeWrapped = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading,setLoading] = useState(true);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [allCoinList,setAllCoinList] = useState([]);
    
    useEffect(() => {
        try {
            utils.getUpbitCoinListAll((result) => {
                console.log('result',result);
                const filteredCoins = result.filter(coin => coin.includes('KRW'));
                console.log('filteredCoins',filteredCoins)
                setAllCoinList(filteredCoins);
                setLoading(false);
            });  
        } catch(e) {
            console.error(e);
        } 
    },[])


    const renderSelecteScreen = () => {
        if(loading) {
            return (<div>로딩중</div>)
        }
        if(location.pathname === "/trade/log") {
            return (<TradeLogPage coinList = {allCoinList}/>)
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
export default TradeWrapped;