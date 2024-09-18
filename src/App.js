import './App.css';
import {useDispatch, useSelector} from "react-redux";
import RootRoutes from './routes';
import { Navigate, Routes, Route, useLocation,BrowserRouter } from 'react-router-dom';
import './styles/base.css';
import './styles/custom.css';
import ToastOnlyTitle from './components/toast/toast-only-title';


function App() {
    const dispatch = useDispatch();
    const modal = useSelector(state => state.modal);

    return (
        <>
            <div id="public_root_wrap">
            <BrowserRouter>
                <Routes>
                    {/* 공용토스트 메시지 */}
            
                    {/* <Route path={URL.ERROR} element={<EgovError />} /> */}
                    {/*<Route path="*" element={<SecondRoutes/>} />*/}
                    {/* 워크스페이스 라우팅 */}
                    {/* <Route path="/main/*" element={<RootRoutes />} /> */}
                    <Route path="/*" element={<RootRoutes />} />
                    {/* 관리자 페이지 라우팅 */}
                    <Route path="/admin/*" element={<RootRoutes />} />

                </Routes>
            </BrowserRouter>
            </div>
        </>
    );
}

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("process.env.REACT_APP_EGOV_CONTEXT_URL", process.env.REACT_APP_EGOV_CONTEXT_URL);


export default App;
