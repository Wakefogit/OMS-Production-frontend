import {
  Modal,
  Input,
  Button,
  Alert,
  Space,
  Form,
  message,
  notification,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deepCopyFunction, isArrayNotEmpty } from "../../Global/Helpers";
import { getOperatorEntryInprogressDataAction, getReAssign, getToolShopInprogressDataAction, updateBundlingSupervisorDataAction, updateOperatorEntryDataAction, updateToolShopDataAction } from "../Store/Action/jindalAction";
import "./CommonReassignpopup.scss";
import { getUser } from "../../localStorage";
import AppConstants from "../../Global/AppConstants";

interface DataType{
  isModalOpen: boolean,
  setIsModalOpen: any,
  sectionNo: any,
  sectionName: any,
  uniqueId: string,
  data: any,
  getInProgressData: any,
  type: any, 
  prePopremarks: any, 
  updatedData: any,
  role: number,
  formbillet: any,
  breakdown: any,
  setUpdateForm: any,
  updateQAData: any,
  getQAData: any,
  updateApi: any
}

const CommonReassignpopup: any = (props: DataType) => {
  const {
    isModalOpen,
    setIsModalOpen,
    sectionNo,
    sectionName,
    uniqueId,
    data,
    getInProgressData, type, prePopremarks, 
    updatedData,
    role,
    formbillet,
    breakdown,
    setUpdateForm,
    getQAData,
    updateApi
  } = props;

  const currentUser = getUser();
  const { TextArea } = Input;
  const [toastForm]: any = Form.useForm();
  const [getReasgin, setGetReassign] = useState(false);
  const jindalReducerState: any = useSelector(
    (state: any) => state.JindalReducerState
  );
  const [getOperatorInprogressLoad, setGetOperatorInprogressLoad] = useState(false);
  const { reassignOnload,
          updateOperatorEntryOnLoad,
          updateToolShopOnLoad,
          updateBundlingSupervisorOnLoad,
          updateToolShop,
          updateBundlingSupervisor,
          updateOperatorEntryData,
          updateStatusData
  } = jindalReducerState
  const [reassignLoad, setReassignOnload] = useState(false);
 
  // const {
  //   getOperatorInprogressData,
  // } = jindalReducerState;

  useEffect(() => {
    if(isModalOpen){
      prePopulateReassign()
    }
  }, [isModalOpen])

  const prePopulateReassign = () => {
    toastForm?.setFieldsValue({
      [`reassign-remark`]: updatedData?.remarks,
    });
    setUpdateForm({ ...updatedData, reassignRemarks: updatedData?.remarks })
  }

  const dispatch = useDispatch();

  const getOperatorEntryInprogress = () => {
    let payload = {
      orderId: data?.orderId,
    };
    dispatch(getOperatorEntryInprogressDataAction(payload));
    setGetOperatorInprogressLoad(true);
  };

  useEffect(() => {
    if (reassignLoad === true && updateOperatorEntryOnLoad === false 
      && updateToolShopOnLoad == false && updateBundlingSupervisorOnLoad === false) {
      setReassignOnload(false);
      reAssignApi();
    }
  }, [reassignLoad, updateOperatorEntryOnLoad, updateToolShopOnLoad, updateBundlingSupervisorOnLoad ]);

  const reAssignApi = () => {
    let user = getUser();
    try {
      let payloadKeys = ["plannedQuenching","plannedInternalAlloy","frontEndCoringLength","backEndCoringLength","cut_len_tolerance_upper","cut_len_tolerance_lower"];
      // let trackObjectKeys = ["plannedQuenching", "plannedInternalAlloy", "frontEndCoringLength", "backEndCoringLength", "cutLengthToleranceUpper", "cutLengthToleranceLower"]
      let payload: any = {
        type: type,
        processStage: user?.roleId == 1 ? data?.processStage : "",
        uniqueKey: role === AppConstants.roleIds.bundelingSp ? (updateBundlingSupervisor?.createOrUpdateBundlingSupervisor?.uniqueKey)
          : role === AppConstants.roleIds.toolShop ? (updateToolShop?.createOrUpdateToolShopData?.uniqueKey)
            : role === AppConstants.roleIds.operator ? (updateOperatorEntryData?.createOrUpdateOperatorEntryData?.uniqueKey)
              : role === AppConstants.roleIds.QA ? (uniqueId ? uniqueId : '')
                : "",
        orderId: data?.orderId,
        remarks: updatedData?.reassignRemarks,
        workFlowId: data?.workFlowId,
      };
      // (getQAData || {}).plannedQuenchingData = getQAData?.plannedQuenching;
      // delete getQAData?.plannedQuenching;
      if(currentUser?.roleId == 4){
        for(let key in updatedData){
          if(key == 'remarks'){
            payload[key] = updatedData['reassignRemarks'];
          }
          else{
            payload[key] = updatedData[key];
          }
        }
        if(payload["cutLengthToleranceUpper"] !== undefined){
          payload["cut_len_tolerance_upper"] = payload["cutLengthToleranceUpper"];
          delete payload["cutLengthToleranceUpper"];
        }
        if(payload["cutLengthToleranceLower"] !== undefined){
          payload["cut_len_tolerance_lower"] = payload["cutLengthToleranceLower"];
          delete payload["cutLengthToleranceLower"];
        }
      }else{
        for(let key of payloadKeys){
          payload[key] = null;
        }
      }
      dispatch(getReAssign(payload));
      setGetReassign(true)
      } catch (error) {
        console.log("Error in reAssignApi::", error)
      }
  };

  useEffect(() => {
    if (getReasgin && !reassignOnload) {
        prePopulateReassign();
        getInProgressData();
        success();
        setGetReassign(false)
        getOperatorEntryInprogress();
    }
  }, [getReasgin, reassignOnload])

  const handleCancel = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 0);
  };

  const success = () => {
    const option = {
      content:
        'PO No "' + sectionNo + '"has been assigned to "' + sectionName + '"',
      duration: 3,
      className: "Toast",
    };
    message.success(option);
  };

  // useEffect(() => {
  //   if (updateBsStatus === true && updateBundlingSupervisorOnLoad === false) {
  //     reAssignApi();
  //   }
  // }, [updateBsStatus, updateBundlingSupervisorOnLoad]);


  const handleReassignButton = () => {
    if(!reassignLoad && !getReasgin){
      setIsModalOpen(false);
      if (role === 5 || role === 6) {
        updateApi(data, "reassign");
        setReassignOnload(true);
      }
      else if (role === 3) {
        updateApi("reassign")
        setReassignOnload(true);
      }
      else {
        reAssignApi();
      }
    }
  };

  return (
    <Modal
      className="commonReassignModalContainer"
      open={isModalOpen}
      onOk={() => setIsModalOpen(true)}
      onCancel={() => handleCancel()} // setIsModalOpen(false)}
      closable={false}
      footer={false}
    >
      <Form
        form={toastForm}
        id="toastForm"
        onFinish={() => handleReassignButton()}
      >
        <div className="reassign">
          <div className="reassign-heading">
            Do you want to reassign the selected PO No: <span className="sectionName">{data?.poNo}</span>
            <br></br>
            to <span>{sectionName}</span>?
          </div>
          <div className="reassign-remark required-field"> Add Remarks</div>
          <div className="remarks">
            <Form.Item
              name="reassign-remark"
              rules={[{ required: true, message: "Field is required" }]}
            >
              <TextArea
                maxLength={5000}
                // value={value}
                onChange={(e: any) => setUpdateForm({ ...updatedData, reassignRemarks: e?.target?.value })}
                placeholder="Add your Remarks.."
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </div>
          <div className="Reassign-buttons jf-end">
            <Button
              className="Reassign-Cancel-button"
              onClick={() => handleCancel()} // setIsModalOpen(false)}
              type="default"
            >
              Cancel
            </Button>
            <Button
              className="Reassign-Confirm-button"
              type="primary"
              htmlType="submit"
            >
              Reassign
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export { CommonReassignpopup };
