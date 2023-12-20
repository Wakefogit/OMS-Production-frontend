import ApiConstant from "../../../../Global/ApiConstants";
import AppConstants from "../../../../Global/AppConstants";


const initialState = {
    getPendingList: null,
    inprogressdata: null,
    onHoldData: null,
    completedData: null,
    getInProgressList: null,
    getInProgressOnLoad: false,
    getPendingOnLoad: false,
    savePPCDataOnLoad: false,
    updateStatusOnLoad: false,
    ppcOrderDataOnLoad: false,
    ppcOrderDataList: null,
    viewDetailsData: null,
    viewDetailsOnLoad: false,
    jindalLoginData: null,
    jindalLoginOnLoad: false,
    updateToolShop: null,
    updateToolShopOnLoad: false,
    updateQaData: null,
    updateQaOnLoad: false,
    updateOperatorEntryData: null,
    updateOperatorEntryOnLoad: false,
    updateBundlingSupervisor: null,
    updateBundlingSupervisorOnLoad: false,
    getToolShopInprogressData: null,
    getToolShopOnload: false,
    getQAInprogressData: null,
    getQAOnload: false,
    getOperatorInprogressData: null,
    getOperatorOnload: false,
    getBundlingInprogressData: null,
    getBundlingOnload: false,
    getDownloadCsvData: null,
    downloadCsvOnLoad: false,
    commonReferenceData: null,
    commonReferenceOnLoad: false,
    dieReferenceData: null,
    plantReferenceData: null,
    getDownloadPdfData: null,
    downloadPdfOnLoad: false,
    dieFailureReasonData: null,
    reasonForBreakdown: null,
    responsibleDepartmentForBreakdown: null,
    processStage: null,
    logoutData: null,
    logoutOnLoad: false,
    savePPCData: null,
    updateStatusData: null,
    plannedQuenchingData: null,
    pressAllocationData: null,
    CutBilletsData: null,
    PriorityData: null,
    ExtrusionLengthUnitData: null,
    lastSyncLoad: false,
    lastSyncData: null,
    getReferenceData: null,
    reassignOnload: false,
    reassignData: null,
    dietrialData: null,
    dieWithAluminium: null,
    previousDaydieContinue: null,
    dieFailData: null,
    xlFileStream: null,
    getRoleList: null,
    getUserDetailsList: null,
    downloadOnload: false,
    prerssAllocation: null,
    downloadCSVData: null,
    createUserMessage: null

}


function setMetaLists(state: any, group: any, referenceName: any) {

    try {
        switch (referenceName) {
            case "Die":
                state.dieReferenceData = group?.getReferenceData;
                break;
            case "Plant":
                state.plantReferenceData = group?.getReferenceData;
                break;
            case AppConstants?.DieFailureReason:
                state.dieFailureReasonData = group?.getReferenceData;
                break;
            case AppConstants?.ReasonForBreakDown:
                state.reasonForBreakdown = group?.getReferenceData;
                break;
            case AppConstants?.ResponsibleDepartmentForBreakdown:
                state.responsibleDepartmentForBreakdown = group?.getReferenceData;
                break;
            case AppConstants?.ProcessStage:
                state.processStage = group?.getReferenceData;
                break;
            case AppConstants?.plannedQuenching:
                state.plannedQuenchingData = group?.getReferenceData;
                break;
            case AppConstants?.cutBillets:
                state.CutBilletsData = group?.getReferenceData;
                break;
            case "Priority":
                state.PriorityData = group?.getReferenceData;
                break;
            case "Press Allocation":
                state.pressAllocationData = group?.getReferenceData;
                break;
            case "Extrusion Length Unit":
                state.ExtrusionLengthUnitData = group?.getReferenceData;
                break;
            case "Die Trial":
                state.dietrialData = group?.getReferenceData;
                break;
            case "Die with Aluminium":
                state.dieWithAluminium = group?.getReferenceData;
                break;
            case "Previous Day die Continue":
                state.previousDaydieContinue = group?.getReferenceData;
                break;
            case "Die Fail":
                state.dieFailData = group?.getReferenceData;
                break;
            default:
                state.assetTypeReferences = group;
                break;
        }
    } catch (ex) {
        console.log("Error in setMetaLists ::", ex)
    }
}

