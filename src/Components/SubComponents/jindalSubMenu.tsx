import { SyncOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppConstants from "../../Global/AppConstants";
import AppImages from "../../Global/AppImages";
import {
  downloadCSVAction,
  downloadPdfAction,
  getPendingListAction,
  manualOrderSyncAction,
} from "../Store/Action/jindalAction";
import "./jindalSubMenu.scss";
import { getUser } from "../../localStorage";
import SpinLoader from "../Common/SpinLoader";

const JindalSubMenu = (props: any) => {
  const {
    setShowAlert,
    title,
    showLasAsyncAndSelect,
    setAssignToMeKey,
    checkRecords,
    lastSync,
    setsyncprops,
    lastSyncProps,
    filter,
    variable
  } = props;
  const jindalReducerState = useSelector(
    (state: any) => state.JindalReducerState
  );
  const {
    getPendingOnLoad,
    downloadCsvOnLoad,
    getDownloadCsvData,
    getDownloadPdfData,
    downloadPdfOnLoad,
    xlFileStream,
    lastSyncLoad,
    downloadOnload
  } = jindalReducerState;
  const { Option } = Select;
  const getOrderData = jindalReducerState[variable]?.getOrderData?.orderData;

  const setPickKeyState = () => {
    setAssignToMeKey(true);
  };
  const [getDownload, setGetDownLoad] = useState(false);
  const[spinning , setSpining] = useState(false);
  const dispatch = useDispatch();
  const user = getUser();

  const getPendingListApi = (exportType: any) => {
    let payload = {
      filterBy: "",
      type: title,
      exportType: exportType,
      ...filter,
      key: variable,
      paging: {
        limit: exportType === 1 || exportType === 2 ? 0 : 50,
        offset: 0,
      },
    };
    payload.fcutBilletsRefId = payload.fcutBilletsRefId ? payload.fcutBilletsRefId : "";
    payload.fdieTrialRefId = payload.fdieTrialRefId ? payload.fdieTrialRefId : "";
    payload.fdieWithAluminiumRefId = payload.fdieWithAluminiumRefId ? payload.fdieWithAluminiumRefId : "";
    payload.fdiefailRefId = payload.fdiefailRefId ? payload.fdiefailRefId : "";
    payload.fextrusionLengthRefId = payload.fextrusionLengthRefId ? payload.fextrusionLengthRefId : "";
    payload.fplannedQuenching = payload.fplannedQuenching ? payload.fplannedQuenching : "";
    payload.fpreviousDayDie_continueRefId = payload.fpreviousDayDie_continueRefId ? payload.fpreviousDayDie_continueRefId : "";
    payload.fpriority = payload.fpriority ? payload.fpriority : "";
    payload.fstatusOrWeightage = payload.fstatusOrWeightage ? payload.fstatusOrWeightage : -1;
    payload.fPriority = payload.fpriority ? payload.fpriority : "";
    payload.fpressAllocation = payload.fpressAllocation ? payload.fpressAllocation : "";
    delete payload?.fpress;
    dispatch(getPendingListAction(payload));
    setGetDownLoad(true);
  };

  const dateSyncApiCall = () => {
    // setSpining(true)
    dispatch(manualOrderSyncAction(""));
    setsyncprops(true);
  };

  const dummyapiCall = () => {};

  const [getDownloadCsv, setGetDownloadCsv] = useState(false);
  const [getDownloadPdf, setGetDownloadPdf] = useState(false);

  const getOrderDataCommon = () => {
    let payload = {
      filterBy: "",
      type: title,
      exportType: 0,
      ...filter,
      key: variable,
      paging: {
        limit: 50,
        offset: 0,
      },
    };
    dispatch(getPendingListAction(payload));
  };

  const downloadCsvApi = () => {
    let payload = {
      filterBy: "",
      exportType: 2,
      type: title,
      ...filter,
      paging: {
        limit: 0,
        offset: 0,
      },
    };
    payload.fcutBilletsRefId = payload.fcutBilletsRefId ? payload.fcutBilletsRefId : "";
    payload.fdieTrialRefId = payload.fdieTrialRefId ? payload.fdieTrialRefId : "";
    payload.fdieWithAluminiumRefId = payload.fdieWithAluminiumRefId ? payload.fdieWithAluminiumRefId : "";
    payload.fdiefailRefId = payload.fdiefailRefId ? payload.fdiefailRefId : "";
    payload.fextrusionLengthRefId = payload.fextrusionLengthRefId ? payload.fextrusionLengthRefId : "";
    payload.fplannedQuenching = payload.fplannedQuenching ? payload.fplannedQuenching : "";
    payload.fpreviousDayDie_continueRefId = payload.fpreviousDayDie_continueRefId ? payload.fpreviousDayDie_continueRefId : "";
    payload.fpriority = payload.fpriority ? payload.fpriority : "";
    payload.fstatusOrWeightage = payload.fstatusOrWeightage ? payload.fstatusOrWeightage : -1;
    payload.fPriority = payload.fpriority ? payload.fpriority : "";
    payload.fpressAllocation = payload.fpressAllocation ? payload.fpressAllocation : "";
    delete payload?.fpress;
    dispatch(downloadCSVAction(payload));
    setGetDownloadCsv(true);
  };

  const downloadPdfApi = () => {
    let payload = {
      filterBy: "",
      type: title,
      fSectionNo: "",
      fOrderNo: "",
      fSoNo: "",
      fOrderDate: "",
      fCustomerName: "",
      fOrderQty: "",
      fAlloyTemper: "",
      fCutLength: "",
      fPriority: "",
      fCompletedDate: "",
      exportType: 2,
      paging: {
        limit: 0,
        offset: 0,
      },
    };
    dispatch(downloadPdfAction(payload));
    setGetDownloadPdf(true);
  };

  useEffect(() => {
    if (getDownload && !downloadOnload) {
      saveAsXlsxFile();
      setGetDownLoad(false);
    }
  }, [getDownload, downloadOnload]);

  useEffect(() => {
    if (getDownloadPdf && !downloadPdfOnLoad) {
      saveAsPdfFile();
      setGetDownloadPdf(false);
    }
  }, [getDownloadPdf, downloadPdfOnLoad]);

  useEffect(() => {
    if (getDownloadCsv && !downloadCsvOnLoad) {
      saveAsCsvFile();
      setGetDownloadCsv(false);
    }
  }, [getDownloadCsv, downloadCsvOnLoad]);

  const saveAsXlsxFile = () => {
    var pre: any =
      "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
    var inp: any = xlFileStream;
    var link = document.createElement("a");
    link.href = pre + inp;
    link.download = "download.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // window.open(pre+inp);
    getOrderDataCommon();
  };

  const saveAsCsvFile = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    var inp: any = getDownloadCsvData;
    var link = document.createElement("a");
    link.href = csvContent + inp;
    link.download = "download.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // getOrderDataCommon();
  };

  const saveAsPdfFile = () => {
    const file = new Blob([getDownloadPdfData], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement("a");
    // link.href = fileURL
    link.setAttribute("download", "myPDF.pdf");
    link.setAttribute("href", fileURL);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // getOrderDataCommon();
  };

  const downloadProcess = (keyValue: any) => {
    // let key = parseInt(keyValue);
    if (keyValue == 1) {
      getPendingListApi(1);
    } else if (keyValue == 2) {
      downloadCsvApi();
    } else if (keyValue == 3) {
      downloadPdfApi();
      // getPendingListApi(3)
    }
  };

  const downloadMenu = () => {
    return (
      <Menu onClick={(e: any) => downloadProcess(e?.key)}>
        <Menu.Item key={1}>Download As Excel</Menu.Item>
        <Menu.Item key={2}>Download As CSV</Menu.Item>
        {/* <Menu.Item key={3}>Download As PDF</Menu.Item> */}
      </Menu>
    );
  };

  const message: any = () => {
    setShowAlert(false);
    return setTimeout(() => {
      return (
        <div className="alreadyPickedToast ja">
          <div className="toast-div"></div>
          <img src={AppImages?.infoIcon} alt="infoIcon}" />
          <div className="info-text">
            Sorry. Selected PO has been picKed by other user.
          </div>
        </div>
      );
    }, 3000);
  };

  return (
    <div className="submenu-content js">
      <div className="submenu-title">{
      title == 'PENDING' ? "Pending" :
      title == 'INPROGRESS' ? "In-Progress" :
      title == 'HOLD' ? "On Hold" :
      "Completed" 
      }</div>
      <div className="submenu-last-sync-menu-download jc">
        {showLasAsyncAndSelect === true && (
          <>
            {(title === "PENDING" && lastSync != "Invalid date" &&
            (user?.roleId == 2 || user?.roleId == 1)) && (
              <div
                className={
                  lastSyncProps
                    ? "submenu-last-sync-after"
                    : "submenu-last-sync jc"
                }
                onClick={() => {
                  lastSyncProps ? dummyapiCall() : dateSyncApiCall();
                }}
              >
                {/* <img src={AppImages?.recycleIcon} alt="recycleIcon"/> Last Sync: 02-Dec-2022,9.20 AM */}
                {/* <div className="submenu-last-sync jc" onClick={() => {onLoading(prevalue => !prevalue)}}></div> */}
                <SyncOutlined spin={lastSyncProps} />
                {lastSync}
              </div>
            )}

            {title === "PENDING" && user?.roleId !== 1 && (
              <div className="submenu-action">
                <div className="submenu-action-title">Action</div>
                <div className="submenu-action-select">
                  <Select
                    disabled={checkRecords.length === 0}
                    onChange={() => setPickKeyState()}
                    value="Select"
                    style={{ width: 140 }}
                    className="submenu-action-menu"
                    placeholder="Select"
                  >
                    <Option className="submenu-action-option">
                      Assign To Me
                    </Option>
                  </Select>
                </div>
              </div>
            )}
          </>
        )}

        <Dropdown
          overlay={downloadMenu()}
          disabled={
            getOrderData == null
          }
        >
          <div
            className={
              getOrderData == null
                ? "submenu-download-disabled"
                : "submenu-download"
            }
          >
            <img src={AppImages?.downloadIcon} alt="recycleIcon" />
          </div>
        </Dropdown>
        <SpinLoader loading={getDownloadCsv || getDownload}/>
      </div>
    </div>
  );
};

export default JindalSubMenu;
