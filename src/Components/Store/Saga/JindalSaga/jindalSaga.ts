import { message } from "antd";
import { SagaIterator } from "redux-saga";
import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../../Global/ApiConstants";
import { JindalAxiosApi } from "../../Http/JindalHttp/jindalAxiosApi";
import { getBundlingSupervisorInprogressQuery, getCommonReferenceQuery, getOperatorEntryInprogressQuery, getPendingListQuery, getPpcOrderDataQuery, getQAInprogressQuery, getToolShopInprogressQuery, getViewDetailsQuery, jindalLoginQuery, logoutQuery, savePPCDataQuery, updateBundlingSupervisorQuery, updateOperatorEntryQuery, updateOrderStatusQuery, updateQADataQuery, updateToolShopDataQuery,lastSyncQuery, reassignOrderQuery,  createOrUpdateUserQuery, getRoleListQuery, getUserDetailsListQuery,getDashboardData, downloadDashboardXLQuery } from "./jindalGraphQlQuery";

function* failSaga(result: any) {
  yield put({ type: ApiConstants.API_USER_FAIL });
  let msg = result.result.data
    ? result.result.data.message
    : "somethingWentWrong";//AppConstants.somethingWentWrong;
  message.config({
    duration: 1.5,
    maxCount: 1,
  });
  message.error(msg);
}

function* errorSaga(error: any) {
  yield put({
    type: ApiConstants.API_SR_ERROR,
    error: error,
    status: error.status,
  });

  message.config({
    duration: 1.5,
    maxCount: 1,
  });
  message.error("somethingWentWrong");//AppConstants.somethingWentWrong);
}

export function* getPendingListSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.getPendingList, getPendingListQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_GET_PENDING_LIST_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* getInProgressListSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.getInProgressList, getPendingListQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_GET_IN_PROGRESS_LIST_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* savePPCDataSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.savePPCData, savePPCDataQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_SAVE_PPC_DATA_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* updateOrderStatusSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.saveOrderUpdateStatus, updateOrderStatusQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_UPDATE_STATUS_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* getPpcOrderDataSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.getPpcOrderDataList, getPpcOrderDataQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_GET_PPC_ORDER_DATA_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* getViewDetailsSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.getViewDetails, getViewDetailsQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_GET_VIEW_DETAILS_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* jindalLoginSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.jindalLogin, jindalLoginQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_JINDAL_LOGIN_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* updateToolShopSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.updateToolShop, updateToolShopDataQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_UPDATE_TOOL_SHOP_DATA_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* updateQASaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.updateQA, updateQADataQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_UPDATE_QA_DATA_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* updateOperatorEntrySaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.updateOperatorEntry, updateOperatorEntryQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_UPDATE_OPERATOR_ENTRY_DATA_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* updateBundlingSupervisorSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.updateBundlingSupervisor, updateBundlingSupervisorQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_UPDATE_BUNDLING_SUPERVISOR_DATA_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* getToolShopInprogressSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.getToolShopInprogress, getToolShopInprogressQuery(action.payload));    
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_GET_TOOLSHOP_INPROGRESS_DATA_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* getQAInprogressSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.getQAInprogress, getQAInprogressQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_GET_QA_INPROGRESS_DATA_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* getOperatorEntryInprogressSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.getOperatorEntryInprogress, getOperatorEntryInprogressQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_GET_OPERATOR_ENTRY_INPROGRESS_DATA_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* getBundlingSupervisorInprogressSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.getBundlingSupervisorInprogress, getBundlingSupervisorInprogressQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_GET_BUNDLING_SUPERVISOR_INPROGRESS_DATA_SUCCESS,
        result: result.result.data.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* downloadCsvSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.downloadCsv, action?.payload);
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_DOWNLOAD_CSV_SUCCESS,
        result: result?.result?.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* commonReferenceSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.getCommonReference, getCommonReferenceQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_COMMON_REFERENCE_SUCCESS,
        result: result?.result?.data?.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* downloadPdfSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.downloadPdf, action?.payload);
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_DOWNLOAD_PDF_SUCCESS,
        result: result?.result?.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* logoutSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.logout, logoutQuery(action.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_LOGOUT_SUCCESS,
        result: result?.result?.data?.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}


export function* lastSyncSaga(action: any): SagaIterator {
  
  try {
    const result = yield call(JindalAxiosApi.lastSyncData, lastSyncQuery());
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_SYNC_SUCCESS,
        result: result?.result?.data?.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* reassignOrderSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.reassignUpdate, reassignOrderQuery(action?.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_REASSIGN_SUCCESS,
        result: result?.result?.data?.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* getDashboardTableDataSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.dashboardTableData, getDashboardData(action?.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.GET_DASHBOARD_TABLE_DATA_SUCCESS,
        result: result?.result?.data?.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}



export function* createOrUpdateUserSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.createOrUpdateUserAxios, createOrUpdateUserQuery(action?.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_CREATE_OR_UPDATE_USER_SUCCESS,
        result: result?.result?.data?.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* getRoleListSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.getRoleListAxios, getRoleListQuery(action?.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_GET_ROLE_LIST_ACTION_SUCCESS,
        result: result?.result?.data?.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* getUserDetailsListSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.getUserDetailsListAxios, getUserDetailsListQuery(action?.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.API_GET_USER_DETAILS_LIST_SUCCESS,
        result: result?.result?.data?.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}

export function* downloadDashboardXLSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.downloadDashboardXLAxios, downloadDashboardXLQuery(action?.payload));
    if (result.status == 1) {
      yield put({
        type: ApiConstants.GET_DASHBOARD_DOWNLOAD_XL_SUCCESS,
        result: result?.result?.data?.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}
export function* downloadDashboardCSVSaga(action: any): SagaIterator {
  try {
    const result = yield call(JindalAxiosApi.downloadDashboardCSVAxios, action?.payload);
    if (result.status == 1) {
      yield put({
        type: ApiConstants.GET_DASHBOARD_DOWNLOAD_CSV_SUCCESS,
        result: result?.result?.data,
        status: result.status,
        payload: action.payload
      });
    }
    else {
      yield call(failSaga, result);
    }
  }
  catch (error) {
    yield call(errorSaga, error);
  }
}


