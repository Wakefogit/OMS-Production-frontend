import {
  CloseCircleOutlined,
  DownOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Skeleton,
  Space,
  TimePicker,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppConstants from "../../Global/AppConstants";
import AppImages from "../../Global/AppImages";
import { dataModify, deepCopyFunction } from "../../Global/Helpers";
import { getUser } from "../../localStorage";
import FormUpdate from "./FormUpdate";
import OperatorEntryFormUpdate from "./OperatorEntryFormUpdate";
import "./inprogressListScreen.scss";
import {
  commonReferenceDataAction,
  getBundlingSupervisorInprogressDataAction,
  getOperatorEntryInprogressDataAction,
  getPendingListAction,
  getPpcOrderData,
  getQAInprogressDataAction,
  getToolShopInprogressDataAction,
  getViewDetailsAction,
  savePCCDataAction,
  updateBundlingSupervisorDataAction,
  updateOperatorEntryDataAction,
  updateOrderStatus,
  updateQADataAction,
  updateToolShopDataAction,
} from "../Store/Action/jindalAction";
import {

  CommonReassignpopup,
} from "../SubComponents/CommonReassignpopup";
import JindalSubMenu from "../SubComponents/jindalSubMenu";
import QaFormUpdates from "../SubComponents/QaFormUpdate";
import ToolShopFormUpdate from "../SubComponents/ToolShopFormUpdate";
import TopMenuAndSider from "../SubComponents/Top_Menu";
import ViewDetailsScreen from "./ViewDetailsScreen";
import operatorEntryFormUpdate from "./OperatorEntryFormUpdate";

const InProgressListScreen = () => {
  const [expandoOpen, setExpandoOpen] = useState(true);
  const [viewDrawer, setViewDrawer] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);

  const { Option } = Select;
  const [role] = useState(1);
  const windowInnerHeight = window.innerHeight + 0;
  const dispatch = useDispatch();
  const jindalReducerState: any = useSelector(
    (state: any) => state.JindalReducerState
  );
  const {
    getPendingList,
    savePPCDataOnLoad,
    ppcOrderDataList,
    updateStatusOnLoad,
    getPendingOnLoad,
    ppcOrderDataOnLoad,
    viewDetailsOnLoad,
    viewDetailsData,
    getToolShopInprogressData,
    getToolShopOnload,
    updateToolShopOnLoad,
    getQAOnload,
    updateQaOnLoad,
    getQAInprogressData,
    updateOperatorEntryOnLoad,
    getOperatorInprogressData,
    getOperatorOnload,
    updateBundlingSupervisorOnLoad,
    getBundlingOnload,
    getBundlingInprogressData,
    dieReferenceData,
    plantReferenceData,
    dieFailureReasonData,
    reasonForBreakdown,
    updateToolShop,
    responsibleDepartmentForBreakdown,
    processStage,
    savePPCData,
    updateStatusData,
    updateQaData,
    updateOperatorEntryData,
    updateBundlingSupervisor,
  } = jindalReducerState;
  const getOrderData = getPendingList?.getOrderData?.orderData;
  const getOrderDataPage = getPendingList?.getOrderData?.page;
  const [form]: any = Form.useForm();
  const [toolShopForm]: any = Form.useForm();
  const [qaForm]: any = Form.useForm();
  const [operatorForm]: any = Form.useForm();
  const [supervisorForm]: any = Form.useForm();
  const [saveInProgressLoad, setSaveInProgressLoad] = useState(false);
  const [updateStatusLoad, setupdateStatusLoad] = useState(false);
  const [inProgressDataLoad, setInProgressDataLoad] = useState(false);
  const [ppcDataLoad, setPpcDataLoad] = useState(false);
  const ppcOrderDetails = ppcOrderDataList?.getPpcInprogressData;
  const [pageLimit, setPageLimit] = useState(4);
  const [checkNoData, setCheckNoData] = useState(false);
  const [viewDetailsLoad, setViewDetailsLoad] = useState(false);
  const [viewDetailsPpcList, setViewDetailsPpcList] = useState<any>();
  const [viewDetailsToolShopList, setViewDetailsToolShopList] = useState<any>();
  const [viewDetailsOperatorList, setViewDetailsOperatorList] = useState<any>();
  const [viewDetailsQAList, setViewDetailsQAList] = useState<any>();
  const [viewDetailsSupervisorList, setViewDetailsSupervisorList] =
    useState<any>();
  const [ppcSectionData, setPpcSectionData] = useState<any>();
  const [updateToolShopLoad, setUpdateToolShopLoad] = useState(false);
  const getToolShopData = getToolShopInprogressData?.getToolShopInprogressData;
  const getQAData = getQAInprogressData?.getQAInprogressData;
  const getOperatorData =
    getOperatorInprogressData?.getOperatorEntry_inprogressData;
  const getSupervisorData =
    getBundlingInprogressData?.getBundlingSupervisor_inprogressData;
  const user = getUser();
  const workFlowId = [4, 7, 10, 13, 16];
  const [sectionNumModal, setSectionNumModal] = useState<any>(null);
  const [sectionName, setSectionName] = useState<any>("");
  const [reasignToast, setReasignToast] = useState(false);
  const saveInProgressDataTemp = {
    ppcId: "",
    orderId: null,
    alloy: "",
    quenching: "",
    productionRate: null,
    billetLength: null,
    noOfBillet: null,
    piecesPerBillet: null,
    buttThickness: null,
    extrusionLength: "",
    extrusionLengthMeter: "",
    coringOrPipingLength_frontEnd: null,
    coringOrPipingLength_backEnd: null,
    pressEntry: null,
    plantRefId: null,
    balanceQuantity: null,
    noOfPiecesRequired: null,
    quantityTolerance: null,
    remarks: "",
  };

  const updateToolShopDataTemp = {
    toolShopId: "",
    orderId: "",
    dieRefId: null,
    noOfCavity: "",
    bolsterEntry: null,
    backerEntry: null,
    specialBackerEntry: null,
    ringEntry: null,
    dieSetter: null,
    weldingChamber: null,
    remarks: "",
  };

  const updateQATemp = {
    remarks: "",
  };

  const updateOperatorTemp = {
    operatorEntryId: "",
    orderId: "",
    batchNo: null,
    buttWeight: null,
    pushOnBilletLength: null,
    approxPushQty: null,
    startTime: "",
    endTime: "",
    processTime: "",
    productionRateActual: null,
    dieWithAluminium: null,
    diefailed: null,
    dieFailureReasonRefId: null,
    breakDownStartTime: "",
    breakDownEndTime: "",
    reasonForBreakDownRefId: null,
    timeTakenBreakDown: null,
    previousDayDieContinue: null,
    nameOfOperator: "",
    buttThickness: null,
    breakThroughPressure: null,
    responsibleDepartmentForBreakdown: "",
    remarks: "",
  };

  const updateBundlingSupervisorTemp = {
    finishQuantity: null,
    piecesPerBundle: null,
    bundleWeight: null,
    noOfBundles: null,
    correctionQty: null,
    totalNoOfPieces: null,
    totalFinishQty: null,
    recovery: null,
    logEndCutSharpInch: null,
    logEndCutSharpWeight: null,
    remarks: "",
  };

  const [saveInProgressData, setSaveInProgressData] = useState(
    deepCopyFunction(saveInProgressDataTemp)
  );

  const [updateToolShopData, setUpdateToolShopData] = useState(
    deepCopyFunction(updateToolShopDataTemp)
  );
  const [updateQAData, setUpdateQAData] = useState(
    deepCopyFunction(updateQATemp)
  );
  const [updateOperatorData, setUpdateOperatorData] = useState(
    deepCopyFunction(updateOperatorTemp)
  );
  const [updateBundlingSupervisorData, setUpdateBundlingSupervisorData] =
    useState(deepCopyFunction(updateBundlingSupervisorTemp));

  const commonReferenceForDie = () => {
    const payload: any = {
      name: "Die",
    };
    dispatch(commonReferenceDataAction(payload));
  };

  const commonReferenceForPlant = () => {
    const payload: any = {
      name: "Plant",
    };
    dispatch(commonReferenceDataAction(payload));
  };

  const commonReferenceForProcessStage = () => {
    const payload: any = {
      name: AppConstants?.ProcessStage,
    };
    dispatch(commonReferenceDataAction(payload));
  };

  const pendingListFilter = {
    fSectionNo: "",
    fOrderNo: "",
    fSoNo: "",
    fOrderDate: null,
    fCustomerName: "",
    fOrderQty: "",
    fAlloyTemper: "",
    fCutLength: "",
    fPriority: "",
  };

  const [pendingFilter, setPendingFilter] = useState(
    deepCopyFunction(pendingListFilter)
  );

  const getInProgressData = () => {
    let payload = {
      type: AppConstants.INPROGRESS,
      paging: {
        limit: 100,
        offset: 0
      }
    };
    dispatch(getPendingListAction(payload));
    setInProgressDataLoad(true);
  };

  useEffect(() => {
    if (
      pendingFilter?.fSectionNo?.length >= 0 ||
      pendingFilter?.fOrderNo?.length >= 0 ||
      pendingFilter?.fSoNo?.length >= 0 ||
      pendingFilter?.fOrderDate !== "" ||
      pendingFilter?.fOrderDate !== "Invalid date" ||
      pendingFilter?.fAlloyTemper?.length >= 0 ||
      pendingFilter?.fCutLength?.length >= 0 ||
      pendingFilter?.fPriority?.length >= 0 ||
      pendingFilter?.limit ||
      pendingFilter?.offset ||
      pendingFilter?.fCustomerName?.length >= 0 ||
      pendingFilter?.fOrderQty?.length >= 0 ||
      pageLimit
    )
      getInProgressData();
    {
      (user?.roleId === 1 || user?.roleId === 3) && commonReferenceForDie();
    }
    {
      (user?.roleId === 1 || user?.roleId === 2) && commonReferenceForPlant();
    }
    {
      (user?.roleId === 1 || user?.roleId === 5) &&
        commonReferenceForReasonBreakdown();
    }
    {
      (user?.roleId === 1 || user?.roleId === 5) &&
        commonReferenceForResponsibleDept();
    }
    {
      (user?.roleId === 1 || user?.roleId === 5) && commonDieFailureReason();
    }
    {
      user?.roleId === 1 && commonReferenceForProcessStage();
    }
  }, [
    pendingFilter?.fSectionNo,
    pendingFilter?.fOrderNo,
    pendingFilter?.fSoNo,
    pendingFilter?.fOrderDate,
    pendingFilter?.fAlloyTemper,
    pendingFilter?.fCutLength,
    pendingFilter?.fPriority,
    pendingFilter?.limit,
    pendingFilter?.offset,
    pendingFilter?.fCustomerName,
    pendingFilter?.fOrderQty,
    pageLimit,
  ]);

  const viewDetailsApi = (data: any) => {
    let payload: any = {
      orderId: data?.orderId,
    };
    dispatch(getViewDetailsAction(payload));
    setViewDetailsLoad(true);
  };

  //update Tool Shop and get In progress data From

  const updateToolShopApi = (data: any) => {
    let payload = {
      toolShopId:
        getToolShopData?.toolShopId != undefined ||
          getToolShopData?.toolShopId != null
          ? getToolShopData?.toolShopId
          : "",
      orderId: data?.orderId,
      dieRefId: updateToolShopData?.dieRefId
        ? parseInt(updateToolShopData?.dieRefId)
        : null,
      noOfCavity: updateToolShopData?.noOfCavity
        ? parseInt(updateToolShopData?.noOfCavity)
        : null,
      bolsterEntry: updateToolShopData?.bolsterEntry
        ? parseInt(updateToolShopData?.bolsterEntry)
        : null,
      backerEntry: updateToolShopData?.backerEntry
        ? parseInt(updateToolShopData?.backerEntry)
        : null,
      specialBackerEntry: updateToolShopData?.specialBackerEntry
        ? parseInt(updateToolShopData?.specialBackerEntry)
        : null,
      ringEntry: updateToolShopData?.ringEntry
        ? parseInt(updateToolShopData?.ringEntry)
        : null,
      dieSetter: updateToolShopData?.dieSetter
        ? parseInt(updateToolShopData?.dieSetter)
        : null,
      weldingChamber: updateToolShopData?.weldingChamber
        ? parseInt(updateToolShopData?.weldingChamber)
        : null,
      remarks: updateToolShopData?.remarks,
    };
    dispatch(updateToolShopDataAction(payload));
    setUpdateToolShopLoad(true);
  };

  useEffect(() => {
    if (updateToolShopLoad && !updateToolShopOnLoad) {
      getInProgressData();
      if (
        updateToolShop?.createOrUpdateToolShopData == "Updated Successfully"
      ) {
        message?.success("Updated");
      } else {
        message?.error("Fill all the data");
      }
      setUpdateToolShopLoad(false);
    }
  }, [updateToolShopLoad, updateToolShopOnLoad]);

  const [getToolShopInprogressLoad, setGetToolShopInprogressLoad] =
    useState(false);
  const getToolShopInprogress = (data: any) => {
    let payload = {
      orderId: data?.orderId,
    };
    dispatch(getToolShopInprogressDataAction(payload));
    setGetToolShopInprogressLoad(true);
  };

  useEffect(() => {
    if (getToolShopInprogressLoad && !getToolShopOnload) {
      prePopulateToolShopInprogressData();
      setGetToolShopInprogressLoad(false);
    }
  }, [getToolShopInprogressLoad, getToolShopOnload]);

  const prePopulateToolShopInprogressData = () => {
    if (getToolShopData) {
      toolShopForm?.setFieldsValue({
        ["toolshop-die"]: getToolShopData?.dieRefId,
        [`toolshop-noOfCavity`]: getToolShopData?.noOfCavity,
        [`toolshop-bolsterEntry`]: getToolShopData?.bolsterEntry,
        [`toolshop-backerEntry`]: getToolShopData?.backerEntry,
        [`toolshop-specialBackerEntry`]: getToolShopData?.specialBackerEntry,
        [`toolshop-ringEntry`]: getToolShopData?.ringEntry,
        [`toolshop-dieSetter`]: getToolShopData?.dieSetter,
        [`toolshop-weldingChamber`]: getToolShopData?.weldingChamber,
        [`toolshop-remarks`]: getToolShopData?.remarks,
      });
      setUpdateToolShopData({
        ...updateToolShopData,
        toolShopId: getToolShopData?.toolShopId,
        dieRefId: getToolShopData?.dieRefId,
        noOfCavity: getToolShopData?.noOfCavity,
        bolsterEntry: getToolShopData?.bolsterEntry,
        backerEntry: getToolShopData?.backerEntry,
        specialBackerEntry: getToolShopData?.specialBackerEntry,
        ringEntry: getToolShopData?.ringEntry,
        dieSetter: getToolShopData?.dieSetter,
        weldingChamber: getToolShopData?.weldingChamber,
        remarks: getToolShopData?.remarks,
      });
    } else {
      toolShopForm?.resetFields();
    }
  };

  //update Tool Shop and get In progress data To

  //update QA and get In progress data From
  const [updateQALoad, setUpdateQALoad] = useState(false);

  const prePopulateQAInprogressData = () => {
    if (getQAData) {
      qaForm?.setFieldsValue({
        ["qa-remarks"]: getQAData?.remarks,
      });
      setUpdateQAData({
        ...updateQAData,
        remarks: getQAData?.remarks,
      });
    } else {
      qaForm.resetFields();
    }
  };

  const updateQaApi = (data: any) => {
    let payload = {
      qaId:
        getQAData?.qaId != undefined || getQAData?.qaId != null
          ? getQAData?.qaId
          : "",
      orderId: data?.orderId,
      remarks: updateQAData?.remarks,
    };
    // dispatch(updateQADataAction(payload));
    setUpdateQALoad(true);
  };

  useEffect(() => {
    if (updateQALoad && !updateQaOnLoad) {
      getInProgressData();
      if (updateQaData?.createOrUpdateQAData == "Updated Successfully") {
        message?.success("Successfully Updated");
      } else {
        message?.error("Fill all the data");
      }
      setUpdateQALoad(false);
    }
  }, [updateQALoad, updateQaOnLoad]);

  const [getQAInprogressLoad, setGetQAInprogressLoad] = useState(false);
  const getQAInprogress = (data: any) => {
    let payload = {
      orderId: data?.orderId,
    };
    // dispatch(getQAInprogressDataAction(payload));
    setGetQAInprogressLoad(true);
  };

  useEffect(() => {
    if (getQAInprogressLoad && !getQAOnload) {
      prePopulateQAInprogressData();
      setGetQAInprogressLoad(false);
    }
  }, [getQAInprogressLoad, getQAOnload]);

  //update QA and get In progress data To

  //update Operator and get in progress data From
  const [updateOperatorLoad, setUpdateOperatorLoad] = useState(false);
  const [getOperatorInprogressLoad, setGetOperatorInprogressLoad] =
    useState(false);
  const [formBatch, setFormBatch] = useState<any>([]);
  const [formBilletLength, setFormBilletLength] = useState<any>([]);

  const findDuration = (startTime: any, endTime: any) => {
    const startDate: any = new Date(startTime);
    const endDate: any = new Date(endTime);
    const duration: any = endDate.getTime() - startDate.getTime();
    const secs: any = Math.abs(duration) / 1000;
    const min = Math?.floor(secs / 60);
    return min;
  };

  const prePopulateOperatorInprogressData = () => {
    const processTime = findDuration(
      getOperatorData?.startTime,
      getOperatorData?.endTime
    );
    if (getOperatorData) {
      operatorForm?.setFieldsValue({
        [`operator-batchNo`]: getOperatorData?.batchNo,
        [`operator-buttWeightKg`]: getOperatorData?.buttWeight,
        [`operator-pushOnBilletLength`]: getOperatorData?.pushOnBilletLength,
        [`operator-approxPushQty`]: getOperatorData?.approxPushQty,
        [`operator-startTime`]: getOperatorData?.startTime
          ? moment(getOperatorData?.startTime)
          : "",
        [`operator-endTime`]: getOperatorData?.endTime
          ? moment(getOperatorData?.endTime)
          : "",
        [`operator-processTime`]: getOperatorData?.processTime,
        [`operator-productionRateActual`]:
          getOperatorData?.productionRateActual,
        [`operator-dieWithAluminium`]: getOperatorData?.dieWithAluminium,
        [`operator-dieFailed`]: getOperatorData?.diefailed,
        [`operator-dieFailureReason`]: getOperatorData?.dieFailureReasonRefId,
        [`operator-breakdownStartTime`]: getOperatorData?.breakDownStartTime
          ? moment(getOperatorData?.breakDownStartTime)
          : "",
        [`operator-breakdownEndTime`]: getOperatorData?.breakDownEndTime
          ? moment(getOperatorData?.breakDownEndTime)
          : "",
        [`operator-reasonForBreakdown`]:
          getOperatorData?.reasonForBreakDownRefId,
        [`operator-timeTakenBreakdown`]: getOperatorData?.timeTakenBreakDown,
        [`operator-previousDayDieContinue`]:
          getOperatorData?.previousDayDieContinue,
        [`operator-nameOfOperator`]: getOperatorData?.nameOfOperator,
        [`operator-buttThickness`]: getOperatorData?.buttThickness,
        [`operator-breakThroughPressure`]:
          getOperatorData?.breakThroughPressure,
        [`operator-responsibleDepartmentForBreakdown`]:
          getOperatorData?.responsibleDepartmentForBreakdownRefId,
        [`operator-remarks`]: getOperatorData?.remarks,
      });
      setUpdateOperatorData({
        ...updateOperatorData,
        operatorEntryId: getOperatorData?.operatorEntryId,
        batchNo: getOperatorData?.batchNo,
        buttWeight: getOperatorData?.buttWeight,
        pushOnBilletLength: getOperatorData?.pushOnBilletLength,
        approxPushQty: getOperatorData?.approxPushQty,
        startTime: getOperatorData?.startTime
          ? moment(getOperatorData?.startTime)?.utc()?.format()
          : "",
        endTime: getOperatorData?.endTime
          ? moment(getOperatorData?.endTime)?.utc()?.format()
          : "",
        processTime: getOperatorData?.processTime,
        productionRateActual: getOperatorData?.productionRateActual,
        dieWithAluminium: getOperatorData?.dieWithAluminium,
        diefailed: getOperatorData?.diefailed,
        dieFailureReasonRefId: getOperatorData?.dieFailureReasonRefId,
        breakDownStartTime: getOperatorData?.breakDownStartTime
          ? moment(getOperatorData?.breakDownStartTime)?.format()
          : "",
        breakDownEndTime: getOperatorData?.breakDownEndTime
          ? moment(getOperatorData?.breakDownEndTime)?.format()
          : "",
        reasonForBreakDownRefId: getOperatorData?.reasonForBreakDownRefId,
        timeTakenBreakDown: getOperatorData?.timeTakenBreakDown,
        previousDayDieContinue: getOperatorData?.previousDayDieContinue,
        nameOfOperator: getOperatorData?.nameOfOperator,
        buttThickness: getOperatorData?.buttThickness,
        breakThroughPressure: getOperatorData?.breakThroughPressure,
        responsibleDepartmentForBreakdown:
          getOperatorData?.responsibleDepartmentForBreakdownRefId,
        remarks: getOperatorData?.remarks,
      });
    } else {
      if (!updateOperatorData.startTime && !updateOperatorData.endTime) {
        setUpdateOperatorData({
          ...updateOperatorData,
          startTime: "",
          endTime: "",
          breakDownStartTime: "",
          breakDownEndTime: "",
          processTime: null,
          timeTakenBreakDown: null,
        });
      }
      setFormBatch("");
      setFormBilletLength("");
      operatorForm.resetFields();
    }

    if (getOperatorData?.batchNo && getOperatorData?.pushOnBilletLength) {
      setFormBatch(JSON?.parse(getOperatorData?.batchNo));
      setFormBilletLength(JSON?.parse(getOperatorData?.pushOnBilletLength));
    }
  };

  useEffect(() => {
    if (
      (updateOperatorData?.startTime && updateOperatorData?.endTime) ||
      (updateOperatorData?.breakDownStartTime &&
        updateOperatorData?.breakDownEndTime)
    ) {
      const startDate: any = new Date(updateOperatorData?.startTime);
      const endDate: any = new Date(updateOperatorData?.endTime);
      const min = findDuration(startDate, endDate);
      const breakDownStartTime = new Date(
        updateOperatorData?.breakDownStartTime
      );
      const breakDownEndTime = new Date(updateOperatorData?.breakDownEndTime);
      const breakDownMin = findDuration(breakDownStartTime, breakDownEndTime);
      operatorForm?.setFieldsValue({
        [`operator-processTime`]: min ? min : "",
        [`operator-timeTakenBreakdown`]: breakDownMin ? breakDownMin : "",
      });
    }
  }, [
    updateOperatorData?.startTime,
    updateOperatorData?.endTime,
    updateOperatorData?.breakDownStartTime,
    updateOperatorData?.breakDownEndTime,
  ]);

  useEffect(() => {
    if (
      [undefined, null].includes(updateOperatorData?.startTime) ||
      [undefined, null].includes(updateOperatorData?.endTime)
    ) {
      operatorForm?.setFieldsValue({
        [`operator-processTime`]: "",
      });
      setUpdateOperatorData({ ...updateOperatorData, processTime: "" });
    }
  }, [updateOperatorData?.startTime, updateOperatorData?.endTime]);

  useEffect(() => {
    if ([undefined, null].includes(updateOperatorData?.startTime)) {
      operatorForm?.setFieldsValue({
        [`operator-endTime`]: "",
      });
      setUpdateOperatorData({ ...updateOperatorData, endTime: "" });
    }
  }, [updateOperatorData?.startTime]);

  useEffect(() => {
    if (
      [undefined, null].includes(updateOperatorData?.breakDownStartTime) ||
      [undefined, null].includes(updateOperatorData?.breakDownEndTime)
    ) {
      operatorForm?.setFieldsValue({
        [`operator-timeTakenBreakdown`]: "",
      });
      setUpdateOperatorData({ ...updateOperatorData, processTime: "" });
    }
  }, [
    updateOperatorData?.breakDownStartTime,
    updateOperatorData?.breakDownEndTime,
  ]);

  useEffect(() => {
    if ([undefined, null].includes(updateOperatorData?.breakDownStartTime)) {
      operatorForm?.setFieldsValue({
        [`operator-breakdownEndTime`]: "",
      });
      setUpdateOperatorData({ ...updateOperatorData, breakDownEndTime: "" });
    }
  }, [updateOperatorData?.breakDownStartTime]);

  const updateOperatorApi = (data: any) => {
    const startDate: any = new Date(updateOperatorData?.startTime);
    const endDate: any = new Date(updateOperatorData?.endTime);
    const min = findDuration(startDate, endDate);
    const breakDownStartTime = new Date(updateOperatorData?.breakDownStartTime);
    const breakDownEndTime = new Date(updateOperatorData?.breakDownEndTime);
    const breakDownMin = findDuration(breakDownStartTime, breakDownEndTime);
    let payload = {
      operatorEntryId:
        getOperatorData?.operatorEntryId != undefined ||
          getOperatorData?.operatorEntryId != null
          ? getOperatorData?.operatorEntryId
          : "",
      orderId: data?.orderId,
      batchNo: formBatch ? formBatch : null,
      buttWeight: updateOperatorData?.buttWeight
        ? parseInt(updateOperatorData?.buttWeight)
        : null,
      pushOnBilletLength: formBilletLength ? formBilletLength : null,
      approxPushQty: updateOperatorData?.approxPushQty
        ? parseInt(updateOperatorData?.approxPushQty)
        : null,
      startTime: updateOperatorData?.startTime
        ? moment(startDate)?.utc()?.format()
        : "",
      endTime: updateOperatorData?.endTime
        ? moment(endDate)?.utc()?.format()
        : "",
      processTime: min,
      productionRateActual: updateOperatorData?.productionRateActual
        ? parseInt(updateOperatorData?.productionRateActual)
        : null,
      dieWithAluminium: updateOperatorData?.dieWithAluminium
        ? parseInt(updateOperatorData?.dieWithAluminium)
        : null,
      diefailed: updateOperatorData?.diefailed
        ? parseInt(updateOperatorData?.diefailed)
        : null,
      dieFailureReasonRefId: updateOperatorData?.dieFailureReasonRefId,
      breakDownStartTime: updateOperatorData?.breakDownStartTime
        ? moment(breakDownStartTime)?.utc()?.format()
        : null,
      breakDownEndTime: updateOperatorData?.breakDownEndTime
        ? moment(breakDownEndTime)?.utc()?.format()
        : null,
      reasonForBreakDownRefId: updateOperatorData?.reasonForBreakDownRefId
        ? parseInt(updateOperatorData?.reasonForBreakDownRefId)
        : null,
      timeTakenBreakDown: breakDownMin,
      previousDayDieContinue: updateOperatorData?.previousDayDieContinue
        ? parseInt(updateOperatorData?.previousDayDieContinue)
        : null,
      nameOfOperator: updateOperatorData?.nameOfOperator,
      buttThickness: updateOperatorData?.buttThickness
        ? parseInt(updateOperatorData?.buttThickness)
        : null,
      breakThroughPressure: updateOperatorData?.breakThroughPressure
        ? parseInt(updateOperatorData?.breakThroughPressure)
        : null,
      responsibleDepartmentForBreakdown:
        updateOperatorData?.responsibleDepartmentForBreakdown,
      remarks: updateOperatorData?.remarks,
    };
    dispatch(updateOperatorEntryDataAction(payload));
    setUpdateOperatorLoad(true);
  };

  const getOperatorEntryInprogress = (data: any) => {
    let payload = {
      orderId: data?.orderId,
    };
    dispatch(getOperatorEntryInprogressDataAction(payload));
    setGetOperatorInprogressLoad(true);
  };

  const commonDieFailureReason = () => {
    const payload: any = {
      name: AppConstants?.DieFailureReason,
    };
    dispatch(commonReferenceDataAction(payload));
  };

  const commonReferenceForReasonBreakdown = () => {
    const payload: any = {
      name: AppConstants?.ReasonForBreakDown,
    };
    dispatch(commonReferenceDataAction(payload));
  };

  const commonReferenceForResponsibleDept = () => {
    const payload: any = {
      name: AppConstants?.ResponsibleDepartmentForBreakdown,
    };
    dispatch(commonReferenceDataAction(payload));
  };

  useEffect(() => {
    if (getOperatorInprogressLoad && !getOperatorOnload) {
      prePopulateOperatorInprogressData();
      setGetOperatorInprogressLoad(false);
    }
  }, [getOperatorInprogressLoad, getOperatorOnload]);

  useEffect(() => {
    if (reasignToast == true) {
      setTimeout(() => {
        setReasignToast(false);
      }, 5000);
    }
  }, [reasignToast]);
  useEffect(() => {
    if (updateOperatorLoad && !updateOperatorEntryOnLoad) {
      getInProgressData();
      if (
        updateOperatorEntryData?.createOrUpdateOperatorEntryData?.message ==
        "Updated Successfully"
      ) {
        message?.success("Updated");
      } else {
        message?.error("Fill all the data");
      }
      setUpdateOperatorLoad(false);
    }
  }, [updateOperatorLoad, updateOperatorEntryOnLoad]);
  //update Operator and get in progress data To

  //update Bundling Supervisor and get in progress data From
  const [updateBundlingSupervisorLoad, setUpdateBundlingSupervisorLoad] =
    useState(false);
  const [getBundlingSupervisorLoad, setGetBundlingSupervisorLoad] =
    useState(false);

  const prePopulateSupervisorInprogressData = () => {
    if (getSupervisorData) {
      supervisorForm?.setFieldsValue({
        [`supervisor-finishQuantity`]: getSupervisorData?.finishQuantity,
        [`supervisor-noOfPcsPerBundle`]: getSupervisorData?.piecesPerBundle,
        [`supervisor-bundleWeightKg`]: getSupervisorData?.bundleWeight,
        [`supervisor-noOfBundles`]: getSupervisorData?.noOfBundles,
        [`supervisor-correctionQty`]: getSupervisorData?.correctionQty,
        [`supervisor-totalNoOfPcs`]: getSupervisorData?.totalNoOfPieces,
        [`supervisor-totalFinishQty`]: getSupervisorData?.totalFinishQty,
        [`supervisor-recovery`]: getSupervisorData?.recovery,
        [`supervisor-logEndCutScrapInch`]:
          getSupervisorData?.logEndCutSharpInch,
        [`supervisor-logEndCutScrapWeight`]:
          getSupervisorData?.logEndCutSharpWeight,
        [`supervisor-remarks`]: getSupervisorData?.remarks,
      });
      setUpdateBundlingSupervisorData({
        ...updateBundlingSupervisorData,
        finishQuantity: getSupervisorData?.finishQuantity,
        piecesPerBundle: getSupervisorData?.piecesPerBundle,
        bundleWeight: getSupervisorData?.bundleWeight,
        noOfBundles: getSupervisorData?.noOfBundles,
        correctionQty: getSupervisorData?.correctionQty,
        totalNoOfPieces: getSupervisorData?.totalNoOfPieces,
        totalFinishQty: getSupervisorData?.totalFinishQty,
        recovery: getSupervisorData?.recovery,
        logEndCutSharpInch: getSupervisorData?.logEndCutSharpInch,
        logEndCutSharpWeight: getSupervisorData?.logEndCutSharpWeight,
        remarks: getSupervisorData?.remarks,
      });
    } else {
      supervisorForm.resetFields();
    }
  };

  const updateBundlingSupervisorApi = (data: any) => {
    let payload = {
      bundlingSupervisorId:
        getSupervisorData?.bundlingSupervisorId != null ||
          getSupervisorData?.bundlingSupervisorId != undefined
          ? getSupervisorData?.bundlingSupervisorId
          : "",
      orderId: data?.orderId,
      finishQuantity: updateBundlingSupervisorData?.finishQuantity
        ? parseInt(updateBundlingSupervisorData?.finishQuantity)
        : null,
      piecesPerBundle: updateBundlingSupervisorData?.piecesPerBundle
        ? parseInt(updateBundlingSupervisorData?.piecesPerBundle)
        : null,
      bundleWeight: updateBundlingSupervisorData?.bundleWeight
        ? parseInt(updateBundlingSupervisorData?.bundleWeight)
        : null,
      noOfBundles: updateBundlingSupervisorData?.noOfBundles
        ? parseInt(updateBundlingSupervisorData?.noOfBundles)
        : null,
      correctionQty: updateBundlingSupervisorData?.correctionQty
        ? parseInt(updateBundlingSupervisorData?.correctionQty)
        : null,
      totalNoOfPieces: updateBundlingSupervisorData?.totalNoOfPieces
        ? parseInt(updateBundlingSupervisorData?.totalNoOfPieces)
        : null,
      totalFinishQty: updateBundlingSupervisorData?.totalFinishQty
        ? parseInt(updateBundlingSupervisorData?.totalFinishQty)
        : null,
      recovery: updateBundlingSupervisorData?.recovery
        ? parseInt(updateBundlingSupervisorData?.recovery)
        : null,
      logEndCutSharpInch: updateBundlingSupervisorData?.logEndCutSharpInch
        ? parseInt(updateBundlingSupervisorData?.logEndCutSharpInch)
        : null,
      logEndCutSharpWeight: updateBundlingSupervisorData?.logEndCutSharpWeight
        ? parseInt(updateBundlingSupervisorData?.logEndCutSharpWeight)
        : null,
      remarks: updateBundlingSupervisorData?.remarks,
    };
    dispatch(updateBundlingSupervisorDataAction(payload));
    setUpdateBundlingSupervisorLoad(true);
  };

  const getBundlingSupervisorInprogress = (data: any) => {
    let payload = {
      orderId: data?.orderId,
    };
    dispatch(getBundlingSupervisorInprogressDataAction(payload));
    setGetBundlingSupervisorLoad(true);
  };

  useEffect(() => {
    if (getBundlingSupervisorLoad && !getBundlingOnload) {
      prePopulateSupervisorInprogressData();
      setGetBundlingSupervisorLoad(false);
    }
  }, [getBundlingSupervisorLoad, getBundlingOnload]);

  useEffect(() => {
    if (updateBundlingSupervisorLoad && !updateBundlingSupervisorOnLoad) {
      getInProgressData();
      if (
        updateBundlingSupervisor?.createOrUpdateBundlingSupervisor?.message ==
        "Updated Successfully"
      ) {
        message?.success("Updated");
      } else {
        message?.error("Fill all the data");
      }
      setUpdateBundlingSupervisorLoad(false);
    }
  }, [updateBundlingSupervisorLoad, updateBundlingSupervisorOnLoad]);

  //update Bundling Supervisor and get in progress data To
  const prePopulateInprogressData = () => {
    if (ppcOrderDetails) {
      const extrusionLength = ppcOrderDetails?.extrusionLength?.split(" ");
      form?.setFieldsValue({
        [`ppcdata-alloy`]: ppcOrderDetails?.alloy,
        [`ppcdata-quenching`]: ppcOrderDetails?.quenching,
        [`ppcdata-productionRate`]: ppcOrderDetails?.productionRate,
        [`ppcdata-billetLength`]: ppcOrderDetails?.billetLength,
        [`ppcdata-noOfBillet`]: ppcOrderDetails?.noOfBillet,
        [`ppcdata-piecesPerBillet`]: ppcOrderDetails?.piecesPerBillet,
        [`ppcdata-buttThickness`]: ppcOrderDetails?.buttThickness,
        [`ppcdata-extrusionLength`]:
          extrusionLength !== undefined ? extrusionLength[0] : null,
        [`ppcdata-extrusionLengthMeter`]:
          extrusionLength !== undefined ? extrusionLength[1] : null,
        [`ppcdata-coringOrPipingLength_frontEnd`]:
          ppcOrderDetails?.coringOrPipingLength_frontEnd,
        [`ppcdata-coringOrPipingLength_backEnd`]:
          ppcOrderDetails?.coringOrPipingLength_backEnd,
        [`ppcdata-pressEntry`]: ppcOrderDetails?.pressEntry,
        [`ppcdata-plantRefId`]: ppcOrderDetails?.plantRefId,
        [`ppcdata-balanceQuantity`]: ppcOrderDetails?.balanceQuantity,
        [`ppcdata-noOfPiecesRequired`]: ppcOrderDetails?.noOfPiecesRequired,
        [`ppcdata-quantityTolerance`]: ppcOrderDetails?.quantityTolerance,
        [`ppcdata-remarks`]: ppcOrderDetails?.remarks,
      });
      let extraction = ppcOrderDetails?.extrusionLength?.split(" ");
      setSaveInProgressData({
        ...saveInProgressData,
        ppcId: ppcOrderDetails?.ppcId,
        orderId: ppcOrderDetails?.orderId,
        alloy: ppcOrderDetails?.alloy,
        quenching: ppcOrderDetails?.quenching,
        productionRate: ppcOrderDetails?.productionRate,
        billetLength: ppcOrderDetails?.billetLength,
        noOfBillet: ppcOrderDetails?.noOfBillet,
        piecesPerBillet: ppcOrderDetails?.piecesPerBillet,
        buttThickness: ppcOrderDetails?.buttThickness,
        extrusionLength: extraction ? extraction[0] : "",
        extrusionLengthMeter: extraction ? extraction[1] : "",
        coringOrPipingLength_frontEnd:
          ppcOrderDetails?.coringOrPipingLength_frontEnd,
        coringOrPipingLength_backEnd:
          ppcOrderDetails?.coringOrPipingLength_backEnd,
        pressEntry: ppcOrderDetails?.pressEntry,
        plantRefId: ppcOrderDetails?.plantRefId,
        balanceQuantity: ppcOrderDetails?.balanceQuantity,
        noOfPiecesRequired: ppcOrderDetails?.noOfPiecesRequired,
        quantityTolerance: ppcOrderDetails?.quantityTolerance,
        remarks: ppcOrderDetails?.remarks,
      });
    } else {
      form?.resetFields();
    }
  };

  useEffect(() => {
    if (viewDetailsLoad && !viewDetailsOnLoad) {
      setViewDrawer(true);
      setViewDetailsLoad(false);
      setViewDetailsPpcList(viewDetailsData?.getViewDetails[0]?.ppcData);
      setViewDetailsToolShopList(
        viewDetailsData?.getViewDetails[0]?.toolShopData
      );
      setViewDetailsOperatorList(
        viewDetailsData?.getViewDetails[0]?.operatorEntryData
      );
      setViewDetailsQAList(viewDetailsData?.getViewDetails[0]?.qaData);
      setViewDetailsSupervisorList(
        viewDetailsData?.getViewDetails[0]?.bundlingSupervisorData
      );
    }
  }, [viewDetailsLoad, viewDetailsOnLoad]);

  const resetInprogressData = () => {
    form?.resetFields();
    setSaveInProgressData({ ...saveInProgressData, saveInProgressDataTemp });
  };

  const getPpcOrderList = (data: any) => {
    let payload = {
      orderId: data?.orderId ? data?.orderId : "",
    };
    dispatch(getPpcOrderData(payload));
    setPpcDataLoad(true);
  };

  useEffect(() => {
    if (ppcDataLoad && !ppcOrderDataOnLoad) {
      prePopulateInprogressData();
      setPpcDataLoad(false);
    }
  }, [ppcDataLoad, ppcOrderDataOnLoad]);

  const [type, setType] = useState("");

  const updateStatus = (data: any, type: any, isAdminRole: any) => {
    let orderList = [];
    orderList?.push(data?.orderId);
    let orderArr = JSON.stringify(orderList).replace(/"([^(")"]+)":/g, "$1:");

    const startDate: any = new Date(updateOperatorData?.startTime);
    const endDate: any = new Date(updateOperatorData?.endTime);
    const min = findDuration(startDate, endDate);
    const breakDownStartTime = new Date(updateOperatorData?.breakDownStartTime);
    const breakDownEndTime = new Date(updateOperatorData?.breakDownEndTime);
    const breakDownMin = findDuration(breakDownStartTime, breakDownEndTime);

    let ppcRolesData = {
      ppcId:
        ppcOrderDetails?.ppcId != undefined || ppcOrderDetails?.ppcId != null
          ? ppcOrderDetails?.ppcId
          : "",
      orderId: data?.orderId,
      alloy: saveInProgressData?.alloy,
      quenching: saveInProgressData?.quenching,
      productionRate: saveInProgressData?.productionRate
        ? parseInt(saveInProgressData?.productionRate)
        : null,
      billetLength: saveInProgressData?.billetLength
        ? parseInt(saveInProgressData?.billetLength)
        : null,
      noOfBillet: saveInProgressData?.noOfBillet
        ? parseInt(saveInProgressData?.noOfBillet)
        : null,
      piecesPerBillet: saveInProgressData?.piecesPerBillet
        ? parseInt(saveInProgressData?.piecesPerBillet)
        : null,
      buttThickness: saveInProgressData?.buttThickness
        ? parseInt(saveInProgressData?.buttThickness)
        : null,
      extrusionLength:
        saveInProgressData?.extrusionLength +
        " " +
        saveInProgressData?.extrusionLengthMeter,
      coringOrPipingLength_frontEnd:
        saveInProgressData?.coringOrPipingLength_frontEnd
          ? parseInt(saveInProgressData?.coringOrPipingLength_frontEnd)
          : null,
      coringOrPipingLength_backEnd:
        saveInProgressData?.coringOrPipingLength_backEnd
          ? parseInt(saveInProgressData?.coringOrPipingLength_backEnd)
          : null,
      pressEntry: saveInProgressData?.pressEntry
        ? parseInt(saveInProgressData?.pressEntry)
        : null,
      plantRefId: saveInProgressData?.plantRefId
        ? parseInt(saveInProgressData?.plantRefId)
        : null,
      balanceQuantity: saveInProgressData?.balanceQuantity
        ? parseInt(saveInProgressData?.balanceQuantity)
        : null,
      noOfPiecesRequired: saveInProgressData?.noOfPiecesRequired
        ? parseInt(saveInProgressData?.noOfPiecesRequired)
        : null,
      quantityTolerance: saveInProgressData?.quantityTolerance
        ? parseInt(saveInProgressData?.quantityTolerance)
        : null,
      remarks: saveInProgressData?.remarks,
    };

    let toolShopData = {
      toolShopId:
        getToolShopData?.toolShopId != undefined ||
          getToolShopData?.toolShopId != null
          ? getToolShopData?.toolShopId
          : "",
      orderId: data?.orderId,
      dieRefId: updateToolShopData?.dieRefId
        ? parseInt(updateToolShopData?.dieRefId)
        : null,
      noOfCavity: updateToolShopData?.noOfCavity
        ? parseInt(updateToolShopData?.noOfCavity)
        : null,
      bolsterEntry: updateToolShopData?.bolsterEntry
        ? parseInt(updateToolShopData?.bolsterEntry)
        : null,
      backerEntry: updateToolShopData?.backerEntry
        ? parseInt(updateToolShopData?.backerEntry)
        : null,
      specialBackerEntry: updateToolShopData?.specialBackerEntry
        ? parseInt(updateToolShopData?.specialBackerEntry)
        : null,
      ringEntry: updateToolShopData?.ringEntry
        ? parseInt(updateToolShopData?.ringEntry)
        : null,
      dieSetter: updateToolShopData?.dieSetter
        ? parseInt(updateToolShopData?.dieSetter)
        : null,
      weldingChamber: updateToolShopData?.weldingChamber
        ? parseInt(updateToolShopData?.weldingChamber)
        : null,
      remarks: updateToolShopData?.remarks,
    };

    let qaData = {
      qaId:
        getQAData?.qaId != undefined || getQAData?.qaId != null
          ? getQAData?.qaId
          : "",
      orderId: data?.orderId,
      remarks: updateQAData?.remarks,
    };

    let operatorData = {
      operatorId:
        getOperatorData?.operatorEntryId != undefined ||
          getOperatorData?.operatorEntryId != null
          ? getOperatorData?.operatorEntryId
          : "",
      orderId: data?.orderId,
      batchNo: formBatch ? formBatch : null,
      buttWeight: updateOperatorData?.buttWeight
        ? parseInt(updateOperatorData?.buttWeight)
        : null,
      pushOnBilletLength: formBilletLength ? formBilletLength : null,
      approxPushQty: updateOperatorData?.approxPushQty
        ? parseInt(updateOperatorData?.approxPushQty)
        : null,
      startTime: updateOperatorData?.startTime,
      endTime: updateOperatorData?.endTime,
      processTime: min,
      productionRateActual: updateOperatorData?.productionRateActual
        ? parseInt(updateOperatorData?.productionRateActual)
        : null,
      dieWithAluminium: updateOperatorData?.dieWithAluminium
        ? parseInt(updateOperatorData?.dieWithAluminium)
        : null,
      diefailed: updateOperatorData?.diefailed
        ? parseInt(updateOperatorData?.diefailed)
        : null,
      dieFailureReasonRefId: updateOperatorData?.dieFailureReasonRefId,
      breakDownStartTime: updateOperatorData?.breakDownStartTime,
      breakDownEndTime: updateOperatorData?.breakDownEndTime,
      reasonForBreakDownRefId: updateOperatorData?.reasonForBreakDownRefId
        ? parseInt(updateOperatorData?.reasonForBreakDownRefId)
        : null,
      timeTakenBreakDown: breakDownMin,
      previousDayDieContinue: updateOperatorData?.previousDayDieContinue
        ? parseInt(updateOperatorData?.previousDayDieContinue)
        : null,
      nameOfOperator: updateOperatorData?.nameOfOperator,
      buttThickness: updateOperatorData?.buttThickness
        ? parseInt(updateOperatorData?.buttThickness)
        : null,
      breakThroughPressure: updateOperatorData?.breakThroughPressure
        ? parseInt(updateOperatorData?.breakThroughPressure)
        : null,
      responsibleDepartmentForBreakdown:
        updateOperatorData?.responsibleDepartmentForBreakdown,
      remarks: updateOperatorData?.remarks,
    };

    let supervisorData = {
      bundlingSupervisorId:
        getSupervisorData?.bundlingSupervisorId != null ||
          getSupervisorData?.bundlingSupervisorId != undefined
          ? getSupervisorData?.bundlingSupervisorId
          : "",
      orderId: data?.orderId,
      finishQuantity: updateBundlingSupervisorData?.finishQuantity
        ? parseInt(updateBundlingSupervisorData?.finishQuantity)
        : null,
      piecesPerBundle: updateBundlingSupervisorData?.piecesPerBundle
        ? parseInt(updateBundlingSupervisorData?.piecesPerBundle)
        : null,
      bundleWeight: updateBundlingSupervisorData?.bundleWeight
        ? parseInt(updateBundlingSupervisorData?.bundleWeight)
        : null,
      noOfBundles: updateBundlingSupervisorData?.noOfBundles
        ? parseInt(updateBundlingSupervisorData?.noOfBundles)
        : null,
      correctionQty: updateBundlingSupervisorData?.correctionQty
        ? parseInt(updateBundlingSupervisorData?.correctionQty)
        : null,
      totalNoOfPieces: updateBundlingSupervisorData?.totalNoOfPieces
        ? parseInt(updateBundlingSupervisorData?.totalNoOfPieces)
        : null,
      totalFinishQty: updateBundlingSupervisorData?.totalFinishQty
        ? parseInt(updateBundlingSupervisorData?.totalFinishQty)
        : null,
      recovery: updateBundlingSupervisorData?.recovery
        ? parseInt(updateBundlingSupervisorData?.recovery)
        : null,
      logEndCutSharpInch: updateBundlingSupervisorData?.logEndCutSharpInch
        ? parseInt(updateBundlingSupervisorData?.logEndCutSharpInch)
        : null,
      logEndCutSharpWeight: updateBundlingSupervisorData?.logEndCutSharpWeight
        ? parseInt(updateBundlingSupervisorData?.logEndCutSharpWeight)
        : null,
      remarks: updateBundlingSupervisorData?.remarks,
    };
    let payload = {
      orderId: orderArr,
      type: type,
      roleData:
        user?.roleId === 2 || (user?.roleId === 1 && isAdminRole === "PPC Data")
          ? ppcRolesData
          : user?.roleId === 3 ||
            (user?.roleId === 1 && isAdminRole === "Tool Shop Data")
            ? toolShopData
            : user?.roleId === 4 ||
              (user?.roleId === 1 && isAdminRole === "QA Data")
              ? qaData
              : user?.roleId === 5 ||
                (user?.roleId === 1 && isAdminRole === "Operator Entry")
                ? operatorData
                : user?.roleId === 6 ||
                  (user?.roleId === 1 && isAdminRole === "Bundling Supervisor")
                  ? supervisorData
                  : "",
    };
    dispatch(updateOrderStatus(payload));
    setType(type);
    setupdateStatusLoad(true);
  };

  const saveOrUpdateInprogressData = (data: any) => {
    let payload = {
      ppcId: ppcOrderDetails?.ppcId,
      orderId: data?.orderId,
      alloy: saveInProgressData?.alloy,
      quenching: saveInProgressData?.quenching,
      productionRate: saveInProgressData?.productionRate
        ? parseInt(saveInProgressData?.productionRate)
        : null,
      billetLength: saveInProgressData?.billetLength
        ? parseInt(saveInProgressData?.billetLength)
        : null,
      noOfBillet: saveInProgressData?.noOfBillet
        ? parseInt(saveInProgressData?.noOfBillet)
        : null,
      piecesPerBillet: saveInProgressData?.piecesPerBillet
        ? parseInt(saveInProgressData?.piecesPerBillet)
        : null,
      buttThickness: saveInProgressData?.buttThickness
        ? parseInt(saveInProgressData?.buttThickness)
        : null,
      extrusionLength:
        saveInProgressData?.extrusionLength +
        " " +
        saveInProgressData?.extrusionLengthMeter,
      coringOrPipingLength_frontEnd:
        saveInProgressData?.coringOrPipingLength_frontEnd
          ? parseInt(saveInProgressData?.coringOrPipingLength_frontEnd)
          : null,
      coringOrPipingLength_backEnd:
        saveInProgressData?.coringOrPipingLength_backEnd
          ? parseInt(saveInProgressData?.coringOrPipingLength_backEnd)
          : null,
      pressEntry: saveInProgressData?.pressEntry
        ? parseInt(saveInProgressData?.pressEntry)
        : null,
      plantRefId: saveInProgressData?.plantRefId
        ? parseInt(saveInProgressData?.plantRefId)
        : null,
      balanceQuantity: saveInProgressData?.balanceQuantity
        ? parseInt(saveInProgressData?.balanceQuantity)
        : null,
      noOfPiecesRequired: saveInProgressData?.noOfPiecesRequired
        ? parseInt(saveInProgressData?.noOfPiecesRequired)
        : null,
      quantityTolerance: saveInProgressData?.quantityTolerance
        ? parseInt(saveInProgressData?.quantityTolerance)
        : null,
      remarks: saveInProgressData?.remarks,
    };
    dispatch(savePCCDataAction(payload));
    setSaveInProgressLoad(true);
  };

  useEffect(() => {
    if (saveInProgressLoad && !savePPCDataOnLoad) {
      getInProgressData();
      if (savePPCData?.createOrUpdatePpcData == "Updated Successfully") {
        message?.success("Successfully Updated");
      } else {
        message?.error("Fill all the data");
      }
      setSaveInProgressLoad(false);
    }
  }, [saveInProgressLoad, savePPCDataOnLoad]);

  // useEffect(() => {
  //     if (pageLimit) {
  //         // getInProgressData()
  //     }
  // }, [pageLimit])

  const [firstPendingData, setFirstPendingData] = useState<any>(null);
  useEffect(() => {
    if (inProgressDataLoad == true && getPendingOnLoad == false) {
      let FirstArrWorkFlowId =
        getOrderData?.length > 1 ? getOrderData[0]?.workFlowId : 0;
      if (user?.roleId === 2) {
        getPpcOrderList(
          getOrderData?.length == 1
            ? getOrderData[0]
            : getOrderData?.length == null
              ? ""
              : getOrderData?.length > 1 && FirstArrWorkFlowId == 2
                ? getOrderData[0]
                : getOrderData[1]
        );
      } else if (user?.roleId === 3) {
        getToolShopInprogress(
          getOrderData?.length == 1
            ? getOrderData[0]
            : getOrderData?.length == null
              ? ""
              : getOrderData?.length > 1 && FirstArrWorkFlowId == 5
                ? getOrderData[0]
                : getOrderData[1]
        );
      } else if (user?.roleId === 4) {
        getQAInprogress(
          getOrderData?.length == 1
            ? getOrderData[0]
            : getOrderData?.length == null
              ? ""
              : getOrderData?.length > 1 && FirstArrWorkFlowId == 8
                ? getOrderData[0]
                : getOrderData[1]
        );
      } else if (user?.roleId === 5) {
        getOperatorEntryInprogress(
          getOrderData?.length == 1
            ? getOrderData[0]
            : getOrderData?.length == null
              ? ""
              : getOrderData?.length > 1 && FirstArrWorkFlowId == 11
                ? getOrderData[0]
                : getOrderData[1]
        );
      } else if (user?.roleId === 6) {
        getBundlingSupervisorInprogress(
          getOrderData?.length == 1
            ? getOrderData[0]
            : getOrderData?.length == null
              ? ""
              : getOrderData[1]
        );
      }
      setInProgressDataLoad(false);

      setFirstPendingData(
        getOrderData?.length === undefined || getOrderData?.length === null
          ? null
          : getOrderData[0]
      );
      if (getOrderData === undefined) {
        setCheckNoData(true);
      }
    }
  }, [inProgressDataLoad, getPendingOnLoad]);

  useEffect(() => {
    if (updateStatusLoad && !updateStatusOnLoad) {
      getInProgressData();
      resetInprogressData();
      setFormBatch([]);
      setFormBilletLength([]);
      if (
        updateStatusData?.updateOrderStatus_withMapping?.Message ==
        "Updated Successfully"
      ) {
        message?.success(
          type === AppConstants?.COMPLETED
            ? "Successfully Completed"
            : "Order Holded Successfully"
        );
      } else {
        message?.error("Fill all the data");
      }
      setType("");
      setupdateStatusLoad(false);
    }
  }, [updateStatusLoad, updateStatusOnLoad]);

  const [filterMenu, setFilterMenu] = useState(false);

  const clearFilter = () => {
    form?.resetFields();
    setPendingFilter(pendingListFilter);
  };

  const closeFilter = () => {
    form?.resetFields();
    setPendingFilter(pendingListFilter);
    setFilterMenu(false);
  };

  const filterHeader = () => {
    return (
      <Form form={form} autoComplete="off" id="form">
        <div className="withInprogress-filter-header">
          <Row className="withInprogress-filter-row">
            <Col span={3} className="withInprogress-filter-left-radius-col">
              <div className="withInprogress-filter-header-data">
                <div className="withInprogress-filter-header-text jfe">
                  <img
                    src={AppImages?.filterIcon}
                    onClick={() => setFilterMenu(!filterMenu)}
                  />
                  <div className="table-title jc">Section No</div>
                </div>
                <div className="filter-data-with-input jfe">
                  <div className="table-filter-data">Filters:</div>
                  <Form.Item style={{ marginBottom: "0px" }} name="sectionNo">
                    <Input
                      className="table-filter-input"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fSectionNo: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">PO No</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="poNo">
                    <Input
                      className="table-filter-input-width"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fOrderNo: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">SO No</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="soNo">
                    <Input
                      className="table-filter-input-width"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fSoNo: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={3} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Date</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="orderDate">
                    <DatePicker
                      // value={pendingFilter?.fOrderDate}
                      className="table-filter-input-width"
                      format={"DD-MMM-YYYY"}
                      placeholder="Select"
                      onChange={(e: any) => {
                        setPendingFilter({ ...pendingFilter, fOrderDate: e });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={3} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Customer Name</div>
                <div className="filter-data-with-input">
                  <Form.Item
                    style={{ marginBottom: "0px" }}
                    name="customerName"
                  >
                    <Input
                      className="table-filter-input-width"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fCustomerName: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-oqty-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Order Qty (Kgs) DWO wise</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="orderQty">
                    <Input
                      className="table-filter-input-width"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fOrderQty: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={3} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Alloy Temper</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="alloyTemper">
                    <Input
                      className="table-filter-input-width"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fAlloyTemper: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Cut Length</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="cutLength">
                    <Input
                      className="table-filter-input-width"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fCutLength: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Priority</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="priority">
                    <Select
                      className="table-filter-Select-width"
                      placeholder="Select"
                      onChange={(e: any) => {
                        setPendingFilter({ ...pendingFilter, fPriority: e });
                      }}
                    >
                      <Option value={"Immediate"}>Immediate</Option>
                      <Option value={"7 Days"}>7 Days</Option>
                      <Option value={"15 Days"}>15 Days</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-right-radius-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Action</div>
                <div className="filter-data-with-input jfe">
                  <Button
                    className="common-default-button jc"
                    type="default"
                    onClick={() => clearFilter()}
                  >
                    Clear
                  </Button>
                  <div className="cross-button jc">
                    <img
                      src={AppImages?.crossIcon}
                      onClick={() => closeFilter()}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Form>
    );
  };

  const adminFilterHeader = () => {
    return (
      <Form form={form} autoComplete="off" id="form">
        <div className="withInprogress-filter-header">
          <Row className="withInprogress-filter-row">
            <Col span={3} className="withInprogress-filter-left-radius-col">
              <div className="withInprogress-filter-header-data">
                <div className="withInprogress-filter-header-text jfe">
                  <img
                    src={AppImages?.filterIcon}
                    onClick={() => setFilterMenu(!filterMenu)}
                  />
                  <div className="table-title jc">Section No</div>
                </div>
                <div className="filter-data-with-input jfe">
                  <div className="table-filter-data">Filters:</div>
                  <Form.Item style={{ marginBottom: "0px" }} name="sectionNo">
                    <Input
                      className="table-filter-input"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fSectionNo: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">PO No</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="poNo">
                    <Input
                      className="table-filter-input-width"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fOrderNo: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">SO No</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="soNo">
                    <Input
                      className="table-filter-input-width"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fSoNo: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Date</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="orderDate">
                    <DatePicker
                      // value={pendingFilter?.fOrderDate}
                      className="table-filter-input-width"
                      format={"DD-MMM-YYYY"}
                      placeholder="Select"
                      onChange={(e: any) => {
                        setPendingFilter({ ...pendingFilter, fOrderDate: e });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-cust-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Customer Name</div>
                <div className="filter-data-with-input">
                  <Form.Item
                    style={{ marginBottom: "0px" }}
                    name="customerName"
                  >
                    <Input
                      className="table-filter-input-width"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fCustomerName: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-oqty-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Order Qty (Kgs) DWO wise</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="orderQty">
                    <Input
                      className="table-filter-input-width"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fOrderQty: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={3} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Alloy Temper</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="alloyTemper">
                    <Input
                      className="table-filter-input-width"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fAlloyTemper: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Cut Length</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="cutLength">
                    <Input
                      className="table-filter-input-width"
                      placeholder="Enter"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fCutLength: e?.target?.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Priority</div>
                <div className="filter-data-with-input">
                  <Form.Item style={{ marginBottom: "0px" }} name="priority">
                    <Select
                      className="table-filter-Select-width"
                      placeholder="Select"
                      onChange={(e: any) => {
                        setPendingFilter({ ...pendingFilter, fPriority: e });
                      }}
                    >
                      <Option value={"Immediate"}>Immediate</Option>
                      <Option value={"7 Days"}>7 Days</Option>
                      <Option value={"15 Days"}>15 Days</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-filter-cust-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Process Stage</div>
                <div className="filter-data-with-input">
                  <Form.Item
                    style={{ marginBottom: "0px" }}
                    name="processStage"
                  >
                    <Select
                      className="table-filter-Select-width"
                      placeholder="Select"
                      onChange={(e: any) => {
                        setPendingFilter({
                          ...pendingFilter,
                          fProcessStage: e,
                        });
                      }}
                    >
                      {(processStage || []).map((item: any) => {
                        return <Option value={item?.id}>{item?.name}</Option>;
                      })}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={2} className="withInprogress-right-radius-col">
              <div className="withInprogress-filter-header-text">
                <div className="table-title jc">Action</div>
                <div className="filter-data-with-input jfe">
                  <Button
                    className="common-default-button jc"
                    type="default"
                    onClick={() => clearFilter()}
                  >
                    Clear
                  </Button>
                  <div className="cross-button jc">
                    <img
                      src={AppImages?.crossIcon}
                      onClick={() => closeFilter()}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Form>
    );
  };

  const header = () => {
    return (
      <div className={!filterMenu ? "inprogress-header" : ""}>
        {user?.roleId !== 1 && !filterMenu ? (
          <Row className="inprogress-row">
            <Col span={3} className="inprogress-left-radius-col jfe">
              <img
                src={AppImages?.filterIcon}
                onClick={() => setFilterMenu(!filterMenu)}
              />
              Section No
            </Col>
            <Col span={2} className="inprogress-col jc">
              PO No
            </Col>
            <Col span={2} className="inprogress-col jc">
              SO No
            </Col>
            <Col span={3} className="inprogress-col jc">
              Date
            </Col>
            <Col span={3} className="inprogress-col jc">
              Customer Name
            </Col>
            <Col span={2} className="inprogress-col jc">
              <div>
                <div>Order Qty (Kgs) </div>
                <div>DWO wise</div>
              </div>
            </Col>
            <Col span={3} className="inprogress-col jc">
              Alloy Temper
            </Col>
            <Col span={2} className="inprogress-col jc">
              Cut Length
            </Col>
            <Col span={2} className="inprogress-col jc">
              Priority
            </Col>
            <Col span={2} className="inprogress-right-radius-col jc">
              Action
            </Col>
          </Row>
        ) : user?.roleId !== 1 ? (
          filterHeader()
        ) : (
          ""
        )}
        {user?.roleId === 1 && !filterMenu ? (
          <Row className="inprogress-row">
            <Col span={3} className="inprogress-left-radius-col jfe">
              <img
                src={AppImages?.filterIcon}
                onClick={() => setFilterMenu(!filterMenu)}
              />
              Section No
            </Col>
            <Col span={2} className="inprogress-col jc">
              PO No
            </Col>
            <Col span={2} className="inprogress-col jc">
              SO No
            </Col>
            <Col span={2} className="inprogress-col jc">
              Date
            </Col>
            <Col span={2} className="inprogress-col jc">
              Customer Name
            </Col>
            <Col span={2} className="inprogress-col jc">
              <div>
                <div>Order Qty (Kgs) </div>
                <div>DWO wise</div>
              </div>
            </Col>
            <Col span={3} className="inprogress-col jc">
              Alloy Temper
            </Col>
            <Col span={2} className="inprogress-col jc">
              Cut Length
            </Col>
            <Col span={2} className="inprogress-col jc">
              Priority
            </Col>
            <Col span={2} className="inprogress-col jc">
              Process Stage
            </Col>
            <Col span={2} className="inprogress-right-radius-col jc">
              Action
            </Col>
          </Row>
        ) : user?.roleId === 1 && filterMenu ? (
          adminFilterHeader()
        ) : (
          ""
        )}
      </div>
    );
  };

  const expandoOpenOrClose = (data: any) => {
    setExpandoOpen(!expandoOpen);
    if (user?.roleId === 2) {
      getPpcOrderList(data);
    } else if (user?.roleId === 3) {
      getToolShopInprogress(data);
    } else if (user?.roleId === 4) {
      getQAInprogress(data);
    } else if (user?.roleId === 5) {
      getOperatorEntryInprogress(data);
    } else if (user?.roleId === 6) {
      getBundlingSupervisorInprogress(data);
    }
  };
  const Reassignsetvalue = (data: any) => {
    setReassignOpen(true);
    setSectionNumModal(data?.sectionNo);
    setSectionName(data?.processStage);
  };

  const ppcDataInprogress = (data: any) => {
    return (
      <>
        {!getPendingOnLoad ? (
          <div className="inprogressRow-header-expando-collapse">
            <div className="inprogressRow-header">
              <Row className="inprogressRow-row">
                <Col span={3} className="inprogressRow-left-radius-col">
                  <div className="inprogress-expando-icon-text">
                    {expandoOpen === true ? (
                      <DownOutlined
                        className="rightOutlined-Icon"
                        onClick={() => expandoOpenOrClose(data)}
                      />
                    ) : (
                      <RightOutlined
                        className="rightOutlined-Icon"
                        onClick={() => expandoOpenOrClose(data)}
                      />
                    )}
                    <div className="inprogress-expando-text">
                      {data?.sectionNo}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">{data?.orderNo}</div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">{data?.soNo}</div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {dataModify(data?.orderDate)}
                    </div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.customerName}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.orderQty}
                    </div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.alloyTemper}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.cutLength}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div
                      className={
                        data?.priority === "Immediate"
                          ? "table-data_immediate"
                          : "inprogressRow-text jc"
                      }
                    >
                      {data?.priority}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-right-radius-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="completedRow-text jc"></div>
                  </div>
                </Col>
              </Row>
            </div>
            {expandoOpen === true && (
              //     <Form
              //     form={form}
              //     autoComplete="off"
              //     id="form"
              //     onFinish={() => saveOrUpdateInprogressData(data)}
              //   >
              //     <div className="inprogress-expando-collapse">
              //       <Row className="inprogress-data-with-box">
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           Alloy
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-alloy">
              //             <Input
              //               className="inprogress-data-with-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   alloy: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           Quenching
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-quenching">
              //             <Input
              //               className="inprogress-data-with-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   quenching: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           Production Rate Reg(Kg/Hr)
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-productionRate">
              //             <Input
              //               min={1}
              //               type="number"
              //               className="inprogress-data-with-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   productionRate: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           Billet Length (Inches)
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-billetLength">
              //             <Input
              //               min={1}
              //               type="number"
              //               className="inprogress-data-with-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   billetLength: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //       </Row>
              //       <Row className="inprogress-data-with-box">
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           No. of Billet
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-noOfBillet">
              //             <Input
              //               min={1}
              //               maxLength={5}
              //               type="number"
              //               className="inprogress-data-with-box"
              //               onKeyDown={(e: any) =>
              //                 e.keyCode !== 8 &&
              //                 saveInProgressData?.noOfBillet?.length === 5 &&
              //                 e.preventDefault()
              //               }
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   noOfBillet: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           No. of Pieces Per Billet
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-piecesPerBillet">
              //             <Input
              //               min={1}
              //               type="number"
              //               className="inprogress-data-with-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   piecesPerBillet: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           Butt Thickness (Inches)
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-buttThickness">
              //             <Input
              //               min={1}
              //               type="number"
              //               className="inprogress-data-with-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   buttThickness: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           Extrusion Length
              //         </Col>
              //         <Col span={3} className="jfs">
              //           <Form.Item name="ppcdata-extrusionLength">
              //             <Input
              //               min={1}
              //               type="number"
              //               className="inprogress-data-with-small-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   extrusionLength: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //           <Form.Item name="ppcdata-extrusionLengthMeter">
              //             <Select
              //               className="inprogress-data-with-box-samll-select"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   extrusionLengthMeter: e,
              //                 });
              //               }}
              //             >
              //               <Option value={"m"}>(m)</Option>
              //               <Option value={"ft"}>(ft)</Option>
              //               <Option value={"I"}>(I)</Option>
              //             </Select>
              //           </Form.Item>
              //         </Col>
              //       </Row>
              //       <Row className="inprogress-data-with-box">
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           Coring/Piping Length (Front End)
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-coringOrPipingLength_frontEnd">
              //             <Input
              //               min={1}
              //               type="number"
              //               className="inprogress-data-with-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   coringOrPipingLength_frontEnd: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           Coring/Piping Length (Back End)
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-coringOrPipingLength_backEnd">
              //             <Input
              //               min={1}
              //               type="number"
              //               className="inprogress-data-with-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   coringOrPipingLength_backEnd: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           Press Entry
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-pressEntry">
              //             <Input
              //               min={1}
              //               type="number"
              //               className="inprogress-data-with-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   pressEntry: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           Plant
              //         </Col>
              //         <Col span={3}>
              //           <Form.Item name="ppcdata-plantRefId">
              //             <Select
              //               className="inprogress-data-with-box-select"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   plantRefId: e,
              //                 });
              //               }}
              //             >
              //               {(plantReferenceData || []).map((item: any) => {
              //                 return (
              //                   <Option value={item?.id}>{item?.name}</Option>
              //                 );
              //               })}
              //             </Select>
              //           </Form.Item>
              //         </Col>
              //       </Row>
              //       <Row className="inprogress-data-with-box">
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           Balance Quantity (Kg)
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-balanceQuantity">
              //             <Input
              //               min={1}
              //               type="number"
              //               className="inprogress-data-with-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   balanceQuantity: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           No. of Pieces Required
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-noOfPiecesRequired">
              //             <Input
              //               min={1}
              //               type="number"
              //               className="inprogress-data-with-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   noOfPiecesRequired: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //         <Col
              //           span={3}
              //           className="inprogress-data-with-box-title jfe"
              //         >
              //           Quantity Tolerance
              //         </Col>
              //         <Col span={3} className="jc">
              //           <Form.Item name="ppcdata-quantityTolerance">
              //             <Input
              //               min={1}
              //               type="number"
              //               className="inprogress-data-with-box"
              //               onChange={(e: any) => {
              //                 setSaveInProgressData({
              //                   ...saveInProgressData,
              //                   quantityTolerance: e?.target?.value,
              //                 });
              //               }}
              //             />
              //           </Form.Item>
              //         </Col>
              //         {/* <Col span={3} className="inprogress-data-with-box-title jfe">
              //                             Plant
              //                         </Col>
              //                         <Col span={3}>
              //                             <Form.Item name="ppcdata-plantRefId">
              //                                 <Select className="inprogress-data-with-box-select"
              //                                     onChange={(e: any) => {setSaveInProgressData({...saveInProgressData,plantRefId:e})}}>
              //                                     {(plantReferenceData || []).map((item: any) => {
              //                                         return (
              //                                             <Option value={item?.id} >{item?.name}</Option>
              //                                         )
              //                                     })}
              //                                 </Select>
              //                             </Form.Item>
              //                         </Col> */}
              //       </Row>
              //       <div className="inprogress-remark-title-text">
              //         <div className="inprogress-remark-title">Remarks</div>
              //         <Form.Item name="ppcdata-remarks">
              //           <TextArea
              //             maxLength={5000}
              //             className="inprogress-remark-text"
              //             onChange={(e: any) => {
              //               setSaveInProgressData({
              //                 ...saveInProgressData,
              //                 remarks: e?.target?.value,
              //               });
              //             }}
              //           />
              //         </Form.Item>
              //       </div>
              //       <div className="inprogress-buttons js">
              //         <div className="inprogress-hold-complete-button js">
              //           <Button
              //             className="inprogress-hold-button jc"
              //             type="primary"
              //             onClick={() =>
              //               updateStatus(data, AppConstants?.HOLD, 0)
              //             }
              //           >
              //             <img src={AppImages?.holdIcon} />
              //             Hold
              //           </Button>
              //           <Button
              //             className="inprogress-complete-button jc"
              //             type="default"
              //             onClick={() =>
              //               updateStatus(data, AppConstants?.COMPLETED, 0)
              //             }
              //           >
              //             <img src={AppImages?.correctIcon} />
              //             Complete
              //           </Button>
              //           <Button
              //             className="inprogress-Reassign-button jc"
              //             type="default"
              //             onClick={() => {
              //               Reassignsetvalue(data);
              //             }}
              //           >
              //             <img className='inprogress-Reassign-icon' src={AppImages?.vectorIcon} />
              //             Reassign
              //           </Button>
              //         </div>
              //         <div className="inprogress-clear-update-button js">
              //           <Button
              //             className="inprogress-clear-button"
              //             type="default"
              //             onClick={() => getPpcOrderList(data)}
              //           >
              //             Clear
              //           </Button>
              //           <Button
              //             className="inprogress-update-button"
              //             htmlType="submit"
              //             type="primary"
              //           >
              //             Update
              //           </Button>
              //         </div>
              //       </div>
              //     </div>
              //     </Form>

              <FormUpdate
                saveInProgressData={saveInProgressData}
                setSaveInProgressData={setSaveInProgressData}
                getPpcOrderList={getPpcOrderList}
                getInProgressData={getInProgressData}
              />
            )}
          </div>
        ) : (
          <Row gutter={16}>
            {/* {skeletonList.map((item: any) => ( */}
            <Col lg={24} md={24}>
              <div className="agenda-skeleton-card-box">
                <Skeleton paragraph={{ rows: 1 }} loading={true} active />
              </div>
            </Col>
            {/* ))} */}
          </Row>
        )}
      </>
    );
  };

  const toolShopDataInprogress = (data: any) => {
    return (
      <>
        {!getPendingOnLoad ? (
          <div className="inprogressRow-header-expando-collapse">
            <div className="inprogressRow-header">
              <Row className="inprogressRow-row">
                <Col span={3} className="inprogressRow-left-radius-col">
                  <div className="inprogress-expando-icon-text">
                    {expandoOpen === true ? (
                      <DownOutlined
                        className="rightOutlined-Icon"
                        onClick={() => expandoOpenOrClose(data)}
                      />
                    ) : (
                      <RightOutlined
                        className="rightOutlined-Icon"
                        onClick={() => expandoOpenOrClose(data)}
                      />
                    )}
                    <div className="inprogress-expando-text">
                      {data?.sectionNo}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">{data?.orderNo}</div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">{data?.soNo}</div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {dataModify(data?.orderDate)}
                    </div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.customerName}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.orderQty}
                    </div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.alloyTemper}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.cutLength}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div
                      className={
                        data?.priority === "Immediate"
                          ? "table-data_immediate"
                          : "inprogressRow-text jc"
                      }
                    >
                      {data?.priority}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-right-radius-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div
                      className="completedRow-text jc"
                      onClick={() => viewDetailsDrawer(data)}
                      style={{
                        width: "100%",
                        color: "#2C5E8D",
                        cursor: "pointer",
                      }}
                    >
                      View Details
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            {expandoOpen === false && (
              <ToolShopFormUpdate data={data} form={toolShopForm} />
            )}
          </div>
        ) : (
          <Row gutter={16}>
            {/* {skeletonList.map((item: any) => ( */}
            <Col lg={24} md={24}>
              <div className="agenda-skeleton-card-box">
                <Skeleton paragraph={{ rows: 1 }} loading={true} active />
              </div>
            </Col>
            {/* ))} */}
          </Row>
        )}
      </>
    );
  };

  let removeFormFields = (index: any, type: any) => {
    if (type == "Batch") {
      let newFormBatch = [...formBatch];
      newFormBatch.splice(index, 1);
      setFormBatch(newFormBatch);
    } else if (type == "Billet") {
      let newFormBillet = [...formBilletLength];
      newFormBillet.splice(index, 1);
      setFormBilletLength(newFormBillet);
    }
  };

  let handleMultipleData = (index: any, e: any, type: any) => {
    if (type == "Batch") {
      let newFormBatch = [...formBatch];
      newFormBatch[index] = parseInt(e.target.value);
      setFormBatch(newFormBatch);
    } else if (type == "Billet") {
      let newFormBillet = [...formBilletLength];
      newFormBillet[index] = parseInt(e.target.value);
      setFormBilletLength(newFormBillet);
    }
  };

  let addFormFields = (type: any) => {
    if (type == "Batch") {
      setFormBatch([...formBatch, ""]);
    } else if (type == "Billet") {
      setFormBilletLength([...formBilletLength, ""]);
    }
  };

  const disabledHours = (type: any) => {
    const hours: any = [];
    let currentHours: any;
    const compareArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    if (type == "End Time") {
      currentHours = new Date(updateOperatorData?.startTime)?.getHours();
    } else if (type == "Break Time") {
      currentHours = new Date(
        updateOperatorData?.breakDownStartTime
      )?.getHours();
    }

    for (let i = currentHours + 1; i <= 12; i++) {
      hours.push(i);
    }

    hours.push(currentHours);
    const filterHours = compareArr?.filter((x: any) => !hours?.includes(x));
    return filterHours;
  };

  const disabledMinutes = (selectedHour: any, type: any) => {
    const minutes: any = [];
    let currentMinutes: any;
    let startHours: any;
    if (type == "End Time") {
      currentMinutes = new Date(updateOperatorData?.startTime)?.getMinutes();
      startHours = new Date(updateOperatorData?.startTime)?.getHours();
    } else if (type == "Break Time") {
      currentMinutes = new Date(
        updateOperatorData?.breakDownStartTime
      )?.getMinutes();
      startHours = new Date(updateOperatorData?.breakDownStartTime)?.getHours();
    }
    const tempMin = [];
    for (let i = 0; i <= 59; i++) {
      tempMin?.push(i);
    }
    if (selectedHour == startHours) {
      for (let i = currentMinutes; i <= 60; i++) {
        minutes.push(i);
      }
      const filterMin = tempMin?.filter((x: any) => !minutes?.includes(x));
      return filterMin;
    } else {
      return minutes;
    }
  };

  const multiplInputBoxForBatch = (type: any) => {
    return (
      <div className="wrap">
        {(formBatch || []).map((item: any, index: any) => {
          return (
            <div className="d-flex" style={{ margin: "0px 0px 10px 0px" }}>
              {
                <div
                  className="multiple-inputBox-container"
                  style={{ margin: "0px 10px" }}
                >
                  <div className="d-flex">
                    <Input
                      min={1}
                      type="number"
                      className="inputBox-Width60"
                      value={item ? item : null}
                      onChange={(e: any) => handleMultipleData(index, e, type)}
                    />
                    <div
                      className="closeButton jc"
                      onClick={() => removeFormFields(index, type)}
                    >
                      X
                    </div>
                  </div>
                </div>
              }
            </div>
          );
        })}
      </div>
    );
  };

  const multiplInputBoxForBillet = (type: any) => {
    return (
      <div className="wrap">
        {(formBilletLength || []).map((item: any, index: any) => {
          return (
            <div className="d-flex" style={{ margin: "0px 0px 10px 0px" }}>
              {
                <div
                  className="multiple-inputBox-container"
                  style={{ margin: "0px 10px" }}
                >
                  <div className="d-flex">
                    <Input
                      min={1}
                      type="number"
                      value={item ? item : null}
                      className="inputBox-Width60"
                      onChange={(e: any) => handleMultipleData(index, e, type)}
                    />
                    <div
                      className="closeButton jc"
                      onClick={() => removeFormFields(index, type)}
                    >
                      X
                    </div>
                  </div>
                </div>
              }
            </div>
          );
        })}
      </div>
    );
  };

  const operatorEntryInprogress = (data: any) => {
    return (
      <>
        {!getPendingOnLoad ? (
          <div className="inprogressRow-header-expando-collapse">
            <div className="inprogressRow-header">
              <Row className="inprogressRow-row">
                <Col span={3} className="inprogressRow-left-radius-col">
                  <div className="inprogress-expando-icon-text">
                    {expandoOpen === true ? (
                      <DownOutlined
                        className="rightOutlined-Icon"
                        onClick={() => expandoOpenOrClose(data)}
                      />
                    ) : (
                      <RightOutlined
                        className="rightOutlined-Icon"
                        onClick={() => expandoOpenOrClose(data)}
                      />
                    )}
                    <div className="inprogress-expando-text">
                      {data?.sectionNo}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">{data?.orderNo}</div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">{data?.soNo}</div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {dataModify(data?.orderDate)}
                    </div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.customerName}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.orderQty}
                    </div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.alloyTemper}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.cutLength}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div
                      className={
                        data?.priority == "Immediate"
                          ? "immediate jc"
                          : "inprogressRow-text jc"
                      }
                    >
                      {data?.priority}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-right-radius-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div
                      className="completedRow-text jc"
                      onClick={() => viewDetailsDrawer(data)}
                      style={{
                        width: "100%",
                        color: "#2C5E8D",
                        cursor: "pointer",
                      }}
                    >
                      View Details
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            {expandoOpen === true && (
              // <Form
              //   form={operatorForm}
              //   autoComplete="off"
              //   id="operatorForm"
              //   onFinish={() => updateOperatorApi(data)}
              // >
              //   <div className="inprogress-expando-collapse">
              //     <Row className="inprogress-data-with-box">
              //       <Col span={3} className="inprogress-data-with-box-title">
              //         {AppConstants?.batchNo}
              //       </Col>
              //       <Col span={1} className="d-flex">
              //         <Form.Item name="operator-batchNo">
              //           {formBatch?.length >= 0 && (
              //             <div className="d-flex">
              //               <div
              //                 className="addButton d-flex"
              //                 onClick={() => addFormFields("Batch")}
              //               >
              //                 +
              //               </div>
              //             </div>
              //           )}
              //           {/* <Input type="number" className="inprogress-data-with-box" onChange={(e: any) => setUpdateOperatorData({ ...updateOperatorData, batchNo: e?.target?.value })} /> */}
              //         </Form.Item>
              //       </Col>
              //       <Col span={20} className="d-flex">
              //         {multiplInputBoxForBatch("Batch")}
              //       </Col>
              //     </Row>
              //     <Row className="inprogress-data-with-box">
              //       <Col span={3} className="inprogress-data-with-box-title">
              //         {AppConstants?.pushOnBilletLength}
              //       </Col>
              //       <Col span={1} className="d-flex">
              //         <Form.Item name="operator-pushOnBilletLength">
              //           {formBilletLength?.length >= 0 && (
              //             <div className="d-flex">
              //               <div
              //                 className="addButton d-flex"
              //                 onClick={() => addFormFields("Billet")}
              //               >
              //                 +
              //               </div>
              //             </div>
              //           )}
              //         </Form.Item>
              //       </Col>
              //       <Col span={20} className="d-flex">
              //         {multiplInputBoxForBillet("Billet")}
              //       </Col>
              //     </Row>
              //     <Row className="inprogress-data-with-box">
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.buttWeightKg}
              //       </Col>
              //       <Col span={3} className="jc">
              //         <Form.Item name="operator-buttWeightKg">
              //           <Input
              //             min={1}
              //             type="number"
              //             className="inprogress-data-with-box"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 buttWeight: e?.target?.value,
              //               })
              //             }
              //           />
              //         </Form.Item>
              //       </Col>
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.approxPushQty}
              //       </Col>
              //       <Col span={3} className="jc">
              //         <Form.Item name="operator-approxPushQty">
              //           <Input
              //             min={1}
              //             type="number"
              //             className="inprogress-data-with-box"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 approxPushQty: e?.target?.value,
              //               })
              //             }
              //           />
              //         </Form.Item>
              //       </Col>
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.startTime}
              //       </Col>
              //       <Col span={3}>
              //         {/* <Input className="inprogress-data-with-box" onChange={(e: any) => setUpdateOperatorData({...updateOperatorData,startTime:e?.target?.value})}/> */}
              //         <Form.Item name="operator-startTime">
              //           {/* <Input className="inprogress-data-with-box" onChange={(e: any) => setUpdateOperatorData({...updateOperatorData,startTime:e?.target?.value})}/> */}
              //           <TimePicker
              //             className="inprogress-data-with-time-picker"
              //             format={"HH:mm A"}
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 startTime: e,
              //               })
              //             }
              //             placeholder="Select"
              //             suffixIcon={false}
              //           />
              //           {/* <TimePicker 
              //                           format={"HH:mm"} 
              //                           value={updateOperatorData?.startTime && moment(updateOperatorData?.startTime).format("HH:mm")}
              //                           onChange={(timeString: any) => setUpdateOperatorData({...updateOperatorData,startTime:moment(timeString).format("HH:mm:ss")})}
              //                           // onChange={(timeString: any) => console.log("timeString => => ",moment(timeString).format("hh:mm"))}
              //                           /> */}
              //           {/* <TimePicker format={"HH:mm"} onChange={(event: any) => console.log("eygf",moment(event).format("HH:mm:ss"))}/> */}
              //         </Form.Item>
              //       </Col>
              //       <Col span={3} className="inprogress-data-with-box-title jc">
              //         {AppConstants?.endTime}
              //       </Col>
              //       <Col span={3}>
              //         <Form.Item name="operator-endTime">
              //           <TimePicker
              //             disabled={
              //               updateOperatorData?.startTime ? false : true
              //             }
              //             className="inprogress-data-with-time-picker"
              //             format={"HH:mm A"}
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 endTime: e,
              //               })
              //             }
              //             placeholder="Select"
              //             suffixIcon={false}
              //             disabledHours={() => disabledHours("End Time")}
              //             disabledMinutes={(e: any) =>
              //               disabledMinutes(e, "End Time")
              //             }
              //           />
              //         </Form.Item>
              //       </Col>
              //     </Row>
              //     <Row className="inprogress-data-with-box">
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.processTime}
              //       </Col>
              //       <Col span={3} className="jc">
              //         <Form.Item name="operator-processTime">
              //           <Input
              //             disabled={true}
              //             className="inprogress-data-with-box-disabled"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 processTime: e?.target?.value,
              //               })
              //             }
              //             suffix="min"
              //           />
              //         </Form.Item>
              //       </Col>
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.productionRateActual}
              //       </Col>
              //       <Col span={3} className="jc">
              //         <Form.Item name="operator-productionRateActual">
              //           <Input
              //             min={1}
              //             type="number"
              //             className="inprogress-data-with-box"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 productionRateActual: e?.target?.value,
              //               })
              //             }
              //           />
              //         </Form.Item>
              //       </Col>
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.dieFailureReason}
              //       </Col>
              //       <Col span={9}>
              //         <Form.Item name="operator-dieFailureReason">
              //           <Select
              //             className="inprogress-data-with-long-box-select"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 dieFailureReasonRefId: e,
              //               })
              //             }
              //           >
              //             {/* {(dieFailureReasonData || []).map((item: any) => {
              //               return (
              //                 <Option value={item?.id}>{item?.name}</Option>
              //               );
              //             })} */}
              //           </Select>
              //         </Form.Item>
              //       </Col>
              //     </Row>
              //     <Row className="inprogress-data-with-box">
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.dieWithAluminium}
              //       </Col>
              //       <Col span={3} className="jc">
              //         <Form.Item name="operator-dieWithAluminium">
              //           <Input
              //             min={1}
              //             type="number"
              //             className="inprogress-data-with-box"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 dieWithAluminium: e?.target?.value,
              //               })
              //             }
              //           />
              //         </Form.Item>
              //       </Col>
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.dieFailed}
              //       </Col>
              //       <Col span={3} className="jc">
              //         <Form.Item name="operator-dieFailed">
              //           <Input
              //             min={1}
              //             type="number"
              //             className="inprogress-data-with-box"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 diefailed: e?.target?.value,
              //               })
              //             }
              //           />
              //         </Form.Item>
              //       </Col>
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.reasonForBreakdown}
              //       </Col>
              //       <Col span={9}>
              //         <Form.Item name="operator-reasonForBreakdown">
              //           <Select
              //             className="inprogress-data-with-long-box-select"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 reasonForBreakDownRefId: e,
              //               })
              //             }
              //           >
              //             {/* {(reasonForBreakdown || []).map((item: any) => {
              //               return (
              //                 <Option value={item?.id}>{item?.name}</Option>
              //               );
              //             })} */}
              //           </Select>
              //         </Form.Item>
              //       </Col>
              //     </Row>
              //     <Row className="inprogress-data-with-box">
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.breakdownStartTime}
              //       </Col>
              //       <Col span={3}>
              //         <Form.Item name="operator-breakdownStartTime">
              //           <TimePicker
              //             className="inprogress-data-with-time-picker"
              //             format={"HH:mm A"}
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 breakDownStartTime: e,
              //               })
              //             }
              //             placeholder="Select"
              //             suffixIcon={false}
              //           />
              //         </Form.Item>
              //       </Col>
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.breakdownEndTime}
              //       </Col>
              //       <Col span={3}>
              //         <Form.Item name="operator-breakdownEndTime">
              //           <TimePicker
              //             disabled={
              //               updateOperatorData?.breakDownStartTime
              //                 ? false
              //                 : true
              //             }
              //             className="inprogress-data-with-time-picker"
              //             format={"HH:mm A"}
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 breakDownEndTime: e,
              //               })
              //             }
              //             placeholder="Select"
              //             suffixIcon={false}
              //             disabledHours={() => disabledHours("Break Time")}
              //             disabledMinutes={(e: any) =>
              //               disabledMinutes(e, "Break Time")
              //             }
              //           />
              //         </Form.Item>
              //       </Col>
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.nameOfOperator}
              //       </Col>
              //       <Col span={9}>
              //         <Form.Item name="operator-nameOfOperator">
              //           <Input
              //             className="inprogress-data-with-long-box-title"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 nameOfOperator: e?.target?.value,
              //               })
              //             }
              //           />
              //         </Form.Item>
              //       </Col>
              //     </Row>
              //     <Row className="inprogress-data-with-box">
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.timeTakenBreakdown}
              //       </Col>
              //       <Col span={3} className="jc">
              //         <Form.Item name="operator-timeTakenBreakdown">
              //           <Input
              //             disabled={true}
              //             className="inprogress-data-with-box-disabled"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 timeTakenBreakDown: e?.target?.value,
              //               })
              //             }
              //             suffix="min"
              //           />
              //         </Form.Item>
              //       </Col>
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         {AppConstants?.previousDayDieContinue}
              //       </Col>
              //       <Col span={3} className="jc">
              //         <Form.Item name="operator-previousDayDieContinue">
              //           <Input
              //             min={1}
              //             type="number"
              //             className="inprogress-data-with-box"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 previousDayDieContinue: e?.target?.value,
              //               })
              //             }
              //           />
              //         </Form.Item>
              //       </Col>
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         Responsible Department for Breakdown
              //       </Col>
              //       <Col span={9}>
              //         <Form.Item name="operator-responsibleDepartmentForBreakdown">
              //           <Select
              //             className="inprogress-data-with-long-box-select"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 responsibleDepartmentForBreakdown: e,
              //               })
              //             }
              //           >
              //             {/* {(responsibleDepartmentForBreakdown || []).map(
              //               (item: any) => {
              //                 return (
              //                   <Option value={item?.id}>{item?.name}</Option>
              //                 );
              //               }
              //             )} */}
              //           </Select>
              //         </Form.Item>
              //       </Col>
              //     </Row>
              //     <Row className="inprogress-data-with-box">
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         Butt Thickness (mm)
              //       </Col>
              //       <Col span={3} className="jc">
              //         <Form.Item name="operator-buttThickness">
              //           <Input
              //             min={1}
              //             type="number"
              //             className="inprogress-data-with-box"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 buttThickness: e?.target?.value,
              //               })
              //             }
              //           />
              //         </Form.Item>
              //       </Col>
              //       <Col
              //         span={3}
              //         className="inprogress-data-with-box-title jfe"
              //       >
              //         Break through Pressure (MPa)
              //       </Col>
              //       <Col span={3} className="jc">
              //         <Form.Item name="operator-breakThroughPressure">
              //           <Input
              //             min={1}
              //             className="inprogress-data-with-box"
              //             onChange={(e: any) =>
              //               setUpdateOperatorData({
              //                 ...updateOperatorData,
              //                 breakThroughPressure: e?.target?.value,
              //               })
              //             }
              //           />
              //         </Form.Item>
              //       </Col>
              //     </Row>
              //     <div className="inprogress-remark-title-text">
              //       <div className="inprogress-remark-title">Remarks</div>
              //       <Form.Item name="operator-remarks">
              //         <TextArea
              //           maxLength={5000}
              //           className="inprogress-remark-text"
              //           onChange={(e: any) =>
              //             setUpdateOperatorData({
              //               ...updateOperatorData,
              //               remarks: e?.target?.value,
              //             })
              //           }
              //         />
              //       </Form.Item>
              //     </div>
              //     <div className="inprogress-buttons js">
              //       <div className="inprogress-hold-complete-button js">
              //         <Button
              //           className="inprogress-hold-button jc"
              //           type="primary"
              //           onClick={() =>
              //             updateStatus(data, AppConstants?.HOLD, 0)
              //           }
              //         >
              //           <img src={AppImages?.holdIcon} />
              //           Hold
              //         </Button>
              //         <Button
              //           className="inprogress-complete-button jc"
              //           type="default"
              //           onClick={() =>
              //             updateStatus(data, AppConstants?.COMPLETED, 0)
              //           }
              //         >
              //           <img src={AppImages?.correctIcon} />
              //           Complete
              //         </Button>
              //         <Button
              //           className="inprogress-Reassign-button jc"
              //           type="default"
              //           onClick={() => {
              //             Reassignsetvalue(data);
              //           }}
              //         >
              //           <img
              //             className="inprogress-Reassign-icon"
              //             src={AppImages?.vectorIcon}
              //           />
              //           Reassign
              //         </Button>
              //       </div>
              //       <div className="inprogress-clear-update-button js">
              //         <Button
              //           className="inprogress-clear-button"
              //           type="default"
              //           onClick={() => getOperatorEntryInprogress(data)}
              //         >
              //           Clear
              //         </Button>
              //         <Button
              //           className="inprogress-update-button"
              //           type="primary"
              //           htmlType="submit"
              //         >
              //           Update
              //         </Button>
              //       </div>
              //     </div>
              //   </div>
              // </Form>
              <OperatorEntryFormUpdate
                getInProgressData={getInProgressData} />
            )}
          </div>
        ) : (
          <Row gutter={16}>
            {/* {skeletonList.map((item: any) => ( */}
            <Col lg={24} md={24}>
              <div className="agenda-skeleton-card-box">
                <Skeleton paragraph={{ rows: 1 }} loading={true} active />
              </div>
            </Col>
            {/* ))} */}
          </Row>
        )}
      </>
    );
  };

  const supervisorInprogress = (data: any) => {
    return (
      <>
        {!getPendingOnLoad ? (
          <div className="inprogressRow-header-expando-collapse">
            <div className="inprogressRow-header">
              <Row className="inprogressRow-row">
                <Col span={3} className="inprogressRow-left-radius-col">
                  <div className="inprogress-expando-icon-text">
                    {expandoOpen === true ? (
                      <DownOutlined
                        className="rightOutlined-Icon"
                        onClick={() => expandoOpenOrClose(data)}
                      />
                    ) : (
                      <RightOutlined
                        className="rightOutlined-Icon"
                        onClick={() => expandoOpenOrClose(data)}
                      />
                    )}
                    <div className="inprogress-expando-text">
                      {data?.sectionNo}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">{data?.orderNo}</div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">{data?.soNo}</div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {dataModify(data?.orderDate)}
                    </div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.customerName}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.orderQty}
                    </div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.alloyTemper}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.cutLength}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div
                      className={
                        data?.priority == "Immediate"
                          ? "immediate jc"
                          : "inprogressRow-text jc"
                      }
                    >
                      {data?.priority}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-right-radius-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div
                      className="completedRow-text jc"
                      onClick={() => viewDetailsDrawer(data)}
                      style={{
                        width: "100%",
                        color: "#2C5E8D",
                        cursor: "pointer",
                      }}
                    >
                      View Details
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            {expandoOpen === true && (
              <Form
                form={supervisorForm}
                autoComplete="off"
                id="supervisorForm"
                onFinish={() => updateBundlingSupervisorApi(data)}
              >
                <div className="inprogress-expando-collapse">
                  <Row className="inprogress-data-with-box">
                    <Col
                      span={3}
                      className="inprogress-data-with-box-title jfe"
                    >
                      {AppConstants?.finishQuantity}
                    </Col>
                    <Col span={3} className="jc">
                      <Form.Item name="supervisor-finishQuantity">
                        <Input
                          min={1}
                          type="number"
                          className="inprogress-data-with-box"
                          onChange={(e: any) =>
                            setUpdateBundlingSupervisorData({
                              ...updateBundlingSupervisorData,
                              finishQuantity: e?.target?.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      span={3}
                      className="inprogress-data-with-box-title jfe"
                    >
                      {AppConstants?.noOfPcsPerBundle}
                    </Col>
                    <Col span={3} className="jc">
                      <Form.Item name="supervisor-noOfPcsPerBundle">
                        <Input
                          min={1}
                          type="number"
                          className="inprogress-data-with-box"
                          onChange={(e: any) =>
                            setUpdateBundlingSupervisorData({
                              ...updateBundlingSupervisorData,
                              piecesPerBundle: e?.target?.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      span={3}
                      className="inprogress-data-with-box-title jfe"
                    >
                      {AppConstants?.bundleWeightKg}
                    </Col>
                    <Col span={3} className="jc">
                      <Form.Item name="supervisor-bundleWeightKg">
                        <Input
                          min={1}
                          type="number"
                          className="inprogress-data-with-box"
                          onChange={(e: any) =>
                            setUpdateBundlingSupervisorData({
                              ...updateBundlingSupervisorData,
                              bundleWeight: e?.target?.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      span={3}
                      className="inprogress-data-with-box-title jfe"
                    >
                      {AppConstants?.noOfBundles}
                    </Col>
                    <Col span={3} className="jc">
                      <Form.Item name="supervisor-noOfBundles">
                        <Input
                          min={1}
                          type="number"
                          className="inprogress-data-with-box"
                          onChange={(e: any) =>
                            setUpdateBundlingSupervisorData({
                              ...updateBundlingSupervisorData,
                              noOfBundles: e?.target?.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className="inprogress-data-with-box">
                    <Col
                      span={3}
                      className="inprogress-data-with-box-title jfe"
                    >
                      {AppConstants?.correctionQty}
                    </Col>
                    <Col span={3} className="jc">
                      <Form.Item name="supervisor-correctionQty">
                        <Input
                          min={1}
                          type="number"
                          className="inprogress-data-with-box"
                          onChange={(e: any) =>
                            setUpdateBundlingSupervisorData({
                              ...updateBundlingSupervisorData,
                              correctionQty: e?.target?.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      span={3}
                      className="inprogress-data-with-box-title jfe"
                    >
                      {AppConstants?.totalNoOfPcs}
                    </Col>
                    <Col span={3} className="jc">
                      <Form.Item name="supervisor-totalNoOfPcs">
                        <Input
                          min={1}
                          type="number"
                          className="inprogress-data-with-box"
                          onChange={(e: any) =>
                            setUpdateBundlingSupervisorData({
                              ...updateBundlingSupervisorData,
                              totalNoOfPieces: e?.target?.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      span={3}
                      className="inprogress-data-with-box-title jfe"
                    >
                      {AppConstants?.totalFinishQty}
                    </Col>
                    <Col span={3} className="jc">
                      <Form.Item name="supervisor-totalFinishQty">
                        <Input
                          min={1}
                          type="number"
                          className="inprogress-data-with-box"
                          onChange={(e: any) =>
                            setUpdateBundlingSupervisorData({
                              ...updateBundlingSupervisorData,
                              totalFinishQty: e?.target?.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      span={3}
                      className="inprogress-data-with-box-title jfe"
                    >
                      {AppConstants?.recovery}
                    </Col>
                    <Col span={3} className="jc">
                      <Form.Item name="supervisor-recovery">
                        <Input
                          min={1}
                          type="number"
                          className="inprogress-data-with-box"
                          onChange={(e: any) =>
                            setUpdateBundlingSupervisorData({
                              ...updateBundlingSupervisorData,
                              recovery: e?.target?.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className="inprogress-data-with-box">
                    <Col
                      span={3}
                      className="inprogress-data-with-box-title jfe"
                    >
                      {AppConstants?.logEndCutScrapInch}
                    </Col>
                    <Col span={3} className="jc">
                      <Form.Item name="supervisor-logEndCutScrapInch">
                        <Input
                          min={1}
                          type="number"
                          className="inprogress-data-with-box"
                          onChange={(e: any) =>
                            setUpdateBundlingSupervisorData({
                              ...updateBundlingSupervisorData,
                              logEndCutSharpInch: e?.target?.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      span={3}
                      className="inprogress-data-with-box-title jfe"
                    >
                      {AppConstants?.logEndCutScrapWeight}
                    </Col>
                    <Col span={3} className="jc">
                      <Form.Item name="supervisor-logEndCutScrapWeight">
                        <Input
                          min={1}
                          type="number"
                          className="inprogress-data-with-box"
                          onChange={(e: any) =>
                            setUpdateBundlingSupervisorData({
                              ...updateBundlingSupervisorData,
                              logEndCutSharpWeight: e?.target?.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}></Col>
                  </Row>
                  <div className="inprogress-remark-title-text">
                    <div className="inprogress-remark-title">Remarks</div>
                    <Form.Item name="supervisor-remarks">
                      <TextArea
                        maxLength={5000}
                        className="inprogress-remark-text"
                        onChange={(e: any) =>
                          setUpdateBundlingSupervisorData({
                            ...updateBundlingSupervisorData,
                            remarks: e?.target?.value,
                          })
                        }
                      />
                    </Form.Item>
                  </div>
                  <div className="inprogress-buttons js">
                    <div className="inprogress-hold-complete-button js">
                      <Button
                        className="inprogress-hold-button jc"
                        type="primary"
                        onClick={() =>
                          updateStatus(data, AppConstants?.HOLD, 0)
                        }
                      >
                        <img src={AppImages?.holdIcon} />
                        Hold
                      </Button>
                      <Button
                        className="inprogress-complete-button jc"
                        type="default"
                        onClick={() =>
                          updateStatus(data, AppConstants?.COMPLETED, 0)
                        }
                      >
                        <img src={AppImages?.correctIcon} />
                        Complete
                      </Button>
                      <Button
                        className="inprogress-Reassign-button jc"
                        type="default"
                        onClick={() => {
                          Reassignsetvalue(data);
                        }}
                      >
                        <img
                          className="inprogress-Reassign-icon"
                          src={AppImages?.vectorIcon}
                        />
                        Reassign
                      </Button>
                    </div>
                    <div className="inprogress-clear-update-button js">
                      <Button
                        className="inprogress-clear-button"
                        type="default"
                        onClick={() => getBundlingSupervisorInprogress(data)}
                      >
                        Clear
                      </Button>
                      <Button
                        className="inprogress-update-button"
                        type="primary"
                        htmlType="submit"
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </div>
        ) : (
          <Row gutter={16}>
            {/* {skeletonList.map((item: any) => ( */}
            <Col lg={24} md={24}>
              <div className="agenda-skeleton-card-box">
                <Skeleton paragraph={{ rows: 1 }} loading={true} active />
              </div>
            </Col>
            {/* ))} */}
          </Row>
        )}
      </>
    );
  };

  const qaInprogress = (data: any) => {
    return (
      <>
        {!getPendingOnLoad ? (
          <div className="inprogressRow-header-expando-collapse">
            <div className="inprogressRow-header">
              <Row className="inprogressRow-row">
                <Col span={3} className="inprogressRow-left-radius-col">
                  <div className="inprogress-expando-icon-text">
                    {expandoOpen === true ? (
                      <DownOutlined
                        className="rightOutlined-Icon"
                        onClick={() => expandoOpenOrClose(data)}
                      />
                    ) : (
                      <RightOutlined
                        className="rightOutlined-Icon"
                        onClick={() => expandoOpenOrClose(data)}
                      />
                    )}
                    <div className="inprogress-expando-text">
                      {data?.sectionNo}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">{data?.orderNo}</div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">{data?.soNo}</div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {dataModify(data?.orderDate)}
                    </div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.customerName}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.orderQty}
                    </div>
                  </div>
                </Col>
                <Col span={3} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.alloyTemper}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div className="inprogressRow-text jc">
                      {data?.cutLength}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div
                      className={
                        data?.priority == "Immediate"
                          ? "immediate jc"
                          : "inprogressRow-text jc"
                      }
                    >
                      {data?.priority}
                    </div>
                  </div>
                </Col>
                <Col span={2} className="inprogressRow-right-radius-col">
                  <div style={{ display: "flex", margin: "14px 0px" }}>
                    <div className="line" style={{ color: "#8D8D8D" }}>
                      |
                    </div>
                    <div
                      className="completedRow-text jc"
                      onClick={() => viewDetailsDrawer(data)}
                      style={{
                        width: "100%",
                        color: "#2C5E8D",
                        cursor: "pointer",
                      }}
                    >
                      View Details
                    </div>
                  </div>
                </Col>
              </Row>
              <QaFormUpdates qaForm={qaForm} getQAInprogress={getQAInprogress} data={data} getInProgressData={getInProgressData} />
            </div>
            {expandoOpen === true && (

              //  <Form
              //   form={qaForm}
              //   autoComplete="off"
              //   id="qaForm"
              //   onFinish={() => updateQaApi(data)}
              // >
              //   <div className="inprogress-expando-collapse">
              //     <div className="inprogress-remark-title-text">
              //       <div className="inprogress-remark-title">Remarks</div>
              //       <Form.Item name="qa-remarks">
              //         <TextArea
              //           maxLength={5000}
              //           className="inprogress-remark-text"
              //           onChange={(e: any) =>
              //             setUpdateQAData({
              //               ...updateQAData,
              //               remarks: e?.target?.value,
              //             })
              //           }
              //         />
              //       </Form.Item>
              //     </div>
              //     <div className="inprogress-buttons js">
              //       <div className="inprogress-hold-complete-button js">
              //         <Button
              //           className="inprogress-hold-button jc"
              //           type="primary"
              //           onClick={() =>
              //             updateStatus(data, AppConstants?.HOLD, 0)
              //           }
              //         >
              //           <img src={AppImages?.holdIcon} />
              //           Hold
              //         </Button>
              //         <Button
              //           className="inprogress-complete-button jc"
              //           type="default"
              //           onClick={() =>
              //             updateStatus(data, AppConstants?.COMPLETED, 0)
              //           }
              //         >
              //           <img src={AppImages?.correctIcon} />
              //           Complete
              //         </Button>
              //         <Button
              //           className="inprogress-Reassign-button jc"
              //           type="default"
              //           onClick={() => {
              //             Reassignsetvalue(data);
              //           }}
              //         >
              //           <img className='inprogress-Reassign-icon' src={AppImages?.vectorIcon} />
              //           Reassign
              //         </Button>
              //       </div>
              //       <div className="inprogress-clear-update-button js">
              //         <Button
              //           className="inprogress-clear-button"
              //           type="default"
              //           onClick={() => getQAInprogress(data)}
              //         >
              //           Clear
              //         </Button>
              //         <Button
              //           className="inprogress-update-button"
              //           type="primary"
              //           htmlType="submit"
              //         >
              //           Update
              //         </Button>
              //       </div>
              //     </div>
              //   </div>
              // </Form>
              <div></div>
            )}

          </div>
        ) : (
          <Row gutter={16}>
            {/* {skeletonList.map((item: any) => ( */}
            <Col lg={24} md={24}>
              <div className="agenda-skeleton-card-box">
                <Skeleton paragraph={{ rows: 1 }} loading={true} active />
              </div>
            </Col>
            {/* ))} */}
          </Row>
        )}
      </>
    );
  };

  const viewDetailsDrawer = (data: any) => {
    setPpcSectionData(data);
    viewDetailsApi(data);
  };
  const completedRowData = (data: any) => {
    return (
      <div className="completed-header">
        {!getPendingOnLoad ? (
          <Row className="completed-row">
            <Col span={3} className="completedRow-left-radius-col jc">
              {data?.sectionNo}
            </Col>
            <Col span={2} className="completedRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="completedRow-text jc">{data?.orderNo}</div>
              </div>
            </Col>
            <Col span={2} className="completedRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="completedRow-text jc">{data?.soNo}</div>
              </div>
            </Col>
            <Col span={3} className="completedRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="completedRow-text jc">
                  {dataModify(data?.orderDate)}
                </div>
              </div>
            </Col>
            <Col span={3} className="completedRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="completedRow-text jc">{data?.customerName}</div>
              </div>
            </Col>
            <Col span={2} className="completedRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="completedRow-text jc">{data?.orderQty}</div>
              </div>
            </Col>
            <Col span={3} className="completedRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="completedRow-text jc">{data?.alloyTemper}</div>
              </div>
            </Col>
            <Col span={2} className="completedRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="completedRow-text jc">{data?.cutLength}</div>
              </div>
            </Col>
            <Col span={2} className="completedRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line">|</div>
                <div
                  className={
                    data?.priority == "Immediate"
                      ? "immediate"
                      : "completedRow-text jc"
                  }
                >
                  {data?.priority}
                </div>
              </div>
            </Col>
            <Col span={2} className="completedRow-right-radius-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line">|</div>
                <div
                  className="completedRow-text jc"
                  onClick={() => viewDetailsDrawer(data)}
                  style={{ width: "100%", color: "#2C5E8D", cursor: "pointer" }}
                >
                  View Details
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          <Row gutter={16}>
            {/* {skeletonList.map((item: any) => ( */}
            <Col lg={24} md={24}>
              <div className="agenda-skeleton-card-box">
                <Skeleton paragraph={{ rows: 1 }} loading={true} active />
              </div>
            </Col>
            {/* ))} */}
          </Row>
        )}
      </div>
    );
  };

  const inProgressRowData = (data: any) => {
    return (
      <div>
        {user?.roleId === 2
          ? ppcDataInprogress(data)
          : user?.roleId === 3
            ? toolShopDataInprogress(data)
            : user?.roleId === 5
              ? operatorEntryInprogress(data)
              : user?.roleId === 4
                ? qaInprogress(data)
                : supervisorInprogress(data)}
      </div>
    );
  };

  const [holdIndex, setHoldIndex] = useState(null);

  const setOpenAndClose = (index: any, data: any) => {
    setExpandoOpen(!expandoOpen);
    setHoldIndex(index);
    if (data?.processStage === "PPC Data") {
      getPpcOrderList(data);
    } else if (data?.processStage === "Tool Shop Data") {
      getToolShopInprogress(data);
    } else if (data?.processStage === "QA Data") {
      getQAInprogress(data);
    } else if (data?.processStage === "Operator Entry") {
      getOperatorEntryInprogress(data);
    } else if (data?.processStage === "Bundling Supervisor") {
      getBundlingSupervisorInprogress(data);
    }

    // roleType == 1 ? getToolShopInprogress(data?.orderId)
    // roleType == 2 ? getToolShopInprogress(data?.orderId) : null
    //roleType == 3 ? getToolShopInprogress(data?.orderId) :
    // roleType == 4 ? getToolShopInprogress(data?.orderId) : null
  };

  const adminInprogressData = (orderData: any) => {
    return (
      <>
        {!getPendingOnLoad ? (
          <div className="admin-header-expando-collapse">
            {(orderData?.slice(1, orderData?.length) || [])?.map(
              (item: any, index: any) => {
                return (
                  <div>
                    <div
                      className={
                        expandoOpen === true && holdIndex === index
                          ? "admin-header"
                          : "admin-header-closed"
                      }
                    >
                      <Row className="admin-row">
                        <Col span={3} className="admin-left-radius-col">
                          <div className="admin-expando-icon-text">
                            {expandoOpen === true && holdIndex === index ? (
                              <DownOutlined
                                className="rightOutlined-Icon"
                                onClick={() => setOpenAndClose(index, item)}
                              />
                            ) : (
                              <RightOutlined
                                className="rightOutlined-Icon"
                                onClick={() => setOpenAndClose(index, item)}
                              />
                            )}
                            <div className="admin-expando-text">
                              {item?.sectionNo}
                            </div>
                          </div>
                        </Col>
                        <Col span={2} className="admin-col">
                          <div style={{ display: "flex", margin: "14px 0px" }}>
                            <div className="line" style={{ color: "#8D8D8D" }}>
                              |
                            </div>
                            <div className="admin-text jc">{item?.orderNo}</div>
                          </div>
                        </Col>
                        <Col span={2} className="admin-col">
                          <div style={{ display: "flex", margin: "14px 0px" }}>
                            <div className="line" style={{ color: "#8D8D8D" }}>
                              |
                            </div>
                            <div className="admin-text jc">{item?.soNo}</div>
                          </div>
                        </Col>
                        <Col span={2} className="admin-col">
                          <div style={{ display: "flex", margin: "14px 0px" }}>
                            <div className="line" style={{ color: "#8D8D8D" }}>
                              |
                            </div>
                            <div className="admin-text jc">
                              {dataModify(item?.orderDate)}
                            </div>
                          </div>
                        </Col>
                        <Col span={2} className="admin-col">
                          <div style={{ display: "flex", margin: "14px 0px" }}>
                            <div className="line" style={{ color: "#8D8D8D" }}>
                              |
                            </div>
                            <div className="admin-text jc">
                              {item?.customerName}
                            </div>
                          </div>
                        </Col>
                        <Col span={2} className="admin-col">
                          <div style={{ display: "flex", margin: "14px 0px" }}>
                            <div className="line" style={{ color: "#8D8D8D" }}>
                              |
                            </div>
                            <div className="admin-text jc">
                              {item?.orderQty}
                            </div>
                          </div>
                        </Col>
                        <Col span={3} className="admin-col">
                          <div style={{ display: "flex", margin: "14px 0px" }}>
                            <div className="line" style={{ color: "#8D8D8D" }}>
                              |
                            </div>
                            <div className="admin-text jc">
                              {item?.alloyTemper}
                            </div>
                          </div>
                        </Col>
                        <Col span={2} className="admin-col">
                          <div style={{ display: "flex", margin: "14px 0px" }}>
                            <div className="line" style={{ color: "#8D8D8D" }}>
                              |
                            </div>
                            <div className="admin-text jc">
                              {item?.cutLength}
                            </div>
                          </div>
                        </Col>
                        <Col span={2} className="admin-col">
                          <div style={{ display: "flex", margin: "14px 0px" }}>
                            <div className="line" style={{ color: "#8D8D8D" }}>
                              |
                            </div>
                            <div
                              className={
                                item?.priority === "Immediate"
                                  ? "immediate"
                                  : "admin-text jc"
                              }
                            >
                              {item?.priority}
                            </div>
                          </div>
                        </Col>
                        <Col span={2} className="admin-col">
                          <div style={{ display: "flex", margin: "14px 0px" }}>
                            <div className="line" style={{ color: "#8D8D8D" }}>
                              |
                            </div>
                            <div
                              className={
                                item?.processStage != "Bundling Supervisor"
                                  ? "admin-text jc"
                                  : "admin-text-bundler jc"
                              }
                            >
                              {item?.processStage}
                            </div>
                          </div>
                        </Col>
                        <Col span={2} className="admin-right-radius-col">
                          <div style={{ display: "flex", margin: "14px 0px" }}>
                            <div className="line" style={{ color: "#8D8D8D" }}>
                              |
                            </div>
                            <div
                              className="admin-text jc"
                              onClick={() => viewDetailsDrawer(item)}
                              style={{
                                width: "100%",
                                color: "#2C5E8D",
                                cursor: "pointer",
                              }}
                            >
                              View Details
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    {expandoOpen === true && holdIndex === index && (
                      <div>
                        {item?.processStage === "PPC Data" && (
                          <Form
                            form={form}
                            autoComplete="off"
                            id="form"
                            onFinish={() => saveOrUpdateInprogressData(item)}
                          >
                            <div className="inprogress-expando-collapse">
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Alloy
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="ppcdata-alloy">
                                    <Input
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          alloy: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Quenching
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="ppcdata-quenching">
                                    <Input
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          quenching: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Production Rate Reg(Kg/Hr)
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="ppcdata-productionRate">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          productionRate: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Billet Length (Inches)
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="ppcdata-billetLength">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          billetLength: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  No. of Billet
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="ppcdata-noOfBillet">
                                    <Input
                                      min={1}
                                      maxLength={5}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onKeyDown={(e: any) =>
                                        e.keyCode !== 8 &&
                                        saveInProgressData?.noOfBillet
                                          ?.length === 5 &&
                                        e.preventDefault()
                                      }
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          noOfBillet: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  No. of Pieces Per Billet
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="ppcdata-piecesPerBillet">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          piecesPerBillet: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Butt Thickness (Inches)
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="ppcdata-buttThickness">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          buttThickness: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Extrusion Length
                                </Col>
                                <Col span={3} className="jfs">
                                  <Form.Item name="ppcdata-extrusionLength">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-small-box"
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          extrusionLength: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                  <Form.Item name="ppcdata-extrusionLengthMeter">
                                    <Select
                                      className="inprogress-data-with-box-samll-select"
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          extrusionLengthMeter: e,
                                        });
                                      }}
                                    >
                                      <Option value={"m"}>(m)</Option>
                                      <Option value={"ft"}>(ft)</Option>
                                      <Option value={"I"}>(I)</Option>
                                    </Select>
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Coring/Piping Length (Front End)
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="ppcdata-coringOrPipingLength_frontEnd">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          coringOrPipingLength_frontEnd:
                                            e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Coring/Piping Length (Back End)
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="ppcdata-coringOrPipingLength_backEnd">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          coringOrPipingLength_backEnd:
                                            e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Press Entry
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="ppcdata-pressEntry">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          pressEntry: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Plant
                                </Col>
                                <Col span={3}>
                                  <Form.Item name="ppcdata-plantRefId">
                                    <Select
                                      className="inprogress-data-with-box-select"
                                      onChange={(e: any) => {
                                        setSaveInProgressData({
                                          ...saveInProgressData,
                                          plantRefId: e,
                                        });
                                      }}
                                    >
                                      {(new Array(20).fill(0) || []).map(
                                        (e: any, index: any) => {
                                          return (
                                            <Option value={index + 1}>
                                              {index + 1}
                                            </Option>
                                          );
                                        }
                                      )}
                                    </Select>
                                  </Form.Item>
                                </Col>
                              </Row>
                              <div className="inprogress-remark-title-text">
                                <div className="inprogress-remark-title">
                                  Remarks
                                </div>
                                <Form.Item name="ppcdata-remarks">
                                  <TextArea
                                    maxLength={5000}
                                    className="inprogress-remark-text"
                                    onChange={(e: any) => {
                                      setSaveInProgressData({
                                        ...saveInProgressData,
                                        remarks: e?.target?.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </div>
                              <div className="inprogress-buttons js">
                                <div className="inprogress-hold-complete-button js">
                                  <Button
                                    className="inprogress-hold-button jc"
                                    type="primary"
                                    onClick={() =>
                                      updateStatus(
                                        item,
                                        AppConstants?.HOLD,
                                        item?.processStage
                                      )
                                    }
                                  >
                                    <img src={AppImages?.holdIcon} />
                                    Hold
                                  </Button>
                                  <Button
                                    className="inprogress-complete-button jc"
                                    type="default"
                                    onClick={() =>
                                      updateStatus(
                                        item,
                                        AppConstants?.COMPLETED,
                                        item?.processStage
                                      )
                                    }
                                  >
                                    <img src={AppImages?.correctIcon} />
                                    Complete
                                  </Button>
                                  <Button
                                    className="inprogress-Reassign-button jc"
                                    type="default"
                                    onClick={() => {
                                      Reassignsetvalue(item);
                                    }}
                                  >
                                    <img
                                      className="inprogress-Reassign-icon"
                                      src={AppImages?.vectorIcon}
                                    />
                                    Reassign
                                  </Button>
                                </div>
                                <div className="inprogress-clear-update-button js">
                                  <Button
                                    className="inprogress-clear-button"
                                    type="default"
                                    onClick={() => prePopulateInprogressData()}
                                  >
                                    Clear
                                  </Button>
                                  <Button
                                    className="inprogress-update-button"
                                    htmlType="submit"
                                    type="primary"
                                  >
                                    Update
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Form>
                        )}
                        {item?.processStage === "Tool Shop Data" && (
                          <Form
                            form={toolShopForm}
                            autoComplete="off"
                            id="toolShopForm"
                            onFinish={() => updateToolShopApi(item)}
                          >
                            <div className="inprogress-expando-collapse">
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.die}
                                </Col>
                                <Col span={3} style={{ marginTop: "5px" }}>
                                  <Form.Item name="toolshop-die">
                                    <Select
                                      className="inprogress-data-with-box-select"
                                      onChange={(e: any) => {
                                        setUpdateToolShopData({
                                          ...updateToolShopData,
                                          dieRefId: e,
                                        });
                                      }}
                                    >
                                      <Option value={1}>1</Option>
                                      <Option value={2}>2</Option>
                                      <Option value={3}>3</Option>
                                      <Option value={4}>4</Option>
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.noOfCavity}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="toolshop-noOfCavity">
                                    <Input
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setUpdateToolShopData({
                                          ...updateToolShopData,
                                          noOfCavity: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.bolsterEntry}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="toolshop-bolsterEntry">
                                    <Input
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setUpdateToolShopData({
                                          ...updateToolShopData,
                                          bolsterEntry: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.backerEntry}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="toolshop-backerEntry">
                                    <Input
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setUpdateToolShopData({
                                          ...updateToolShopData,
                                          backerEntry: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.specialBackerEntry}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="toolshop-specialBackerEntry">
                                    <Input
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setUpdateToolShopData({
                                          ...updateToolShopData,
                                          specialBackerEntry: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.ringEntry}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="toolshop-ringEntry">
                                    <Input
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setUpdateToolShopData({
                                          ...updateToolShopData,
                                          ringEntry: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.dieSetter}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="toolshop-dieSetter">
                                    <Input
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setUpdateToolShopData({
                                          ...updateToolShopData,
                                          dieSetter: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.weldingChamber}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="toolshop-weldingChamber">
                                    <Input
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) => {
                                        setUpdateToolShopData({
                                          ...updateToolShopData,
                                          weldingChamber: e?.target?.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <div className="inprogress-remark-title-text">
                                <div className="inprogress-remark-title">
                                  Remarks
                                </div>
                                <Form.Item name="toolshop-remarks">
                                  <TextArea
                                    maxLength={5000}
                                    className="inprogress-remark-text"
                                    onChange={(e: any) => {
                                      setUpdateToolShopData({
                                        ...updateToolShopData,
                                        remarks: e?.target?.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </div>
                              <div className="inprogress-buttons js">
                                <div className="inprogress-hold-complete-button js">
                                  <Button
                                    className="inprogress-hold-button jc"
                                    type="primary"
                                    onClick={() =>
                                      updateStatus(
                                        item,
                                        AppConstants?.HOLD,
                                        item?.processStage
                                      )
                                    }
                                  >
                                    <img src={AppImages?.holdIcon} />
                                    Hold
                                  </Button>
                                  <Button
                                    className="inprogress-complete-button jc"
                                    type="default"
                                    onClick={() =>
                                      updateStatus(
                                        item,
                                        AppConstants?.COMPLETED,
                                        item?.processStage
                                      )
                                    }
                                  >
                                    <img src={AppImages?.correctIcon} />
                                    Complete
                                  </Button>
                                  <Button
                                    className="inprogress-Reassign-button jc"
                                    type="default"
                                    onClick={() => {
                                      Reassignsetvalue(item);
                                    }}
                                  >
                                    <img
                                      className="inprogress-Reassign-icon"
                                      src={AppImages?.vectorIcon}
                                    />
                                    Reassign
                                  </Button>
                                </div>
                                <div className="inprogress-clear-update-button js">
                                  <Button
                                    className="inprogress-clear-button"
                                    type="default"
                                    onClick={() =>
                                      prePopulateToolShopInprogressData()
                                    }
                                  >
                                    Clear
                                  </Button>
                                  <Button
                                    className="inprogress-update-button"
                                    type="primary"
                                    htmlType="submit"
                                  >
                                    Update
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Form>
                        )}
                        {item?.processStage === "Operator Entry" && (
                          <Form
                            form={operatorForm}
                            autoComplete="off"
                            id="operatorForm"
                            onFinish={() => updateOperatorApi(item)}
                          >
                            <div className="inprogress-expando-collapse">
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title"
                                >
                                  {AppConstants?.batchNo}
                                </Col>
                                <Col span={1} className="d-flex">
                                  <Form.Item name="operator-batchNo">
                                    {formBatch?.length >= 0 && (
                                      <div className="d-flex">
                                        <div
                                          className="addButton d-flex"
                                          onClick={() => addFormFields("Batch")}
                                        >
                                          +
                                        </div>
                                      </div>
                                    )}
                                    {/* <Input type="number" className="inprogress-data-with-box" onChange={(e: any) => setUpdateOperatorData({ ...updateOperatorData, batchNo: e?.target?.value })} /> */}
                                  </Form.Item>
                                </Col>
                                <Col span={20} className="d-flex">
                                  {multiplInputBoxForBatch("Batch")}
                                </Col>
                              </Row>
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title"
                                >
                                  {AppConstants?.pushOnBilletLength}
                                </Col>
                                <Col span={1} className="d-flex">
                                  <Form.Item name="operator-pushOnBilletLength">
                                    {formBilletLength?.length >= 0 && (
                                      <div className="d-flex">
                                        <div
                                          className="addButton d-flex"
                                          onClick={() =>
                                            addFormFields("Billet")
                                          }
                                        >
                                          +
                                        </div>
                                      </div>
                                    )}
                                  </Form.Item>
                                </Col>
                                <Col span={20} className="d-flex">
                                  {multiplInputBoxForBillet("Billet")}
                                </Col>
                              </Row>
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.buttWeightKg}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="operator-buttWeightKg">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          buttWeight: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.approxPushQty}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="operator-approxPushQty">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          approxPushQty: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.startTime}
                                </Col>
                                <Col span={3}>
                                  <Form.Item name="operator-startTime">
                                    <TimePicker
                                      style={{
                                        width: "60%",
                                        background: "#FFFFFF",
                                        border: "1px solid #A7A7A7",
                                        borderRadius: "4px",
                                      }}
                                      className="inprogress-data-with-time-picker"
                                      format={"HH:mm A"}
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          startTime: e,
                                        })
                                      }
                                      placeholder="Select"
                                      suffixIcon={false}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jc"
                                >
                                  {AppConstants?.endTime}
                                </Col>
                                <Col span={3}>
                                  <Form.Item name="operator-endTime">
                                    <TimePicker
                                      style={{
                                        width: "60%",
                                        background: "#FFFFFF",
                                        border: "1px solid #A7A7A7",
                                        borderRadius: "4px",
                                      }}
                                      disabled={
                                        updateOperatorData?.startTime
                                          ? false
                                          : true
                                      }
                                      className="inprogress-data-with-time-picker"
                                      format={"HH:mm A"}
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          endTime: e,
                                        })
                                      }
                                      placeholder="Select"
                                      suffixIcon={false}
                                      disabledHours={() =>
                                        disabledHours("End Time")
                                      }
                                      disabledMinutes={(e: any) =>
                                        disabledMinutes(e, "End Time")
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.processTime}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="operator-processTime">
                                    <Input
                                      style={{ width: "60%" }}
                                      disabled={true}
                                      className="inprogress-data-with-box-disabled"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          processTime: e?.target?.value,
                                        })
                                      }
                                      suffix="min"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.productionRateActual}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="operator-productionRateActual">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          productionRateActual:
                                            e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.dieFailureReason}
                                </Col>
                                <Col span={9}>
                                  <Form.Item name="operator-dieFailureReason">
                                    <Select
                                      className="inprogress-data-with-long-box-select"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          dieFailureReasonRefId: e,
                                        })
                                      }
                                    >
                                      {(dieFailureReasonData || []).map(
                                        (item: any) => {
                                          return (
                                            <Option value={item?.id}>
                                              {item?.name}
                                            </Option>
                                          );
                                        }
                                      )}
                                    </Select>
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.dieWithAluminium}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="operator-dieWithAluminium">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          dieWithAluminium: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.dieFailed}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="operator-dieFailed">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          diefailed: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.reasonForBreakdown}
                                </Col>
                                <Col span={9}>
                                  <Form.Item name="operator-reasonForBreakdown">
                                    <Select
                                      className="inprogress-data-with-long-box-select"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          reasonForBreakDownRefId: e,
                                        })
                                      }
                                    >
                                      {(reasonForBreakdown || []).map(
                                        (item: any) => {
                                          return (
                                            <Option value={item?.id}>
                                              {item?.name}
                                            </Option>
                                          );
                                        }
                                      )}
                                    </Select>
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.breakdownStartTime}
                                </Col>
                                <Col span={3} className="jfe">
                                  <Form.Item name="operator-breakdownStartTime">
                                    <TimePicker
                                      style={{
                                        width: "75%",
                                        background: "#FFFFFF",
                                        border: "1px solid #A7A7A7",
                                        borderRadius: "4px",
                                      }}
                                      className="inprogress-data-with-time-picker"
                                      format={"HH:mm A"}
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          breakDownStartTime: e,
                                        })
                                      }
                                      placeholder="Select"
                                      suffixIcon={false}
                                    />
                                    {/* <Input className="inprogress-data-with-box" onChange={(e: any) => setUpdateOperatorData({ ...updateOperatorData, breakDownStartTime: e?.target?.value })} /> */}
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.breakdownEndTime}
                                </Col>
                                <Col span={3} className="jfe">
                                  <Form.Item name="operator-breakdownEndTime">
                                    <TimePicker
                                      style={{
                                        width: "75%",
                                        background: "#FFFFFF",
                                        border: "1px solid #A7A7A7",
                                        borderRadius: "4px",
                                      }}
                                      disabled={
                                        updateOperatorData?.breakDownStartTime
                                          ? false
                                          : true
                                      }
                                      className="inprogress-data-with-time-picker"
                                      format={"HH:mm A"}
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          breakDownEndTime: e,
                                        })
                                      }
                                      placeholder="Select"
                                      suffixIcon={false}
                                      disabledHours={() =>
                                        disabledHours("End Time")
                                      }
                                      disabledMinutes={(e: any) =>
                                        disabledMinutes(e, "End Time")
                                      }
                                    />
                                    {/* <Input className="inprogress-data-with-box" onChange={(e: any) => setUpdateOperatorData({ ...updateOperatorData, breakDownEndTime: e?.target?.value })} /> */}
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.nameOfOperator}
                                </Col>
                                <Col span={9}>
                                  <Form.Item name="operator-nameOfOperator">
                                    <Input
                                      className="inprogress-data-with-long-box-title"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          nameOfOperator: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.timeTakenBreakdown}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="operator-timeTakenBreakdown">
                                    <Input
                                      style={{ width: "60%" }}
                                      disabled={true}
                                      className="inprogress-data-with-box-disabled"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          timeTakenBreakDown: e?.target?.value,
                                        })
                                      }
                                      suffix="min"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.previousDayDieContinue}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="operator-previousDayDieContinue">
                                    <Input
                                      min={1}
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          previousDayDieContinue:
                                            e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Responsible Department for Breakdown
                                </Col>
                                <Col span={9}>
                                  <Form.Item name="operator-responsibleDepartmentForBreakdown">
                                    <Select
                                      className="inprogress-data-with-long-box-select"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          responsibleDepartmentForBreakdown: e,
                                        })
                                      }
                                    >
                                      {(
                                        responsibleDepartmentForBreakdown || []
                                      ).map((item: any) => {
                                        return (
                                          <Option value={item?.id}>
                                            {item?.name}
                                          </Option>
                                        );
                                      })}
                                    </Select>
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Butt Thickness (mm)
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="operator-buttThickness">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          buttThickness: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  Break through Pressure (MPa)
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="operator-breakThroughPressure">
                                    <Input
                                      min={1}
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateOperatorData({
                                          ...updateOperatorData,
                                          breakThroughPressure:
                                            e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <div className="inprogress-remark-title-text">
                                <div className="inprogress-remark-title">
                                  Remarks
                                </div>
                                <Form.Item name="operator-remarks">
                                  <TextArea
                                    maxLength={5000}
                                    className="inprogress-remark-text"
                                    onChange={(e: any) =>
                                      setUpdateOperatorData({
                                        ...updateOperatorData,
                                        remarks: e?.target?.value,
                                      })
                                    }
                                  />
                                </Form.Item>
                              </div>
                              <div className="inprogress-buttons js">
                                <div className="inprogress-hold-complete-button js">
                                  <Button
                                    className="inprogress-hold-button jc"
                                    type="primary"
                                    onClick={() =>
                                      updateStatus(
                                        item,
                                        AppConstants?.HOLD,
                                        item?.processStage
                                      )
                                    }
                                  >
                                    <img src={AppImages?.holdIcon} />
                                    Hold
                                  </Button>
                                  <Button
                                    className="inprogress-complete-button jc"
                                    type="default"
                                    onClick={() =>
                                      updateStatus(
                                        item,
                                        AppConstants?.COMPLETED,
                                        item?.processStage
                                      )
                                    }
                                  >
                                    <img src={AppImages?.correctIcon} />
                                    Complete
                                  </Button>
                                  <Button
                                    className="inprogress-Reassign-button jc"
                                    type="default"
                                    onClick={() => {
                                      Reassignsetvalue(item);
                                    }}
                                  >
                                    <img
                                      className="inprogress-Reassign-icon"
                                      src={AppImages?.vectorIcon}
                                    />
                                    Reassign
                                  </Button>
                                </div>
                                <div className="inprogress-clear-update-button js">
                                  <Button
                                    className="inprogress-clear-button"
                                    type="default"
                                    onClick={() =>
                                      prePopulateOperatorInprogressData()
                                    }
                                  >
                                    Clear
                                  </Button>
                                  <Button
                                    className="inprogress-update-button"
                                    type="primary"
                                    htmlType="submit"
                                  >
                                    Update
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Form>
                        )}
                        {item?.processStage === "QA Data" && (
                          <Form
                            form={qaForm}
                            autoComplete="off"
                            id="qaForm"
                            onFinish={() => updateQaApi(item)}
                          >
                            <div className="inprogress-expando-collapse">
                              <div className="inprogress-remark-title-text">
                                <div className="inprogress-remark-title">
                                  Remarks
                                </div>
                                <Form.Item name="qa-remarks">
                                  <TextArea
                                    maxLength={5000}
                                    className="inprogress-remark-text"
                                    onChange={(e: any) =>
                                      setUpdateQAData({
                                        ...updateQAData,
                                        remarks: e?.target?.value,
                                      })
                                    }
                                  />
                                </Form.Item>
                              </div>
                              <div className="inprogress-buttons js">
                                <div className="inprogress-hold-complete-button js">
                                  <Button
                                    className="inprogress-hold-button jc"
                                    type="primary"
                                    onClick={() =>
                                      updateStatus(
                                        item,
                                        AppConstants?.HOLD,
                                        item?.processStage
                                      )
                                    }
                                  >
                                    <img src={AppImages?.holdIcon} />
                                    Hold
                                  </Button>
                                  <Button
                                    className="inprogress-complete-button jc"
                                    type="default"
                                    onClick={() =>
                                      updateStatus(
                                        item,
                                        AppConstants?.COMPLETED,
                                        item?.processStage
                                      )
                                    }
                                  >
                                    <img src={AppImages?.correctIcon} />
                                    Complete
                                  </Button>
                                  <Button
                                    className="inprogress-Reassign-button jc"
                                    type="default"
                                    onClick={() => {
                                      Reassignsetvalue(item);
                                    }}
                                  >
                                    <img
                                      className="inprogress-Reassign-icon"
                                      src={AppImages?.vectorIcon}
                                    />
                                    Reassign
                                  </Button>
                                </div>
                                <div className="inprogress-clear-update-button js">
                                  <Button
                                    className="inprogress-clear-button"
                                    type="default"
                                    onClick={() =>
                                      prePopulateQAInprogressData()
                                    }
                                  >
                                    Clear
                                  </Button>
                                  <Button
                                    className="inprogress-update-button"
                                    type="primary"
                                    htmlType="submit"
                                  >
                                    Update
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Form>
                        )}
                        {item?.processStage === "Bundling Supervisor" && (
                          <Form
                            form={supervisorForm}
                            autoComplete="off"
                            id="supervisorForm"
                            onFinish={() => updateBundlingSupervisorApi(item)}
                          >
                            <div className="inprogress-expando-collapse">
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.finishQuantity}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="supervisor-finishQuantity">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateBundlingSupervisorData({
                                          ...updateBundlingSupervisorData,
                                          finishQuantity: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.noOfPcsPerBundle}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="supervisor-noOfPcsPerBundle">
                                    \
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateBundlingSupervisorData({
                                          ...updateBundlingSupervisorData,
                                          piecesPerBundle: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.bundleWeightKg}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="supervisor-bundleWeightKg">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateBundlingSupervisorData({
                                          ...updateBundlingSupervisorData,
                                          bundleWeight: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.noOfBundles}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="supervisor-noOfBundles">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateBundlingSupervisorData({
                                          ...updateBundlingSupervisorData,
                                          noOfBundles: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.correctionQty}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="supervisor-correctionQty">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateBundlingSupervisorData({
                                          ...updateBundlingSupervisorData,
                                          correctionQty: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.totalNoOfPcs}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="supervisor-totalNoOfPcs">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateBundlingSupervisorData({
                                          ...updateBundlingSupervisorData,
                                          totalNoOfPieces: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.totalFinishQty}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="supervisor-totalFinishQty">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateBundlingSupervisorData({
                                          ...updateBundlingSupervisorData,
                                          totalFinishQty: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.recovery}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="supervisor-recovery">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateBundlingSupervisorData({
                                          ...updateBundlingSupervisorData,
                                          recovery: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row className="inprogress-data-with-box">
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.logEndCutScrapInch}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="supervisor-logEndCutScrapInch">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateBundlingSupervisorData({
                                          ...updateBundlingSupervisorData,
                                          logEndCutSharpInch: e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  span={3}
                                  className="inprogress-data-with-box-title jfe"
                                >
                                  {AppConstants?.logEndCutScrapWeight}
                                </Col>
                                <Col span={3} className="jc">
                                  <Form.Item name="supervisor-logEndCutScrapWeight">
                                    <Input
                                      min={1}
                                      type="number"
                                      className="inprogress-data-with-box"
                                      onChange={(e: any) =>
                                        setUpdateBundlingSupervisorData({
                                          ...updateBundlingSupervisorData,
                                          logEndCutSharpWeight:
                                            e?.target?.value,
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={12}></Col>
                              </Row>
                              <div className="inprogress-remark-title-text">
                                <div className="inprogress-remark-title">
                                  Remarks
                                </div>
                                <Form.Item name="supervisor-remarks">
                                  <TextArea
                                    maxLength={5000}
                                    className="inprogress-remark-text"
                                    onChange={(e: any) =>
                                      setUpdateBundlingSupervisorData({
                                        ...updateBundlingSupervisorData,
                                        remarks: e?.target?.value,
                                      })
                                    }
                                  />
                                </Form.Item>
                              </div>
                              <div className="inprogress-buttons js">
                                <div className="inprogress-hold-complete-button js">
                                  <Button
                                    className="inprogress-hold-button jc"
                                    type="primary"
                                    onClick={() =>
                                      updateStatus(
                                        item,
                                        AppConstants?.HOLD,
                                        item?.processStage
                                      )
                                    }
                                  >
                                    <img src={AppImages?.holdIcon} />
                                    Hold
                                  </Button>
                                  <Button
                                    className="inprogress-complete-button jc"
                                    type="default"
                                    onClick={() =>
                                      updateStatus(
                                        item,
                                        AppConstants?.COMPLETED,
                                        item?.processStage
                                      )
                                    }
                                  >
                                    <img src={AppImages?.correctIcon} />
                                    Complete
                                  </Button>
                                  <Button
                                    className="inprogress-Reassign-button jc"
                                    type="default"
                                    onClick={() => {
                                      Reassignsetvalue(item);
                                    }}
                                  >
                                    <img
                                      className="inprogress-Reassign-icon"
                                      src={AppImages?.vectorIcon}
                                    />
                                    Reassign
                                  </Button>
                                </div>
                                <div className="inprogress-clear-update-button js">
                                  <Button
                                    className="inprogress-clear-button"
                                    type="default"
                                    onClick={() =>
                                      prePopulateSupervisorInprogressData()
                                    }
                                  >
                                    Clear
                                  </Button>
                                  <Button
                                    className="inprogress-update-button"
                                    type="primary"
                                    htmlType="submit"
                                  >
                                    Update
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Form>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <Row gutter={16}>
            {/* {skeletonList.map((item: any) => ( */}
            <Col lg={24} md={24}>
              <div className="agenda-skeleton-card-box">
                <Skeleton paragraph={{ rows: 1 }} loading={true} active />
              </div>
            </Col>
            {/* ))} */}
          </Row>
        )}
      </>
    );
  };

  const yetStartRowData = (data: any) => {
    return (
      <div className="yet-to-start-header">
        {!getPendingOnLoad ? (
          <Row className="yet-to-start-row">
            <Col span={3} className="yet-to-start-left-radius-col">
              <div className="yet-to-start-expando-icon-text">
                <RightOutlined className="rightOutlined-Icon" />
                <div className="yet-to-start-expando-text">
                  {data?.sectionNo}
                </div>
              </div>
            </Col>
            <Col span={2} className="yet-to-startRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="yet-to-start-text jc">{data?.orderNo}</div>
              </div>
            </Col>
            <Col span={2} className="yet-to-startRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="yet-to-start-text jc">{data?.soNo}</div>
              </div>
            </Col>
            <Col span={3} className="yet-to-startRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="yet-to-start-text jc">
                  {dataModify(data?.orderDate)}
                </div>
              </div>
            </Col>
            <Col span={3} className="yet-to-startRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="yet-to-start-text jc">{data?.customerName}</div>
              </div>
            </Col>
            <Col span={2} className="yet-to-startRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="yet-to-start-text jc">{data?.orderQty}</div>
              </div>
            </Col>
            <Col span={3} className="yet-to-startRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="yet-to-start-text jc">{data?.alloyTemper}</div>
              </div>
            </Col>
            <Col span={2} className="yet-to-startRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div className="yet-to-start-text jc">{data?.cutLength}</div>
              </div>
            </Col>
            <Col span={2} className="yet-to-startRow-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                <div
                  className={
                    data?.priority == "Immediate"
                      ? "immediate"
                      : "yet-to-start-text jc"
                  }
                >
                  {data?.priority}
                </div>
              </div>
            </Col>
            <Col span={2} className="yet-to-start-right-radius-col">
              <div style={{ display: "flex", margin: "14px 0px" }}>
                <div className="line" style={{ color: "#8D8D8D" }}>
                  |
                </div>
                {user?.roleId !== 2 && (
                  <div
                    className="yet-to-start-text jc"
                    onClick={() => viewDetailsDrawer(data)}
                    style={{
                      width: "100%",
                      color: "#2C5E8D",
                      cursor: "pointer",
                    }}
                  >
                    View Details
                  </div>
                )}
              </div>
            </Col>
          </Row>
        ) : (
          <Row gutter={16}>
            {/* {skeletonList.map((item: any) => ( */}
            <Col lg={24} md={24}>
              <div className="agenda-skeleton-card-box">
                <Skeleton paragraph={{ rows: 1 }} loading={true} active />
              </div>
            </Col>
            {/* ))} */}
          </Row>
        )}
      </div>
    );
  };

  return (
    <div
      className="inprogress-list-container"
      style={{ background: "#E3E2E3", height: "100%" }}
    >
      <TopMenuAndSider style={"2"} />
      <JindalSubMenu
        title={"In-Progress"}
        sectionNo={sectionNumModal}
        sectionName={sectionName}
        reasignToast={reasignToast}
        setReasignToast={setReasignToast}
        showLasAsyncAndSelect={false}
      />
      {checkNoData === false ? (
        <div style={{ margin: "0px 20px" }}>
          {header()}
          {getOrderData?.length === 1
            ? user?.roleId !== 1 && completedRowData(firstPendingData)
            : ""}
          {getOrderData?.length > 1
            ? (user?.roleId !== 1 ||
              (user?.roleId == 2 && firstPendingData?.workFlowId >= 4) ||
              (user?.roleId == 3 && firstPendingData?.workFlowId >= 7) ||
              (user?.roleId == 4 && firstPendingData?.workFlowId >= 10) ||
              (user?.roleId == 5 && firstPendingData?.workFlowId >= 13) ||
              (user?.roleId == 6 && firstPendingData?.workFlowId >= 15)) &&
            completedRowData(firstPendingData)
            : user?.roleId !== 1 &&
              getOrderData?.length === 1 &&
              (user?.roleId !== 1 ||
                (user?.roleId == 2 && firstPendingData?.workFlowId >= 4) ||
                (user?.roleId == 3 && firstPendingData?.workFlowId >= 7) ||
                (user?.roleId == 4 && firstPendingData?.workFlowId >= 10) ||
                (user?.roleId == 5 && firstPendingData?.workFlowId >= 13) ||
                (user?.roleId == 6 && firstPendingData?.workFlowId >= 15))
              ? ""
              : inProgressRowData(firstPendingData)}
          {getOrderData?.length >= 2 &&
            (user?.roleId !== 1 ||
              (user?.roleId == 2 && firstPendingData?.workFlowId >= 4) ||
              (user?.roleId == 3 && firstPendingData?.workFlowId >= 7) ||
              (user?.roleId == 4 && firstPendingData?.workFlowId >= 10) ||
              (user?.roleId == 5 && firstPendingData?.workFlowId >= 13) ||
              (user?.roleId == 6 && firstPendingData?.workFlowId >= 16)
              ? inProgressRowData(getOrderData[1])
              : user?.roleId !== 1 && yetStartRowData(getOrderData[1]))}
          {getOrderData?.length >= 3 &&
            (
              (user?.roleId !== 1 &&
                getOrderData?.slice(2, getOrderData?.length)) ||
              []
            ).map((e: any) => {
              return yetStartRowData(e);
            })}
          {user?.roleId == 1 && adminInprogressData(getOrderData)}
          {getOrderDataPage?.totalCount > 5 ? (
            <div className="jf-end">
              {pageLimit === 4 ? (
                <Button
                  type="primary"
                  className="loadmore-button"
                  onClick={() => setPageLimit(getOrderDataPage?.totalCount)}
                >
                  Load More
                </Button>
              ) : (
                <Button
                  type="primary"
                  className="loadmore-button"
                  onClick={() => setPageLimit(4)}
                >
                  Load Less
                </Button>
              )}
            </div>
          ) : (
            <div className="jf-end">
              <div style={{ margin: "10px 0px" }}></div>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            margin: "0px 20px",
            background: "white",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}

      <ViewDetailsScreen
        open={viewDrawer}
        setOpen={setViewDrawer}
        ppcList={viewDetailsPpcList}
        toolShopList={viewDetailsToolShopList}
        qaList={viewDetailsQAList}
        operatorList={viewDetailsOperatorList}
        sectionData={ppcSectionData}
        supervisorList={viewDetailsSupervisorList}
      />
      <CommonReassignpopup
        isModalOpen={reassignOpen}
        setIsModalOpen={setReassignOpen}
        sectionNo={sectionNumModal}
        sectionName={sectionName}
        setReasignToast={setReasignToast}
        reasignToast={reasignToast}
      />


      {/* <OperatorEntryFormUpdate
      getInProgressData={getInProgressData}/> */}

    </div>
  );
};

export default InProgressListScreen;