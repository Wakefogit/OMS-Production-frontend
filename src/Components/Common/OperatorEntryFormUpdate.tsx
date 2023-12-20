import React, { useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  TimePicker,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import AppConstants from "../../Global/AppConstants";
import AppImages from "../../Global/AppImages";
import moment from "moment";
import "./OperatorEntryFormUpdate.scss";
import "../../index.css";
import { deepCopyFunction, isArrayNotEmpty } from "../../Global/Helpers";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../localStorage";
import {
  commonReferenceDataAction,
  getOperatorEntryInprogressDataAction,
  updateOperatorEntryDataAction,
  updateOrderStatus,
} from "../Store/Action/jindalAction";
import { CommonReassignpopup } from "../SubComponents/CommonReassignpopup";
import dayjs from "dayjs";
import SpinLoader from "./SpinLoader";
import ConfirmPopup from "./ConfirmPopup";

let typeTemp = "";
let buttWeight: any;
let updateKey = "";
let isApiCallInprogress = false;
let breakdownDuration: any;
let breakDownAdded = false;

const OperatorEntryFormUpdate: any = (props: any) => {
  let pathName = window.location.pathname;
  const { Option } = Select;
  const [sectionNumModal, setSectionNumModal] = useState<any>(null);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [opCompleteapicall, setopCompleteapicall] = useState(false);
  const [opHoldapicall, setopHoldapicall] = useState(false);
  const dispatch = useDispatch();
  const [operatorForm]: any = Form.useForm();
  const user = getUser();
  const [formBillet, setFormBillet] = useState<any>([{ id: 1, billetLength: null, noOfBillet: null}]);
  const [formBreakDown, setFormBreakDown] = useState<any>([{ 
    id: 1, 
    startTime: "", 
    endTime: "", 
    elapsedTime:"", 
    reason: "", 
    responsibleDepartment: "" 
  }]);
  const [updateStatusLoad, setupdateStatusLoad] = useState(false);
  const [reasignToast, setReasignToast] = useState(false);
  const jindalReducerState: any = useSelector((state: any) => state.JindalReducerState);
  const [updateOperatorLoad, setUpdateOperatorLoad] = useState(false);
  const [getOperatorInprogressLoad, setGetOperatorInprogressLoad] = useState(false);
  const [actualButtThicknessCal, setActualButtThickness] = useState<any>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [breakDownTime, setBreakdownTime] = useState(0);
  const {
    getOperatorInprogressData,
    updateOperatorEntryOnLoad,
    updateOperatorEntryData,
    getOperatorOnload,
    dietrialData,
    dieWithAluminium,
    previousDaydieContinue,
    dieFailData,
    updateStatusOnLoad, updateStatusData
  } = jindalReducerState;

  const getOperatorData = getOperatorInprogressData?.getOperatorEntry_inprogressData;

  const { data, getInProgressData, type,modalKey } = props;

  const updateOperatorTemp = {
    operatorEntryId: "",
    orderId: "",
    dieTrialRefId: "",
    dieWithAluminiumRefId: "",
    previousDayDie_continueRefId: "",
    batchNo: null,
    actualInternalAlloy: null,
    startTime: "",
    endTime: "",
    processTime: "",
    noOfBilletAndLength: "",
    actualButtThickness: null,
    breakThroughPressure: null,
    pushOnBilletLength: null,
    pushQtyInKgs: null,
    actualProductionRate: null,
    buttWeightInKgs: null,
    diefailRefId: "",
    dieFailureReason: "",
    breakDown: "",
    breakDownDuration: null,
    logEndScrapLengthInMm: null,
    logEndScrapInKgs: null,
    operatorName: "",
    remarks: "",
  };

  const [updateOperatorData, setUpdateOperatorData] = useState(
    deepCopyFunction(updateOperatorTemp)
  );
  const findDuration = (startTime: any, endTime: any) => {
    let mins: any
    const startDate: any = new Date(startTime);
    const endDate: any = new Date(endTime);
    const duration: any = endDate.getTime() - startDate.getTime();
    const diffDuration = moment.duration(duration);
    const hr = diffDuration.hours()
    var min = diffDuration.minutes()
    if (min < 10) {
      mins = 0 + "" + min;
    }
    let minutesTemp = (min >= 10 ? min : mins);
    const time = Number(minutesTemp) == 59 ? (Number(hr)+1)+".00" : hr + "." + minutesTemp;
    let minutes = (hr*60)+(Number(minutesTemp) == 59 ? 60 : Number(minutesTemp))
    return [time, minutes];
  };

  const Reassignsetvalue = (data: any) => {
    setReassignOpen(true);
    setSectionNumModal(data?.poNo);
    // const roleData = "Qa DATA";
    // setSectionName(roleData);
  };

  useEffect(() =>{
    if(modalKey){
      getOperatorEntryInprogress()
    }
  }, [modalKey])

  useEffect(() => {
    if (isArrayNotEmpty(formBreakDown)) {
      (formBreakDown || [])?.map((item: any, index: number) => {
        let value1 = (item["startTime"] && item["startTime"] != 'Invalid date') ? dayjs(item[`startTime`], 'hh:mm A') : "";
        let value2 = (item["endTime"] && item["endTime"] != 'Invalid date') ? dayjs(item["endTime"], 'hh:mm A') : "";
        operatorForm?.setFieldsValue({
          [`startTime${item?.id}`]: value1,
          [`endTime${item?.id}`]: value2,
          [`reason${item?.id}`]: item["reason"],
          [`responsibleDepartment${item.id}`]: item["responsibleDepartment"],
        })
      })
    }
  }, [formBreakDown])

  useEffect(() => {
    try {
        let cal: any
        let totalBillet = formBillet?.reduce(((total: number, x: any) => total+Number(x?.noOfBillet)), 0)
        cal = ((Number(updateOperatorData?.actualButtThickness) / 25.4) * (Number(totalBillet)))
        setActualButtThickness(cal)
        let value = (Number(getOperatorData?.buttWeightPerInch) * Number(updateOperatorData?.actualButtThickness)) * Number(totalBillet);
        operatorForm?.setFieldsValue({
          [`operator-buttWeightInKgs`]: Number(value),
        })
        buttWeight = value;
        setUpdateOperatorData({
          ...updateOperatorData, buttWeightInKgs: value
        })
    } catch (error) {
      console.log("Error in ::", error)
    }
  }, [updateOperatorData?.actualButtThickness])

  const prePopulateOperatorInprogressData = () => {
    let billetsArr: any
    let breakDown: any
    setFormBillet(billetsArr || [{ id: 1, billetLength: null, noOfBillet: null }]);
    setFormBreakDown(breakDown || [{ id: 1, startTime: "", endTime: "", elapsedTime:"", reason: "", responsibleDepartment: "" }])
    if (getOperatorData) {
      setUpdateOperatorData({ ...getOperatorData });
      operatorForm?.setFieldsValue({
        [`operator-dieTrialRefId`]: getOperatorData?.dieTrialRefId,
        [`operator-dieWithAluminiumRefId`]: getOperatorData?.dieWithAluminiumRefId,
        [`operator-previousDayDie_continueRefId`]: getOperatorData?.previousDayDie_continueRefId,
        [`operator-batchNo`]: (getOperatorData?.batchNo),
        [`operator-actualInternalAlloy`]: getOperatorData?.actualInternalAlloy,
        [`operator-startTime`]: getOperatorData?.startTime ? dayjs(getOperatorData?.startTime) : "",
        [`operator-endTime`]: getOperatorData?.endTime ? dayjs(getOperatorData?.endTime) : "",
        [`operator-processTime`]: getOperatorData?.processTime,
        [`operator-actualButtThickness`]: getOperatorData?.actualButtThickness,
        [`operator-breakThroughPressure`]: getOperatorData?.breakThroughPressure,
        [`operator-pushQtyInKgs`]: (getOperatorData?.pushQtyInKgs),
        [`operator-diefailRefId`]: getOperatorData?.diefailRefId,
        [`operator-dieFailureReason`]: getOperatorData?.dieFailureReason,
        [`operator-breakDownDuration`]: getOperatorData?.breakDownDuration,
        [`operator-logEndScrapLengthInMm`]: getOperatorData?.logEndScrapLengthInMm,
        [`operator-logEndScrapInKgs`]: getOperatorData?.logEndScrapInKgs,
        [`operator-operatorName`]: getOperatorData?.operatorName,
        [`operator-remarks`]: getOperatorData?.remarks,
      });
      setUpdateOperatorData({
        ...updateOperatorData,
        operatorEntryId: data?.operatorEntryId,
        orderId: data?.orderId,
        dieTrialRefId: getOperatorData?.dieTrialRefId,
        dieWithAluminiumRefId: getOperatorData?.dieWithAluminiumRefId,
        previousDayDie_continueRefId:
        getOperatorData?.previousDayDie_continueRefId,
        batchNo: (getOperatorData?.batchNo),
        actualInternalAlloy: getOperatorData?.actualInternalAlloy,
        startTime: getOperatorData?.startTime ? moment(getOperatorData?.startTime) : null,
        endTime: getOperatorData?.endTime ? moment(getOperatorData?.endTime) : null,
        processTime: getOperatorData?.processTime,
        actualButtThickness: getOperatorData?.actualButtThickness,
        breakThroughPressure: getOperatorData?.breakThroughPressure,
        pushQtyInKgs: (getOperatorData?.pushQtyInKgs),
        diefailRefId: getOperatorData?.diefailRefId,
        dieFailureReason: getOperatorData?.dieFailureReason,
        breakDownDuration: getOperatorData?.breakDownDuration,
        logEndScrapLengthInMm: getOperatorData?.logEndScrapLengthInMm,
        logEndScrapInKgs: getOperatorData?.logEndScrapInKgs,
        operatorName: getOperatorData?.operatorName,
        remarks: getOperatorData?.remarks,
      });
      breakdownDuration = getOperatorData?.breakDownDuration;
      setBreakdownTime(breakdownDuration);
      let billetsArr = JSON.parse(getOperatorData?.noOfBilletAndLength)
      billetsArr?.forEach((x: any, index: number) => {
        x["id"] = index + 1;
      });
      {isArrayNotEmpty(billetsArr) ? setFormBillet(billetsArr) : setFormBillet([{ id: 1, billetLength: null, noOfBillet: null}])}
      // setFormBillet(billetsArr || [])
      let breakDown = JSON.parse(getOperatorData?.breakDown);
      breakDown?.forEach((x: any, index: number) => {
        x["id"] = index + 1;
      });
      {isArrayNotEmpty(breakDown) ? 
        setFormBreakDown(breakDown) 
        : 
       setFormBreakDown([{ id: 1, startTime: "", endTime: "", elapsedTime:"", reason: "", responsibleDepartment: "" }])}
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
        operatorForm.resetFields();
        operatorForm?.setFieldsValue({
          [`operator-processTime`]: "",
        });
    }
  };
  
  useEffect(() => {
    try {
      let time = findDuration(updateOperatorData?.startTime, updateOperatorData?.endTime);
      let hour = (time[0] != 'NaN.undefined' && time[0]) ? time[0] : '';
      let ActualProductionRate = (updateOperatorData?.pushOnBilletLength*60) / (Number(time[1]) - Number(breakDownTime));
      let value = (ActualProductionRate).toFixed(4);
      operatorForm?.setFieldsValue({
        [`operator-processTime`]: (updateOperatorData?.endTime && updateOperatorData?.startTime) ? hour : "",
        [`operator-timeTakenBreakdown`]: (updateOperatorData?.breakDownStartTime && updateOperatorData?.breakDownEndTime)? breakDownTime : "",
        [`operator-actualProductionRate`]: (!Number.isNaN(value) && value != "Infinity") ? value : 0
      });
      updateOperatorData.processTime = hour;
      updateOperatorData.actualProductionRate= (!Number.isNaN(value) && value != "Infinity") ? value : 0;
      setUpdateOperatorData({
        ...updateOperatorData
      })
    } catch (error) {
      console.log("Error in ::", error)
    }
  }, [
    updateOperatorData?.startTime,
    updateOperatorData?.endTime,
    updateOperatorData?.pushOnBilletLength,
    formBreakDown,
    formBillet,
    breakDownTime
  ]);

  useEffect(()=>{
    try {
      if(formBreakDown){
        {(formBreakDown || [])?.map((item:any,index: any)=>{
          if(item?.startTime && item?.endTime){
            // let time = findDuration(updateOperatorData?.startTime, updateOperatorData?.endTime);
            // let hour = (time[0] != 'NaN.undefined' && time[0]) ? time[0] : '';
            let duration = moment.duration(moment(item?.endTime,"h:mm A").diff(moment(item?.startTime,"h:mm A")));
            let minutes = duration.asMinutes();
            item.elapsedTime = minutes + " mins";
            operatorForm?.setFieldsValue({
              [`elapsedtime${item?.id}`] : minutes + " mins",
            })
          }
          else{
            item.elapsedTime = 0 + " mins";
            operatorForm?.setFieldsValue({
              [`elapsedtime${item?.id}`] : null,
            })
          }
        })}
        setBreakdownDuration()
      }
    } catch (error) {
      console.log("Error in setBreakdownDuration::", error);
    }
  },[formBreakDown]);

  const setBreakdownDuration = () => {
    let total: number = 0;
    for(let item of formBreakDown){
      let value = item.elapsedTime.split(" ")[0];
      total += Number(value);
    }
    setBreakdownTime(total);
    breakdownDuration = total + " mins";
    operatorForm?.setFieldsValue({
      [`operator-breakDownDuration`] :breakdownDuration,
    });
  }

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

  const updateOperatorApi = (data: any, key: any) => {
      updateKey = key;
      const startDate: any = new Date(updateOperatorData?.startTime);
      const endDate: any = new Date(updateOperatorData?.endTime);
      const time: any = findDuration(startDate, endDate);
      // let duration = moment.duration((updateOperatorData?.endTime).diff(updateOperatorData?.startTime));
      // let hours = Math.round(duration.asHours());
      // let minutes = Math.round(duration.asMinutes());
      // let ActualProductionRate: any = (updateOperatorData?.pushQtyInKgs) / time[1];
      // let buttWeightInKgs = "";
      let orderList = [];
      orderList?.push(getOperatorData?.orderId);
      let orderArr = JSON.stringify(orderList).replace(/"([^(")"]+)":/g, "$1:");
      formBillet?.forEach((element: any) => {
        delete element.id;
      })
      formBreakDown?.forEach((element: any) => {
        delete element.id;
      })
      let isBilletAvaiable = true;
      if(formBillet?.length == 1 && (formBillet[0]?.billetLength == (" inches" || null) || formBillet[0]?.noOfBillet == ("" || null))){
        isBilletAvaiable = false;
      }
      let isBreakdownAvaiable = true;
      if(formBreakDown?.length == 1 && (formBreakDown[0]?.endTime == ""  || formBreakDown[0]?.startTime == "")){
        isBreakdownAvaiable = false;
      }   
      let payload = {
        operatorId: getOperatorData?.operatorEntryId ? getOperatorData?.operatorEntryId : "",
        orderId: data?.orderId,
        dieTrialRefId: updateOperatorData?.dieTrialRefId ? Number(updateOperatorData?.dieTrialRefId) : null,
        dieWithAluminiumRefId: (updateOperatorData?.dieWithAluminiumRefId) ,
        previousDayDie_continueRefId: (updateOperatorData?.previousDayDie_continueRefId),
        batchNo: (updateOperatorData?.batchNo),
        actualInternalAlloy:  updateOperatorData?.actualInternalAlloy ,
        startTime:  (moment(startDate).isValid() && updateOperatorData?.startTime) ? moment(startDate)?.utc()?.format() : null ,
        endTime: (moment(endDate).isValid() && updateOperatorData?.endTime) ? moment(endDate)?.utc()?.format() : null,
        processTime: !Number.isNaN(time[0]) ? time[0] : null,
        noOfBilletAndLength: isBilletAvaiable ? formBillet : null,
        actualButtThickness: updateOperatorData?.actualButtThickness,
        breakThroughPressure:  (updateOperatorData?.breakThroughPressure),
        pushOnBilletLength: updateOperatorData?.pushOnBilletLength,
        pushQtyInKgs: updateOperatorData?.pushQtyInKgs,
        actualProductionRate: (!isNaN(updateOperatorData?.actualProductionRate)) ? updateOperatorData?.actualProductionRate : null,
        buttWeightInKgs: buttWeight,
        diefailRefId: (updateOperatorData?.diefailRefId),
        dieFailureReason: updateOperatorData?.dieFailureReason ,
        breakDown: isBreakdownAvaiable ? formBreakDown : null,
        breakDownDuration: breakdownDuration,
        logEndScrapLengthInMm: (updateOperatorData?.logEndScrapLengthInMm),
        logEndScrapInKgs: (updateOperatorData?.logEndScrapInKgs),
        operatorName: updateOperatorData?.operatorName,
        remarks: updateOperatorData?.remarks ? updateOperatorData?.remarks : null,
        isActive: 1,
      };
      dispatch(updateOperatorEntryDataAction(payload));
      setUpdateOperatorLoad(true);
    // }
  };

  // useEffect(() => {
  //     getOperatorEntryInprogress();
  // }, [data?.isExpanded]);
  
  useEffect(() => {
    dietrialReferenceDataApi();
    commonReferenceForDieWithAluminium();
    commonDieFail();
    commonReferenceForDayDieContinue();
  }, []);

  const getOperatorEntryInprogress = () => {
    setUpdateOperatorData({...updateOperatorData, startTime: null, endTime: null})
    let payload = {
      orderId: data?.orderId,
    };
    dispatch(getOperatorEntryInprogressDataAction(payload));
    setGetOperatorInprogressLoad(true);
  };

  const checkValue = (value: any)=>{
    let valueTemp = String(value);
    if(valueTemp && valueTemp != "null" && value != undefined){
      return value
    }
    else{
      return null
    }
  }

  const updateStatus = (type: any) => {
      typeTemp = type;
      let orderList = [];
      orderList?.push(data?.orderId);
      let orderArr = JSON.stringify(orderList).replace(/"([^(")"]+)":/g, "$1:");
      formBreakDown?.forEach((element: any) => {
        delete element.id;
      })
      const startTime: any = new Date(updateOperatorData?.startTime);
      const endTime: any = new Date(updateOperatorData?.endTime);
      // let duration = moment.duration((updateOperatorData?.endTime).diff(updateOperatorData?.startTime));
      // let hours = Math.round(duration.asHours());
      let time = findDuration(updateOperatorData?.startTime, updateOperatorData?.endTime);
      let hour = (time[0] != 'NaN.undefined' && time[0]) ? time[0] : '';
      let isBilletAvaiable = true;
      if(formBillet?.length == 1 &&
      (formBillet[0]?.billetLength == " inches" || formBillet[0]?.billetLength == null) 
      || (formBillet[0]?.noOfBillet == "" || formBillet[0]?.noOfBillet == null)){
          isBilletAvaiable = false;
      }
      let operatorData = {
        operatorId:
          getOperatorData?.operatorEntryId != undefined &&
            getOperatorData?.operatorEntryId != null
            ? getOperatorData?.operatorEntryId
            : "",
        orderId: data?.orderId,
        dieTrialRefId: updateOperatorData?.dieTrialRefId ? updateOperatorData?.dieTrialRefId : null,
        dieWithAluminiumRefId: updateOperatorData?.dieWithAluminiumRefId ? updateOperatorData?.dieWithAluminiumRefId : null,
        previousDayDie_continueRefId:
        updateOperatorData?.previousDayDie_continueRefId ? updateOperatorData?.previousDayDie_continueRefId : null,
        batchNo: updateOperatorData?.batchNo ? updateOperatorData?.batchNo : null,
        actualInternalAlloy: updateOperatorData?.actualInternalAlloy ? updateOperatorData?.actualInternalAlloy : null,
        startTime:  (moment(startTime).isValid() && updateOperatorData?.startTime) ? moment(startTime)?.utc()?.format() : null ,
        endTime: (moment(endTime).isValid() && updateOperatorData?.endTime) ? moment(endTime)?.utc()?.format() : null,
        processTime: hour ? String(hour) : null,
        noOfBilletAndLength: isBilletAvaiable ? formBillet : null,
        actualButtThickness: checkValue(updateOperatorData?.breakThroughPressure) ? parseFloat(updateOperatorData?.breakThroughPressure) : null,  
        breakThroughPressure: checkValue(updateOperatorData?.breakThroughPressure) ? parseFloat(updateOperatorData?.breakThroughPressure) : null,
        pushOnBilletLength: checkValue(updateOperatorData?.pushOnBilletLength) ? parseFloat(updateOperatorData?.pushOnBilletLength) :null,
        pushQtyInKgs: checkValue(updateOperatorData?.pushQtyInKgs) ? parseFloat(updateOperatorData?.pushQtyInKgs) : null,
        actualProductionRate: !isNaN(updateOperatorData?.actualProductionRate) ? updateOperatorData?.actualProductionRate : null,
        buttWeightInKgs: checkValue(updateOperatorData?.buttWeightInKgs) ? updateOperatorData?.buttWeightInKgs : null,
        diefailRefId: updateOperatorData?.diefailRefId ? updateOperatorData?.diefailRefId : null,
        dieFailureReason: updateOperatorData?.dieFailureReason ? updateOperatorData?.dieFailureReason : null, 
        breakDown: breakDownAdded ? formBreakDown : null,
        breakDownDuration: breakdownDuration,
        logEndScrapLengthInMm: updateOperatorData?.logEndScrapLengthInMm ? parseFloat(updateOperatorData?.logEndScrapLengthInMm) :null,
        logEndScrapInKgs: updateOperatorData?.logEndScrapInKgs ? parseFloat(updateOperatorData?.logEndScrapInKgs) : null,
        operatorName: updateOperatorData?.operatorName ? updateOperatorData?.operatorName : null, 
        remarks: updateOperatorData?.remarks ? updateOperatorData?.remarks : null,
        processStage: user?.roleId == 1 ? data?.processStage : ""
      };
  
      let payload = {
        orderId: [orderArr],
        type: type,
        roleData: operatorData,
      };
      dispatch(updateOrderStatus(payload));
      setupdateStatusLoad(true);
  };

  const dietrialReferenceDataApi = () => {
    const payload: any = {
      name: AppConstants?.DieTrial,
    };
    dispatch(commonReferenceDataAction(payload));
  };

  const commonDieFail = () => {
    const payload: any = {
      name: "Die Fail",
    };
    dispatch(commonReferenceDataAction(payload));
  };

  const commonReferenceForDieWithAluminium = () => {
    const payload: any = {
      name: "Die with Aluminium",
    };
    dispatch(commonReferenceDataAction(payload));
  };

  const commonReferenceForDayDieContinue = () => {
    const payload: any = {
      name: "Previous Day die Continue",
    };
    dispatch(commonReferenceDataAction(payload));
  };

  useEffect(() => {
    if (updateStatusLoad && !updateStatusOnLoad) {
      operatorForm.resetFields();
      operatorForm?.setFieldsValue({
        [`operator-processTime`]: "",
      });
      // getPendingListApi();
      getInProgressData();
      setopCompleteapicall(false);
      setopHoldapicall(false);
      setupdateStatusLoad(false);
      isApiCallInprogress = false;
    }
  }, [updateStatusLoad, updateStatusOnLoad])

  useEffect(() => {
    if (updateOperatorLoad && !updateOperatorEntryOnLoad && updateKey == '') {
      // getPendingListApi()
      breakDownAdded = false;
      setTimeout(()=>{
        getOperatorEntryInprogress();
        if (
          updateOperatorEntryData?.createOrUpdateOperatorEntryData?.message ==
          "Updated Successfully"
        ) {
          isApiCallInprogress = false;
          message?.success("Updated Successfully");
          setUpdateOperatorLoad(false);
        }
      }, 800)
    }
  }, [updateOperatorLoad, updateOperatorEntryOnLoad]);

  useEffect(() => {
    try {
      operatorForm.resetFields();
      setUpdateOperatorData(updateOperatorTemp);
      if (getOperatorInprogressData) {
          setGetOperatorInprogressLoad(false);
          operatorForm.resetFields();
          setFormBillet([{ id: 1, billetLength: null, noOfBillet: null}]);
          setFormBreakDown([{id: 1,startTime: "",endTime: "",elapsedTime:"", reason: "", responsibleDepartment: "" }])
          if(getOperatorData){
            const startDate: any = new Date(updateOperatorData?.startTime);
            const endDate: any = new Date(updateOperatorData?.endTime);
            let totalBillet = JSON.parse(getOperatorData?.noOfBilletAndLength)?.reduce(((total: number, x: any) => total+Number(x?.noOfBillet)), 0)
            let value = (Number(getOperatorData?.buttWeightPerInch) * parseFloat(getOperatorData?.actualButtThickness)) * Number(totalBillet);
            operatorForm?.setFieldsValue({
              [`operator-buttWeightInKgs`]: Number(value) ? Number(value) : '',
            })
            buttWeight = value;
            setUpdateOperatorData({
              ...updateOperatorData,
              buttWeightInKgs: value,
              // actualProductionRate: (!Number.isNaN(ActualProductionRate) && ActualProductionRate != "Infinity") ? value : 0
            })
        }
        prePopulateOperatorInprogressData();
      }
    } catch (error) {
      console.log("Error in setGetOperatorInprogressLoad::", error)
    }
  }, [getOperatorInprogressData]);

  useEffect(() => {
    if (updateStatusLoad && !updateStatusOnLoad) {
        operatorForm.resetFields();
        operatorForm?.setFieldsValue({
          [`operator-processTime`]: "",
        });
        // getPendingListApi();
        getInProgressData()
        setTimeout(() =>{
          let {Message} = updateStatusData?.updateOrderStatus_withMapping;
          if (Message == "Updated Successfully") {
              message?.success(
                typeTemp == AppConstants?.COMPLETED
                  ? "Successfully Completed"
                  : "Order Holded Successfully"
              );
          }
          // setUpdateOperatorLoad(false);
          setopCompleteapicall(false);
          setopHoldapicall(false);
          setupdateStatusLoad(false);
        }, 800)
    }
  }, [updateStatusLoad, updateStatusOnLoad]);

  useEffect(() => {
    try {
      let cal: any
      let total: any = 0;
      if(updateOperatorData?.actualButtThickness){
        let totalBillet = formBillet?.reduce(((total: number, x: any) => total+Number(x?.noOfBillet)), 0)
        cal = ((parseFloat(updateOperatorData?.actualButtThickness) / 25.4) * (Number(totalBillet)))
        setActualButtThickness(cal)
        let value = (parseFloat(getOperatorData?.buttWeightPerInch) * parseFloat(updateOperatorData?.actualButtThickness)) * Number(totalBillet);
        operatorForm?.setFieldsValue({
          [`operator-buttWeightInKgs`]: Number(value) ? value : '',
        })
        setUpdateOperatorData({
          ...updateOperatorData, buttWeightInKgs: value
        })
      }
      if (isArrayNotEmpty(formBillet)) {
        (formBillet || [])?.map((item: any, index: number) => {
          let value = item["billetLength"]
            ? item["billetLength"]?.replace("inches", "")
            : "";
          operatorForm?.setFieldsValue({
            [`billetLength${item?.id}`]: parseFloat(value),
            [ `noOfBillet${item?.id}`]: item['noOfBillet']
          });
          total = total + Number(value);
        });
        let pushOnBilletCal = formBillet?.reduce(((total: number, x: any) => {
          let billetVal = Number(x?.noOfBillet)*parseFloat(x?.billetLength)*Number(getOperatorData?.buttWeightPerInch)
          return total+billetVal}), 0);   
        // let pushOnBilletCal = (Number(getOperatorData?.buttWeightPerInch) * Number(totalBilletPushLength)).toFixed(4);
        operatorForm?.setFieldsValue({
          [`operator-pushOnBilletLength`]: !Number.isNaN(pushOnBilletCal) ? Number(pushOnBilletCal).toFixed(4) : '',
        });
        setUpdateOperatorData({
          ...updateOperatorData, pushOnBilletLength: Number(pushOnBilletCal).toFixed(4)
        })
      }
    } catch(error) {
      console.log("Error in setUpdateOperatorData::", error);
    }
  }, [formBillet]);

  const disabledHours = (time: any, key: any) => {
      const hours: any = [];
      let currentHours: any;
      const compareArr = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
      currentHours = new Date(time)?.getHours();
      for (let i = currentHours + 1; i <= 23; i++) {
          hours.push(i);
      }
      hours.push(currentHours);
      const filterHours = compareArr?.filter((x: any) =>{
        if(key == 'endTime'){
          return !hours?.includes(x)
        }
        else{
          return hours?.includes(x)
        }
      });
      console.log("filterHours", filterHours)
      return filterHours;   
  };

  const disabledMinutes = (selectedHour: any, type: any) => {
    const minutes: any = [];
    let currentMinutes: any;
    let startHours: any;
    currentMinutes = new Date(updateOperatorData?.startTime)?.getMinutes();
    startHours = new Date(updateOperatorData?.startTime)?.getHours();
    const tempMin = [];
    for (let i = 0; i <= 59; i++) {
      tempMin?.push(i);
    }
    selectedHour = new Date(selectedHour)?.getHours();
    if (selectedHour === startHours) {
      for (let i = currentMinutes; i <= 60; i++) {
        minutes.push(i);
      }
      const filterMin = tempMin?.filter((x: any) => !minutes?.includes(x));
      return filterMin;
    } else {
      return tempMin;
    }
  };

  let removeFormFields = (index: any, type: any, item: any) => {
    if (type == "formBillet") {
      let newFormBatch = [...formBillet];
      let filterbatch = newFormBatch?.filter((x: any) => x?.id != item?.id);
      setFormBillet(filterbatch);
    }
    else if (type == "breakdown") {
      let newFormbreak = [...formBreakDown];
      let filterbreak = newFormbreak?.filter((x: any) => x?.id != item?.id);
      setFormBreakDown(filterbreak);
    }
  };

  let addFormFields = (type: any) => {
    let lastObj = formBillet[formBillet?.length - 1];
    if (type == "formBillet") {
      let obj: any = {
        id: (lastObj ? lastObj?.id : 0) + 1,
        billetLength: null,
        noOfBillet: null
      };
      setFormBillet([...formBillet, obj]);
    } else if (type == "breakdown") {
      let lastobj = formBreakDown[formBreakDown?.length - 1];
      let value: any = {
        id: (lastobj ? lastobj?.id : 0) + 1,
        startTime: "",
        endTime: "",
        elapsedTime: "",
        reason: "",
        responsibleDepartment: "",
      }
      setFormBreakDown([...formBreakDown, value]);
    }
  };

  const setBilletValue = (e: any, id: number, key: string) => {
    let checkExist = formBillet?.find((x: any) => x?.id == id);
    if(key == 'noOfBillet'){
        checkExist[key] = e.target.value
    }
    else{
        checkExist[key] = e.target.value + " inches";
    }
    setFormBillet([...formBillet]);
  }

  const setBreakDownValue = (e: any, id: number, key: any) => {
    breakDownAdded = true
    let checkbreakdown = formBreakDown?.find((x: any) => x?.id == id);
    if (key == 'startTime' || key == 'endTime') {
      if (key == "startTime") {
        checkbreakdown["endTime"] = '';
        operatorForm?.setFieldsValue({
          [`endTime${id}`]: null,
        });
      }
      checkbreakdown[key] = e;
    }
    else {
      checkbreakdown[key] = e.target.value;
    }
    setFormBreakDown([...formBreakDown]);
  }

  const multiplInputBoxForbilletlength = (type: any) => {
      try {
          let total = formBillet?.reduce(((total: number, x: any) => total+Number(x?.noOfBillet)), 0);
          return (
              <div>
                  {(formBillet || [])?.map((item: any, index: any) => {
                      return (
                        <Row className="jfe" style={{ margin: "0px 0px 10px 0px" }} key={item?.id}>
                            <Col span={6} className="text-center"><pre className="roboto">Batch{index+1}    No.of Billets</pre></Col>
                            <Col span={4} className="h-35">
                                <Form.Item name={`noOfBillet${item?.id}`}
                                    rules={[{   required: (opCompleteapicall || getOperatorData?.noOfBilletAndLength), message: 'Field is required' },
                                    ]}
                                >
                                    <Input 
                                        min={0}
                                        step={1}
                                        type="number" 
                                        onKeyDown={(e)=>e.keyCode == 190 && e.preventDefault()}
                                        onChange={(e) => setBilletValue(e, item?.id, 'noOfBillet')}
                                        className="" />
                                </Form.Item>
                            </Col>
                            <Col span={4} className="text-center">Billet Length</Col>
                            <Col span={7} className="multiple-inputBox-container h-35" style={{ margin: "0px 10px" }}>
                                <div className="d-flex">
                                    <Form.Item name={`billetLength${item?.id}`}
                                        rules={[{   required: (opCompleteapicall ), message: 'Field is required' },
                                        {
                                            validator(rule, value, callback) {
                                                if (!value && opCompleteapicall || (getOperatorData?.noOfBilletAndLength && !value)) {
                                                    return Promise.reject("Field is required")
                                                }
                                                else {
                                                    return Promise.resolve();
                                                }
                                            },
                                        }
                                        ]}
                                    >
                                        <Input 
                                            type="number" 
                                            step={0.0001}
                                            min={0.0001}
                                            style={{ width: 180 }}
                                            onChange={(e) => setBilletValue(e, item?.id, 'billetLength')}
                                            // addonBefore={`Billet${index + 1}`}
                                            addonAfter="(in)"
                                            // value={item["billet"+(index+1)]}
                                            className="" />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col span={1}>
                                {formBillet.length > 1 &&
                                <div className="closeButton jc" onClick={() => removeFormFields(index, type, item)}>X</div>}
                            </Col>
                        </Row>
                      )
                  })}
                  <div className="jfe">
                      <div className="text-center total"><pre className="roboto">Total Billet Count</pre></div>
                      <div>
                          <Input 
                          readOnly 
                          value={!isNaN(total) ? total : 0} 
                          style={{width: 150, background: '#f4f4f4'}}/>
                      </div>
                  </div>
            </div>
          )

      } catch (error) {
          console.log("Error in multiplInputBoxForBilletlength::", error);
      }
  };

  const multiplInputBoxForBreakDown = (type: any) => {
    try {
      return (
        <div className="wrap">
          {(formBreakDown || []).map((item: any, index: any) => {
            return (
              <div>
                {
                  <div
                    className="multiple-inputBox-container"
                  >
                    <div className="d-flex">
                      <div className="breakDownStyle">
                        <label>{`Breakdown${index + 1} Start Time`} </label>
                        <Form.Item name={`startTime${item?.id}`}
                          rules={[{   required: (opCompleteapicall || getOperatorData?.breakDown), message: "Field is required" },
                          ]}>
                          <TimePicker
                            className="inputbox"
                            use12Hours format={"h:mm a"}
                            style={{ width: 100 }}
                            suffixIcon={false}
                            onChange={(e: any) => { setBreakDownValue(e ? dayjs(e).format("h:mm A") : '', item?.id, "startTime") }}
                            value={item["startTime" + (index + 1)]}
                            disabledHours={() => item?.endTime && disabledHours(moment(item?.endTime,"h:mm a"), "startTime")}
                          />
                        </Form.Item>
                        {/* <label>{`Breakdown${index + 1} End Time `}</label> */}
                        <label>End Time</label>
                        <Form.Item name={`endTime${item?.id}`}
                          rules={[{   required: (opCompleteapicall  || getOperatorData?.breakDown || item?.startTime), message: "Field is required" },
                          ]}>
                          <TimePicker className="inputbox" style={{ width: 100 }}
                            suffixIcon={false}
                            use12Hours format={"h:mm a"}
                            disabled={item.startTime ? false : true}
                            disabledHours={() => disabledHours(moment(item?.startTime,"h:mm a"), "endTime")}
                            // disabledMinutes={(e: any) => disabledMinutes(e, "End Time")}

                            onChange={(e: any) => { setBreakDownValue(e ? dayjs(e).format("h:mm A") : '', item?.id, "endTime") }}
                          />
                        </Form.Item>
                        <label> Elapsed Time</label>
                        <Form.Item
                        name={`elapsedtime${item?.id}`}
                        rules={[{   required: opCompleteapicall, message: "Field is required" },
                        ]}>
                          <Input
                          className="inputbox" 
                          disabled={true}
                          style ={{width:100}}
                          onChange={(e: any)=> {setBreakDownValue(e, item.id, "elapsedTime")}}
                          />
                        </Form.Item>
                        {/* <label>{AppConstants?.reasonForBreakdown}</label> */}
                        <label>Reason</label>
                        <Form.Item name={`reason${item?.id}`}
                          rules={[{   required: opCompleteapicall, message: "Field is required" },
                          ]}>
                          <Input className="inputbox" 
                                type="text" 
                                maxLength={500}
                                style={ modalKey!="true" ? {width: 200}:{width:100}} 
                                onChange={(e) => { setBreakDownValue(e, item?.id, "reason") }} />
                        </Form.Item>
                        {/* <label >{AppConstants?.ResponsibleDepartmentForBreakdown}</label> */}
                        <label>Responsible Department</label>
                        <Form.Item name={`responsibleDepartment${item.id}`}
                          rules={[{   required: opCompleteapicall, message: "Field is required" },
                          ]}>
                          <Input className="inputbox"
                                type="text" 
                                maxLength={500}
                                // style={{ width: 200 }}
                                style={ modalKey!="true" ? {width: 200}:{width:100}} 
                                onChange={(e) => { setBreakDownValue(e, item?.id, "responsibleDepartment") }} />
                        </Form.Item>
                      </div>
                      {formBreakDown.length > 1 && <div
                        className="closeButton jc"
                        onClick={() => removeFormFields(index, type, item)}
                      >
                        X
                      </div>}
                    </div>
                  </div>
                }
              </div>
            );
          })}
        </div>
      );
    } catch (error) {
        console.log("Error in multiplInputBoxForBreakDown::", error)
    }
  };

  const confirmProcess = (key: string,)=>{
    if(key == 'complete'){
      setopCompleteapicall(true);
      operatorForm.validateFields().then(()=>{
          setConfirmOpen(true)
      })
    }
    else{
      setopCompleteapicall(false);
      operatorForm.validateFields().then(()=>{
        if(key == 'reassign'){
          setReassignOpen(true)
        }else{
          setopHoldapicall(true); 
          setConfirmOpen(true); 
        }  
      })
      
    }
  }

  const setEndTime = (e: any)=>{
    let start = dayjs(updateOperatorData?.startTime).format("HH:mm").split(":");
    let end = dayjs(e).format("HH:mm").split(":");
    let isStartGreaterEnd = Number(start[0]) > Number(end[0]);
    if((Number(start[0]) === Number(end[0])) && (Number(start[1]) > Number(end[1]))){
      isStartGreaterEnd = true;
    }
    if(e !== null && isStartGreaterEnd){
      operatorForm.setFieldsValue({['operator-endTime']: ""})
      operatorForm.setFields([{name: 'operator-endTime', errors: ["Select valid time"]}])
    }
    else{
      setUpdateOperatorData({
        ...updateOperatorData,
        endTime: e,
      })
    }
  }

  const closePopup = ()=>{
      setConfirmOpen(false);
      setopCompleteapicall(false);
      setopHoldapicall(false)
  }

  const formView = ()=>{
    try {
     return( 
      <Form
        form={operatorForm}
        autoComplete="off"
        id="operatorForm"
        //onFinish={() => updateOperatorApi(data)}
        onFinish={() => {
          reassignOpen
            ? Reassignsetvalue(data)
            : opCompleteapicall || opHoldapicall
              ? updateStatus(
                opCompleteapicall ? AppConstants?.COMPLETED : AppConstants?.HOLD
              )
              : updateOperatorApi(data, '');
        }}
      >
        <div className={modalKey!="true" ? "operator-entry-expando-collapse":"operator-entry-expando-collapse operator-entry-Modal-expando-collapse"}>
          <Row className="operator-entry-data-with-box-Row">
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">{AppConstants?.DieTrial}</div>
              <Form.Item name="operator-dieTrialRefId" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Select
                  onChange={(e: any) => {
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      dieTrialRefId: e,
                    });
                  }}
                  style={{ width: 100 }}
                >
                  {(dietrialData || []).map((item: any) => {
                    return (
                      <Option key={item?.id} value={item?.id}>
                        {item?.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">
                {AppConstants?.dieWithAluminium}
              </div>
              <Form.Item name="operator-dieWithAluminiumRefId" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Select
                  style={{ width: 100 }}
                  className=""
                  onChange={(e: any) => {
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      dieWithAluminiumRefId: e,
                    });
                  }}
                >
                  {(dieWithAluminium || []).map((item: any) => {
                    return (
                      <Option key={item?.id} value={item?.id}>
                        {item?.name}
                      </Option>
                    );
                  })}
                  {/* {(CutBilletsData || []).map((item: any)=>{
                                  return(
                                      <Option key={item?.id} value={item?.id}>{item?.name}</Option>
                                  )
                              })} */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">
                {AppConstants?.previousDayDieContinue}
              </div>
              <Form.Item name="operator-previousDayDie_continueRefId" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Select
                  style={{ width: 100 }}
                  className=""
                  onChange={(e: any) => {
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      previousDayDie_continueRefId: e,
                    });
                  }}
                >
                  {(previousDaydieContinue || []).map((item: any) => {
                    return (
                      <Option key={item?.id} value={item?.id}>
                        {item?.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">{AppConstants?.BatchNo}</div>
              <Form.Item name="operator-batchNo" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                  style={{ width: 100 }}
                  min={1}
                  type="number"
                  onChange={(e: any) =>
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      batchNo: e?.target?.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="operator-entry-data-with-box-Row">
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">
                {AppConstants?.ActualInternalAlloy}
              </div>
              <Form.Item name="operator-actualInternalAlloy" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                maxLength={500}
                  style={{ width: 100 }}
                  onChange={(e: any) =>
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      actualInternalAlloy: e?.target?.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">{AppConstants?.startTime}</div>
              <Form.Item name="operator-startTime" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <TimePicker
                  style={{ width: 100 }}
                  use12Hours format={"h:mm a"}
                  // value={}
                  // disabledHours={() => updateOperatorData?.endTime ? disabledHours(moment(updateOperatorData?.endTime,"h:mm a"), "startTime") : []}
                  onChange={(e: any) =>{
                    operatorForm.setFieldsValue({
                      'operator-endTime': '',
                      'operator-processTime': ""
                    })
                    operatorForm.resetFields(['operator-endTime']);
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      startTime: e,
                      endTime: null
                    })
                  }
                  }
                  placeholder="Select"
                  suffixIcon={false}
                />
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">{AppConstants?.endTime}</div>
              <Form.Item name="operator-endTime" rules={[{   required: (opCompleteapicall || updateOperatorData?.startTime), message: "Field is required" }]}>
                <TimePicker
                  disabled={updateOperatorData?.startTime ? false : true}
                  style={{ width: 100 }}
                  use12Hours format={"h:mm a"}
                  onChange={(e: any) =>setEndTime(e)}
                  placeholder="Select"
                  suffixIcon={false}
                  disabledHours={() => updateOperatorData?.startTime && disabledHours(updateOperatorData?.startTime, "endTime")}
                />
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">{AppConstants?.processTime}</div>
              <Form.Item name="operator-processTime" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                  step={0.0001}
                  disabled={true}
                  // readOnly
                  style={{ width: 100 }}
                  onChange={(e: any) =>
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      processTime: e?.target?.value,
                    })
                  }
                  suffix="hr"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="operator-entry-data-with-box-Row billet-set ">
            <Col span={24} className="d-flex padding-1 h-35">
              <div className="required-field-1">
                {AppConstants?.NoofBilletandBilletLength}
              </div>
              <Form.Item name="operator-noOfBilletAndLength">
                {formBillet?.length >= 0 && (
                  <div className={formBillet?.length >= 5 ? "d-flex disabled" : 'd-flex '}>
                  <div className={formBillet?.length >= 5  ? "addButton disabled d-flex" : "addButton d-flex" } 
                  onClick={() =>{formBillet?.length < 5 && addFormFields("formBillet")}}
                  >
                      +
                  </div>
              </div>
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="operator-entry-data-with-box padding">
              {multiplInputBoxForbilletlength("formBillet")}
            </Col>
          </Row>

          <Row className="operator-entry-data-with-box-Row">
            <Col span={6} className="operator-entry-data-with-box padding">
              <div className="required-field-1">
                {AppConstants?.ActualButtthickness}
              </div>
              <Form.Item name="operator-actualButtThickness" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                  style={{ width: 100 }}
                  min={0.0001}
                  type="number"
                  step={0.0001}
                  onChange={(e: any) =>
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      actualButtThickness: e?.target?.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding">
              <div className="required-field-1">
                {AppConstants?.Breakthroughpressure}
              </div>
              <Form.Item name="operator-breakThroughPressure" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                  style={{ width: 100 }}
                  min={0.0001}
                  type="number"
                  step={0.0001}
                  onChange={(e: any) =>
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      breakThroughPressure: e?.target?.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding">
              <div className="required-field-1">
                {AppConstants?.PushOnBilletLength}
              </div>
              <Form.Item name="operator-pushOnBilletLength" rules={[{ required: false, message: "Field is required" }]}>
                <Input
                  min={0.0001}
                  style={{ width: 100 }}
                  step={0.0001}
                  disabled={true}
                  className="inprogress-data-with-box-disabled"
                  // readOnly
                  type="number"
                // onChange={(e: any) =>
                //   setUpdateOperatorData({
                //     ...updateOperatorData,
                //     pushOnBilletLength: e?.target?.value,
                //   })
                // }
                />
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding">
              <div className="required-field-1">{AppConstants?.PushQty}</div>
              <Form.Item name="operator-pushQtyInKgs" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                  min={0.0001}
                  type="number"
                  style={{ width: 100 }}
                  step={0.0001}
                  onChange={(e: any) =>
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      pushQtyInKgs: e?.target?.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="operator-entry-data-with-box-Row">
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">
                {AppConstants?.ActualProductionRate}
              </div>
              <Form.Item name="operator-actualProductionRate" rules={[{required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                  style={{ width: 100 }}
                  // min={0.0001}
                  type="number"
                  step={0.0001}
                  disabled={true}
                  className="inprogress-data-with-box-disabled"
                  // readOnly
                // onChange={(e: any) =>
                //   setUpdateOperatorData({
                //     ...updateOperatorData,
                //     actualProductionRate: e?.target?.value,
                //   })
                // }
                />
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">{AppConstants?.ButtWeight}</div>
              <Form.Item name="operator-buttWeightInKgs" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                  style={{ width: 100}}
                  min={0.0001}
                  type="number"
                  disabled={true}
                  // readOnly
                  step={0.0001}
                  className="inprogress-data-with-box-disabled"
                  onChange={(e: any) =>
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      buttWeightInKgs: e?.target?.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">{AppConstants?.DieFail}</div>
              <Form.Item name="operator-diefailRefId" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Select
                  style={{ width: 100 }}
                  onChange={(e: any) => {
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      diefailRefId: e,
                    });
                  }}
                >
                  {(dieFailData || []).map((item: any) => {
                    return (
                      <Option key={item?.id} value={item?.id}>
                        {item?.name}
                      </Option>
                    );
                  })}
                  {/* {(CutBilletsData || []).map((item: any)=>{
                                  return(
                                      <Option key={item?.id} value={item?.id}>{item?.name}</Option>
                                  )
                              })} */}
                  {/* <Option>Yes</Option> */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">
                {AppConstants?.dieFailureReason}
              </div>
              <Form.Item name="operator-dieFailureReason" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                  style={{ width: 150 }}
                  maxLength={500}
                  type="text"
                  onChange={(e: any) =>
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      dieFailureReason: e?.target?.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="operator-entry-data-with-box-Row border_line">
            <Col span={modalKey!="true" ? 3:4} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">{AppConstants?.BreakDown}</div>
              <Form.Item name="operator-breakDown">
                {formBreakDown?.length >= 0 && (
                  <div className={formBreakDown?.length >= 5 ? "d-flex disabled" : 'd-flex '}>
                  <div className={formBreakDown?.length >= 5  ? "addButton disabled d-flex" : "addButton d-flex" } 
                  onClick={() =>{formBreakDown?.length < 5 && addFormFields("breakdown")}}
                  >
                      +
                  </div>
              </div>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className="operator-entry-data-with-box-Row">
            <Col span={24} className="operator-entry-data-with-box padding-1">
              {multiplInputBoxForBreakDown("breakdown")}
            </Col>
          </Row>
          <Row className="operator-entry-data-with-box-Row border_line_bottom">
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">
                {AppConstants?.Breakdownduration}
              </div>
              <Form.Item name="operator-breakDownDuration" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                  // onClick={(e: any) => editBreakdownDuration(e)}
                  style={{ width: 100 }}
                  readOnly={true}
                  disabled={true}
                  className="inprogress-data-with-box-disabled"
                  // onChange={(e: any) =>{
                  //   breakDownAdded = true;
                  //   editBreakdownDuration(e)
                  // }}
                />
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">
                {AppConstants?.Logendscraplength}
              </div>
              <Form.Item name="operator-logEndScrapLengthInMm" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                  min={0.0001}
                  type="number"
                  step={0.0001}
                  style={{ width: 100 }}
                  onChange={(e: any) =>
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      logEndScrapLengthInMm: e?.target?.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box">
              <div className="required-field-1">{AppConstants?.LogendScrap}</div>
              <Form.Item name="operator-logEndScrapInKgs" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                  min={0.0001}
                  type="number"
                  step={0.0001}
                  style={{ width: 100 }}
                  onChange={(e: any) =>
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      logEndScrapInKgs: e?.target?.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6} className="operator-entry-data-with-box padding-1">
              <div className="required-field-1">{AppConstants?.OperatorName}</div>
              <Form.Item name="operator-operatorName" rules={[{   required: opCompleteapicall, message: "Field is required" }]}>
                <Input
                  type="text"
                  maxLength={500}
                  style={{ width: 145 }}
                  onChange={(e: any) =>
                    setUpdateOperatorData({
                      ...updateOperatorData,
                      operatorName: e?.target?.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="inprogress-remark-title-text">
            <div className="inprogress-remark-title">Operator Remarks</div>
            <Form.Item name="operator-remarks" >
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
          {modalKey != "true" &&(
          <div className="inprogress-buttons js">
            <div className="inprogress-hold-complete-button js">
              {type === AppConstants.INPROGRESS && (
                <Button
                  className="inprogress-hold-button jc"
                  type="primary"
                  // disabled={opHoldapicall}
                  // onClick={() =>
                  //   updateStatus(data, AppConstants?.HOLD, 0)
                  // }
                  onClick={() =>{
                    confirmProcess('hold')
                  }}
                >
                  <img src={AppImages?.holdIcon} />
                  Hold
                </Button>
              )}
              <Button
                className="inprogress-complete-button jc"
                type="default"
                onClick={() => confirmProcess('complete')}
              >
                <img src={AppImages?.correctIcon} />
                Complete
              </Button>
              <Button
                className="inprogress-Reassign-button jc"
                type="default"
                htmlType="submit"
                // onClick={() => {
                //   Reassignsetvalue(data);
                // }}
                onClick={() => confirmProcess('reassign')}
              >
                <img
                  className="inprogress-Reassign-icon"
                  src={AppImages?.vectorIcon}
                />
                <CommonReassignpopup
                  type={type}
                  isModalOpen={reassignOpen}
                  setIsModalOpen={setReassignOpen}
                  sectionNo={sectionNumModal}
                  sectionName={"Qa DATA"}
                  setReasignToast={setReasignToast}
                  reasignToast={reasignToast}
                  getInProgressData={getInProgressData}
                  uniqueId={updateOperatorData?.operatorEntryId}
                  data={data}
                  prePopremarks={getOperatorData?.remarks}
                  updatedData={updateOperatorData}
                  setUpdateForm={setUpdateOperatorData}
                  role={5}
                  formbillet={formBillet}
                  breakdown={formBreakDown}
                  updateApi={updateOperatorApi}
                />
                Reassign
              </Button>
            </div>
            <div className="inprogress-clear-update-button js">
              <Button
                className="inprogress-clear-button"
                type="default"
                onClick={() => getOperatorEntryInprogress()}
              >
                Clear
              </Button>
              <Button
                className="inprogress-update-button"
                type="primary"
                htmlType="submit"
                onClick={() => setopCompleteapicall(false)}
                // disabled={updateOperatorLoad}
              >
                Update
              </Button>
            </div>
          </div>
          )}
          {(modalKey ==='true')&&(
          <div className="inprogress-buttons position-fixed jf">
              <Button className="inprogress-save-Modal-button" 
              // disabled={saveInProgressLoad}
              htmlType="submit"
              type="primary">Save</Button>
          </div>
              )}
        </div>
        {(updateStatusLoad || updateOperatorLoad || getOperatorInprogressLoad) && <SpinLoader loading={true}/>}
        <ConfirmPopup 
          open={confirmOpen}
          setOpen={closePopup}
          content={opCompleteapicall ? 
              <>Do you want to complete the process for PO: <b>{data?.poNo}</b> ?</>
              : 
              <>Do you want to move PO: <b>{data?.poNo}</b> to hold?</>
          }
          callback={() => updateStatus(opCompleteapicall ? AppConstants?.COMPLETED : AppConstants?.HOLD)} 
          buttonText={opCompleteapicall ? "Complete" : "Hold"}     
        />
      </Form>
    )
    } catch (error) {
      console.log("Error in Formview::", error)
    }
  }
  
  return (
   <>
      {formView()}
   </>
  );
}

export default OperatorEntryFormUpdate

