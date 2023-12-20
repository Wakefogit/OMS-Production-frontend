import { Button, Col, Form, Input, message, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppButtons from "../../CustomComponents/AppButton";
import AppConstants from "../../Global/AppConstants";
import AppImages from "../../Global/AppImages";
import { deepCopyFunction } from "../../Global/Helpers";
import { getUser } from "../../localStorage";
import {
  getBundlingSupervisorInprogressDataAction,
  updateBundlingSupervisorDataAction,
  updateOrderStatus,
} from "../Store/Action/jindalAction";
import "./BundlingSupervisorForm.scss";
import { CommonReassignpopup } from "./CommonReassignpopup";
import SpinLoader from "../Common/SpinLoader";
import ConfirmPopup from "../Common/ConfirmPopup";

let statusType = "";
let updateKey = "";
let isApiCallInprogress = false;

const BundlingSupervisorForm = (props: any) => {
  const { data, getInProgressData, type,modalKey } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const jindalReducerState: any = useSelector(
    (state: any) => state.JindalReducerState
  );

  const {
    getBundlingInprogressData,
    getBundlingOnload,
    updateBundlingSupervisorOnLoad,
    updateStatusOnLoad, 
    updateStatusData, 
    updateBundlingSupervisor,
  } = jindalReducerState;
  const getBSData =
    getBundlingInprogressData?.getBundlingSupervisor_inprogressData; //getbundlingsupervisor
  const [bsOnload, setBsOnload] = useState(false);
  const [bsGet, setBsGet] = useState(false); //for get bs
  const [updateBsStatus, setUpdateBsStatus] = useState(false); //for status update
  const [sectionNumModal, setSectionNumModal] = useState<any>(null);
  const [sectionName, setSectionName] = useState<any>("");
  const [reasignToast, setReasignToast] = useState(false);
  const [updateStatusLoad, setupdateStatusLoad] = useState(false);
  const [reAssignCall, setReassignCall] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completeapicall, setCompleteapicall] = useState(false);
  const [holdapicall, setHoldapicall] = useState(false);
  // const [type, setType] = useState("");
  const user = getUser();

  const updateSaveTemp = {
    bundlingSupervisorId: null,
    orderId: null,
    finishQuantity: null,
    piecesPerBundle: null,
    bundleWeight: null,
    noOfBundles: null,
    totalNoOfPieces: null,
    correctionQty: null,
    actualFrontEndCoringLength: null,
    actualBackEndCoringLength: null,
    recovery: null,
    remarks: null,
    isActive: null,
  };

  const [updateForm, setUpdateForm] = useState(
    deepCopyFunction(updateSaveTemp)
  );

  useEffect(() => {
    if (updateBundlingSupervisorOnLoad === false && bsGet === true) {
        setBsGet(false); 
        isApiCallInprogress = false;
        getBundlingSupervisorInprogressData();
    }
  }, [updateBundlingSupervisorOnLoad, bsGet]); // for bs update

  useEffect(() => {
    if (updateStatusOnLoad === false && updateStatusLoad === true) {
      setTimeout(()=>{
        let {Message} = updateStatusData?.updateOrderStatus_withMapping
        if (Message == "Updated Successfully" ){
            message?.success(
              statusType === AppConstants?.COMPLETED
                ? "Successfully Completed"
                : "Order Holded Successfully"
            );
        }
        getInProgressData();
        // setType("");
        isApiCallInprogress = false;
        setupdateStatusLoad(false);
      }, 800)
    }
  }, [updateStatusOnLoad, updateStatusLoad]);

  const formSubmit = (data: any, key: any) => {
    // if(!isApiCallInprogress){
    //   isApiCallInprogress = true
    updateKey = key;
      let payload = {
        bundlingSupervisorId: getBSData?.bundlingSupervisorId != undefined ||
          getBSData?.bundlingSupervisorId != null
          ? getBSData?.bundlingSupervisorId
          : "",
        orderId: data?.orderId,
        finishQuantity: updateForm?.finishQuantity,
        piecesPerBundle: updateForm?.piecesPerBundle,
        bundleWeight: updateForm?.bundleWeight,
        noOfBundles: updateForm?.noOfBundles,
        totalNoOfPieces: updateForm?.totalNoOfPieces,
        correctionQty: updateForm?.correctionQty,
        actualFrontEndCoringLength: updateForm?.actualFrontEndCoringLength,
        actualBackEndCoringLength: updateForm?.actualBackEndCoringLength,
        recovery: updateForm?.recovery != 'NaN' ? updateForm?.recovery : "",
        remarks: updateForm?.remarks,
        isActive: 1,
      };
      dispatch(updateBundlingSupervisorDataAction(payload));
      setBsGet(true);
    // }
  };

  useEffect(() => {
    let recovery = (updateForm?.finishQuantity / getBSData?.pushOnBilletLength)*100;
    form?.setFieldsValue({
      ["recovery"]: recovery.toFixed(4)
    })
    setUpdateForm({
      ...updateForm,
      recovery: recovery.toFixed(4),
    });
  }, [updateForm?.finishQuantity])

  const checkValue = (value: any)=>{
    let valueTemp = String(value);
    if(valueTemp && valueTemp != "null" && value != undefined){
      return value
    }
    else{
      return null
    }
  }
  
  const updateStatusDataApi = (type: any) => {
      let orderList = [];
      orderList?.push(data?.orderId);
      let orderArr = JSON.stringify(orderList).replace(/"([^(")"]+)":/g, "$1:");
      let bsStatusData = {
        bundlingSupervisorId: getBSData?.bundlingSupervisorId != undefined ||
          getBSData?.bundlingSupervisorId != null
          ? getBSData?.bundlingSupervisorId
          : "",
        orderId: data?.orderId,
        finishQuantity: checkValue(updateForm?.finishQuantity), 
        piecesPerBundle: checkValue(updateForm?.piecesPerBundle),
        bundleWeight: checkValue(updateForm?.bundleWeight),
        noOfBundles: checkValue(updateForm?.noOfBundles),
        totalNoOfPieces: checkValue(updateForm?.totalNoOfPieces),
        correctionQty: checkValue(updateForm?.correctionQty),
        actualFrontEndCoringLength: checkValue(updateForm?.actualFrontEndCoringLength),
        actualBackEndCoringLength: checkValue(updateForm?.actualBackEndCoringLength),
        recovery: updateForm?.recovery != 'NaN' ? updateForm?.recovery : null,
        remarks: checkValue(updateForm?.remarks),
        isActive: 1,
        processStage: user?.roleId == 1 ? data?.processStage : ""
      };
      let payload = {
        orderId: [orderArr],
        type: type,
        roleData: bsStatusData,
      };
      dispatch(updateOrderStatus(payload));
      setupdateStatusLoad(true);
  };

  useEffect(() => {
    if (bsGet && !updateBundlingSupervisorOnLoad && updateKey == '') {
      setTimeout(() =>{
        if (updateBundlingSupervisor?.createOrUpdateBundlingSupervisor?.message ==="Updated Successfully") {
          message?.success("Updated Successfully");
        }
        setUpdateBsStatus(false);
        updateKey = '';
        // getInProgressData()
        getBundlingSupervisorInprogressData()
      }, 800)
    }
  }, [bsGet, updateBundlingSupervisorOnLoad]);

  // useEffect(() => {
  //   // if (data?.isExpanded === true) {
  //     getBundlingSupervisorInprogressData();
  //   // }
  // }, [data?.isExpanded])

  const getBundlingSupervisorInprogressData = () => {
    let payload = {
      orderId: data?.orderId,
    };
    dispatch(getBundlingSupervisorInprogressDataAction(payload));
    setBsOnload(true);
  };

  useEffect(() =>{
    if(modalKey){
      getBundlingSupervisorInprogressData()
    }
  }, [modalKey])

  const updateStatus = (type: any) => {
    statusType = type;
    form
      .validateFields()
      .then(() => {
        updateStatusDataApi(type);
      })
      .catch(() => {
        console.log("Error occur in type");
      });
  };

  const prePopulateBSTable = () => {
    form?.setFieldsValue({
      ["finish-quantity"]: getBSData?.finishQuantity,
      ["pcs-per-bundle"]: getBSData?.piecesPerBundle,
      ["bundle-weight"]: getBSData?.bundleWeight,
      ["no-of-bundle"]: getBSData?.noOfBundles,
      ["no-of-pcs"]: getBSData?.totalNoOfPieces,
      ["correction-qty"]: getBSData?.correctionQty,
      ["actual-front-len"]: getBSData?.actualFrontEndCoringLength,
      ["actual-back-len"]: getBSData?.actualBackEndCoringLength,
      ["recovery"]: getBSData?.recovery,
      ["remarks"]: getBSData?.remarks,
    });
    setUpdateForm({
      ...getBSData,
    });
  };

  useEffect(() => {
    form.resetFields()
    if (getBSData) {
      prePopulateBSTable();
      setBsOnload(false)
    }
  }, [getBSData]);

  const clearData = () => {
    form.resetFields();
    setUpdateForm(updateSaveTemp)
    getBundlingSupervisorInprogressData();
  };
  const Reassignsetvalue = (data: any) => {
    setSectionNumModal(data?.poNo);
    // const roleData = "Opertor Entry DATA";
    // setSectionName(roleData);
  };

  const reAssignFun = ()=>{
    // form.validateFields().then(()=>{
      setReassignCall(true);
    // })
  }

  const formView = () => {
    return (
      <div className={modalKey != "true" ? "form-view-container":"form-view-container form-view-model-container"}>
        <Row gutter={20}>
          <Col span={6}>
            <div className="form-field-container">
              <div className="form-text  ">Finish Quantity (kgs)</div>
              <div>
                <Form.Item
                  name="finish-quantity"
                  rules={[
                    {
                        required: completeapicall,
                      message: "Field is required",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={0.0001}
                    step={0.0001}
                    onChange={(e: any) => {
                      setUpdateForm({
                        ...updateForm,
                        finishQuantity: e?.target?.value,
                      });
                    }}
                    className="input-field"
                    placeholder=""
                  />
                </Form.Item>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="form-field-container">
              <div className="form-text  ">No of Pcs Per Bundle</div>
              <div>
                <Form.Item
                  name="pcs-per-bundle"
                  rules={[
                    {
                        required: completeapicall,
                      message: "Field is required",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={1}
                    onChange={(e: any) => {
                      setUpdateForm({
                        ...updateForm,
                        piecesPerBundle: e?.target?.value,
                      });
                    }}
                    className="input-field"
                    placeholder=""
                  />
                </Form.Item>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="form-field-container">
              <div className="form-text  ">Bundle Weight (Kg)</div>
              <div>
                <Form.Item
                  name="bundle-weight"
                  rules={[
                    {
                        required: completeapicall,
                      message: "Field is required",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={0.0001}
                    step={0.0001}
                    onChange={(e: any) => {
                      setUpdateForm({
                        ...updateForm,
                        bundleWeight: e?.target?.value,
                      });
                    }}
                    className="input-field"
                    placeholder=""
                  />
                </Form.Item>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="form-field-container">
              <div className="form-text  ">No. of Bundles</div>
              <div>
                <Form.Item
                  name="no-of-bundle"
                  rules={[
                    {
                        required: completeapicall,
                      message: "Field is required",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={1}
                    onChange={(e: any) => {
                      setUpdateForm({
                        ...updateForm,
                        noOfBundles: e?.target?.value,
                      });
                    }}
                    className="input-field"
                    placeholder=""
                  />
                </Form.Item>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="form-field-container">
              <div className="form-text  ">Total No. of Pcs</div>
              <div>
                <Form.Item
                  name="no-of-pcs"
                  rules={[
                    {
                        required: completeapicall,
                      message: "Field is required",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={1}
                    onChange={(e: any) => {
                      setUpdateForm({
                        ...updateForm,
                        totalNoOfPieces: e?.target?.value,
                      });
                    }}
                    className="input-field"
                    placeholder=""
                  />
                </Form.Item>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="form-field-container">
              <div className="form-text  ">Correction Qty (kgs)</div>
              <div>
                <Form.Item
                  name="correction-qty"
                  rules={[
                    {
                        required: completeapicall,
                      message: "Field is required",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={0.0001}
                    step={0.0001}
                    onChange={(e: any) => {
                      setUpdateForm({
                        ...updateForm,
                        correctionQty: e?.target?.value,
                      });
                    }}
                    className="input-field"
                    placeholder=""
                  />
                </Form.Item>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="form-field-container">
              <div className="form-text  ">
                Actual Front end coring length (mm)
              </div>
              <div>
                <Form.Item
                  name="actual-front-len"
                  rules={[
                    {
                        required: completeapicall,
                      message: "Field is required",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={0.0000}
                    step={0.0001}
                    onChange={(e: any) => {
                      setUpdateForm({
                        ...updateForm,
                        actualFrontEndCoringLength: e?.target?.value,
                      });
                    }}
                    className="input-field"
                    placeholder=""
                  />
                </Form.Item>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="form-field-container">
              <div className="form-text  ">
                Actual Back end coring length (mm){" "}
              </div>
              <div>
                <Form.Item
                  name="actual-back-len"
                  rules={[
                    {
                        required: completeapicall,
                      message: "Field is required",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={0.0000}
                    step={0.0001}
                    onChange={(e: any) => {
                      setUpdateForm({
                        ...updateForm,
                        actualBackEndCoringLength: e?.target?.value,
                      });
                    }}
                    className="input-field"
                    placeholder=""
                  />
                </Form.Item>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="form-field-container">
              <div className="form-text  ">Recovery(Calculated)</div>
              <div>
                <Form.Item
                  name="recovery"
                  rules={[
                    {
                        required: completeapicall,
                      message: "Field is required",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    // readOnly
                    disabled={true}
                    // onChange={(e: any) => {
                    //   setUpdateForm({
                    //     ...updateForm,
                    //     recovery: e?.target?.value,
                    //   });
                    // }}
                    className="input-field"
                    placeholder=""
                  />
                </Form.Item>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div>
              <div className="form-text">Bundling Remarks</div>
              <div>
                <Form.Item
                  name="remarks"
                // rules={[
                //   {
                //       required: completeapicall,
                //     message: "Field is required",
                //   },
                // ]}
                >
                  <TextArea
                    onChange={(e: any) => {
                      setUpdateForm({
                        ...updateForm,
                        remarks: e?.target?.value,
                      });
                    }}
                    className="border-size"
                    placeholder=""
                  />
                </Form.Item>
              </div>
            </div>
          </Col>
        </Row>
        {modalKey !="true" &&(
        <div className="button-container">
          <div className="d-flex">
            {type === AppConstants?.INPROGRESS && <Button
              className="hold-container "
              onClick={() =>{ setHoldapicall(true); setConfirmOpen(true); setCompleteapicall(false)}}
            >
              <img src={AppImages?.holdIcon} className="mr-10" />
              <div className="status-text">Hold</div>
            </Button>
            }
            <Button
              className="complete-container ml-15 jc"
              type="default"
              onClick={() => confirmProcess('complete')}
            >
              <img src={AppImages?.completedIcon} className="mr-10" />
              <div className="status-text">Complete</div>
            </Button>
            <Button
              htmlType="submit"
              onClick={() =>reAssignFun()}
              className="assign-container ml-15 jc"
            >
              <img src={AppImages?.reAssignIcon} className="mr-10" />
              <div className="status-text">
                <CommonReassignpopup
                  type={type}
                  getInProgressData={getInProgressData}
                  isModalOpen={reAssignCall}
                  setIsModalOpen={setReassignCall}
                  sectionNo={sectionNumModal}
                  sectionName={"Operator Entry DATA"}
                  setReasignToast={setReasignToast}
                  reasignToast={reasignToast}
                  data={data}
                  prePopremarks={getBSData?.remarks}
                  updatedData={updateForm}
                  setUpdateForm={setUpdateForm}
                  updateApi={formSubmit}
                  role={6}
                />
                Reassign
              </div>
            </Button>
          </div>
          <div className="d-flex">
            <AppButtons
              className="clear-container"
              text="Clear"
              onClick={() => clearData()}
            />
            <AppButtons
              // disabled={bsGet}
              className="update-container ml-15"
              htmlType="submit"
              text="Update"
              onClick={()=>setCompleteapicall(false)}
            />
          </div>
        </div>
        )}
        {
          modalKey === "true" &&(
            <div className="save-modal-button jf">
              <AppButtons
              // disabled={bsGet}
              className="save-container-modal-button"
              htmlType="submit"
              text="Save"
            />
            </div>
          )
        }
      </div>
    );
  };

  const confirmProcess = (key: string,)=>{
    setCompleteapicall(true);
    form.validateFields().then(()=>{
        setConfirmOpen(true)
        if(key == 'complete'){
        }
        else{
          setHoldapicall(true);
        }
    })
  }

  const closePopup = ()=>{
      setConfirmOpen(false);
      setCompleteapicall(false);
      setHoldapicall(false)
  }

  return (
    <div>
      <Form id="form" form={form} onFinish={() => reAssignCall ? Reassignsetvalue(data) : formSubmit(data, "")}>
        {formView()}
      </Form>
      {(updateStatusLoad || bsGet || bsOnload) && <SpinLoader loading={true}/>}
      <ConfirmPopup 
          open={confirmOpen}
          setOpen={closePopup}
          content={completeapicall ? 
              <>Do you want to complete the process for PO: <b>{data?.poNo}</b> ?</>
              : 
              <>Do you want to move PO: <b>{data?.poNo}</b> to hold?</>
          }
          callback={() => updateStatus(completeapicall ? AppConstants?.COMPLETED : AppConstants?.HOLD)} 
          buttonText={completeapicall ? "Complete" : "Hold"}     
      />
    </div>
  );
}

export default BundlingSupervisorForm;
