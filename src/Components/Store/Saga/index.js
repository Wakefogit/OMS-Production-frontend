import { takeEvery } from "redux-saga/effects";
import ApiConstant from "../../../Global/ApiConstants";
import {
    getPendingListSaga,
    getInProgressListSaga,
    savePPCDataSaga,
    updateOrderStatusSaga,
    getPpcOrderDataSaga,
    getViewDetailsSaga,
    jindalLoginSaga,
    updateToolShopSaga,
    updateQASaga,
    updateOperatorEntrySaga,
    updateBundlingSupervisorSaga,
    getToolShopInprogressSaga,
    getQAInprogressSaga,
    getOperatorEntryInprogressSaga,
    getBundlingSupervisorInprogressSaga,
    downloadCsvSaga,
    commonReferenceSaga,
    downloadPdfSaga,
    logoutSaga,
    lastSyncSaga,
    reassignOrderSaga,
    getDashboardTableDataSaga,
    createOrUpdateUserSaga,
    getRoleListSaga,
    getUserDetailsListSaga,
    downloadDashboardXLSaga,
    downloadDashboardCSVSaga
} from "./JindalSaga/jindalSaga"
export default function* rootSaga() {
    yield takeEvery(ApiConstant?.API_GET_PENDING_LIST_LOAD, getPendingListSaga)
    yield takeEvery(ApiConstant?.API_GET_IN_PROGRESS_LIST_LOAD, getInProgressListSaga)
    yield takeEvery(ApiConstant?.API_UPDATE_STATUS_LOAD, updateOrderStatusSaga)
    yield takeEvery(ApiConstant?.API_SAVE_PPC_DATA_LOAD, savePPCDataSaga)
    yield takeEvery(ApiConstant?.API_GET_PPC_ORDER_DATA_LOAD, getPpcOrderDataSaga)
    yield takeEvery(ApiConstant?.API_GET_VIEW_DETAILS_LOAD, getViewDetailsSaga)
    yield takeEvery(ApiConstant?.API_JINDAL_LOGIN_LOAD, jindalLoginSaga)
    

    yield takeEvery(ApiConstant?.API_UPDATE_TOOL_SHOP_DATA_LOAD, updateToolShopSaga)
    yield takeEvery(ApiConstant?.API_UPDATE_QA_DATA_LOAD, updateQASaga)
    yield takeEvery(ApiConstant?.API_UPDATE_OPERATOR_ENTRY_DATA_LOAD, updateOperatorEntrySaga)
    yield takeEvery(ApiConstant?.API_UPDATE_BUNDLING_SUPERVISOR_DATA_LOAD, updateBundlingSupervisorSaga)

    yield takeEvery(ApiConstant?.API_GET_TOOLSHOP_INPROGRESS_DATA_LOAD, getToolShopInprogressSaga)
    yield takeEvery(ApiConstant?.API_GET_QA_INPROGRESS_DATA_LOAD, getQAInprogressSaga)
    yield takeEvery(ApiConstant?.API_GET_OPERATOR_ENTRY_INPROGRESS_DATA_LOAD, getOperatorEntryInprogressSaga)
    yield takeEvery(ApiConstant?.API_GET_BUNDLING_SUPERVISOR_INPROGRESS_DATA_LOAD, getBundlingSupervisorInprogressSaga)
    yield takeEvery(ApiConstant?.API_DOWNLOAD_CSV_LOAD, downloadCsvSaga)
    yield takeEvery(ApiConstant?.API_COMMON_REFERENCE_LOAD, commonReferenceSaga)
    yield takeEvery(ApiConstant?.API_DOWNLOAD_PDF_LOAD, downloadPdfSaga)
    yield takeEvery(ApiConstant?.API_LOGOUT_LOAD, logoutSaga)
    yield takeEvery(ApiConstant?.API_SYNC_LOAD, lastSyncSaga)
    yield takeEvery(ApiConstant?.API_REASSIGN_LOAD, reassignOrderSaga)
    yield takeEvery(ApiConstant?.GET_DASHBOARD_TABLE_DATA_LOAD, getDashboardTableDataSaga)

    
    yield takeEvery(ApiConstant?.API_CREATE_OR_UPDATE_USER_LOAD, createOrUpdateUserSaga)
    yield takeEvery(ApiConstant?.API_GET_ROLE_LIST_ACTION_LOAD, getRoleListSaga)
    yield takeEvery(ApiConstant?.API_GET_USER_DETAILS_LIST_LOAD, getUserDetailsListSaga)
    yield takeEvery(ApiConstant?.GET_DASHBOARD_DOWNLOAD_XL_LOAD, downloadDashboardXLSaga )
    yield takeEvery(ApiConstant?.GET_DASHBOARD_DOWNLOAD_CSV_LOAD, downloadDashboardCSVSaga )
    
    

}