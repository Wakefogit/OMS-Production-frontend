import {
  Form,
  Row,
  Col,
  Select,
  Button,
  Input,
  message,
} from "antd";

import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppConstants from "../../Global/AppConstants";

import AppImages from "../../Global/AppImages";
import { deepCopyFunction } from "../../Global/Helpers";
import { getUser } from "../../localStorage";
import {
  commonReferenceDataAction,
  getQAInprogressDataAction,
  updateOrderStatus,
  updateQADataAction,
} from "../Store/Action/jindalAction";
import { CommonReassignpopup } from "./CommonReassignpopup";
// import "../inprogressListScreen.scss";
import "./QaFormUpdate.scss";
import SpinLoader from "../Common/SpinLoader";
import ConfirmPopup from "../Common/ConfirmPopup";
let typeTemp = "";
let typeReassign = "";
let isApiCallInprogress = false;

const QaFormUpdates: any = (props: any) => {
  const user = getUser();
  const { data, holdButton, type, getInProgressData,modalKey } = props;
  const [reassignOpen, setReassignOpen] = useState(false);
  const [sectionNumModal, setSectionNumModal] = useState<any>(null);
  const [sectionName, setSectionName] = useState<any>("");
  const [reasignToast, setReasignToast] = useState(false);
  const [CompleteCall, setCompleteCall] = useState(false);
  const [HoldCall, setHoldCall] = useState(false);
  typeReassign = type;
  const [form]: any = Form.useForm();
  const [qaForm]: any = Form.useForm();
  const dispatch = useDispatch();
  const jindalReducerState: any = useSelector(
    (state: any) => state.JindalReducerState
  );
  const updateQATemp = {
    qaId: "",
    plannedQuenching: "",
    cutLengthToleranceUpper: null,
    cutLengthToleranceLower: null,
    plannedInternalAlloy: "",
    frontEndCoringLength: null,
    backEndCoringLength: null,
    remarks: "",
  };
  const {
    plannedQuenchingData,
    getQAInprogressData,
    getQAOnload,
    updateQaOnLoad,
    updateQaData,
    updateStatusOnLoad,
    updateStatusData,
    
  } = jindalReducerState;
  const { Option } = Select;
  const [updateStatusLoad, setupdateStatusLoad] = useState(false);
  // const [type, setType] = useState("");
  const [getQaInprogressLoad, setGetQaInprogressLoad] = useState(false);
  const [updateQALoad, setUpdateQALoad] = useState(false);
  const [updateQAData, setUpdateQAData] = useState(
    deepCopyFunction(updateQATemp)
  );
  const getQAData = getQAInprogressData?.getQAInprogressData;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const prePopulateQAInprogressData = () => {
    if (getQAInprogressData) {
      qaForm?.setFieldsValue({
        ["qa-plannedQuenchingData"]: getQAData?.plannedQuenching,
        // ["qa-p"]: getQAData?.plannedQuenchingData,
        ["qa-backEndCoringLength"]: getQAData?.backEndCoringLength,
        ["qa-cutLengthToleranceUpper"]: getQAData?.cutLengthToleranceUpper,
        ["qa-cutLengthToleranceLower"]: getQAData?.cutLengthToleranceLower,
        ["qa-frontEndCoringLength"]: getQAData?.frontEndCoringLength,
        ["qa-plannedInternalAlloy"]: getQAData?.plannedInternalAlloy,
        [`qa-remarks`]: getQAData?.remarks,
      });
      setUpdateQAData({
        ...updateQAData,
        qaId: getQAData?.qaId,
        plannedQuenching: getQAData?.plannedQuenching,
        backEndCoringLength: getQAData?.backEndCoringLength,
        cutLengthToleranceUpper: getQAData?.cutLengthToleranceUpper,
        cutLengthToleranceLower: getQAData?.cutLengthToleranceLower,
        frontEndCoringLength: getQAData?.frontEndCoringLength,
        plannedInternalAlloy: getQAData?.plannedInternalAlloy,
        remarks: getQAData?.remarks,
      });
    } else {
      qaForm?.resetFields();
    }
  };

  const plannedQuenchingReferenceDataApi = () => {
    let payload = {
      name: "Planned Quenching",
    };
    dispatch(commonReferenceDataAction(payload));
  };

  const getQaInprogressDataApi = () => {
    let payload = {
      orderId: data?.orderId,
    };
    dispatch(getQAInprogressDataAction(payload));
    setGetQaInprogressLoad(true);
    qaForm?.resetFields();
    setUpdateQAData(updateQATemp)
  };

  // useEffect(() => {
  //   // if (data?.isExpanded === true) {
  //     getQaInprogressDataApi();
  //   // }
  // }, [data?.isExpanded])

  useEffect(() =>{
    if(modalKey){
      getQaInprogressDataApi()
    }
  }, [modalKey])

  useEffect(() => {
    plannedQuenchingReferenceDataApi();
  }, []);

  useEffect(() => {
    qaForm.resetFields();
    setUpdateQAData(updateQATemp);
    if (getQAInprogressData) {
      prePopulateQAInprogressData();
      setGetQaInprogressLoad(false);
    }
  }, [getQAInprogressData]);

  const checkValue = (value: any)=>{
    let valueTemp = String(value);
    if(valueTemp && valueTemp != "null" && value != undefined){
      return value
    }
    else{
      return null
    }
  }

  const updateQaApi = () => {
      let payload = {
        qaId: getQAData?.qaId ? getQAData?.qaId : "",
        orderId: data?.orderId,
        plannedQuenching: checkValue(updateQAData?.plannedQuenching),
        cut_len_tolerance_upper: checkValue(updateQAData?.cutLengthToleranceUpper),
        cut_len_tolerance_lower: checkValue(updateQAData?.cutLengthToleranceLower),
        plannedInternalAlloy: checkValue(updateQAData?.plannedInternalAlloy) ,
        frontEndCoringLength: checkValue(updateQAData?.frontEndCoringLength),
        PlannedBackEnd: checkValue(updateQAData?.PlannedBackEnd),
        backEndCoringLength: checkValue(updateQAData?.backEndCoringLength), 
        remarks: checkValue(updateQAData?.remarks),
      };
      dispatch(updateQADataAction(payload));
      setUpdateQALoad(true);
  };

  useEffect(() => {
    if (updateQALoad && !updateQaOnLoad) {
      isApiCallInprogress = false;
      setUpdateQALoad(false);
      getQaInprogressDataApi();
      setTimeout(()=>{
          if (updateQaData?.createOrUpdateQAData?.message == "Updated Successfully") {
              message?.success("Successfully Updated");
          }
          setupdateStatusLoad(false);
        },800);
    }
  }, [updateQALoad, updateQaOnLoad]);

  const updateStatus = (data: any, type: any) => {
    // if(!isApiCallInprogress){
    //     isApiCallInprogress = true;
        typeTemp = type;
        let orderList = [];
        orderList?.push(data?.orderId);
        let orderArr = JSON.stringify(orderList).replace(/"([^(")"]+)":/g, "$1:");
        let qaData = {
          qaId:
            getQAData?.qaId != undefined || getQAData?.qaId != null
              ? getQAData?.qaId
              : "",
          orderId: data?.orderId,
          plannedQuenching: checkValue(updateQAData?.plannedQuenching),
          cutLengthTolerance: checkValue(updateQAData?.cutLengthTolerance),
          plannedInternalAlloy: checkValue(updateQAData?.plannedInternalAlloy),
          frontEndCoringLength: checkValue(updateQAData?.frontEndCoringLength), 
          backEndCoringLength: checkValue(updateQAData?.backEndCoringLength),
          cut_len_tolerance_upper: checkValue(updateQAData.cutLengthToleranceUpper),
          cut_len_tolerance_lower: checkValue(updateQAData.cutLengthToleranceLower), 
          remarks: checkValue(updateQAData?.remarks),
          processStage: user?.roleId == 1 ? data?.processStage : null
        };
        let payload = {
          orderId: [orderArr],
          type: type,
          roleData: qaData,
        };
        dispatch(updateOrderStatus(payload));
        // setType(type);
        setupdateStatusLoad(true);
    // }
  };

  useEffect(() => {
    if (updateStatusLoad && !updateStatusOnLoad) {
      
      isApiCallInprogress = false;
      getInProgressData();
      // setType("");
      setCompleteCall(false);
      setHoldCall(false);
      setTimeout(()=>{
        if (
          updateStatusData?.updateOrderStatus_withMapping?.Message ==
          "Updated Successfully"
        ) {
          message?.success(
            typeTemp == AppConstants?.COMPLETED
              ? "Successfully Completed"
              : "Order Holded Successfully"
          );
          setupdateStatusLoad(false);
        }
      },800)
    }
  }, [updateStatusLoad, updateStatusOnLoad]);


  const Reassignsetvalue = (data: any) => {
    setReassignOpen(true);
    setSectionNumModal(data?.poNo);
    const roleData = "Tool Shop DATA";
    setSectionName(roleData);
  };

    const validateForm = ()=>{
      // qaForm.validateFields().then(() =>{
        Reassignsetvalue(data)
      // })
    }

    const confirmProcess = (key: string,)=>{
      setCompleteCall(true);
      form.validateFields().then(()=>{
          setConfirmOpen(true)
      })
  }

  const closePopup = ()=>{
      setConfirmOpen(false);
      setCompleteCall(false);
      setHoldCall(false)
  }

  return (
    <Form
      form={qaForm}
      autoComplete="off"
      id="qaForm"
      onFinish={() =>updateQaApi()}
    >
      <div className={modalKey!="true" ? "inprogress-expando-collapse":"inprogress-expando-collapse inprogress-expando-modal-collapse"}>
        <div className="inprogress-remark-title-text">
          <Row>
            <Col span={4}>
              <div className="inprogress-planned-quenching required ">
                {AppConstants?.plannedQuenching}
              </div>
            </Col>
            <Col span={4}>
              <div className="inprogress-remark-input-box required ">
                <Form.Item
                  name="qa-plannedQuenchingData"
                  rules={[{   required: CompleteCall, message: "Field is required" }]}
                >
                  <Select style={{ width: 120 }}
                  onChange={(e: any) => setUpdateQAData({
                    ...updateQAData,
                    plannedQuenching: e,
                  })}
                  >
                    {(plannedQuenchingData || []).map((item: any) => {
                      return (
                        <Option key={item?.id} value={item?.id}>
                          {item?.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col span={4}>
              <div className="qa-cutLengthTolerance required ">
                {" "}
                {AppConstants?.cutlengthtolerancelower}
              </div>
            </Col>
            <Col span={4}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="qa-cutLengthToleranceLower"
                  rules={[{ required: false }]}
                >
                  <input
                    className="qa-input-number"
                    type="number"
                    min={0}
                    step={0.0001}
                    onChange={(e: any) => {
                      setUpdateQAData({
                        ...updateQAData,
                        cutLengthToleranceLower: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={4}>
              <div className="qa-cutLengthTolerance required ">
                {" "}
                {AppConstants?.cutlengthtoleranceupper}
              </div>
            </Col>
            <Col span={4}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="qa-cutLengthToleranceUpper"
                  rules={[{ required: false },
                    // {validator(rule, value, callback) {
                    //     if(value < updateQAData?.cutLengthToleranceLower){
                    //       return Promise.reject("Must be greater than Cut Length Tolerance Lower")
                    //     }
                    //     else{
                    //       return Promise.resolve()
                    //     }
                    // },}
                  ]}
                >
                  <input
                  min={0}
                  step={0.0001}
                    className="qa-input-number"
                    type="number"
                    // onFocus={(e: any) => cutLengthToleranceUpperFuncMax(e?.target?.value)}
                    // value={updateQAData?.cutLengthToleranceUpper}
                    // value={updateQAData?.cutLengthToleranceLower > updateQAData?.cutLengthToleranceUpper ? updateQAData?.cutLengthToleranceLower : updateQAData?.cutLengthToleranceUpper}
                    onChange={(e: any) => {
                      setUpdateQAData({
                        ...updateQAData,
                        cutLengthToleranceUpper: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            {/* <Col span={4}>
              <div className="qa-cutLengthTolerance required ">
                {" "}
                Cut Length Tolerance Lower(mm)
              </div>
            </Col>
            <Col span={4}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="qa-cutLengthToleranceLower"
                  rules={[{ required: false }]}
                >
                  <input
                    className="qa-input-number"
                    type="number"
                    min={0.0001}
                    step={0.0001}
                    onChange={(e: any) => {
                      setUpdateQAData({
                        ...updateQAData,
                        cutLengthToleranceLower: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col> */}
            <Col span={4}>
              <div className="qa-PlannedInternalAlloy required ">
                {AppConstants?.plannedInternalAlloy}
              </div>
            </Col>
            <Col span={4}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="qa-plannedInternalAlloy"
                  rules={[{   required: CompleteCall, message: "Field is required" }]}
                >
                  <Input
                    maxLength={500}
                    onChange={(e: any) => {
                      setUpdateQAData({
                        ...updateQAData,
                        plannedInternalAlloy: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={5}>
              <div className="qa-PlannedFrontEnd required ">
                {AppConstants?.plannedFrontEndCoringLength}
              </div>
            </Col>
            <Col span={3}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="qa-frontEndCoringLength"
                  rules={[{   required: CompleteCall, message: "Field is required" }]}
                >
                  <input
                    className="qa-input-number"
                    type="number"
                    min={0.0000}
                    step={0.0001}
                    onChange={(e: any) => {
                      setUpdateQAData({
                        ...updateQAData,
                        frontEndCoringLength: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={5}>
              <div className="qa-PlannedBackEnd required ">
                {AppConstants?.plannedBackEndCoringLength}
              </div>
            </Col>
            <Col span={3}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="qa-backEndCoringLength"
                  rules={[{   required: CompleteCall, message: "Field is required" }]}
                >
                  <input
                    className="qa-input-number"
                    type="number"
                    min={0.0000}
                    step={0.0001}
                    onChange={(e: any) => {
                      setUpdateQAData({
                        ...updateQAData,
                        backEndCoringLength: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <div className="inprogress-remark-title required">{AppConstants?.qaremarks}</div>
          <Form.Item
            name="qa-remarks"
          // rules={[{   required: CompleteCall, message: "Field is required" }]}
          >
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
        {(modalKey!="true") && (
        <div className="inprogress-buttons js">
          <div className="inprogress-hold-complete-button js">
            {type === AppConstants.INPROGRESS && (
              <Button
                className="inprogress-hold-button jc"
                type="primary"
                onClick={() => {setHoldCall(true); setConfirmOpen(true); setCompleteCall(false)}}
              >
                <img src={AppImages?.holdIcon} />
                Hold
              </Button>
            )}
            <Button
              className="inprogress-complete-button jc"
              type="primary"
              onClick={() => confirmProcess('complete')}
            >
              <img src={AppImages?.correctIcon} />
              Complete
            </Button>
            <Button
              className="inprogress-Reassign-button jc"
              type="default"
              onClick={() => validateForm()}
            >
              <img
                className="inprogress-Reassign-icon"
                src={AppImages?.vectorIcon}
              />
              <CommonReassignpopup
                type={typeReassign}
                getInProgressData={getInProgressData}
                isModalOpen={reassignOpen}
                setIsModalOpen={setReassignOpen}
                sectionNo={sectionNumModal}
                sectionName={sectionName}
                setReasignToast={setReasignToast}
                reasignToast={reasignToast}
                uniqueId={getQAData?.qaId}
                data={data}
                getQAData={getQAData}
                updatedData={updateQAData}
                setUpdateForm={setUpdateQAData}
                prePopremarks={getQAData?.remarks}
                role={4}
              />
              Reassign
            </Button>
          </div>
          <div className="inprogress-clear-update-button js">
            <Button
              className="inprogress-clear-button"
              type="default"
              onClick={() => getQaInprogressDataApi()}
            >
              Clear
            </Button>
            <Button
              className="inprogress-update-button"
              type="primary"
              htmlType="submit"
              onClick={() => setCompleteCall(false)}
              // disabled={updateStatusLoad}
            >
              Update
            </Button>
          </div>
        </div>
        )}
        {(modalKey ==='true')&&(
        <div className="inprogress-buttons jf">
            <Button className="inprogress-save-Modal-button" 
            // disabled={saveInProgressLoad}
            htmlType="submit"
            type="primary">Save</Button>
        </div>
            )}
      </div>
      {(updateStatusLoad || updateQALoad ||getQAOnload) && <SpinLoader loading={true}/>}
      <ConfirmPopup 
          open={confirmOpen}
          setOpen={closePopup}
          content={CompleteCall ? 
              <>Do you want to complete the process for PO: <b>{data?.poNo}</b> ?</>
              : 
              <>Do you want to move PO: <b>{data?.poNo}</b> to hold?</>
          }
          callback={() => updateStatus(data, (CompleteCall ? AppConstants?.COMPLETED : AppConstants?.HOLD))} 
          buttonText={CompleteCall ? "Complete" : "Hold"}     
      />
    </Form>
  );
};

export default QaFormUpdates;
