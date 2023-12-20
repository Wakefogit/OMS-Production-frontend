import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ReportListScreen from '../Components/Reports/reportListScreen';
import CommonPagination from '../Components/SubComponents/commonPagination';
import TopMenuAndSider from '../Components/SubComponents/Top_Menu';
import Login from '../Components/Login/login';
import AccessDenied from '../Components/Common/AccessDenied';
import { routes } from './NavigateAccess';
import { PrivateNavigates } from './PrivateNavigates';
import CompletedScreen from '../Components/CompletedScreen/CompletedScreen';
import RollTable from '../Components/InProgressScreen/rollTable';
import BundlingSupervisorForm from '../Components/SubComponents/BundlingSupervisorForm';
import NewInProgress from '../Components/InProgressScreen/InProgressScreen';
import NewOnHold from '../Components/OnHoldScreen/OnHoldScreen';
import SubMenu from 'antd/es/menu/SubMenu';
import UserListing from "../Components/UserManagement/UserListing";
import PendingScreen from "../Components/PendingScreen/PendingScreen";
import { getUser } from "../localStorage";
import AppImages from "../Global/AppImages";
import Modaldemo from "../Components/modal";


function Navigates() {

    const user = getUser();
    const haveAccess = (screen: any) => {
        if (screen == "/userlisting") {
            if (user?.roleId == 1) {
                return routes?.includes(screen)
            }
            else{
                return false;
            }
        }
        else{
            return routes?.includes(screen)
        }
        
    }
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to={"/login"} />}
                />
                <Route path='/login' element={<Login />} />
                <Route path='/pending' element={<PrivateNavigates>{haveAccess("/pending") == true ? <PendingScreen /> : <AccessDenied />}</PrivateNavigates>} />
                <Route path='/top-menu' element={<TopMenuAndSider />} />
                <Route path='/submenu' element={<SubMenu />} />
                <Route path='/in-progress/list' element={<PrivateNavigates>{haveAccess("/in-progress/list") == true ? <NewInProgress /> : <AccessDenied />}</PrivateNavigates>} />
                <Route path='/hold-on/list' element={<PrivateNavigates>{haveAccess("/hold-on/list") == true ? <NewOnHold /> : <AccessDenied />}</PrivateNavigates>} />
                <Route path='/dashboard' element={<PrivateNavigates>{haveAccess("/dashboard") == true ? <ReportListScreen /> : <AccessDenied />}</PrivateNavigates>} />
                <Route path='/pagination' element={<CommonPagination />} />
                <Route path='/completed/list' element={<PrivateNavigates>{haveAccess("/completed/list") == true ? <CompletedScreen /> : <AccessDenied />}</PrivateNavigates>} />
                <Route path='/bs-table' element={<BundlingSupervisorForm />} />
                <Route path='/rolltable' element={<RollTable />} />
                {/* <Route path='/toolshop' element={<ToolShopFormUpdate />} /> */}
                {/* <Route path='/qaForm' element={<QaFormUpdates/>}/> */}
                <Route path='/userlisting' element={<PrivateNavigates>{haveAccess("/userlisting") == true ? <UserListing /> : <img src={AppImages?.errorimage} />}</PrivateNavigates>} />
                {/* <Route path ='/demo' element ={<Modaldemo/>}/> */}

            </Routes>
        </BrowserRouter>
    );
}

export default Navigates;