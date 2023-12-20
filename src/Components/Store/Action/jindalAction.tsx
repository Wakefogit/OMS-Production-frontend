import ApiConstant from "../../../Global/ApiConstants";

function getPendingListAction(payload: any) {
    const action = {
        type: ApiConstant?.API_GET_PENDING_LIST_LOAD,
        payload
    }
    return action;
}

function getInProgressListAction(payload: any) {
    const action = {
        type: ApiConstant?.API_GET_IN_PROGRESS_LIST_LOAD,
        payload
    }
    return action;
}

function savePCCDataAction(payload: any) {
    const action = {
        type: ApiConstant?.API_SAVE_PPC_DATA_LOAD,
        payload
    }
    return action;
}

function updateOrderStatus(payload: any) {
    const action = {
        type: ApiConstant?.API_UPDATE_STATUS_LOAD,
        payload
    }
    return action;
}

function getPpcOrderData(payload: any) {
    const action = {
        type: ApiConstant?.API_GET_PPC_ORDER_DATA_LOAD,
        payload
    }
    return action;
}

function getViewDetailsAction(payload: any) {
    const action = {
        type: ApiConstant?.API_GET_VIEW_DETAILS_LOAD,
        payload
    }
    return action
}

function jindalLoginAction(payload: any) {
    const action = {
        type: ApiConstant?.API_JINDAL_LOGIN_LOAD,
        payload
    }
    return action
}

function updateToolShopDataAction(payload: any) {
    const action = {
        type: ApiConstant?.API_UPDATE_TOOL_SHOP_DATA_LOAD,
        payload
    }
    return action;
}

function updateQADataAction(payload: any) {
    const action = {
        type: ApiConstant?.API_UPDATE_QA_DATA_LOAD,
        payload
    }
    return action;
}

function updateOperatorEntryDataAction(payload: any) {
    const action = {
        type: ApiConstant?.API_UPDATE_OPERATOR_ENTRY_DATA_LOAD,
        payload
    }
    return action;
}

function updateBundlingSupervisorDataAction(payload: any) {
    const action = {
        type: ApiConstant?.API_UPDATE_BUNDLING_SUPERVISOR_DATA_LOAD,
        payload
    }
    return action;
}

function getToolShopInprogressDataAction(payload: any){
    const action = {
        type: ApiConstant?.API_GET_TOOLSHOP_INPROGRESS_DATA_LOAD,
        payload
    }
    return action;
}

function getQAInprogressDataAction(payload: any){
    const action = {
        type: ApiConstant?.API_GET_QA_INPROGRESS_DATA_LOAD,
        payload
    }
    return action;
}

function getOperatorEntryInprogressDataAction(payload: any){
    const action = {
        type: ApiConstant?.API_GET_OPERATOR_ENTRY_INPROGRESS_DATA_LOAD,
        payload
    }
    return action;
}

function getBundlingSupervisorInprogressDataAction(payload: any){
    const action = {
        type: ApiConstant?.API_GET_BUNDLING_SUPERVISOR_INPROGRESS_DATA_LOAD,
        payload
    }
    return action;
}

function downloadCSVAction(payload: any){
    const action = {
        type: ApiConstant?.API_DOWNLOAD_CSV_LOAD,
        payload
    }
    return action;
}

function commonReferenceDataAction(payload: any){
    const action = {
        type: ApiConstant?.API_COMMON_REFERENCE_LOAD,
        payload
    }
    return action;
}

function downloadPdfAction(payload: any){
    const action = {
        type: ApiConstant?.API_DOWNLOAD_PDF_LOAD,
        payload
    }
    return action;
}

function logoutAction(payload: any){
    const action = {
        type: ApiConstant?.API_LOGOUT_LOAD,
        payload
    }
    return action;
}

function manualOrderSyncAction(payload: any){
    const action = {
        type: ApiConstant?.API_SYNC_LOAD,
        payload
    }
    return action;
}
function getReAssign(payload: any){
    const action = {
        type: ApiConstant?.API_REASSIGN_LOAD,
        payload
    }
    return action;
}

function updateIsExpandedOnGetPendingList(value: boolean, key: string, record: any, variable: any){
    const action = {
        type: ApiConstant?.UPDATE_ISEXPANDED_GET_PENDING_LIST,
        value,
        key,
        record,
        variable
    }
    return action;
}

function createOrUpdateUserAction(payload: any){
    const action = {
        type: ApiConstant?.API_CREATE_OR_UPDATE_USER_LOAD,
        payload
    }
    return action;
}

function getRoleListAction(){
    const action = {
        type: ApiConstant?.API_GET_ROLE_LIST_ACTION_LOAD,
    }
    return action;
}

function getUserDetailsListAction(payload: any){
    const action = {
        type: ApiConstant?.API_GET_USER_DETAILS_LIST_LOAD,
        payload
    }
    return action;
}

export function getDashboardTableData(payload: any){
    const action = {
        type: ApiConstant?.GET_DASHBOARD_TABLE_DATA_LOAD,
        payload
    }
    return action
}

export function downloadDashboardXLAction(payload: any){
    const action = {
        type: ApiConstant?.GET_DASHBOARD_DOWNLOAD_XL_LOAD,
        payload
    }
    return action
}

export function downloadDashboardCSVAction(payload: any){
    const action = {
        type: ApiConstant?.GET_DASHBOARD_DOWNLOAD_CSV_LOAD,
        payload
    }
    return action
}

function clearReducerAction(payload: any){
    const action = {
        type: ApiConstant?.CLEAR_REDUCER_ACTION,
        payload
    }
    return action
}
export{
    getPendingListAction,
    getInProgressListAction,
    savePCCDataAction,
    updateOrderStatus,
    getPpcOrderData,
    getViewDetailsAction,
    jindalLoginAction,
    updateToolShopDataAction,
    updateQADataAction,
    updateBundlingSupervisorDataAction,
    updateOperatorEntryDataAction,
    getToolShopInprogressDataAction,
    getQAInprogressDataAction,
    getOperatorEntryInprogressDataAction,
    getBundlingSupervisorInprogressDataAction,
    downloadCSVAction,
    commonReferenceDataAction,
    downloadPdfAction,
    logoutAction,
    manualOrderSyncAction,
    getReAssign,
    updateIsExpandedOnGetPendingList,
    createOrUpdateUserAction,
    getRoleListAction,
    getUserDetailsListAction,
    clearReducerAction
}