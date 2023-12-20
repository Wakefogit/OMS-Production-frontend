import { Form, Row, Col, Button, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppConstants from "../../Global/AppConstants";
import AppImages from "../../Global/AppImages";
import { deepCopyFunction } from "../../Global/Helpers";
import { getUser } from "../../localStorage";
import {
  getToolShopInprogressDataAction,
  updateOrderStatus,
  updateToolShopDataAction,
} from "../Store/Action/jindalAction";
import { CommonReassignpopup } from "./CommonReassignpopup";
// import "../inprogressListScreen.scss";
import "./ToolShopFormUpdate.scss";
import SpinLoader from "../Common/SpinLoader";
import ConfirmPopup from "../Common/ConfirmPopup";

let typeTemp = "";
let updateKey = "";
let modalKey = "";
let isApiCallInprogress = false;

const ToolShopFormUpdate: any = (props: any) => {
  const user = getUser();
  // const [onHold,setOnHold]= useState(false);
  const {
    type,
    data,
    getInProgressData,
    holdButton,
    reasignToast,
    setReasignToast,
    modalKey,
    isExpand
  } = props;
  const [reassignOpen, setReassignOpen] = useState(false);
  const [toolShopForm]: any = Form.useForm();
  // const [reassignOpen, setReassignOpen] = useState(false);
  const [sectionNumModal, setSectionNumModal] = useState<any>(null);
  // const [sectionName, setSectionName] = useState<any>("");
  const [completeCall, setCompleteCall] = useState(false);
  const [holdCall, setHoldCall] = useState(false);
  const [reAssignCall, setReassignCall] = useState(false);
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const jindalReducerState: any = useSelector(
    (state: any) => state.JindalReducerState
  );
  const updateToolShopDataTemp = {
    die: null,
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
  const {
    getToolShopInprogressData,
    getToolShopOnload,
    updateToolShopOnLoad,
    updateToolShop,
    updateStatusOnLoad,
    updateStatusData,
  } = jindalReducerState;
  const getToolShopData = getToolShopInprogressData?.getToolShopInprogressData;
  const [updateToolShopLoad, setUpdateToolShopLoad] = useState(false);
  const [updateStatusLoad, setupdateStatusLoad] = useState(false);
  const [updateToolShopData, setUpdateToolShopData] = useState(
    deepCopyFunction(updateToolShopDataTemp)
  );
  const [getToolShopInprogressLoad, setGetToolShopInprogressLoad] =
    useState(false);

  const prePopulateToolShopInprogressData = () => {
    try{
      toolShopForm?.resetFields();
      if (getToolShopData?.toolShopId) {
        toolShopForm?.setFieldsValue({
          ["toolshop-die"]: getToolShopData?.dieRefId ? getToolShopData?.dieRefId : "",
          [`toolshop-noOfCavity`]: getToolShopData?.noOfCavity ? getToolShopData?.noOfCavity : "",
          [`toolshop-bolsterEntry`]: getToolShopData?.bolsterEntry ? getToolShopData?.bolsterEntry : "",
          [`toolshop-backerEntry`]: getToolShopData?.backerEntry ? getToolShopData?.backerEntry : "",
          [`toolshop-specialBackerEntry`]: getToolShopData?.specialBackerEntry ? getToolShopData?.specialBackerEntry : "",
          [`toolshop-ringEntry`]: getToolShopData?.ringEntry ? getToolShopData?.ringEntry : "",
          [`toolshop-dieSetter`]: getToolShopData?.dieSetter ? getToolShopData?.dieSetter : "",
          [`toolshop-weldingChamber`]: getToolShopData?.weldingChamber ? getToolShopData?.weldingChamber : "",
          [`toolshop-remarks`]: getToolShopData?.remarks ? getToolShopData?.remarks : "",
        });
        setUpdateToolShopData({
          ...updateToolShopData,
          toolShopId: getToolShopData?.toolShopId,
          // die: getToolShopData?.die,
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
    }
    catch(error){
      console.log("Error in prePopulateToolShopInprogressData::", error)
    }
  };


  useEffect(() =>{
    if(modalKey){
      getToolShopInprogress()
    }
  }, [modalKey])

  const getToolShopInprogress = () => {
    let payload = {
      orderId: data?.orderId,
    };
    dispatch(getToolShopInprogressDataAction(payload));
    setGetToolShopInprogressLoad(true);
    setUpdateToolShopData(updateToolShopDataTemp)
  };

  useEffect(() => {
    toolShopForm.resetFields();
    setUpdateToolShopData(updateToolShopDataTemp);
    if (getToolShopInprogressData) {
      prePopulateToolShopInprogressData();
      setGetToolShopInprogressLoad(false);
    }
  }, [getToolShopInprogressData]);

  const updateToolShopApi = (key: string) => {
    // if(!isApiCallInprogress){
    //     isApiCallInprogress = true;
        updateKey = key
        let payload = {
          toolShopId:
            updateToolShopData?.toolShopId != undefined ||
              updateToolShopData?.toolShopId != null
              ? updateToolShopData?.toolShopId
              : "",
          orderId: data?.orderId,
          // die: updateToolShopData?.die ? parseInt(updateToolShopData?.die) : null,
          dieRefId: updateToolShopData?.dieRefId
            ? updateToolShopData?.dieRefId
            : null,
          noOfCavity: updateToolShopData?.noOfCavity
            ? parseInt(updateToolShopData?.noOfCavity)
            : null,
          bolsterEntry: updateToolShopData?.bolsterEntry
            ? updateToolShopData?.bolsterEntry
            : null,
          backerEntry: updateToolShopData?.backerEntry
            ? updateToolShopData?.backerEntry
            : null,
          specialBackerEntry: updateToolShopData?.specialBackerEntry
            ? updateToolShopData?.specialBackerEntry
            : null,
          ringEntry: updateToolShopData?.ringEntry
            ? updateToolShopData?.ringEntry
            : null,
          dieSetter: updateToolShopData?.dieSetter
            ? updateToolShopData?.dieSetter
            : null,
          weldingChamber: updateToolShopData?.weldingChamber
            ? updateToolShopData?.weldingChamber
            : null,
          remarks: updateToolShopData?.remarks,
        };
        dispatch(updateToolShopDataAction(payload));
        setUpdateToolShopLoad(true);
    // }
  };

  useEffect(() => {
    if (updateToolShopLoad && !updateToolShopOnLoad && updateKey == "") {
        let messageVal = updateToolShop?.createOrUpdateToolShopData?.message;
        setUpdateToolShopData(updateToolShopDataTemp)
        setTimeout(()=>{
          if (messageVal == "Updated Successfully") {
            message?.success("Successfully updated");
          }
          updateKey = "";
          isApiCallInprogress = false;
          setUpdateToolShopLoad(false);
          getToolShopInprogress();
        }, 800)
    }
  }, [updateToolShopLoad, updateToolShopOnLoad]);

  const updateStatus = (data: any, type: any) => {
    // if(!isApiCallInprogress){
    //     isApiCallInprogress = true;
        typeTemp = type;
        let orderList = [];
        orderList?.push(data?.orderId);
        let orderArr = JSON.stringify(orderList).replace(/"([^(")"]+)":/g, "$1:");
    
        let toolShopData = {
          toolShopId:
            updateToolShopData?.toolShopId != undefined ||
              updateToolShopData?.toolShopId != null
              ? updateToolShopData?.toolShopId
              : "",
          orderId: data?.orderId,
          dieRefId: updateToolShopData?.dieRefId ? updateToolShopData?.dieRefId : null,
          noOfCavity: updateToolShopData?.noOfCavity ? updateToolShopData?.noOfCavity : null, 
          bolsterEntry: updateToolShopData?.bolsterEntry ? updateToolShopData?.bolsterEntry : null, 
          backerEntry: updateToolShopData?.backerEntry ? updateToolShopData?.backerEntry : null,
          specialBackerEntry: updateToolShopData?.specialBackerEntry ? updateToolShopData?.specialBackerEntry : null,
          ringEntry: updateToolShopData?.ringEntry ? updateToolShopData?.ringEntry : null,
          dieSetter: updateToolShopData?.dieSetter ? updateToolShopData?.dieSetter : null,
          weldingChamber: updateToolShopData?.weldingChamber ? updateToolShopData?.weldingChamber :null, 
          remarks: updateToolShopData?.remarks ? updateToolShopData?.remarks : null, 
          processStage: user?.roleId == 1 ? data?.processStage : ""
        };
        let payload = {
          orderId: [orderArr],
          type: type,
          roleData: toolShopData,
        };
        dispatch(updateOrderStatus(payload));
        setupdateStatusLoad(true);
    // }
  };


  useEffect(() => {
    if (updateStatusLoad && !updateStatusOnLoad) {
      getToolShopInprogress();
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
        }
        setCompleteCall(false)
        setHoldCall(false)
        // setType(""); 
        isApiCallInprogress = false;
        setupdateStatusLoad(false);
        getInProgressData()
      }, 800)
    }
  }, [updateStatusLoad, updateStatusOnLoad]);

  const Reassignsetvalue = (data: any) => {
    setReassignOpen(true);
    setSectionNumModal(data?.poNo);
    // const roleData = "PPC DATA";
    // setSectionName(roleData);
  }

  const validateForm = ()=>{
    // toolShopForm.validateFields().then(() =>{
      setReassignCall(true)
      Reassignsetvalue(data)
    // })
  }

  const confirmProcess = (key: string,)=>{
      setCompleteCall(true);
      toolShopForm.validateFields().then(()=>{
          setConfirmOpen(true);
      })
  }

  const closePopup = ()=>{
      setConfirmOpen(false);
      setCompleteCall(false);
      setHoldCall(false)
  }
  
  return (
    <Form
      form={toolShopForm}
      autoComplete="off"
      id="toolShopForm"
      onFinish={() => updateToolShopApi("")}>
      <div className={modalKey!="true" ? "inprogress-expando-collapse-toolshop":"inprogress-expando-collapse-toolshop inprogress-modal-toolshop"}>
        <div className="inprogress-remark-title-text">
          <Row>
            <Col span={3}>
              <div className="inprogress-planned-quenching   ">
                DIE
              </div>
            </Col>
            <Col span={3}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="toolshop-die"
                  rules={[{   required: completeCall, message: "Field is required" }]}
                >
                  <input
                    className="qa-input-number"
                    type="text"
                    // type="number"
                    // min={1}
                    onChange={(e: any) => {
                      setUpdateToolShopData({
                        ...updateToolShopData,
                        dieRefId: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={3}>
              <div className="qa-cutLengthTolerance   ">
                No. of Cavity
              </div>
            </Col>
            <Col span={3}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="toolshop-noOfCavity"
                  rules={[{   required: completeCall, message: "Field is required" }]}
                >
                  <input
                    className="qa-input-number"
                    type="number"
                    min={1}
                    onChange={(e: any) => {
                      setUpdateToolShopData({
                        ...updateToolShopData,
                        noOfCavity: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={3}>
              <div className="qa-PlannedInternalAlloy   ">
                Bolster Entry
              </div>
            </Col>
            <Col span={3}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="toolshop-bolsterEntry"
                  rules={[{   required: completeCall, message: "Field is required" }]}
                >
                  <input
                    className="qa-input-number"
                    // type="number"
                    // min={1}
                    type="text"
                    onChange={(e: any) => {
                      setUpdateToolShopData({
                        ...updateToolShopData,
                        bolsterEntry: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={3}>
              <div className="qa-PlannedFrontEnd   ">
                Backer Entry
              </div>
            </Col>
            <Col span={3}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="toolshop-backerEntry"
                  rules={[{   required: completeCall, message: "Field is required" }]}
                >
                  <input
                    className="qa-input-number"
                    // type="number"
                    // min={1}
                    type="text"
                    onChange={(e: any) => {
                      setUpdateToolShopData({
                        ...updateToolShopData,
                        backerEntry: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={3}>
              <div className="qa-PlannedBackEnd   ">
                Special Backer Entry
              </div>
            </Col>
            <Col span={3}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="toolshop-specialBackerEntry"
                  rules={[{   required: completeCall, message: "Field is required" }]}
                >
                  <input
                    className="qa-input-number"
                    // type="number"
                    // min={1}
                    type="text"
                    onChange={(e: any) => {
                      setUpdateToolShopData({
                        ...updateToolShopData,
                        specialBackerEntry: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={3}>
              <div className="qa-PlannedBackEnd   ">Ring Entry</div>
            </Col>
            <Col span={3}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="toolshop-ringEntry"
                  rules={[{   required: completeCall, message: "Field is required" }]}
                >
                  <input
                    className="qa-input-number"
                    // type="number"
                    // min={1}
                    type="text"
                    onChange={(e: any) => {
                      setUpdateToolShopData({
                        ...updateToolShopData,
                        ringEntry: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={3}>
              <div className="qa-PlannedBackEnd   ">
                Welding Chamber
              </div>
            </Col>
            <Col span={3}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="toolshop-weldingChamber"
                  rules={[{   required: completeCall, message: "Field is required" }]}
                >
                  <input
                    className="qa-input-number"
                    // type="number"
                    // min={1}
                    type="text"
                    // value={updateToolShopData?.weldingChamber}
                    onChange={(e: any) => {
                      setUpdateToolShopData({
                        ...updateToolShopData,
                        weldingChamber: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={3}>
              <div className="qa-PlannedBackEnd   ">Die Setter</div>
            </Col>
            <Col span={3}>
              <div className="inprogress-remark-input-box">
                <Form.Item
                  name="toolshop-dieSetter"
                  rules={[{   required: completeCall, message: "Field is required" }]}
                >
                  <input
                    className="qa-input-number"
                    // type="number"
                    // min={1}
                    type="text"
                    // value={updateToolShopData?.dieSetter}
                    onChange={(e: any) => {
                      setUpdateToolShopData({
                        ...updateToolShopData,
                        dieSetter: e?.target?.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <div className="inprogress-remark-title">Tool Room Remarks</div>
          <Form.Item
            name="toolshop-remarks"
          // rules={[{   required: completeCall, message: "Field is required" }]}
          >
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
        {(modalKey !='true')&&(
        <div className="inprogress-buttons js">
          <div className="inprogress-hold-complete-button js">
            {type === AppConstants?.INPROGRESS && (
              <Button
                className="inprogress-hold-button jc"
                type="primary"
                onClick={() =>{ 
                  setHoldCall(true); 
                  setConfirmOpen(true); 
                  setCompleteCall(false)}
                }
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
                // uniqueId={updateToolShop?.toolShopId}
                getInProgressData={getInProgressData}
                isModalOpen={reassignOpen}
                setIsModalOpen={setReassignOpen}
                sectionNo={sectionNumModal}
                sectionName={"PPC DATA"}
                setReasignToast={setReasignToast}
                reasignToast={reasignToast}
                uniqueId={updateToolShopData?.toolShopId}
                data={data}
                type={type}
                prePopremarks={getToolShopData?.remarks}
                updatedData={updateToolShopData}
                setUpdateForm={setUpdateToolShopData}
                role={3}
                setReassignCall={setReassignCall}
                updateApi={updateToolShopApi}
              />
              Reassign
            </Button>
          </div>
          <div className="inprogress-clear-update-button js">
            <Button
              className="inprogress-clear-button"
              type="default"
              onClick={() => getToolShopInprogress()}
            >
              Clear
            </Button>
            <Button
              className="inprogress-update-button"
              type="primary"
              htmlType="submit"
              onClick={()=>setCompleteCall(false)}
              // disabled={updateToolShopLoad}
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
      {(updateToolShopLoad || updateStatusLoad || getToolShopInprogressLoad) && <SpinLoader loading={true}/>}
      <ConfirmPopup 
          open={confirmOpen}
          setOpen={closePopup}
          content={completeCall ? 
              <>Do you want to complete the process for PO: <b>{data?.poNo}</b> ?</>
              : 
              <>Do you want to move PO: <b>{data?.poNo}</b> to hold?</>
          }
          callback={() => updateStatus(data, (completeCall ? AppConstants?.COMPLETED : AppConstants?.HOLD))} 
          buttonText={completeCall ? "Complete" : "Hold"}     
      />
    </Form>
  );
}
export default ToolShopFormUpdate