const setPendingOrderData = (state: any, action: any) => {
    let pendingInfo: any = action?.result;
    if (action?.payload?.exportType == 1) {
        state.xlFileStream = pendingInfo?.getOrderData;
    }
    else{
        (pendingInfo?.getOrderData?.orderData || [])?.forEach((item: any, index: any) => {
            item.key = item?.orderId;
            item.index = index;
        })
        console.log("pendingInfo", pendingInfo)
        state[action?.payload?.key] = pendingInfo; //this is where data setting
    }
}

function JindalReducerState(state: any = initialState, action: any) {
    switch (action?.type) {
        case ApiConstant?.API_GET_PENDING_LIST_LOAD:
            if(!action.payload.exportType){
                state.getPendingOnLoad = true;
            }
            else{
                state.downloadOnload = true;
            }
            return {
                ...state,
                getPendingList: null,
                inprogressdata: null,
                onHoldData: null,
                completedData: null
            }
        case ApiConstant?.API_GET_PENDING_LIST_SUCCESS:
            setPendingOrderData(state, action)
            return {
                ...state,
                getPendingOnLoad: false,
                downloadOnload: false
            }
        case ApiConstant?.UPDATE_ISEXPANDED_GET_PENDING_LIST:
            let index = state[action?.variable]?.getOrderData?.orderData?.findIndex((x: any) => x.orderId === action.record.orderId);
            state[action?.variable].getOrderData.orderData[index][action.key] = false;
            console.log("action", action)
           setTimeout(() =>{
            state[action?.variable].getOrderData.orderData[index][action.key] = action.value;
           }, 1000)
            return {
                ...state
            }
        case ApiConstant?.API_GET_IN_PROGRESS_LIST_LOAD:
            return {
                ...state,
                getInProgressOnLoad: true,
                getInProgressList: null
            }
        case ApiConstant?.API_GET_IN_PROGRESS_LIST_SUCCESS:
            return {
                ...state,
                getInProgressList: action?.result,
                getInProgressOnLoad: false
            }
        case ApiConstant?.API_UPDATE_STATUS_LOAD:
            return {
                ...state,
                updateStatusOnLoad: true
            }
        case ApiConstant?.API_UPDATE_STATUS_SUCCESS:
            return {
                ...state,
                updateStatusOnLoad: false,
                updateStatusData: action.result
            }
        case ApiConstant?.API_SAVE_PPC_DATA_LOAD:
            return {
                ...state,
                savePPCDataOnLoad: true
            }
        case ApiConstant?.API_SAVE_PPC_DATA_SUCCESS:
            return {
                ...state,
                savePPCDataOnLoad: false,
                savePPCData: action?.result
            }
        case ApiConstant?.API_GET_PPC_ORDER_DATA_LOAD:
            return {
                ...state,
                ppcOrderDataOnLoad: true,
                ppcOrderDataList: null
            }
        case ApiConstant?.API_GET_PPC_ORDER_DATA_SUCCESS:
            return {
                ...state,
                ppcOrderDataList: action?.result,
                ppcOrderDataOnLoad: false
            }
        case ApiConstant?.API_GET_VIEW_DETAILS_LOAD:
            return {
                ...state,
                viewDetailsOnLoad: true
            }
        case ApiConstant?.API_GET_VIEW_DETAILS_SUCCESS:
            return {
                ...state,
                viewDetailsData: action?.result,
                viewDetailsOnLoad: false
            }
        case ApiConstant?.API_JINDAL_LOGIN_LOAD:
            return {
                ...state,
                jindalLoginOnLoad: true
            }
        case ApiConstant?.API_JINDAL_LOGIN_SUCCESS:
            return {
                ...state,
                jindalLoginData: action?.result,
                jindalLoginOnLoad: false
            }
        case ApiConstant?.API_UPDATE_TOOL_SHOP_DATA_LOAD:
            return {
                ...state,
                updateToolShopOnLoad: true
            }
        case ApiConstant?.API_UPDATE_TOOL_SHOP_DATA_SUCCESS:
            return {
                ...state,
                updateToolShop: action?.result,
                updateToolShopOnLoad: false
            }
        case ApiConstant?.API_UPDATE_QA_DATA_LOAD:
            return {
                ...state,
                updateQaOnLoad: true
            }
        case ApiConstant?.API_UPDATE_QA_DATA_SUCCESS:
            return {
                ...state,
                updateQaData: action?.result,
                updateQaOnLoad: false
            }
        case ApiConstant?.API_UPDATE_OPERATOR_ENTRY_DATA_LOAD:
            return {
                ...state,
                updateOperatorEntryOnLoad: true
            }
        case ApiConstant?.API_UPDATE_OPERATOR_ENTRY_DATA_SUCCESS:
            return {
                ...state,
                updateOperatorEntryData: action?.result,
                updateOperatorEntryOnLoad: false
            }
        case ApiConstant?.API_UPDATE_BUNDLING_SUPERVISOR_DATA_LOAD:
            return {
                ...state,
                updateBundlingSupervisorOnLoad: true
            }
        case ApiConstant?.API_UPDATE_BUNDLING_SUPERVISOR_DATA_SUCCESS:
            return {
                ...state,
                updateBundlingSupervisor: action?.result,
                updateBundlingSupervisorOnLoad: false
            }
        case ApiConstant?.API_GET_TOOLSHOP_INPROGRESS_DATA_LOAD:
            return {
                ...state,
                getToolShopOnload: true,
                getToolShopInprogressData: null
            }
        case ApiConstant?.API_GET_TOOLSHOP_INPROGRESS_DATA_SUCCESS:
            return {
                ...state,
                getToolShopInprogressData: action?.result,
                getToolShopOnload: false
            }
        case ApiConstant?.API_GET_QA_INPROGRESS_DATA_LOAD:
            return {
                ...state,
                getQAOnload: true,
                getQAInprogressData: null
            }
        case ApiConstant?.API_GET_QA_INPROGRESS_DATA_SUCCESS:
            return {
                ...state,
                getQAInprogressData: action?.result,
                getQAOnload: false
            }
        case ApiConstant?.API_GET_OPERATOR_ENTRY_INPROGRESS_DATA_LOAD:
            return {
                ...state,
                getOperatorOnload: true,
                getOperatorInprogressData: null
            }
        case ApiConstant?.API_GET_OPERATOR_ENTRY_INPROGRESS_DATA_SUCCESS:
            return {
                ...state,
                getOperatorInprogressData: action?.result,
                getOperatorOnload: false
            }
        case ApiConstant?.API_GET_BUNDLING_SUPERVISOR_INPROGRESS_DATA_LOAD:
            return {
                ...state,
                getBundlingOnload: true,
                getBundlingInprogressData: null
            }
        case ApiConstant?.API_GET_BUNDLING_SUPERVISOR_INPROGRESS_DATA_SUCCESS:
            return {
                ...state,
                getBundlingInprogressData: action?.result,
                getBundlingOnload: false
            }
        case ApiConstant?.API_DOWNLOAD_CSV_LOAD:
            return {
                ...state,
                downloadCsvOnLoad: true
            }
        case ApiConstant?.API_DOWNLOAD_CSV_SUCCESS:
            return {
                ...state,
                getDownloadCsvData: action?.result,
                downloadCsvOnLoad: false
            }
        case ApiConstant?.API_COMMON_REFERENCE_LOAD:
            return {
                ...state,
                commonReferenceOnLoad: true
            }
        case ApiConstant?.API_COMMON_REFERENCE_SUCCESS:
            setMetaLists(state, action.result, action?.payload?.name)
            return {
                ...state,
                commonReferenceOnLoad: false
            }
        case ApiConstant?.API_DOWNLOAD_PDF_LOAD:
            return {
                ...state,
                downloadPdfOnLoad: true
            }
        case ApiConstant?.API_DOWNLOAD_PDF_SUCCESS:
            return {
                ...state,
                getDownloadPdfData: action?.result,
                downloadPdfOnLoad: false
            }
        case ApiConstant?.API_LOGOUT_LOAD:
            return {
                ...state,
                logoutOnLoad: true
            }
        case ApiConstant?.API_LOGOUT_SUCCESS:
            return {
                ...state,
                logoutData: action?.result,
                logoutOnLoad: false
            }
        case ApiConstant?.API_SYNC_LOAD:
            return {
                ...state,
                lastSyncLoad: true
            }
        case ApiConstant?.API_SYNC_SUCCESS:
            return {
                ...state,
                lastSyncLoad: false,
                lastSyncData: action?.result
            }
        case ApiConstant?.API_REASSIGN_LOAD:
            return {
                ...state,
                reassignOnload: true
            }
        case ApiConstant?.API_REASSIGN_SUCCESS:
            return {
                ...state,
                reassignOnload: false,
                reassignData: action?.result
            }
        case ApiConstant?.GET_DASHBOARD_TABLE_DATA_LOAD:
            return {
                ...state,
                dashboardOnload: true
            }
        case ApiConstant?.GET_DASHBOARD_TABLE_DATA_SUCCESS:
            return {
                ...state,
                dashboardOnload: false,
                dashboardData: action?.result
            }
        case ApiConstant?.API_CREATE_OR_UPDATE_USER_LOAD:
            return {
                ...state,
                saveUserOnload: true
            }
        case ApiConstant?.API_CREATE_OR_UPDATE_USER_SUCCESS:
            return {
                ...state,
                saveUserOnload: false,
                createUserMessage: action?.result
            }
        case ApiConstant?.API_GET_ROLE_LIST_ACTION_LOAD:
            return {
                ...state,
                getRoleListOnload: true
            }
        case ApiConstant?.API_GET_ROLE_LIST_ACTION_SUCCESS:
            return {
                ...state,
                getRoleListOnload: false,
                getRoleList: action?.result
            }
        case ApiConstant?.API_GET_USER_DETAILS_LIST_LOAD:
            return {
                ...state,
                getUserDetailsListOnload: true
            }
        case ApiConstant?.API_GET_USER_DETAILS_LIST_SUCCESS:
            return {
                ...state,
                getUserDetailsListOnload: false,
                getUserDetailsList: action?.result
            }

        case ApiConstant?.GET_DASHBOARD_DOWNLOAD_XL_LOAD:
            return {
                ...state,
                downloadXLOnLoad: true,
            }
        case ApiConstant?.GET_DASHBOARD_DOWNLOAD_XL_SUCCESS:
            return {
                ...state,
                downloadXLOnLoad: false,
                downloadXLData: action?.result
            }
        case ApiConstant?.GET_DASHBOARD_DOWNLOAD_CSV_LOAD:
            return {
                ...state,
                downloadCSVOnLoad: true,
            }
        case ApiConstant?.GET_DASHBOARD_DOWNLOAD_CSV_SUCCESS:
            return {
                ...state,
                downloadCSVOnLoad: false,
                downloadCSVData: action?.result
            }
            case ApiConstant?.CLEAR_REDUCER_ACTION:
                state[action.key] = null;
                return {
                    ...state,
                }
        default:
            return state;
    }
}

export default JindalReducerState;