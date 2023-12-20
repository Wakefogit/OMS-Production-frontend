import React, { useEffect, useState } from "react";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deepCopyFunction,
  isArrayNotEmpty,
} from "../../Global/Helpers";
import AppConstants from "../../Global/AppConstants";
import {
  clearReducerAction,
  commonReferenceDataAction,
  getBundlingSupervisorInprogressDataAction,
  getOperatorEntryInprogressDataAction,
  getPendingListAction,
  getPpcOrderData,
  getQAInprogressDataAction,
  getToolShopInprogressDataAction,
  updateIsExpandedOnGetPendingList,
  updateOrderStatus,
} from "../Store/Action/jindalAction";
import { getUser } from "../../localStorage";
import AppImages from "../../Global/AppImages";
import moment from "moment";
import TopMenuAndSider from "../SubComponents/Top_Menu";
import JindalSubMenu from "../SubComponents/jindalSubMenu";
import CommonPagination from "../SubComponents/commonPagination";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Skeleton,
  Table,
  TimePicker,
} from "antd";
import FormUpdate from "../Common/FormUpdate";
import ToolShopFormUpdate from "../SubComponents/ToolShopFormUpdate";
import QaFormUpdates from "../SubComponents/QaFormUpdate";
import BundlingSupervisorForm from "../SubComponents/BundlingSupervisorForm";
import OperatorEntryFormUpdate from "../Common/OperatorEntryFormUpdate";
import dayjs from "dayjs";

let isfilterInprogress = false;
let height: any = 0;
function NewInProgress() {
  const dispatch = useDispatch();
  const [filterMenu, setFilterMenu] = useState(false);
  const [picking, setPicking] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const { Column, ColumnGroup } = Table;
  const { Option } = Select;
  const jindalReducerState = useSelector(
    (state: any) => state.JindalReducerState
  );
  const {
    inprogressdata,
    updateStatusOnLoad,
    getPendingOnLoad,
    plannedQuenchingData,
    ExtrusionLengthUnitData,
    pressAllocationData
  } = jindalReducerState;
  const getOrderData = inprogressdata?.getOrderData?.orderData;
  const getOrderDataPage = inprogressdata?.getOrderData?.page;
  const [updateStatus, setUpdateStatus] = useState(false);
  const [assignToMe, setAssignToMe] = useState(false);
  const [checkRecords, setCheckRecords]: any = useState([]);
  const [reasignToast, setReasignToast] = useState(false);
  const [expandedRowkey, setExpandedRowkey] = useState<any>([]);
  const [form]: any = Form.useForm();
  const [tableHeight, setTableHeight] = useState(0);
  const [isExpand, setIsExpand] = useState(false);
  const pendingListFilter = {
    ffromDate: "",
    ftoDate: "",
    fstatusOrWeightage: null,
    fpress: null,
    fpo: "",
    fcustomer_name: "",
    fso: "",
    fpo_qty: "",
    fAlloyTemper: "",
    fextruded_qty: "",
    fbalance_po_qty: "",
    fmarketing_remarks: "",
    fcut_len: "",
    fplantSelected: "",
    fpressAllocation: null,
    fplannedQty: "",
    fplannedInternalAlloy: "",
    fplannedNoOfBilletAndLength: "",
    fproductionRateRequired: "",
    fplannedQuenching: null,
    ffrontEndCoringLength: "",
    fbackEndCoringLength: "",
    fplantExtrusionLength: "",
    fextrusionLengthRefId: null,
    fplannedButtThickness: "",
    fcutBilletsRefId: null,
    fbuttWeightPerInch: "",
    fpriority: null,
    fppcRemarks: "",
    fdieRefId: "",
    fnoOfCavity: "",
    fbolsterEntry: "",
    fbackerEntry: "",
    fspecialBackerEntry: "",
    fringEntry: "",
    fdieSetter: "",
    fweldingChamber: "",
    ftoolShopRemarks: "",
    fqaRemarks: "",
    fdieTrialRefId: null,
    fdieWithAluminiumRefId: null,
    fpreviousDayDie_continueRefId:  null,
    fbatchNo: "",
    factualInternalAlloy: "",
    fstartTime: "",
    fendTime: "",
    fprocessTime: "",
    fnoOfBilletAndLength: "",
    factualButtThickness: "",
    fbreakThroughPressure: "",
    fpushOnBilletLength: "",
    fpushQtyInKgs: "",
    factualProductionRate: "",
    fbuttWeightInKgs: "",
    fdiefailRefId: null,
    fdieFailureReason: "",
    fbreakDown: "",
    fbreakDownDuration: "",
    flogEndScrapLengthInMm: "",
    flogEndScrapInKgs: "",
    foperatorName: "",
    foperatorEntryRemarks: "",
    ffinishQuantity: "",
    fpiecesPerBundle: "",
    fbundleWeight: "",
    fnoOfBundles: "",
    ftotalNoOfPieces: "",
    fcorrectionQty: "",
    factualFrontEndCoringLength: "",
    factualBackEndCoringLength: "",
    frecovery: "",
    fbundlingSupervisorRemarks: "",
    fsectionNo: ""
};
  let workFlowIds = AppConstants.workFlowIds;

  const [pendingFilter, setPendingFilter] = useState(
    deepCopyFunction(pendingListFilter)
  );

  const selectAll = (data: any) => {
    if (data?.target?.checked == false) {
      setCheckRecords([]);
    } else {
      let checked: any = [];
      {
        (getOrderData || []).map((item: any, index: any) => {
          checked.push(item);
        });
      }
      setCheckRecords([...checked]);
    }
  };

  const ExtrusionLengthUnitReferenceData = () => {
    let payload = {
        name: "Extrusion Length Unit"
    };
    dispatch(commonReferenceDataAction(payload))
}


const getPressallocation = ()=>{
  let payload = {
      name: "Press Allocation"
  }
  dispatch(commonReferenceDataAction(payload));
}

  const plannnedQuenchingReferenceDataApi = () => {
      let payload = {
          name: "Planned Quenching"
      };
      dispatch(commonReferenceDataAction(payload));
  }

  const selectOrder = (data: any, item: any) => {
    if (data?.target?.checked == false) {
      setCheckRecords(
        checkRecords.filter((x: any) => x?.orderId != item?.orderId)
      );
    } else {
      setCheckRecords([...checkRecords, item]);
    }
  };

  const checkIsCompleted = (record: any, index: any)=>{
    return ((index == 0) && ((record?.workFlowId >= 4 && (record?.workFlowId != 2)) && user?.roleId == 2))
      || ((index == 0) && ((record?.workFlowId >= 7 && (record?.workFlowId != 5)) && user?.roleId == 3))
      || ((index == 0) && ((record?.workFlowId >= 10 && (record?.workFlowId != 8)) && user?.roleId == 4))
      || ((index == 0) && ((record?.workFlowId >= 13 && (record?.workFlowId != 11)) && user?.roleId == 5))
      || ((index == 0) && ((record?.workFlowId >= 16 && (record?.workFlowId != 14)) && user?.roleId == 6))
  }

  const updatePendingDataStatus = (item: any) => {
    let pickedOrders = [];

    if (checkRecords.length > 0) {
      for (let pickedOrderObj of checkRecords) {
        pickedOrders.push(pickedOrderObj.orderId);
      }
    }
    // else if(checkRecords.length == 0){
    //     message.warning("Atleast have to tick one",3)
    //     setAssignToMe(false)
    // }
    else {
      pickedOrders.push(item.orderId);
    }

    let data = JSON.stringify(pickedOrders).replace(/"([^(")"]+)":/g, "$1:");

    let payload = {
      orderId: data,
      type: AppConstants.PICK,
      roleData: "",
    };
    dispatch(updateOrderStatus(payload));
    setUpdateStatus(true);
    setCheckRecords([]);
  };

  useEffect(() => {
    if (!updateStatusOnLoad && updateStatus) {
      getPendingListApi(limit, offset);
      setUpdateStatus(false);
      message.success("Successfully Picked");
      setAssignToMe(false);
    }
  }, [updateStatus, updateStatusOnLoad]);

  const getData = ()=>{
    getPendingListApi(limit, offset);
  }

  // useEffect(() => {
  //     if (!updateStatusOnLoad && assignToMe) {
  //         getPendingListApi()
  //         setAssignToMe(false)
  //         message.success("Success")
  //     }
  // }, [assignToMe,updateStatusOnLoad])

  useEffect(() => {
    if (assignToMe) {
      updatePendingDataStatus(null);
      setAssignToMe(false);
    }
  }, [assignToMe]);

  // useEffect(() => {
  //     if(checkRecords == true){
  //         setCheckRecords([]);
  //     }
  // },checkRecords)
  // const Toast=(data:any)=>{
  //     setSectionNumModal(data?.sectionNo)
  //     setSectionName(data?.processStage);
  // }
  // Toast();

  // const [limit, setPageLimit] = useState(10);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [pendingListLoad, setPendingListLoad] = useState(false);
  const [checkRecordsList, setCheckRecordsList] = useState(true);
  const user = getUser();

  const getPendingListApi = (limitVal: number, offsetVal: number) => {
    let date = new Date(pendingFilter?.fOrderDate);
    let payload = {
      type: AppConstants.INPROGRESS,
      ...pendingFilter,
      key: "inprogressdata",
      paging: {
        limit: limitVal,
        offset: isfilterInprogress ? 0 : offsetVal,
      },
    };
    dispatch(getPendingListAction(payload));
    setPendingListLoad(true);
  };

  const commonReferenceForProcessStage = () => {
    const payload: any = {
      name: AppConstants?.ProcessStage,
    };
    dispatch(commonReferenceDataAction(payload));
  };

  useEffect(() => {
    if (pendingListLoad && !getPendingOnLoad) {
      setPendingListLoad(false);
      isfilterInprogress = false;
      if (getOrderData == undefined) {
        setCheckRecordsList(false);
      }
    }
  }, [pendingListLoad, getPendingOnLoad]);

  const clearFilter = () => {
    isfilterInprogress = true;
    form?.resetFields();
    setPendingFilter(pendingListFilter);
  };

  const closeFilter = () => {
    isfilterInprogress = true;    form?.resetFields();
    setPendingFilter(pendingListFilter);
    setFilterMenu(false);
  };

  useEffect(() => {
    // getPendingListApi();
    user?.roleId == 1 && commonReferenceForProcessStage();
    setCheckRecords([]);
    plannnedQuenchingReferenceDataApi();
    ExtrusionLengthUnitReferenceData();
    getPressallocation();
    let doc: any = document.getElementById('root');
    // let topMenu = document.getElementsByClassName('top_menu_container'); 
    height = doc?.clientHeight ;
    setTableHeight(height);
    return() => {
      dispatch(clearReducerAction({key: "inprogressdata"}))
    }
  }, []);

  const handlePagination = (offsetVal: any, pagesize: any) => {
    getPendingListApi(pagesize, offsetVal);
    setLimit(pagesize)
    setOffset(offset)
  }

  useEffect(() => {
    let filterFilterApplied = JSON.stringify(pendingFilter) != JSON.stringify(pendingListFilter);
   let debounce = setTimeout(() => {
    getPendingListApi(limit, offset);
      setCheckRecords([]);
    }, (filterFilterApplied ? 500 : 0));
    return ()=>{
      clearTimeout(debounce)
    }
  }, [pendingFilter, limit, offset]);
  
  const setFilterData = (value: unknown, key: string)=>{
    isfilterInprogress = true;
     setPendingFilter({...pendingFilter, [key]: value})
  }

  const getDataApis = (record: any)=>{
    let payload = {
      orderId: record?.orderId,
    };
    if(record?.workFlowId == workFlowIds.PPCInprogress){
      dispatch(getPpcOrderData(payload));
    }
    else if(record?.workFlowId == workFlowIds.ToolShopInprogress){
      dispatch(getToolShopInprogressDataAction(payload));
    }
    else if(record?.workFlowId == workFlowIds.QAInprogress){
      dispatch(getQAInprogressDataAction(payload));
    }
    else if(record?.workFlowId == workFlowIds.OperatorEntryInprogress){
      dispatch(getOperatorEntryInprogressDataAction(payload));
    }
    else{
      dispatch(getBundlingSupervisorInprogressDataAction(payload));
    }
  }

  const checkValueExist = (value: any)=>{
    if(value != null && value != ""  
    && value != undefined && value != 'null')
    {
      return <div title={value} className="text-ellipse"> {value} </div>
    }
    else{
      return '-'
    }
  }

  let skeletonList = [1, 2, 3, 4, 5, 6, 7, 8];
  const pendingTable = () => {
    const user = getUser();

    const filterColumns : any=
    user?.roleId === 2
      ? [
        {
          title: (
            <div className="jc">
              <img
                src={AppImages?.filterIcon}
                onClick={() => setFilterMenu(!filterMenu)}
              />
              <div className="table-title">PO No.</div>
            </div>
          ),
          dataIndex: "",
          width: 250,
          fixed: "left",
          children: [
            {
              title: (
                <Row
                  gutter={10}
                  className="clear-close-input-inprogress js"
                >
                  <Col
                    span={6}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        background: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 5,
                        borderRadius: 2,
                        width: "100%",
                        color: "black",
                        cursor: "pointer",
                      }}
                      onClick={clearFilter}
                    >
                      Clear
                    </div>
                  </Col>
                  <Col
                    span={4}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    <div
                      style={{
                        background: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 6,
                        borderRadius: 2,
                        width: "100%",
                        cursor: "pointer",
                      }}
                      onClick={() => closeFilter()}
                    >
                      <div
                        className="jc"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          backgroundColor: "#C64040",
                          fontFamily: "Inter-Regular",
                          borderRadius: "50%",
                          color: "#FFFFFF",
                          width: "20px",
                          height: "100%",
                        }}
                      >
                        X
                      </div>
                    </div>
                  </Col>
                  <Col span={14}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      onChange={(e)=> setFilterData(e.target.value, 'fpo')}
                      value={pendingFilter?.fpo}
                    />
                  </Col>
                </Row>
              ),
              fixed: "left",
              width: 250,
              render: (item: any, _: any, index: any) => {
                return (
                 
                    <div className="table-data">
                      {item?.poNo != null ? item?.poNo! : "-"}
                    </div>
                );
              },
            },
          ],
         
        },
        {
          title: <div className="table-title">Customer Name</div>,
          dataIndex: "",
          width: 200,
          fixed: "left",
          align: "center",
          ellipsis: true,
          children: [
            {
              title: (
                <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                   <Input type="search"
                    className="small-input-filter jc"
                    placeholder="Enter"
                    style={{ width: "140px" }}
                    value={pendingFilter?.fcustomer_name}
                    onChange={(e)=> setFilterData(e.target.value, 'fcustomer_name')}
                  />
                </div>
              ),
              fixed: "left",
              width: 200,
              render: (item: any) => {
                return (
                  <div className="table-data">{checkValueExist(item?.customer_name)} </div>
                );
              },
            },
          ],
        },
        {
          title: <div className="table-title">Sales Order No.</div>,
          dataIndex: "",
          width: 200,
          align: "center",
          ellipsis: true,
          children: [
            {
              title: (
                <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                   <Input type="search"
                    className="small-input-filter jc"
                    placeholder="Enter"
                    style={{ width: "140px" }}
                    value={pendingFilter?.fso}
                    onChange={(e)=> setFilterData(e.target.value, 'fso')}
                  />
                </div>
              ),
              width: 200,
              render: (item: any) => {
                return (
                  <div className="table-data">
                    {item?.soNo != null ? item?.soNo : "-"}
                  </div>
                );
              },
            },
          ],
        },
        {
          title: <div className="table-title">Section No.</div>,
          dataIndex: "",
          width: 200,

          align: "center",
          ellipsis: true,
          children: [
            {
              title: (
                <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                   <Input type="search"
                    className="small-input-filter jc"
                    placeholder="Enter"
                    style={{ width: "140px" }}
                    value={pendingFilter?.fsectionNo}
                    onChange={(e)=> setFilterData(e.target.value, 'fsectionNo')}
                  />
                </div>
              ),
              width: 200,
              render: (item: any) => {
                return (
                  <div className="table-data">
                    {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                    {item?.sectionNo != null && item?.sectionNo?.length > 0
                      ? item?.sectionNo
                      : "-"}
                  </div>
                );
              },
            },
          ],
        },
        {
          title: <div className="table-title">Alloy Temper</div>,
          dataIndex: "",
          width: 200,
          align: "center",
          ellipsis: true,
          children: [
            {
              title: (
                <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                   <Input type="search"
                    className="small-input-filter jc"
                    placeholder="Enter"
                    style={{ width: "140px" }}
                    value={pendingFilter?.fAlloyTemper}
                    onChange={(e)=> setFilterData(e.target.value, 'fAlloyTemper')}
                  />
                </div>
              ),
              width: 200,
              render: (item: any) => {
                return (
                  <div className="table-data">
                    {item?.alloyTemper != null &&
                      item?.alloyTemper?.length > 0
                      ? item?.alloyTemper
                      : "-"}
                  </div>
                );
              },
            },
          ],
        },
        {
          title: <div className="table-title">PO Total Quantity</div>,
          width: 200,
          dataIndex: "",

          align: "center",
          ellipsis: true,
          children: [
            {
              title: (
                <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                   <Input type="search"
                    className="small-input-filter jc"
                    placeholder="Enter"
                    style={{ width: "140px" }}
                    value={pendingFilter?.fpo_qty}
                    onChange={(e)=> setFilterData(e.target.value, 'fpo_qty')}
                  />
                </div>
              ),
              width: 200,
              render: (item: any) => {
                return (
                  <div className="table-data">
                    {item?.po_qty != null ? item?.po_qty : "-"}
                  </div>
                );
              },
            },
          ],
        },
        {
          title: <div className="table-title">Extruded Quantity (Kgs)</div>,
          dataIndex: "",
          width: 200,

          align: "center",
          ellipsis: true,
          children: [
            {
              title: (
                <div className="clear-close-input-inprogress js" 
                  style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                   <Input type="search"
                    className="small-input-filter jc"
                    placeholder="Enter"
                    style={{ width: "140px" }}
                    value={pendingFilter?.fextruded_qty}
                    onChange={(e)=> setFilterData(e.target.value, 'fextruded_qty')}
                  />
                </div>
              ),
              width: 200,
              render: (item: any) => {
                return (
                  <div className="table-data">
                    {item?.extruded_qty != null &&
                      item?.extruded_qty?.length > 0
                      ? item?.extruded_qty
                      : "-"}
                  </div>
                );
              },
            },
          ],
        },
        {
          title: <div className="table-title">Balance PO Quantity</div>,
          dataIndex: "",
          width: 200,

          align: "center",
          ellipsis: true,
          children: [
            {
              title: (
                <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                   <Input type="search"
                    className="small-input-filter jc"
                    placeholder="Enter"
                    style={{ width: "140px" }}
                    value={pendingFilter?.fbalance_po_qty}
                    onChange={(e)=> setFilterData(e.target.value, 'fbalance_po_qty')}
                  />
                </div>
              ),
              width: 200,
              render: (item: any) => {
                return (
                  <div className="table-data">
                    {item?.balance_po_qty != null &&
                      item?.balance_po_qty?.length > 0
                      ? item?.balance_po_qty
                      : "-"}
                  </div>
                );
              },
            },
          ],
        },
        {
          title: <div className="table-title">Cut Length</div>,
          dataIndex: "",
          width: 200,
          align: "center",
          ellipsis: true,
          children: [
            {
              title: (
                <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                   <Input type="search"
                    className="small-input-filter jc"
                    placeholder="Enter"
                    style={{ width: "140px" }}
                    value={pendingFilter?.fcut_len}
                    onChange={(e)=> setFilterData(e.target.value, 'fcut_len')}
                  />
                </div>
              ),
              width: 200,
              render: (item: any) => {
                return (
                  <div className="table-data">
                    {item?.cut_len != null && item?.cut_len?.length > 0
                      ? item?.cut_len
                      : "-"}
                  </div>
                );
              },
            },
          ],
        },
        {
          title: (
            <div className="table-title">Cut Length tolerance (mm)</div>
          ),
          dataIndex: "",
          width: 200,
          align: "center",
          ellipsis: true,
          children: [
            {
              title: (
                <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {/*  <Input type="search"
                    className="small-input-filter jc"
                    placeholder="Enter"
                    style={{ width: "140px" }}
                  /> */}
                </div>
              ),
              width: 200,
              render: (item: any) => {
                return (
                  <div className="table-data">
                    {item?.cut_len_tolerance != null &&
                      item?.cut_len_tolerance?.length > 0
                      ? item?.cut_len_tolerance
                      : "-"}
                  </div>
                );
              },
            },
          ],
        },
        {
          title: <div className="table-title">Quantity Tolerance (%)</div>,
          dataIndex: "",
          width: 150,

          align: "center",
          ellipsis: true,
          children: [
            {
              title: (
                <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {/*  <Input type="search"
                    className="small-input-filter jc"
                    placeholder="Enter"
                    style={{ width: "140px" }}
                    onChange={(e)=> setFilterData(e.target.value, 'fcut_len')}

                  /> */}
                </div>
              ),
              width: 150,
              render: (item: any) => {
                return (
                  <div className="table-data">
                    {item?.qty_tolerance != null &&
                      item?.qty_tolerance?.length > 0
                      ? item?.qty_tolerance
                      : "-"}
                  </div>
                );
              },
            },
          ],
        },
        {
          title: <div className="table-title">Priority assignment</div>,
          dataIndex: "",
          width: 200,
          align: "center",
          ellipsis: true,
          children: [
            {
              title: (
                <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Select className="small-input-filter jc"
                    placeholder="Select"
                    style={{ width: "140px" }}
                    onChange={(e)=> setFilterData(e, 'fpriority')}
                    value={pendingFilter?.fpriority}
                  >
                      <Select.Option value={1}> High</Select.Option>
                      <Select.Option value={2}> Medium</Select.Option>
                      <Select.Option value={3}> Low</Select.Option>
                  </Select>
                </div>
              ),
              width: 200,
              render: (item: any) => {
                return (
                  //Immediate
                  <div
                    className={
                      item?.priority == "High"
                        ? "table-data_immediate"
                        : "table-data"
                    }
                  >
                    {item?.priority != null && item?.priority?.length > 0
                      ? item?.priority
                      : "-"}
                  </div>
                );
              },
            },
          ],
        },
        {
          title: <div className="table-title">Marketing remarks</div>,
          dataIndex: "",
          width: 200,

          align: "center",
          ellipsis: true,
          children: [
            {
              title: (
                <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                   <Input type="search"
                    className="small-input-filter jc"
                    placeholder="Enter"
                    style={{ width: "140px" }}
                    value={pendingFilter?.fmarketing_remarks}
                    onChange={(e)=> setFilterData(e.target.value, 'fmarketing_remarks')}
                  />
                </div>
              ),
              width: 200,
              render: (item: any) => {
                return (
                  <div className="table-data">
                    {item?.marketing_remarks != null &&
                      item?.marketing_remarks?.length > 0
                      ? item?.marketing_remarks
                      : "-"}
                  </div>
                );
              },
            },
          ],
        },
        // other columns...
      ]
      : user?.roleId === 3
        ? [
          {
            title: (
              <div className="jc">
                <img
                  src={AppImages?.filterIcon}
                  onClick={() => setFilterMenu(!filterMenu)}
                />
                <div className="table-title">PO No.</div>
              </div>
            ),
            dataIndex: "",
            width: 250,
            fixed: "left",
            children: [
              {
                title: (
                  <Row
                    gutter={10}
                    className="clear-close-input-inprogress js"
                  >
                    <Col
                      span={6}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 5,
                          borderRadius: 2,
                          width: "100%",
                          color: "black",
                          cursor: "pointer",
                        }}
                        onClick={clearFilter}
                      >
                        Clear
                      </div>
                    </Col>
                    <Col
                      span={4}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <div
                        style={{
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 6,
                          borderRadius: 2,
                          width: "100%",
                          cursor: "pointer",
                        }}
                        onClick={() => closeFilter()}
                      >
                        <div
                          className="jc"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            backgroundColor: "#C64040",
                            fontFamily: "Inter-Regular",
                            borderRadius: "50%",
                            color: "#FFFFFF",
                            width: "20px",
                            height: "100%",
                          }}
                        >
                          X
                        </div>
                      </div>
                    </Col>
                    <Col span={14}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        onChange={(e)=> setFilterData(e.target.value, 'fpo')}
                        value={pendingFilter?.fpo}
                      />
                    </Col>
                  </Row>
                ),
                fixed: "left",
                width: 250,
                render: (item: any, _: any, index: any) => {
                  return (
                   
                      <div className="table-data">
                        {item?.poNo != null ? item?.poNo! : "-"}
                      </div>
                  );
                },
              },
            ],
           
          },
          {
            title: <div className="table-title">Customer Name</div>,
            dataIndex: "",
            width: 200,
            fixed: "left",
            ellipsis: true,
            align: "center",
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fcustomer_name}
                      onChange={(e)=> setFilterData(e.target.value, 'fcustomer_name')}
                    />
                  </div>
                ),
                width: 200,
                fixed: "left",
                ellipsis: true, 
                render: (item: any) => {
                  return (
                    <div className="table-data">{checkValueExist(item?.customer_name)} </div>
                  );
                },
              },
            ],

          },
          {
            title: <div className="table-title">Sales Order No.</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fso}
                      onChange={(e)=> setFilterData(e.target.value, 'fso')}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <div className="table-data">
                      {item?.soNo != null ? item?.soNo : "-"}
                    </div>
                  );
                },
              },
            ],

          },
          {
            title: <div className="table-title">Section No.</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fsectionNo}
                      onChange={(e)=> setFilterData(e.target.value, 'fsectionNo')}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <div className="table-data">
                      {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                      {item?.sectionNo != null && item?.sectionNo?.length > 0
                        ? item?.sectionNo
                        : "-"}
                    </div>
                  );
                },
              },
            ],

          },
          {
            title: <div className="table-title">Alloy Temper</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fAlloyTemper}
                      onChange={(e)=> setFilterData(e.target.value, 'fAlloyTemper')}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <div className="table-data">
                      {item?.alloyTemper != null && item?.alloyTemper?.length > 0
                        ? item?.alloyTemper
                        : "-"}
                    </div>
                  );
                },
              },
            ],

          },
          {
            title: <div className="table-title">PO Total Quantity</div>,
            width: 200,
            dataIndex: "",
            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fpo_qty}
                      onChange={(e)=> setFilterData(e.target.value, 'fpo_qty')}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <div className="table-data">
                      {item?.po_qty != null ? item?.po_qty : "-"}
                    </div>
                  );
                },
              },
            ],

          },
          {
            title: <div className="table-title">Extruded Quantity (Kgs)</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fextruded_qty}
                      onChange={(e)=> setFilterData(e.target.value, 'fextruded_qty')}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <div className="table-data">
                      {item?.extruded_qty != null &&
                        item?.extruded_qty?.length > 0
                        ? item?.extruded_qty
                        : "-"}
                    </div>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">Balance PO Quantity(Kgs)</div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fbalance_po_qty}
                      onChange={(e)=> setFilterData(e.target.value, 'fbalance_po_qty')}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <div className="table-data">
                      {item?.balance_po_qty != null &&
                        item?.balance_po_qty?.length > 0
                        ? item?.balance_po_qty
                        : "-"}
                    </div>
                  );
                },
              },
            ],

          },
          {
            title: <div className="table-title">Cut Length</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fcut_len}
                      onChange={(e)=> setFilterData(e.target.value, 'fcut_len')}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <div className="table-data">
                      {item?.cut_len != null && item?.cut_len?.length > 0
                        ? item?.cut_len
                        : "-"}
                    </div>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">Cut Length tolerance (mm)</div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {/*  <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                    /> */}
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <div className="table-data">
                      {item?.cut_len_tolerance != null &&
                        item?.cut_len_tolerance?.length > 0
                        ? item?.cut_len_tolerance
                        : "-"}
                    </div>
                  );
                },
              },
            ],

          },
          {
            title: <div className="table-title">Quantity Tolerance (%)</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {/*  <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}

                    /> */}
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <div className="table-data">
                      {item?.qty_tolerance != null &&
                        item?.qty_tolerance?.length > 0
                        ? item?.qty_tolerance
                        : "-"}
                    </div>
                  );
                },
              },
            ],

          },
          {
            title: <div className="table-title">Priority assignment</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Select className="small-input-filter jc"
                      placeholder="Select"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fpriority}
                      onChange={(e)=> setFilterData(e, 'fpriority')}
                    >
                      <Select.Option value={1}> High</Select.Option>
                      <Select.Option value={2}> Medium</Select.Option>
                      <Select.Option value={3}> Low</Select.Option>
                    </Select>
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    //Immediate
                    <div
                      className={
                        item?.priority == "High"
                          ? "table-data_immediate"
                          : "table-data"
                      }
                    >
                      {item?.priority != null && item?.priority?.length > 0
                        ? item?.priority
                        : "-"}
                    </div>
                  );
                },
              },
            ],

          },
          {
            title: <div className="table-title">Marketing remarks</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fmarketing_remarks}
                      onChange={(e)=> setFilterData(e.target.value, 'fmarketing_remarks')}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <div className="table-data" title={item?.marketing_remarks}>
                      {item?.marketing_remarks != null &&
                        item?.marketing_remarks?.length > 0
                        ? item?.marketing_remarks
                        : "-"}
                    </div>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">{AppConstants.plantSelected}</div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fplantSelected}
                      onChange={(e)=> setFilterData(e.target.value, 'fplantSelected')}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <>
                        <div className="table-data">{checkValueExist(item?.plantSelected)}</div>
                    </>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">
                {AppConstants.pressAllocation}
              </div>
            ),
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Select
                        style={{ width: 140 }}
                        className="submenu-action-menu"
                        placeholder="Select"
                        value={pendingFilter?.fpressAllocation}
                        onChange={(e)=>setFilterData(e, 'fpressAllocation')}
                      >
                        {pressAllocationData?.map((x: any) =>
                        <Option className="submenu-action-option" value={x?.id}>
                            {x?.name}
                        </Option>)}
                      </Select>
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <>
                        <div className="table-data">{checkValueExist(item?.pressAllocation)}</div>
                    </>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">
                {AppConstants.plannedQuantity}
              </div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fplannedQty}
                      onChange={(e) => setFilterData(e.target.value, 'fplannedQty')}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <>
                      <div className="table-data">{checkValueExist(item?.plannedQty)}</div>
                    </>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">
                {AppConstants.plannedInternalAlloy}
              </div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fplannedInternalAlloy}
                      onChange={(e) => setFilterData(e.target.value, 'fplannedInternalAlloy')}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <>
                      <div className="table-data">
                        {checkValueExist(item?.plannedInternalAlloy)}
                      </div>
                    </>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">
                {AppConstants.plannedNoOfBillets}
              </div>
            ),
            dataIndex: "",
            width: 300,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {/*  <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fplannedNoOfBilletAndLength}
                      onChange={(e) => setFilterData(e.target.value, 'fplannedNoOfBilletAndLength')}
                    /> */}
                  </div>
                ),
                width: 300,
                render: (item: any) => {
                  let billetLength: any =
                    item?.plannedNoOfBilletAndLength &&
                    JSON.parse(item?.plannedNoOfBilletAndLength);
                    let billetString = ""
                    {(billetLength || []).map((e: any, index: any) => {
                      billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                    })}  
                    let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                    billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                    return (
                      <>
                        <div
                          className="jfs ellipse-none table-data"
                          style={{ marginLeft: "25px" }}
                          title={billetString}
                        >
                          {isArrayNotEmpty(billetLength) ? billetString : "-"}
                        </div>
                      </>
                    );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">{AppConstants.prodRateReq}</div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fproductionRateRequired}
                      onChange={(e)=> setFilterData(e.target.value, 'fproductionRateRequired')}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <>
                        <div className="table-data">
                          {checkValueExist(item?.productionRateRequired)}
                        </div>
                    </>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">
                {AppConstants.plannedQuenching}
              </div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Select className="small-input-filter jc"
                           placeholder="Select"
                            style={{ width: "140px" }}
                            onChange={(e)=>setFilterData(e, 'fplannedQuenching')}
                            value={pendingFilter?.fplannedQuenching}
                          >
                            {plannedQuenchingData?.map((item: any) => 
                                <Select.Option value={item?.id}> {item?.name}</Select.Option>
                            )}
                        </Select>
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <>
                        <div className="table-data">{checkValueExist(item?.plannedQuenching)}</div>
                    </>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">
                {AppConstants.plannedFrontEndCoringLength}
              </div>
            ),
            dataIndex: "",
            width: 300,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.ffrontEndCoringLength}
                      onChange={(e) => setFilterData(e.target.value, 'ffrontEndCoringLength')}
                    />
                  </div>
                ),
                width: 300,
                render: (item: any) => {
                  return (
                    <>
                        <div className="table-data">
                          {checkValueExist(String(item?.frontEndCoringLength))}
                        </div>
                    </>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">
                {AppConstants.plannedBackEndCoringLength}
              </div>
            ),
            dataIndex: "",
            width: 300,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fbackEndCoringLength}
                      onChange={(e) => setFilterData(e.target.value, 'fbackEndCoringLength')}
                    />
                  </div>
                ),
                width: 300,
                render: (item: any) => {
                  return (
                    <>
                        <div className="table-data">
                          {checkValueExist(String(item?.backEndCoringLength))}
                        </div>
                    </>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">
                {AppConstants.plannedExtrusionLength}
              </div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div style={{ display: "inline-flex", gap: "5px" }}>
                     <Input type="search"  
                      style={{ width: 80 }}
                      value={pendingFilter?.fplantExtrusionLength}
                      onChange={(e) => setFilterData(e.target.value, "fplantExtrusionLength")}
                    />
                    <Select style={{ width: 60 }}
                     placeholder="Select"
                     value={pendingFilter?.fextrusionLengthRefId}
                     onChange={(e) => setFilterData(e, "fextrusionLengthRefId")}
                    >
                        {(ExtrusionLengthUnitData || []).map((item: any) => {
                            return (
                                <Option key={item?.id} value={item?.id}>{item?.name}</Option>
                            )
                        })}
                    </Select>
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <>
                      <div className="table-data">
                      {
                        (item?.plantExtrusionLength && item?.extrusionLength) ? 
                        item?.plantExtrusionLength+" "+item?.extrusionLength
                         : '-'
                        }
                      </div>
                    </>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">
                {AppConstants.plannedButtThickness}
              </div>
            ),
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fplannedButtThickness}
                      onChange={(e) => setFilterData(e.target.value, "fplannedButtThickness")}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <>
                        <div className="table-data">
                          {checkValueExist(item?.plannedButtThickness)}
                        </div>
                    </>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">{AppConstants.cutBillet}</div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Select
                      className="small-input-filter jc"
                      placeholder="Select"
                      style={{ width: "140px" }}
                      onChange={(e) => setFilterData(e, "fcutBilletsRefId")}
                      value={pendingFilter?.fcutBilletsRefId}
                    >
                      <Select.Option value={1}>Yes</Select.Option>
                      <Select.Option value={2}>No</Select.Option>
                    </Select>
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <>
                        <div className="table-data">{checkValueExist(item?.cutBillets)}</div>
                    </>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">
                {AppConstants.buttWeightPerInch}
              </div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      value={pendingFilter?.fbuttWeightPerInch}
                      style={{ width: "140px" }}
                      onChange={(e) => setFilterData(e.target.value, "fbuttWeightPerInch")}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <>
                        <div className="table-data">
                          {checkValueExist(item?.buttWeightPerInch)}
                        </div>
                    </>
                  );
                },
              },
            ],

          },
          {
            title: (
              <div className="table-title">{AppConstants.ppcRemarks}</div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
              {
                title: (
                  <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <Input type="search"
                      className="small-input-filter jc"
                      placeholder="Enter"
                      style={{ width: "140px" }}
                      value={pendingFilter?.fppcRemarks}
                      onChange={(e) => setFilterData(e.target.value, "fppcRemarks")}
                    />
                  </div>
                ),
                width: 200,
                render: (item: any) => {
                  return (
                    <>
                        <div className="table-data">
                          {(item?.ppcRemarks != null &&
                            item?.ppcRemarks?.length > 0)
                            ? item?.ppcRemarks
                            : "-"}
                        </div>
                    </>
                  );
                },
              },
            ],

          },
          // other columns...
        ]
        : user?.roleId === 4
          ? [
            {
              title: (
                <div className="jc">
                  <img
                    src={AppImages?.filterIcon}
                    onClick={() => setFilterMenu(!filterMenu)}
                  />
                  <div className="table-title">PO No.</div>
                </div>
              ),
              dataIndex: "",
              width: 250,
              fixed: "left",
              children: [
                {
                  title: (
                    <Row
                      gutter={10}
                      className="clear-close-input-inprogress js"
                    >
                      <Col
                        span={6}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            background: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 5,
                            borderRadius: 2,
                            width: "100%",
                            color: "black",
                            cursor: "pointer",
                          }}
                          onClick={clearFilter}
                        >
                          Clear
                        </div>
                      </Col>
                      <Col
                        span={4}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {" "}
                        <div
                          style={{
                            background: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 6,
                            borderRadius: 2,
                            width: "100%",
                            cursor: "pointer",
                          }}
                          onClick={() => closeFilter()}
                        >
                          <div
                            className="jc"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              backgroundColor: "#C64040",
                              fontFamily: "Inter-Regular",
                              borderRadius: "50%",
                              color: "#FFFFFF",
                              width: "20px",
                              height: "100%",
                            }}
                          >
                            X
                          </div>
                        </div>
                      </Col>
                      <Col span={14}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          onChange={(e)=> setFilterData(e.target.value, 'fpo')}
                          value={pendingFilter?.fpo}
                        />
                      </Col>
                    </Row>
                  ),
                  fixed: "left",
                  width: 250,
                  render: (item: any, _: any, index: any) => {
                    return (
                     
                        <div className="table-data">
                          {item?.poNo != null ? item?.poNo! : "-"}
                        </div>
                    );
                  },
                },
              ],
             
            },
            {
              title: <div className="table-title">Customer Name</div>,
              dataIndex: "",
              width: 200,
              fixed: "left",
              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fcustomer_name}
                        onChange={(e)=> setFilterData(e.target.value, 'fcustomer_name')}
                      />
                    </div>
                  ),
                  width: 200,
                  fixed: "left",
                  render: (item: any) => {
                    return <div className="table-data">{checkValueExist(item?.customer_name)} </div>;
                  },
                },
              ],
             
            },
            {
              title: <div className="table-title">Sales Order No.</div>,
              dataIndex: "",
              width: 200,
              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fso}
                        onChange={(e)=> setFilterData(e.target.value, 'fso')}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <div className="table-data">
                        {item?.soNo != null ? item?.soNo : "-"}
                      </div>
                    );
                  },
                },
              ],
             
            },
            {
              title: <div className="table-title">Section No.</div>,
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fsectionNo}
                        onChange={(e)=> setFilterData(e.target.value, 'fsectionNo')}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <div className="table-data">
                        {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                        {item?.sectionNo != null && item?.sectionNo?.length > 0
                          ? item?.sectionNo
                          : "-"}
                      </div>
                    );
                  },
                },
              ],
              
            },
            {
              title: <div className="table-title">Alloy Temper</div>,
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fAlloyTemper}
                        onChange={(e)=> setFilterData(e.target.value, 'fAlloyTemper')}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <div className="table-data">
                        {item?.alloyTemper != null && item?.alloyTemper?.length > 0
                          ? item?.alloyTemper
                          : "-"}
                      </div>
                    );
                  },
                },
              ],
             
            },
            {
              title: <div className="table-title">PO Total Quantity</div>,
              width: 200,
              dataIndex: "",

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fpo_qty}
                        onChange={(e)=> setFilterData(e.target.value, 'fpo_qty')}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <div className="table-data">
                        {item?.po_qty != null ? item?.po_qty : "-"}
                      </div>
                    );
                  },
                },
              ],
             
            },
            {
              title: <div className="table-title">Extruded Quantity (Kgs)</div>,
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        value={pendingFilter?.fextruded_qty}
                        style={{ width: "140px" }}
                        onChange={(e)=> setFilterData(e.target.value, 'fextruded_qty')}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <div className="table-data">
                        {item?.extruded_qty != null &&
                          item?.extruded_qty?.length > 0
                          ? item?.extruded_qty
                          : "-"}
                      </div>
                    );
                  },
                },
              ],
             
            },
            {
              title: <div className="table-title">Balance PO Quantity</div>,
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fbalance_po_qty}
                        onChange={(e)=> setFilterData(e.target.value, 'fbalance_po_qty')}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <div className="table-data">
                        {item?.balance_po_qty != null &&
                          item?.balance_po_qty?.length > 0
                          ? item?.balance_po_qty
                          : "-"}
                      </div>
                    );
                  },
                },
              ],
              
            },
            {
              title: <div className="table-title">Cut Length</div>,
              dataIndex: "",
              width: 200,
              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fcut_len}
                        onChange={(e)=> setFilterData(e.target.value, 'fcut_len')}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <div className="table-data">
                        {item?.cut_len != null && item?.cut_len?.length > 0
                          ? item?.cut_len
                          : "-"}
                      </div>
                    );
                  },
                },
              ],
              
            },
            {
              title: (
                <div className="table-title">Cut Length tolerance (mm)</div>
              ),
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      {/*  <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                      /> */}
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <div className="table-data">
                        {item?.cut_len_tolerance != null &&
                          item?.cut_len_tolerance?.length > 0
                          ? item?.cut_len_tolerance
                          : "-"}
                      </div>
                    );
                  },
                },
              ],
             
            },
            {
              title: <div className="table-title">Quantity Tolerance (%)</div>,
              dataIndex: "",
              width: 150,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      {/*  <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                      /> */}
                    </div>
                  ),
                  width: 150,
                  render: (item: any) => {
                    return (
                      <div className="table-data">
                        {item?.qty_tolerance != null &&
                          item?.qty_tolerance?.length > 0
                          ? item?.qty_tolerance
                          : "-"}
                      </div>
                    );
                  },
                },
              ],
              
            },
            {
              title: <div className="table-title">Priority assignment</div>,
              dataIndex: "",
              width: 200,
              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Select className="small-input-filter jc"
                          placeholder="Select"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fpriority}
                          onChange={(e)=> setFilterData(e, 'fpriority')}
                        >
                            <Select.Option value={1}> High</Select.Option>
                            <Select.Option value={2}> Medium</Select.Option>
                            <Select.Option value={3}> Low</Select.Option>
                        </Select>
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      //Immediate
                      <div
                        className={
                          item?.priority == "High"
                            ? "table-data_immediate"
                            : "table-data"
                        }
                      >
                        {item?.priority != null && item?.priority?.length > 0
                          ? item?.priority
                          : "-"}
                      </div>
                    );
                  },
                },
              ],
             
            },
            {
              title: <div className="table-title">Marketing remarks</div>,
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fmarketing_remarks}
                        onChange={(e)=> setFilterData(e.target.value, 'fmarketing_remarks')}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <div className="table-data" title={item?.marketing_remarks}>
                        {item?.marketing_remarks != null &&
                          item?.marketing_remarks?.length > 0
                          ? item?.marketing_remarks
                          : "-"}
                      </div>
                    );
                  },
                },
              ],
             
            },
            {
              title: (
                <div className="table-title">{AppConstants.plantSelected}</div>
              ),
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fplantSelected}
                        onChange={(e)=> setFilterData(e.target.value, 'fplantSelected')}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.plantSelected)}</div>
                      </>
                    );
                  },
                },
              ],
              
            },
            {
              title: (
                <div className="table-title">
                  {AppConstants.pressAllocation}
                </div>
              ),
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Select
                          style={{ width: 140 }}
                          className="submenu-action-menu"
                          placeholder="Select"
                          value={pendingFilter?.fpressAllocation}
                          onChange={(e)=>setFilterData(e, 'fpressAllocation')}
                      >
                          {pressAllocationData?.map((x: any) =>
                          <Option className="submenu-action-option" value={x?.id}>
                              {x?.name}
                          </Option>)}
                        </Select>
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.pressAllocation)}</div>
                      </>
                    );
                  },
                },
              ],
             
            },
            {
              title: (
                <div className="table-title">
                  {AppConstants.plannedQuantity}
                </div>
              ),
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fplannedQty}
                        onChange={(e) => setFilterData(e.target.value, 'fplannedQty')}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.plannedQty)}</div>
                      </>
                    );
                  },
                },
              ],
            
            },
            {
              title: (
                <div className="table-title">
                  {AppConstants.plannedInternalAlloy}
                </div>
              ),
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fplannedInternalAlloy}
                        onChange={(e) => setFilterData(e.target.value, 'fplannedInternalAlloy')}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">
                          {checkValueExist(item?.plannedInternalAlloy)}
                        </div>
                      </>
                    );
                  },
                },
              ],
             
            },
            {
              title: (
                <div className="table-title">
                  {AppConstants.plannedNoOfBillets}
                </div>
              ),
              dataIndex: "",
              width: 300,
              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      {/*  <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fplannedNoOfBilletAndLength}
                        onChange={(e) => setFilterData(e.target.value, 'fplannedNoOfBilletAndLength')}
                      /> */}
                    </div>
                  ),
                  width: 300,
                  render: (item: any) => {
                    let billetLength: any =
                      item?.plannedNoOfBilletAndLength &&
                      JSON.parse(item?.plannedNoOfBilletAndLength);
                      let billetString = ""
                      {(billetLength || []).map((e: any, index: any) => {
                        billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                      })}  
                      let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                      billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                      return (
                        <>
                          <div
                            className="jfs ellipse-none table-data"
                            style={{ marginLeft: "25px" }}
                            title={billetString}
                          >
                            {isArrayNotEmpty(billetLength) ? billetString : "-"}
                          </div>
                        </>
                      );
                  },
                },
              ],
             
            },
            {
              title: (
                <div className="table-title">{AppConstants.prodRateReq}</div>
              ),
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fproductionRateRequired}
                        onChange={(e)=> setFilterData(e.target.value, 'fproductionRateRequired')}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">
                          {checkValueExist(item?.productionRateRequired)}
                        </div>
                      </>
                    );
                  },
                },
              ],
             
            },
            {
              title: (
                <div className="table-title">
                  {AppConstants.plannedQuenching}
                </div>
              ),
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Select className="small-input-filter jc"
                        placeholder="Select"
                        value={pendingFilter?.fplannedQuenching}
                          style={{ width: "140px" }}
                          onChange={(e)=>setFilterData(e, 'fplannedQuenching')}
                        >
                          {plannedQuenchingData?.map((item: any) => 
                              <Select.Option value={item?.id}> {item?.name}</Select.Option>
                          )}
                        </Select>
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.plannedQuenching)}</div>
                      </>
                    );
                  },
                },
              ],
              
            },
            {
              title: (
                <div className="table-title">
                  {AppConstants.plannedFrontEndCoringLength}
                </div>
              ),
              dataIndex: "",
              width: 300,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.ffrontEndCoringLength}
                        onChange={(e) => setFilterData(e.target.value, 'ffrontEndCoringLength')}
                      />
                    </div>
                  ),
                  width: 300,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">
                          {checkValueExist(String(item?.frontEndCoringLength))}
                        </div>
                      </>
                    );
                  },
                },
              ],
            
            },
            {
              title: (
                <div className="table-title">
                  {AppConstants.plannedBackEndCoringLength}
                </div>
              ),
              dataIndex: "",
              width: 300,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fbackEndCoringLength}
                        onChange={(e) => setFilterData(e.target.value, 'fbackEndCoringLength')}
                      />
                    </div>
                  ),
                  width: 300,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">
                          {checkValueExist(String(item?.backEndCoringLength))}
                        </div>
                      </>
                    );
                  },
                },
              ],
              
            },
            {
              title: (
                <div className="table-title">
                  {AppConstants.plannedExtrusionLength}
                </div>
              ),
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div style={{ display: "inline-flex", gap: "5px" }}>
                         <Input type="search"  
                          style={{ width: 80 }}
                          value={pendingFilter?.fplantExtrusionLength}
                          onChange={(e) => setFilterData(e.target.value, "fplantExtrusionLength")}
                        />
                        <Select style={{ width: 60 }}  placeholder="Select"
                            value={pendingFilter?.fextrusionLengthRefId}
                            onChange={(e) => setFilterData(e, "fextrusionLengthRefId")}
                        >
                            {(ExtrusionLengthUnitData || []).map((item: any) => {
                                return (
                                    <Option key={item?.id} value={item?.id}>{item?.name}</Option>
                                )
                            })}
                        </Select>
                      </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">
                        {
                        (item?.plantExtrusionLength && item?.extrusionLength) ? 
                        item?.plantExtrusionLength+" "+item?.extrusionLength
                         : '-'
                        }
                        </div>
                      </>
                    );
                  },
                },
              ],
              
            },
            {
              title: (
                <div className="table-title">
                  {AppConstants.plannedButtThickness}
                </div>
              ),
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fplannedButtThickness}
                        onChange={(e) => setFilterData(e.target.value, "fplannedButtThickness")}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">
                          {checkValueExist(item?.plannedButtThickness)}
                        </div>
                      </>
                    );
                  },
                },
              ],
            
            },
            {
              title: (
                <div className="table-title">{AppConstants.cutBillet}</div>
              ),
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Select
                        className="small-input-filter jc"
                        placeholder="Select"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fcutBilletsRefId}
                        onChange={(e) => setFilterData(e, "fcutBilletsRefId")}
                      >
                        <Select.Option value={1}>Yes</Select.Option>
                        <Select.Option value={2}>No</Select.Option>
                      </Select>
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.cutBillets)}</div>
                      </>
                    );
                  },
                },
              ],
             
            },
            {
              title: (
                <div className="table-title">
                  {AppConstants.buttWeightPerInch}
                </div>
              ),
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fbuttWeightPerInch}
                        onChange={(e) => setFilterData(e.target.value, "fbuttWeightPerInch")}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.buttWeightPerInch)}</div>
                      </>
                    );
                  },
                },
              ],
             
            },
            {
              title: (
                <div className="table-title">{AppConstants.ppcRemarks}</div>
              ),
              dataIndex: "",
              width: 200,
              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fppcRemarks}
                        onChange={(e) => setFilterData(e.target.value, "fppcRemarks")}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">
                          {(item?.ppcRemarks != null &&
                            item?.ppcRemarks?.length > 0)
                            ? item?.ppcRemarks
                            : "-"}
                        </div>
                      </>
                    );
                  },
                },
              ],
             
            },
            {
              title: <div className="table-title">DIE</div>,
              dataIndex: "",
              width: 200,
              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fdieRefId}
                        onChange={(e) => setFilterData(e.target.value, "fdieRefId")}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.die)}</div>
                      </>
                    );
                  },
                },
              ],
             
            },
            {
              title: <div className="table-title">No. of Cavity</div>,
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fnoOfCavity}
                        onChange={(e) => setFilterData(e.target.value, "fnoOfCavity")}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.noOfCavity)}</div>
                      </>
                    );
                  },
                },
              ],
            
            },
            {
              title: <div className="table-title">Bolster Entry</div>,
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fbolsterEntry}
                        onChange={(e) => setFilterData(e.target.value, "fbolsterEntry")}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.bolsterEntry)}</div>
                      </>
                    );
                  },
                },
              ],
             
            },
            {
              title: <div className="table-title">Backer Entry</div>,
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fbackerEntry}
                        onChange={(e) => setFilterData(e.target.value, "fbackerEntry")}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.backerEntry)}</div>
                      </>
                    );
                  },
                },
              ],
             
            },
            {
              title: <div className="table-title">Special Baker Entry</div>,
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fspecialBackerEntry}
                        onChange={(e) => setFilterData(e.target.value, "fspecialBackerEntry")}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.specialBackerEntry)}</div>
                      </>
                    );
                  },
                },
              ],
            
            },
            {
              title: <div className="table-title">Ring Entry</div>,
              dataIndex: "",
              width: 200,
              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fringEntry}
                        onChange={(e) => setFilterData(e.target.value, "fringEntry")}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.ringEntry)}</div>
                      </>
                    );
                  },
                },
              ],
           
            },
            {
              title: <div className="table-title">Welding Chambar</div>,
              dataIndex: "",
              width: 200,
              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fweldingChamber}
                        onChange={(e) => setFilterData(e.target.value, "fweldingChamber")}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.weldingChamber)}</div>
                      </>
                    );
                  },
                },
              ],
              
            },
            {
              title: <div className="table-title">Die Setter</div>,
              dataIndex: "",
              width: 200,

              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        style={{ width: "140px" }}
                        value={pendingFilter?.fdieSetter}
                        onChange={(e) => setFilterData(e.target.value, "fdieSetter")}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                   
                    return (
                      <>
                        <div className="table-data">{checkValueExist(item?.dieSetter)}</div>
                      </>
                    );
                  },
                },
              ],
              
            },
            {
              title: <div className="table-title">Tool Shop Remarks</div>,
              dataIndex: "",
              width: 200,
              align: "center",
              ellipsis: true,
              children: [
                {
                  title: (
                    <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Input type="search"
                        className="small-input-filter jc"
                        placeholder="Enter"
                        value={pendingFilter?.ftoolShopRemarks}
                        style={{ width: "140px" }}
                        onChange={(e) => setFilterData(e.target.value, "ftoolShopRemarks")}
                      />
                    </div>
                  ),
                  width: 200,
                  render: (item: any) => {
                    return (
                      <>
                        <div className="table-data">
                          {item?.toolShopRemarks != null &&
                            item?.toolShopRemarks?.length > 0
                            ? item?.toolShopRemarks
                            : "-"}
                        </div>
                      </>
                    );
                  },
                },
              ],
             
            },
            // other columns...
          ]
          : user?.roleId === 5
            ? [
              {
                title: (
                  <div className="jc">
                    <img
                      src={AppImages?.filterIcon}
                      onClick={() => setFilterMenu(!filterMenu)}
                    />
                    <div className="table-title">PO No.</div>
                  </div>
                ),
                dataIndex: "",
                width: 250,
                fixed: "left",
                children: [
                  {
                    title: (
                      <Row
                        gutter={10}
                        className="clear-close-input-inprogress js"
                      >
                        <Col
                          span={6}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              background: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 5,
                              borderRadius: 2,
                              width: "100%",
                              color: "black",
                              cursor: "pointer",
                            }}
                            onClick={clearFilter}
                          >
                            Clear
                          </div>
                        </Col>
                        <Col
                          span={4}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {" "}
                          <div
                            style={{
                              background: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 6,
                              borderRadius: 2,
                              width: "100%",
                              cursor: "pointer",
                            }}
                            onClick={() => closeFilter()}
                          >
                            <div
                              className="jc"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                backgroundColor: "#C64040",
                                fontFamily: "Inter-Regular",
                                borderRadius: "50%",
                                color: "#FFFFFF",
                                width: "20px",
                                height: "100%",
                              }}
                            >
                              X
                            </div>
                          </div>
                        </Col>
                        <Col span={14}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            onChange={(e)=> setFilterData(e.target.value, 'fpo')}
                            value={pendingFilter?.fpo}
                          />
                        </Col>
                      </Row>
                    ),
                    fixed: "left",
                    width: 250,
                    render: (item: any, _: any, index: any) => {
                      return (
                       
                          <div className="table-data">
                            {item?.poNo != null ? item?.poNo! : "-"}
                          </div>
                      );
                    },
                  },
                ],
               
              },
              {
                title: <div className="table-title">Customer Name</div>,
                dataIndex: "",
                width: 200,
                fixed: "left",
                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fcustomer_name}
                          onChange={(e)=> setFilterData(e.target.value, 'fcustomer_name')}
                        />
                      </div>
                    ),
                    width: 200,
                    fixed: "left",
                    render: (item: any) => {
                      return (
                        <div className="table-data" title={item?.customer_name}>
                          {item?.customer_name != null ? item?.customer_name : "-"}{" "}
                        </div>
                      );
                    },
                  },
                ],
               
              },
              {
                title: <div className="table-title">Sales Order No.</div>,
                dataIndex: "",
                width: 200,
                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fso}
                          onChange={(e)=> setFilterData(e.target.value, 'fso')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.soNo != null ? item?.soNo : "-"}
                        </div>
                      );
                    },
                  },
                ],
               
              },
              {
                title: <div className="table-title">Section No.</div>,
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }} 
                          value={pendingFilter?.fsectionNo}
                          onChange={(e)=> setFilterData(e.target.value, 'fsectionNo')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                          {item?.sectionNo != null && item?.sectionNo?.length > 0
                            ? item?.sectionNo
                            : "-"}
                        </div>
                      );
                    },
                  },
                ],
              
              },
              {
                title: <div className="table-title">Alloy Temper</div>,
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fAlloyTemper}
                          onChange={(e)=> setFilterData(e.target.value, 'fAlloyTemper')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.alloyTemper != null && item?.alloyTemper?.length > 0
                            ? item?.alloyTemper
                            : "-"}
                        </div>
                      );
                    },
                  },
                ],
                
              },
              {
                title: <div className="table-title">PO Total Quantity</div>,
                width: 200,
                dataIndex: "",

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fpo_qty}
                          onChange={(e)=> setFilterData(e.target.value, 'fpo_qty')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.po_qty != null ? item?.po_qty : "-"}
                        </div>
                      );
                    },
                  },
                ],
               
              },
              {
                title: <div className="table-title">Extruded Quantity (Kgs)</div>,
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fextruded_qty}
                          onChange={(e)=> setFilterData(e.target.value, 'fextruded_qty')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.extruded_qty != null &&
                            item?.extruded_qty?.length > 0
                            ? item?.extruded_qty
                            : "-"}
                        </div>
                      );
                    },
                  },
                ],
              
              },
              {
                title: (
                  <div className="table-title">Balance PO Quantity(Kgs)</div>
                ),
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          value={pendingFilter?.fbalance_po_qty}
                          style={{ width: "140px" }}
                          onChange={(e)=> setFilterData(e.target.value, 'fbalance_po_qty')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.balance_po_qty != null &&
                            item?.balance_po_qty?.length > 0
                            ? item?.balance_po_qty
                            : "-"}
                        </div>
                      );
                    },
                  },
                ],
                
              },
              {
                title: <div className="table-title">Cut Length</div>,
                dataIndex: "",
                width: 200,
                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fcut_len}
                          onChange={(e)=> setFilterData(e.target.value, 'fcut_len')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.cut_len != null && item?.cut_len?.length > 0
                            ? item?.cut_len
                            : "-"}
                        </div>
                      );
                    },
                  },
                ],
                
              },
              {
                title: (
                  <div className="table-title">Cut Length tolerance (mm)</div>
                ),
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {/*  <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                        /> */}
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.cut_len_tolerance != null &&
                            item?.cut_len_tolerance?.length > 0
                            ? item?.cut_len_tolerance
                            : "-"}
                        </div>
                      );
                    },
                  },
                ],
                
              },
              {
                title: <div className="table-title">Quantity Tolerance (%)</div>,
                dataIndex: "",
                width: 150,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {/*  <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                        /> */}
                      </div>
                    ),
                    width: 150,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.qty_tolerance != null &&
                            item?.qty_tolerance?.length > 0
                            ? item?.qty_tolerance
                            : "-"}
                        </div>
                      );
                    },
                  },
                ],
                
              },
              {
                title: <div className="table-title">Priority assignment</div>,
                dataIndex: "",
                width: 200,
                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Select className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fpriority}
                            onChange={(e)=> setFilterData(e, 'fpriority')}
                          >
                            <Select.Option value={1}> High</Select.Option>
                            <Select.Option value={2}> Medium</Select.Option>
                            <Select.Option value={3}> Low</Select.Option>
                        </Select>
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        //Immediate
                        <div
                          className={
                            item?.priority == "High"
                              ? "table-data_immediate"
                              : "table-data"
                          }
                        >
                          {item?.priority != null && item?.priority?.length > 0
                            ? item?.priority
                            : "-"}
                        </div>
                      );
                    },
                  },
                ],
               
              },
              {
                title: <div className="table-title">Marketing remarks</div>,
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fmarketing_remarks}
                          onChange={(e)=> setFilterData(e.target.value, 'fmarketing_remarks')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {/* {(item?.qty_tolerance!=null||item?.qty_tolerance!="")?item?.qty_tolerance:"-"} */}
                          {item?.marketing_remarks != null &&
                            item?.marketing_remarks.length > 0
                            ? item?.marketing_remarks
                            : "-"}
                        </div>
                      );
                    },
                  },
                ],
                
              },
              {
                title: (
                  <div className="table-title">{AppConstants.plantSelected}</div>
                ),
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fplantSelected}
                          onChange={(e)=> setFilterData(e.target.value, 'fplantSelected')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.plantSelected)}</div>
                        </>
                      );
                    },
                  },
                ],
               
              },
              {
                title: (
                  <div className="table-title">
                    {AppConstants.pressAllocation}
                  </div>
                ),
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Select
                          style={{ width: 140 }}
                          className="submenu-action-menu"
                          placeholder="Select"
                          value={pendingFilter?.fpressAllocation}
                          onChange={(e)=>setFilterData(e, 'fpressAllocation')}
                      >
                          {pressAllocationData?.map((x: any) =>
                          <Option className="submenu-action-option" value={x?.id}>
                              {x?.name}
                          </Option>)}
                        </Select>
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.pressAllocation)}</div>
                        </>
                      );
                    },
                  },
                ],
               
              },
              {
                title: (
                  <div className="table-title">
                    {AppConstants.plannedQuantity}
                  </div>
                ),
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fplannedQty}
                          onChange={(e) => setFilterData(e.target.value, 'fplannedQty')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.plannedQty)}</div>
                        </>
                      );
                    },
                  },
                ],
               
              },
              {
                title: (
                  <div className="table-title">
                    {AppConstants.plannedInternalAlloy}
                  </div>
                ),
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fplannedInternalAlloy}
                          onChange={(e) => setFilterData(e.target.value, 'fplannedInternalAlloy')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">
                            {checkValueExist(item?.plannedInternalAlloy)}
                          </div>
                        </>
                      );
                    },
                  },
                ],
                
              },
              {
                title: (
                  <div className="table-title">
                    {AppConstants.plannedNoOfBillets}
                  </div>
                ),
                dataIndex: "",
                width: 300,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {/*  <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fplannedNoOfBilletAndLength}
                          onChange={(e) => setFilterData(e.target.value, 'fplannedNoOfBilletAndLength')}
                        /> */}
                      </div>
                    ),
                    width: 300,
                    render: (item: any) => {
                      let billetLength: any =
                        item?.plannedNoOfBilletAndLength &&
                        JSON.parse(item?.plannedNoOfBilletAndLength);
                        let billetString = ""
                        {(billetLength || []).map((e: any, index: any) => {
                          billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                        })}  
                        let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                        billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                        return (
                          <>
                            <div
                              className="jfs ellipse-none table-data"
                              style={{ marginLeft: "25px" }}
                              title={billetString}
                            >
                              {isArrayNotEmpty(billetLength) ? billetString : "-"}
                            </div>
                          </>
                        );
                    },
                  },
                ],
               
              },
              {
                title: (
                  <div className="table-title">{AppConstants.prodRateReq}</div>
                ),
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fproductionRateRequired}
                          onChange={(e)=> setFilterData(e.target.value, 'fproductionRateRequired')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">
                            {checkValueExist(item?.productionRateRequired)}
                          </div>
                        </>
                      );
                    },
                  },
                ],
                
              },
              {
                title: (
                  <div className="table-title">
                    {AppConstants.plannedQuenching}
                  </div>
                ),
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       <Select className="small-input-filter jc"
                           placeholder="Select"
                          style={{ width: "140px" }}
                          onChange={(e)=>setFilterData(e, 'fplannedQuenching')}
                          value={pendingFilter?.fplannedQuenching}
                          >
                           {plannedQuenchingData?.map((item: any) => 
                              <Select.Option value={item?.id}> {item?.name}</Select.Option>
                          )}
                        </Select>
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.plannedQuenching)}</div>
                        </>
                      );
                    },
                  },
                ],
               
              },
              {
                title: (
                  <div className="table-title">
                    {AppConstants.plannedFrontEndCoringLength}
                  </div>
                ),
                dataIndex: "",
                width: 300,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.ffrontEndCoringLength}
                          onChange={(e) => setFilterData(e.target.value, 'ffrontEndCoringLength')}
                        />
                      </div>
                    ),
                    width: 300,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">
                            {checkValueExist(String(item?.frontEndCoringLength))}
                          </div>
                        </>
                      );
                    },
                  },
                ],
                
              },
              {
                title: (
                  <div className="table-title">
                    {AppConstants.plannedBackEndCoringLength}
                  </div>
                ),
                dataIndex: "",
                width: 300,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          value={pendingFilter?.fbackEndCoringLength}
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          onChange={(e) => setFilterData(e.target.value, 'fbackEndCoringLength')}
                        />
                      </div>
                    ),
                    width: 300,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">
                            {checkValueExist(String(item?.backEndCoringLength))}
                          </div>
                        </>
                      );
                    },
                  },
                ],
               
              },
              {
                title: (
                  <div className="table-title">
                    {AppConstants.plannedExtrusionLength}
                  </div>
                ),
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div style={{ display: "inline-flex", gap: "5px" }}>
                         <Input type="search"  
                          style={{ width: 80 }}
                          value={pendingFilter?.fplantExtrusionLength}
                          onChange={(e) => setFilterData(e.target.value, "fplantExtrusionLength")}
                        />
                        <Select style={{ width: 60 }} placeholder="Select"
                            value={pendingFilter?.fextrusionLengthRefId}
                            onChange={(e) => setFilterData(e, "fextrusionLengthRefId")}
                        >
                            {(ExtrusionLengthUnitData || []).map((item: any) => {
                                return (
                                    <Option key={item?.id} value={item?.id}>{item?.name}</Option>
                                )
                            })}
                        </Select>
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">
                          {
                          (item?.plantExtrusionLength && item?.extrusionLength) ? 
                          item?.plantExtrusionLength+" "+item?.extrusionLength
                          : '-'
                          }
                          </div>
                        </>
                      );
                    },
                  },
                ],
                
              },
              {
                title: (
                  <div className="table-title">
                    {AppConstants.plannedButtThickness}
                  </div>
                ),
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fplannedButtThickness}
                          onChange={(e) => setFilterData(e.target.value, "fplannedButtThickness")}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">
                            {checkValueExist(item?.plannedButtThickness)}
                          </div>
                        </>
                      );
                    },
                  },
                ],
               
              },
              {
                title: (
                  <div className="table-title">{AppConstants.cutBillet}</div>
                ),
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Select
                          className="small-input-filter jc"
                          placeholder="Select"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fcutBilletsRefId}
                          onChange={(e) => setFilterData(e, "fcutBilletsRefId")}
                        >
                          <Select.Option value={1}>Yes</Select.Option>
                          <Select.Option value={2}>No</Select.Option>
                        </Select>
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.cutBillets)}</div>
                        </>
                      );
                    },
                  },
                ],
               
              },
              {
                title: (
                  <div className="table-title">
                    {AppConstants.buttWeightPerInch}
                  </div>
                ),
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fbuttWeightPerInch}
                          onChange={(e) => setFilterData(e.target.value, "fbuttWeightPerInch")}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.buttWeightPerInch)}</div>
                        </>
                      );
                    },
                  },
                ],
               
              },
              {
                title: (
                  <div className="table-title">{AppConstants.ppcRemarks}</div>
                ),
                dataIndex: "",
                width: 200,
                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fppcRemarks}
                          onChange={(e) => setFilterData(e.target.value, "fppcRemarks")}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">
                            {(item?.ppcRemarks != null &&
                              item?.ppcRemarks?.length > 0)
                              ? item?.ppcRemarks
                              : "-"}
                          </div>
                        </>
                      );
                    },
                  },
                ],
              },
              {
                title: <div className="table-title">DIE</div>,
                dataIndex: "",
                width: 200,
                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fdieRefId}
                          onChange={(e) => setFilterData(e.target.value, "fdieRefId")}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.die)}</div>
                        </>
                      );
                    },
                  },
                ],
                
              },
              {
                title: <div className="table-title">No. of Cavity</div>,
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fnoOfCavity}
                          onChange={(e) => setFilterData(e.target.value, "fnoOfCavity")}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.noOfCavity)}</div>
                        </>
                      );
                    },
                  },
                ],
              
              },
              {
                title: <div className="table-title">Bolster Entry</div>,
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fbolsterEntry}
                          onChange={(e) => setFilterData(e.target.value, "fbolsterEntry")}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.bolsterEntry)}</div>
                        </>
                      );
                    },
                  },
                ],
                
              },
              {
                title: <div className="table-title">Backer Entry</div>,
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fbackerEntry}
                          onChange={(e) => setFilterData(e.target.value, "fbackerEntry")}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.backerEntry)}</div>
                        </>
                      );
                    },
                  },
                ],
                
              },
              {
                title: <div className="table-title">Special Baker Entry</div>,
                dataIndex: "",
                width: 200,
                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fspecialBackerEntry}
                          onChange={(e) => setFilterData(e.target.value, "fspecialBackerEntry")}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.specialBackerEntry)}</div>
                        </>
                      );
                    },
                  },
                ],
               
              },
              {
                title: <div className="table-title">Ring Entry</div>,
                dataIndex: "",
                width: 200,
                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fringEntry}
                          onChange={(e) => setFilterData(e.target.value, "fringEntry")}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.ringEntry)}</div>
                        </>
                      );
                    },
                  },
                ],
               
              },
              {
                title: <div className="table-title">Welding Chamber</div>,
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fweldingChamber}
                          onChange={(e)=> setFilterData(e.target.value, "fweldingChamber")}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.weldingChamber)}</div>
                        </>
                      );
                    },
                  },
                ],
                
              },
              {
                title: <div className="table-title">Die Setter</div>,
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fdieSetter}
                          onChange={(e) => setFilterData(e.target.value, "fdieSetter")}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">{checkValueExist(item?.dieSetter)}</div>
                        </>
                      );
                    },
                  },
                ],
                
              },
              {
                title: <div className="table-title">Tool Shop Remarks</div>,
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.ftoolShopRemarks}
                          onChange={(e) => setFilterData(e.target.value, "ftoolShopRemarks")}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">
                            {item?.toolShopRemarks != null &&
                              item?.toolShopRemarks?.length > 0
                              ? item?.toolShopRemarks
                              : "-"}
                          </div>
                        </>
                      );
                    },
                  },
                ],
               
              },
              {
                title: <div className="table-title">QA Remarks</div>,
                dataIndex: "",
                width: 200,

                align: "center",
                ellipsis: true,
                children: [
                  {
                    title: (
                      <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <Input type="search"
                          className="small-input-filter jc"
                          placeholder="Enter"
                          style={{ width: "140px" }}
                          value={pendingFilter?.fqaRemarks}
                          onChange={(e) => setFilterData(e.target.value, 'fqaRemarks')}
                        />
                      </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                      return (
                        <>
                          <div className="table-data">
                            {item?.qaRemarks != null && item?.qaRemarks?.length > 0
                              ? item?.qaRemarks
                              : "-"}{" "}
                          </div>
                        </>
                      );
                    },
                  },
                ],
               
              },
            ]
            : user?.roleId === 6
              ? [
                {
                  title: (
                    <div className="jc">
                      <img
                        src={AppImages?.filterIcon}
                        onClick={() => setFilterMenu(!filterMenu)}
                      />
                      <div className="table-title">PO No.</div>
                    </div>
                  ),
                  dataIndex: "",
                  width: 250,
                  fixed: "left",
                  children: [
                    {
                      title: (
                        <Row
                          gutter={10}
                          className="clear-close-input-inprogress js"
                        >
                          <Col
                            span={6}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                background: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 5,
                                borderRadius: 2,
                                width: "100%",
                                color: "black",
                                cursor: "pointer",
                              }}
                              onClick={clearFilter}
                            >
                              Clear
                            </div>
                          </Col>
                          <Col
                            span={4}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {" "}
                            <div
                              style={{
                                background: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 6,
                                borderRadius: 2,
                                width: "100%",
                                cursor: "pointer",
                              }}
                              onClick={() => closeFilter()}
                            >
                              <div
                                className="jc"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "12px",
                                  backgroundColor: "#C64040",
                                  fontFamily: "Inter-Regular",
                                  borderRadius: "50%",
                                  color: "#FFFFFF",
                                  width: "20px",
                                  height: "100%",
                                }}
                              >
                                X
                              </div>
                            </div>
                          </Col>
                          <Col span={14}>
                             <Input type="search"
                              className="small-input-filter jc"
                              placeholder="Enter"
                              onChange={(e)=> setFilterData(e.target.value, 'fpo')}
                              value={pendingFilter?.fpo}
                            />
                          </Col>
                        </Row>
                      ),
                      fixed: "left",
                      width: 250,
                      render: (item: any, _: any, index: any) => {
                        return (
                         
                            <div className="table-data">
                              {item?.poNo != null ? item?.poNo! : "-"}
                            </div>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Customer Name</div>,
                  dataIndex: "",
                  width: 200,
                  fixed: "left",
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fcustomer_name}
                            onChange={(e)=> setFilterData(e.target.value, 'fcustomer_name')}
                          />
                        </div>
                      ),
                      width: 200,
                      fixed: "left",
                      render: (item: any) => {
                        return <div className="table-data">{checkValueExist(item?.customer_name)} </div>;
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Sales Order No.</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fso}
                            onChange={(e)=> setFilterData(e.target.value, 'fso')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.soNo != null ? item?.soNo : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Section No.</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fsectionNo}
                            onChange={(e)=> setFilterData(e.target.value, 'fsectionNo')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                            {item?.sectionNo != null && item?.sectionNo?.length > 0
                              ? item?.sectionNo
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
               
                },
                {
                  title: <div className="table-title">Alloy Temper</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fAlloyTemper}
                            onChange={(e)=> setFilterData(e.target.value, 'fAlloyTemper')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.alloyTemper != null && item?.alloyTemper?.length > 0
                              ? item?.alloyTemper
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">PO Total Quantity</div>,
                  width: 200,
                  dataIndex: "",
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fpo_qty}
                            onChange={(e)=> setFilterData(e.target.value, 'fpo_qty')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.po_qty != null ? item?.po_qty : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Extruded Quantity (Kgs)</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fextruded_qty}
                            onChange={(e)=> setFilterData(e.target.value, 'fextruded_qty')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.extruded_qty != null &&
                              item?.extruded_qty?.length > 0
                              ? item?.extruded_qty
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Balance PO Quantity</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbalance_po_qty}
                            onChange={(e)=> setFilterData(e.target.value, 'fbalance_po_qty')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.balance_po_qty != null &&
                              item?.balance_po_qty?.length > 0
                              ? item?.balance_po_qty
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Cut Length</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fcut_len}
                            onChange={(e)=> setFilterData(e.target.value, 'fcut_len')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.cut_len != null && item?.cut_len?.length > 0
                              ? item?.cut_len
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">Cut Length tolerance (mm)</div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          {/*  <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                          /> */}
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.cut_len_tolerance != null &&
                              item?.cut_len_tolerance?.length > 0
                              ? item?.cut_len_tolerance
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Quantity Tolerance (%)</div>,
                  dataIndex: "",
                  width: 150,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          {/*  <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                          /> */}
                        </div>
                      ),
                      width: 150,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.qty_tolerance != null &&
                              item?.qty_tolerance?.length > 0
                              ? item?.qty_tolerance
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Priority assignment</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fpriority}
                            onChange={(e)=> setFilterData(e, 'fpriority')}
                          >
                              <Select.Option value={1}> High</Select.Option>
                              <Select.Option value={2}> Medium</Select.Option>
                              <Select.Option value={3}> Low</Select.Option>
                          </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          //Immediate
                          <div
                            className={
                              item?.priority == "High"
                                ? "table-data_immediate"
                                : "table-data"
                            }
                          >
                            {item?.priority != null && item?.priority?.length > 0
                              ? item?.priority
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Marketing remarks</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fmarketing_remarks}
                            onChange={(e)=> setFilterData(e.target.value, 'fmarketing_remarks')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data" title={item?.marketing_remarks}>
                            {item?.marketing_remarks != null &&
                              item?.marketing_remarks?.length > 0
                              ? item?.marketing_remarks
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: (
                    <div className="table-title">{AppConstants.plantSelected}</div>
                  ),
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fplantSelected}
                            onChange={(e)=> setFilterData(e.target.value, 'fplantSelected')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.plantSelected)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.pressAllocation}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Select
                              style={{ width: 140 }}
                              className="submenu-action-menu"
                              placeholder="Select"
                              value={pendingFilter?.fpressAllocation}
                              onChange={(e)=>setFilterData(e, 'fpressAllocation')}
                          >
                              {pressAllocationData?.map((x: any) =>
                              <Option className="submenu-action-option" value={x?.id}>
                                  {x?.name}
                              </Option>)}
                            </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.pressAllocation)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedQuantity}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fplannedQty}
                            onChange={(e) => setFilterData(e.target.value, 'fplannedQty')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.plannedQty)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedInternalAlloy}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fplannedInternalAlloy}
                            onChange={(e) => setFilterData(e.target.value, 'fplannedInternalAlloy')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.plannedInternalAlloy)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
               
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedNoOfBillets}
                    </div>
                  ),
                  dataIndex: "",
                  width: 300,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          {/*  <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fplannedNoOfBilletAndLength}
                            onChange={(e) => setFilterData(e.target.value, 'fplannedNoOfBilletAndLength')}
                          /> */}
                        </div>
                      ),
                      width: 300,
                      render: (item: any) => {
                        let billetLength: any =
                          item?.plannedNoOfBilletAndLength &&
                          JSON.parse(item?.plannedNoOfBilletAndLength);
                          let billetString = ""
                          {(billetLength || []).map((e: any, index: any) => {
                            billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                          })}  
                          let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                          billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                          return (
                            <>
                              <div
                                className="jfs ellipse-none table-data"
                                style={{ marginLeft: "25px" }}
                                title={billetString}
                              >
                                {isArrayNotEmpty(billetLength) ? billetString : "-"}
                              </div>
                            </>
                          );
                      },
                    },
                  ],
                 
                },
                {
                  title: (
                    <div className="table-title">{AppConstants.prodRateReq}</div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fproductionRateRequired}
                            onChange={(e)=> setFilterData(e.target.value, 'fproductionRateRequired')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.productionRateRequired)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedQuenching}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select className="small-input-filter jc"
                           placeholder="Select"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fplannedQuenching}
                            onChange={(e)=>setFilterData(e, 'fplannedQuenching')}
                          >
                            {plannedQuenchingData?.map((item: any) => 
                                <Select.Option value={item?.id}> {item?.name}</Select.Option>
                            )}
                        </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.plannedQuenching)}</div>
                          </>
                        );
                      },
                    },
                  ],
            
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedFrontEndCoringLength}
                    </div>
                  ),
                  dataIndex: "",
                  width: 300,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.ffrontEndCoringLength}
                            onChange={(e) => setFilterData(e.target.value, 'ffrontEndCoringLength')}
                          />
                        </div>
                      ),
                      width: 300,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(String(item?.frontEndCoringLength))}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedBackEndCoringLength}
                    </div>
                  ),
                  dataIndex: "",
                  width: 300,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbackEndCoringLength}
                            onChange={(e) => setFilterData(e.target.value, 'fbackEndCoringLength')}
                          />
                        </div>
                      ),
                      width: 300,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(String(item?.backEndCoringLength))}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedExtrusionLength}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div style={{ display: "inline-flex", gap: "5px" }}>
                         <Input type="search"  
                          style={{ width: 80 }}
                          value={pendingFilter?.fplantExtrusionLength}
                          onChange={(e) => setFilterData(e.target.value, "fplantExtrusionLength")}
                        />
                        <Select style={{ width: 60 }} placeholder="Select"
                            value={pendingFilter?.fextrusionLengthRefId}
                            onChange={(e) => setFilterData(e, "fextrusionLengthRefId")}
                        >
                            {(ExtrusionLengthUnitData || []).map((item: any) => {
                                return (
                                    <Option key={item?.id} value={item?.id}>{item?.name}</Option>
                                )
                            })}
                        </Select>
                      </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                            {
                            (item?.plantExtrusionLength && item?.extrusionLength) ? 
                            item?.plantExtrusionLength+" "+item?.extrusionLength
                            : '-'
                            }
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedButtThickness}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fplannedButtThickness}
                            onChange={(e) => setFilterData(e.target.value, "fplannedButtThickness")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.plannedButtThickness)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">{AppConstants.cutBillet}</div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select
                            className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fcutBilletsRefId}
                            onChange={(e) => setFilterData(e, "fcutBilletsRefId")}
                          >
                            <Select.Option value={1}>Yes</Select.Option>
                            <Select.Option value={2}>No</Select.Option>
                          </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.cutBillets)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.buttWeightPerInch}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbuttWeightPerInch}
                            onChange={(e) => setFilterData(e.target.value, "fbuttWeightPerInch")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.buttWeightPerInch)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: (
                    <div className="table-title">{AppConstants.ppcRemarks}</div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fppcRemarks}
                            onChange={(e) => setFilterData(e.target.value, "fppcRemarks")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {(item?.ppcRemarks != null &&
                                item?.ppcRemarks?.length > 0)
                                ? item?.ppcRemarks
                                : "-"}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">DIE</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fdieRefId}
                            onChange={(e) => setFilterData(e.target.value, "fdieRefId")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.die)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">No. of Cavity</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fnoOfCavity}
                            onChange={(e) => setFilterData(e.target.value, "fnoOfCavity")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.noOfCavity)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Bolster Entry</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbolsterEntry}
                            onChange={(e) => setFilterData(e.target.value, "fbolsterEntry")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.bolsterEntry)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Backer Entry</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbackerEntry}
                            onChange={(e) => setFilterData(e.target.value, "fbackerEntry")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.backerEntry)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Special Baker Entry</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fspecialBackerEntry}
                            onChange={(e) => setFilterData(e.target.value, "fspecialBackerEntry")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.specialBackerEntry)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Ring Entry</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fringEntry}
                            onChange={(e) => setFilterData(e.target.value, "fringEntry")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.ringEntry)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Welding Chamber</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fweldingChamber}
                            onChange={(e)=> setFilterData(e.target.value, "fweldingChamber")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.weldingChamber)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Die Setter</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fdieSetter}
                            onChange={(e) => setFilterData(e.target.value, "fdieSetter")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.dieSetter)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Tool Shop Remarks</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.ftoolShopRemarks}
                            onChange={(e) => setFilterData(e.target.value, "ftoolShopRemarks")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {item?.toolShopRemarks != null &&
                                item?.toolShopRemarks?.length > 0
                                ? item?.toolShopRemarks
                                : "-"}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">QA Remarks</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fqaRemarks}
                            onChange={(e) => setFilterData(e.target.value, 'fqaRemarks')}

                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {item?.qaRemarks != null && item?.qaRemarks?.length > 0
                                ? item?.qaRemarks
                                : "-"}{" "}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Die Trial</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select
                            className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            onChange={(e) => setFilterData(e, 'fdieTrialRefId')}
                          >
                            <Select.Option value={1}>Yes</Select.Option>
                            <Select.Option value={2}>No</Select.Option>
                          </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.dieTrial)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Die With Aluminium</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select
                            className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            onChange={(e) => setFilterData(e, 'fdieWithAluminiumRefId')}
                          >
                              <Select.Option value={1}>Yes</Select.Option>
                              <Select.Option value={2}>No</Select.Option>
                            </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.dieWithAluminium)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">Previous Day Die Continue</div>
                  ),
                  dataIndex: "",
                  width: 300,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select
                            className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            onChange={(e) => setFilterData(e, 'fpreviousDayDie_continueRefId')}
                          >
                              <Select.Option value={1}>Yes</Select.Option>
                              <Select.Option value={2}>No</Select.Option>
                            </Select>
                        </div>
                      ),
                      width: 300,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.previousDayDie_continue)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Batch No.</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            onChange={(e) => setFilterData(e.target.value, 'fbatchNo')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.batchNo)}</div>
                          </>
                        );
                      },
                    },
                  ],
           
                },
                {
                  title: <div className="table-title">Actual Internal Alloy</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            value={pendingFilter?.factualInternalAlloy}
                            onChange={(e) => setFilterData(e.target.value, 'factualInternalAlloy')}
                            style={{ width: "140px" }}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.actualInternalAlloy)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Start Time</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <TimePicker
                            className="inputbox"
                            use12Hours format={"h:mm A"}
                            style={{ width: 100 }}
                            suffixIcon={false}
                            onChange={(e: any) => {
                              let value = moment(dayjs(e).format('YYYY-MM-DD HH:mm')).utc().format('YYYY-MM-DD HH:mm');
                              setFilterData(value != 'Invalid date' ? value+":00" : '', 'fstartTime')
                            }}
                            value={(pendingFilter.fstartTime !== "Invalid date:00" && pendingFilter.fstartTime) && dayjs(moment(moment.utc(pendingFilter.fstartTime)).local().format("YYYY-MM-DD HH:mm"))}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {moment(item?.startTime)?.isValid()
                              ? moment(item?.startTime)?.format("hh:mm A")
                              : "-"}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">End Time</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <TimePicker
                            className="inputbox"
                            use12Hours format={"h:mm A"}
                            style={{ width: 100 }}
                            suffixIcon={false}
                            onChange={(e: any) => {
                              let value = moment(dayjs(e).format('YYYY-MM-DD HH:mm')).utc().format('YYYY-MM-DD HH:mm');
                              setFilterData(value != 'Invalid date' ? value+":00" : '', 'fendTime')
                            }}
                            value={(pendingFilter.fendTime !== "Invalid date:00" && pendingFilter.fendTime) && dayjs(moment(moment.utc(pendingFilter.fendTime)).local().format("YYYY-MM-DD HH:mm"))}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {moment(item?.endTime)?.isValid()
                                ? moment(item?.endTime)?.format("hh:mm A")
                                : "-"}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Process Time</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fprocessTime}
                            onChange={(e) => setFilterData(e.target.value, "fprocessTime")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.processTime)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">
                      No.of Billet and Billet Length
                    </div>
                  ),
                  dataIndex: "",
                  width: 300,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           {/* <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fnoOfBilletAndLength}
                            onChange={(e) => setFilterData(e.target.value, "fnoOfBilletAndLength")}
                          /> */}
                        </div>
                      ),
                      width: 300,
                      render: (item: any) => {
                        let billetLength: any =
                          item?.noOfBilletAndLength &&
                          JSON.parse(item?.noOfBilletAndLength);
                          let billetString = ""
                          {(billetLength || []).map((e: any, index: any) => {
                            billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                          })}  
                          let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                          billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                          return (
                            <>
                              <div
                                className="jfs ellipse-none table-data"
                                style={{ marginLeft: "25px" }}
                                title={billetString}
                              >
                                {isArrayNotEmpty(billetLength) ? billetString : "-"}
                              </div>
                            </>
                          );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Actual Butt thickness</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.factualButtThickness}
                            onChange={(e) => setFilterData(e.target.value, "factualButtThickness")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.actualButtThickness)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Breakthrough Pressure</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbreakThroughPressure}
                              onChange={(e) => setFilterData(e.target.value, "fbreakThroughPressure")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.breakThroughPressure)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Push on Billet Length</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fpushOnBilletLength}
                            onChange={(e) => setFilterData(e.target.value, 'fpushOnBilletLength')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.pushOnBilletLength)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Push Qty (Kgs)</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fpushQtyInKgs}
                            onChange={(e) => setFilterData(e.target.value, 'fpushQtyInKgs')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.pushQtyInKgs)}</div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Actual Production Rate</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.factualProductionRate}
                            onChange={(e) => setFilterData(e.target.value, 'factualProductionRate')}                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(String(item?.actualProductionRate))}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Butt Weight (Kgs)</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbuttWeightInKgs}
                            onChange={(e) => setFilterData(e.target.value, 'fbuttWeightInKgs')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.buttWeightInKgs)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Die Fail</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select
                            className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fdiefailRefId}
                            onChange={(e) => setFilterData(e, 'fdiefailRefId')}
                          >
                            <Select.Option value={1}>Yes</Select.Option>
                            <Select.Option value={2}>No</Select.Option>
                          </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.diefail)}</div>
                          </>
                        );
                      },
                    },
                  ],
               
                },
                {
                  title: <div className="table-title">Die Failure Reason</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fdieFailureReason}
                            onChange={(e) => setFilterData(e.target.value, "fdieFailureReason")}                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.dieFailureReason)}</div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Breakdown</div>,
                  dataIndex: "",
                  width: 400,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           {/* <TimePicker
                            className="inputbox"
                            use12Hours format={"h:mm a"}
                            style={{ width: 100 }}
                            suffixIcon={false}
                            // onChange={(e: any) => { setBreakDownValue(e ? dayjs(e).format("h:mm A") : '', item?.id, "startTime") }}
                            // value={item["startTime" + (index + 1)]}
                          /> */}
                        </div>
                      ),
                      width: 400,
                      render: (item: any) => {
                        let data: any = JSON.parse(item?.breakDown);
                        // let value =  (data || []).map((e: any) => {
                        //     return (
                        //         `${e?.startTime} - ${e?.endTime}, ${e?.reason}, ${e?.responsibleDepartment} | `
                        //     );
                        // })
                        let value = ""
                        {(data || []).map((e: any, index: any) => {
                          value += `${e?.startTime} - ${e?.endTime}, ${e?.reason}, ${e?.responsibleDepartment} ${index != data.length - 1 ? " | " : ""}`;
                        })}
                        return (
                            <div
                                className="jfs completed-ellipse table-data"
                                title={value}
                            >
                                {checkValueExist(value)}
                            </div>
                        );
                    },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Breakdown Duration</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbreakDownDuration}
                            onChange={(e) =>  setFilterData(e.target.value, "fbreakDownDuration")}                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.breakDownDuration)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">Log end scrap length (mm)</div>
                  ),
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.flogEndScrapLengthInMm}
                            onChange={(e) =>  setFilterData(e.target.value, "flogEndScrapLengthInMm")}                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.logEndScrapLengthInMm)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Log end Scrap(Kgs)</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.flogEndScrapInKgs}
                            onChange={(e) =>  setFilterData(e.target.value, "flogEndScrapInKgs")}                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.logEndScrapInKgs)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Operator Name</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            value={pendingFilter?.foperatorName}
                            onChange={(e) =>  setFilterData(e.target.value, "foperatorName")}
                            style={{ width: "140px" }}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.operatorName)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Operator Remarks</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            value={pendingFilter?.foperatorEntryRemarks}
                            onChange={(e) =>  setFilterData(e.target.value, "foperatorEntryRemarks")}
                            style={{ width: "140px" }}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {item?.operatorEntryRemarks != null &&
                                item?.operatorEntryRemarks?.length > 0
                                ? item?.operatorEntryRemarks
                                : "-"}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
              ]
              :  [
                {
                  title: (
                    <div className="jc">
                      <img
                        src={AppImages?.filterIcon}
                        onClick={() => setFilterMenu(!filterMenu)}
                      />
                      <div className="table-title">PO No.</div>
                    </div>
                  ),
                  dataIndex: "",
                  width: 250,
                  fixed: "left",
                  children: [
                    {
                      title: (
                        <Row
                          gutter={10}
                          className="clear-close-input-inprogress js"
                        >
                          <Col
                            span={6}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                background: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 5,
                                borderRadius: 2,
                                width: "100%",
                                color: "black",
                                cursor: "pointer",
                              }}
                              onClick={clearFilter}
                            >
                              Clear
                            </div>
                          </Col>
                          <Col
                            span={4}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {" "}
                            <div
                              style={{
                                background: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 6,
                                borderRadius: 2,
                                width: "100%",
                                cursor: "pointer",
                              }}
                              onClick={() => closeFilter()}
                            >
                              <div
                                className="jc"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "12px",
                                  backgroundColor: "#C64040",
                                  fontFamily: "Inter-Regular",
                                  borderRadius: "50%",
                                  color: "#FFFFFF",
                                  width: "20px",
                                  height: "100%",
                                }}
                              >
                                X
                              </div>
                            </div>
                          </Col>
                          <Col span={14}>
                             <Input type="search"
                              className="small-input-filter jc"
                              placeholder="Enter"
                              onChange={(e)=> setFilterData(e.target.value, 'fpo')}
                              value={pendingFilter?.fpo}
                            />
                          </Col>
                        </Row>
                      ),
                      fixed: "left",
                      width: 250,
                      render: (item: any, _: any, index: any) => {
                        return (
                          <div className="table-data">{checkValueExist(item?.poNo)}</div>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Customer Name</div>,
                  dataIndex: "",
                  width: 200,
                  fixed: "left",
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fcustomer_name}
                            onChange={(e)=> setFilterData(e.target.value, 'fcustomer_name')}
                          />
                        </div>
                      ),
                      width: 200,
                      fixed: "left",
                      render: (item: any) => {
                        return <div className="table-data">{checkValueExist(item?.customer_name)} </div>;
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Sales Order No.</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fso}
                            onChange={(e)=> setFilterData(e.target.value, 'fso')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.soNo != null ? item?.soNo : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Section No.</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fsectionNo}
                            onChange={(e)=> setFilterData(e.target.value, 'fsectionNo')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                            {item?.sectionNo != null && item?.sectionNo?.length > 0
                              ? item?.sectionNo
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
               
                },
                {
                  title: <div className="table-title">Process Stage</div>,
                  dataIndex: "",
                  width: 200,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          {/* <Select
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            // value={pendingFilter?.fdiefailRefId}
                            // onChange={(e) => setFilterData(e, 'fdiefailRefId')}
                         >
                            <Select.Option value={1}>Yes</Select.Option>
                            <Select.Option value={2}>No</Select.Option>
                          </Select> */}
                        </div>
                      ),
                      width: 200,
                      // fixed: "left",
                      render: (item: any) => {
                        return <div className="table-data">{checkValueExist(item?.processStage)} </div>;
                      },
                    },
                  ],
                },
                {
                  title: <div className="table-title">Alloy Temper</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fAlloyTemper}
                            onChange={(e)=> setFilterData(e.target.value, 'fAlloyTemper')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.alloyTemper != null && item?.alloyTemper?.length > 0
                              ? item?.alloyTemper
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">PO Total Quantity</div>,
                  width: 200,
                  dataIndex: "",
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fpo_qty}
                            onChange={(e)=> setFilterData(e.target.value, 'fpo_qty')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.po_qty != null ? item?.po_qty : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Extruded Quantity (Kgs)</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fextruded_qty}
                            onChange={(e)=> setFilterData(e.target.value, 'fextruded_qty')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.extruded_qty != null &&
                              item?.extruded_qty?.length > 0
                              ? item?.extruded_qty
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Balance PO Quantity</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbalance_po_qty}
                            onChange={(e)=> setFilterData(e.target.value, 'fbalance_po_qty')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.balance_po_qty != null &&
                              item?.balance_po_qty?.length > 0
                              ? item?.balance_po_qty
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Cut Length</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fcut_len}
                            onChange={(e)=> setFilterData(e.target.value, 'fcut_len')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.cut_len != null && item?.cut_len?.length > 0
                              ? item?.cut_len
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">Cut Length tolerance (mm)</div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          {/*  <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                          /> */}
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.cut_len_tolerance != null &&
                              item?.cut_len_tolerance?.length > 0
                              ? item?.cut_len_tolerance
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Quantity Tolerance (%)</div>,
                  dataIndex: "",
                  width: 150,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          {/*  <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                          /> */}
                        </div>
                      ),
                      width: 150,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.qty_tolerance != null &&
                              item?.qty_tolerance?.length > 0
                              ? item?.qty_tolerance
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Priority assignment</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fpriority}
                            onChange={(e)=> setFilterData(e, 'fpriority')}
                          >
                              <Select.Option value={1}> High</Select.Option>
                              <Select.Option value={2}> Medium</Select.Option>
                              <Select.Option value={3}> Low</Select.Option>
                          </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          //Immediate
                          <div
                            className={
                              item?.priority == "High"
                                ? "table-data_immediate"
                                : "table-data"
                            }
                          >
                            {item?.priority != null && item?.priority?.length > 0
                              ? item?.priority
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Marketing remarks</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fmarketing_remarks}
                            onChange={(e)=> setFilterData(e.target.value, 'fmarketing_remarks')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <div className="table-data" title={item?.marketing_remarks}>
                            {item?.marketing_remarks != null &&
                              item?.marketing_remarks?.length > 0
                              ? item?.marketing_remarks
                              : "-"}
                          </div>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: (
                    <div className="table-title">{AppConstants.plantSelected}</div>
                  ),
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fplantSelected}
                            onChange={(e)=> setFilterData(e.target.value, 'fplantSelected')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.plantSelected)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.pressAllocation}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Select
                              style={{ width: 140 }}
                              className="submenu-action-menu"
                              placeholder="Select"
                              value={pendingFilter?.fpressAllocation}
                              onChange={(e)=>setFilterData(e, 'fpressAllocation')}
                          >
                              {pressAllocationData?.map((x: any) =>
                              <Option className="submenu-action-option" value={x?.id}>
                                  {x?.name}
                              </Option>)}
                            </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.pressAllocation)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedQuantity}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fplannedQty}
                            onChange={(e) => setFilterData(e.target.value, 'fplannedQty')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.plannedQty)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedInternalAlloy}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fplannedInternalAlloy}
                            onChange={(e) => setFilterData(e.target.value, 'fplannedInternalAlloy')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.plannedInternalAlloy)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
               
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedNoOfBillets}
                    </div>
                  ),
                  dataIndex: "",
                  width: 300,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          {/*  <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fplannedNoOfBilletAndLength}
                            onChange={(e) => setFilterData(e.target.value, 'fplannedNoOfBilletAndLength')}
                          /> */}
                        </div>
                      ),
                      width: 300,
                      render: (item: any) => {
                        let billetLength: any =
                          item?.plannedNoOfBilletAndLength &&
                          JSON.parse(item?.plannedNoOfBilletAndLength);
                          let billetString = ""
                          {(billetLength || []).map((e: any, index: any) => {
                            billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                          })}  
                          let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                          billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                          return (
                            <>
                              <div
                                className="jfs ellipse-none table-data"
                                style={{ marginLeft: "25px" }}
                                title={billetString}
                              >
                                {isArrayNotEmpty(billetLength) ? billetString : "-"}
                              </div>
                            </>
                          );
                      },
                    },
                  ],
                 
                },
                {
                  title: (
                    <div className="table-title">{AppConstants.prodRateReq}</div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fproductionRateRequired}
                            onChange={(e)=> setFilterData(e.target.value, 'fproductionRateRequired')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.productionRateRequired)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedQuenching}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select className="small-input-filter jc"
                           placeholder="Select"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fplannedQuenching}
                            onChange={(e)=>setFilterData(e, 'fplannedQuenching')}
                          >
                            {plannedQuenchingData?.map((item: any) => 
                                <Select.Option value={item?.id}> {item?.name}</Select.Option>
                            )}
                        </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.plannedQuenching)}</div>
                          </>
                        );
                      },
                    },
                  ],
            
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedFrontEndCoringLength}
                    </div>
                  ),
                  dataIndex: "",
                  width: 300,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.ffrontEndCoringLength}
                            onChange={(e) => setFilterData(e.target.value, 'ffrontEndCoringLength')}
                          />
                        </div>
                      ),
                      width: 300,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(String(item?.frontEndCoringLength))}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedBackEndCoringLength}
                    </div>
                  ),
                  dataIndex: "",
                  width: 300,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbackEndCoringLength}
                            onChange={(e) => setFilterData(e.target.value, 'fbackEndCoringLength')}
                          />
                        </div>
                      ),
                      width: 300,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(String(item?.backEndCoringLength))}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedExtrusionLength}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div style={{ display: "inline-flex", gap: "5px" }}>
                         <Input type="search"  
                          style={{ width: 80 }}
                          value={pendingFilter?.fplantExtrusionLength}
                          onChange={(e) => setFilterData(e.target.value, "fplantExtrusionLength")}
                        />
                        <Select style={{ width: 60 }}
                         placeholder="Select"
                          value={pendingFilter?.fextrusionLengthRefId}
                          onChange={(e) => setFilterData(e, "fextrusionLengthRefId")}
                        >
                            {(ExtrusionLengthUnitData || []).map((item: any) => {
                                return (
                                    <Option key={item?.id} value={item?.id}>{item?.name}</Option>
                                )
                            })}
                        </Select>
                      </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                            {
                            (item?.plantExtrusionLength && item?.extrusionLength) ? 
                            item?.plantExtrusionLength+" "+item?.extrusionLength
                            : '-'
                            }                              
                          </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.plannedButtThickness}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fplannedButtThickness}
                            onChange={(e) => setFilterData(e.target.value, "fplannedButtThickness")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.plannedButtThickness)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">{AppConstants.cutBillet}</div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select
                            className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fcutBilletsRefId}
                            onChange={(e) => setFilterData(e, "fcutBilletsRefId")}
                          >
                            <Select.Option value={1}>Yes</Select.Option>
                            <Select.Option value={2}>No</Select.Option>
                          </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.cutBillets)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: (
                    <div className="table-title">
                      {AppConstants.buttWeightPerInch}
                    </div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbuttWeightPerInch}
                            onChange={(e) => setFilterData(e.target.value, "fbuttWeightPerInch")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.buttWeightPerInch)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: (
                    <div className="table-title">{AppConstants.ppcRemarks}</div>
                  ),
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fppcRemarks}
                            onChange={(e) => setFilterData(e.target.value, "fppcRemarks")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {(item?.ppcRemarks != null &&
                                item?.ppcRemarks?.length > 0)
                                ? item?.ppcRemarks
                                : "-"}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">DIE</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fdieRefId}
                            onChange={(e) => setFilterData(e.target.value, "fdieRefId")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.die)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">No. of Cavity</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fnoOfCavity}
                            onChange={(e) => setFilterData(e.target.value, "fnoOfCavity")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.noOfCavity)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Bolster Entry</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbolsterEntry}
                            onChange={(e) => setFilterData(e.target.value, "fbolsterEntry")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.bolsterEntry)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Backer Entry</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbackerEntry}
                            onChange={(e) => setFilterData(e.target.value, "fbackerEntry")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.backerEntry)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Special Baker Entry</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fspecialBackerEntry}
                            onChange={(e) => setFilterData(e.target.value, "fspecialBackerEntry")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.specialBackerEntry)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Ring Entry</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fringEntry}
                            onChange={(e) => setFilterData(e.target.value, "fringEntry")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.ringEntry)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Welding Chamber</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fweldingChamber}
                            onChange={(e)=> setFilterData(e.target.value, "fweldingChamber")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.weldingChamber)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Die Setter</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fdieSetter}
                            onChange={(e) => setFilterData(e.target.value, "fdieSetter")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.dieSetter)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Tool Shop Remarks</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.ftoolShopRemarks}
                            onChange={(e) => setFilterData(e.target.value, "ftoolShopRemarks")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {item?.toolShopRemarks != null &&
                                item?.toolShopRemarks?.length > 0
                                ? item?.toolShopRemarks
                                : "-"}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">QA Remarks</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fqaRemarks}
                            onChange={(e) => setFilterData(e.target.value, 'fqaRemarks')}

                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {item?.qaRemarks != null && item?.qaRemarks?.length > 0
                                ? item?.qaRemarks
                                : "-"}{" "}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Die Trial</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select
                            className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            onChange={(e) => setFilterData(e, 'fdieTrialRefId')}
                          >
                            <Select.Option value={1}>Yes</Select.Option>
                            <Select.Option value={2}>No</Select.Option>
                          </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.dieTrial)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Die With Aluminium</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select
                            className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            onChange={(e) => setFilterData(e, 'fdieWithAluminiumRefId')}
                          >
                              <Select.Option value={1}>Yes</Select.Option>
                              <Select.Option value={2}>No</Select.Option>
                            </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.dieWithAluminium)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">Previous Day Die Continue</div>
                  ),
                  dataIndex: "",
                  width: 300,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select
                            className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            onChange={(e) => setFilterData(e, 'fpreviousDayDie_continueRefId')}
                          >
                              <Select.Option value={1}>Yes</Select.Option>
                              <Select.Option value={2}>No</Select.Option>
                            </Select>
                        </div>
                      ),
                      width: 300,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.previousDayDie_continue)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Batch No.</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter.fbatchNo}
                            onChange={(e) => setFilterData(e.target.value, 'fbatchNo')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.batchNo)}</div>
                          </>
                        );
                      },
                    },
                  ],
           
                },
                {
                  title: <div className="table-title">Actual Internal Alloy</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            value={pendingFilter?.factualInternalAlloy}
                            onChange={(e) => setFilterData(e.target.value, 'factualInternalAlloy')}
                            style={{ width: "140px" }}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.actualInternalAlloy)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Start Time</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <TimePicker
                            className="inputbox"
                            use12Hours format={"h:mm A"}
                            style={{ width: 100 }}
                            suffixIcon={false}
                            onChange={(e: any) => {
                              let value = moment(dayjs(e).format('YYYY-MM-DD HH:mm')).utc().format('YYYY-MM-DD HH:mm');
                              setFilterData(value != 'Invalid date' ? value+":00" : '', 'fstartTime')
                            }}
                            value={(pendingFilter.fstartTime !== "Invalid date:00" && pendingFilter.fstartTime) && dayjs(moment(moment.utc(pendingFilter.fstartTime)).local().format("YYYY-MM-DD HH:mm"))}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {moment(item?.startTime)?.isValid()
                                ? moment(item?.startTime)?.format("hh:mm A")
                                : "-"}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">End Time</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                         <TimePicker
                            className="inputbox"
                            use12Hours format={"h:mm A"}
                            style={{ width: 100 }}
                            suffixIcon={false}
                            onChange={(e: any) => {
                              let value = moment(dayjs(e).format('YYYY-MM-DD HH:mm')).utc().format('YYYY-MM-DD HH:mm');
                              setFilterData(value != 'Invalid date' ? value+":00" : '', 'fendTime')
                            }}
                            value={(pendingFilter.fendTime !== "Invalid date:00" && pendingFilter.fendTime) && dayjs(moment(moment.utc(pendingFilter.fendTime)).local().format("YYYY-MM-DD HH:mm"))}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {moment(item?.endTime)?.isValid()
                                ? moment(item?.endTime)?.format("hh:mm A")
                                : "-"}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Process Time</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fprocessTime}
                            onChange={(e) => setFilterData(e.target.value, "fprocessTime")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.processTime)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">
                      No.of Billet and Billet Length
                    </div>
                  ),
                  dataIndex: "",
                  width: 300,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           {/* <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fnoOfBilletAndLength}
                            onChange={(e) => setFilterData(e.target.value, "fnoOfBilletAndLength")}
                          /> */}
                        </div>
                      ),
                      width: 300,
                      render: (item: any) => {
                        let billetLength: any =
                          item?.noOfBilletAndLength &&
                          JSON.parse(item?.noOfBilletAndLength);
                          let billetString = ""
                          {(billetLength || []).map((e: any, index: any) => {
                            billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                          })}  
                          let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                          billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                          return (
                            <>
                              <div
                                className="jfs ellipse-none table-data"
                                style={{ marginLeft: "25px" }}
                                title={billetString}
                              >
                                {isArrayNotEmpty(billetLength) ? billetString : "-"}
                              </div>
                            </>
                          );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Actual Butt thickness</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.factualButtThickness}
                            onChange={(e) => setFilterData(e.target.value, "factualButtThickness")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.actualButtThickness)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Breakthrough Pressure</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbreakThroughPressure}
                            onChange={(e) => setFilterData(e.target.value, "fbreakThroughPressure")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.breakThroughPressure)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Push on Billet Length</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fpushOnBilletLength}
                            onChange={(e) => setFilterData(e.target.value, 'fpushOnBilletLength')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.pushOnBilletLength)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Push Qty (Kgs)</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fpushQtyInKgs}
                            onChange={(e) => setFilterData(e.target.value, 'fpushQtyInKgs')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.pushQtyInKgs)}</div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Actual Production Rate</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.factualProductionRate}
                            onChange={(e) => setFilterData(e.target.value, 'factualProductionRate')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(String(item?.actualProductionRate))}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Butt Weight (Kgs)</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbuttWeightInKgs}
                            onChange={(e) => setFilterData(e.target.value, 'fbuttWeightInKgs')}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.buttWeightInKgs)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Die Fail</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Select
                            className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fdiefailRefId}
                            onChange={(e) => setFilterData(e, 'fdiefailRefId')}
                          >
                            <Select.Option value={1}>Yes</Select.Option>
                            <Select.Option value={2}>No</Select.Option>
                          </Select>
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.diefail)}</div>
                          </>
                        );
                      },
                    },
                  ],
               
                },
                {
                  title: <div className="table-title">Die Failure Reason</div>,
                  dataIndex: "",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fdieFailureReason}
                            onChange={(e) => setFilterData(e.target.value, "fdieFailureReason")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.dieFailureReason)}</div>
                          </>
                        );
                      },
                    },
                  ],
                  
                },
                {
                  title: <div className="table-title">Breakdown</div>,
                  dataIndex: "",
                  align: "true",
                  ellipsis: true,
                  width: 400,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           {/* <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbreakDownDuration}
                            onChange={(e) =>  setFilterData(e.target.value, "fbreakDownDuration")}                          /> */}
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        let data: any = JSON.parse(item?.breakDown);
                        // let value =  (data || []).map((e: any) => {
                        //     return (
                        //         `${e?.startTime} - ${e?.endTime}, ${e?.reason}, ${e?.responsibleDepartment} | `
                        //     );
                        // })
                        let value = ""
                        {(data || []).map((e: any, index: any) => {
                          value += `${e?.startTime} - ${e?.endTime}, ${e?.reason}, ${e?.responsibleDepartment} ${index != data.length - 1 ? " | " : ""}`;
                        })}
                        return (
                            <div
                                className="jfs completed-ellipse table-data"
                                title={value}
                            >
                                {checkValueExist(value)}
                            </div>
                        );
                    }}]
                },
                // {
                //   title: <div className="table-title">Reason for Breakdown</div>,
                //   dataIndex: "",
                //   width: 200,

                //   children: [
                //     {
                //       title: (
                //         <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                //           {/*  <Input type="search"
                //             className="small-input-filter jc"
                //             placeholder="Enter"
                //             style={{ width: "140px" }}
                //             value={pendingFilter?.fdieFailureReason}
                //             onChange={(e) => setFilterData(e.target.value, "fdieFailureReason")}
                //           /> */}
                //         </div>
                //       ),
                //       width: 200,
                //       render: (item: any) => {
                //         let breakDown = item?.breakDown && JSON.parse(item?.breakDown)[0];
                //         return (
                //           <>
                //             <div className="table-data">{breakDown ? breakDown?.reason : '-'}</div>
                //           </>
                //         );
                //       },
                //     },
                //   ],
                // },
                // {
                //   title: (
                //     <div className="table-title">
                //       Responsible Department for Breakdown
                //     </div>
                //   ),
                //   dataIndex: "",
                //   width: 300,

                //    children: [
                //     {
                //       title: (
                //         <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                //           {/*  <Input type="search"
                //             className="small-input-filter jc"
                //             placeholder="Enter"
                //             style={{ width: "140px" }}
                //             value={pendingFilter?.fdieFailureReason}
                //             onChange={(e) => setFilterData(e.target.value, "fdieFailureReason")}
                //           /> */}
                //         </div>
                //       ),
                //       width: 200,
                //       render: (item: any) => {
                //         let breakDown = item?.breakDown && JSON.parse(item?.breakDown)[0];
                //         return (
                //           <>
                //             <div className="table-data">{breakDown ? breakDown?.responsibleDepartment : '-'}</div>
                //           </>
                //         );
                //       },
                //     },
                //   ],
                // },
                {
                  title: <div className="table-title">Breakdown Duration</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.fbreakDownDuration}
                            onChange={(e) =>  setFilterData(e.target.value, "fbreakDownDuration")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.breakDownDuration)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: (
                    <div className="table-title">Log end scrap length (mm)</div>
                  ),
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.flogEndScrapLengthInMm}
                            onChange={(e) =>  setFilterData(e.target.value, "flogEndScrapLengthInMm")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.logEndScrapLengthInMm)}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Log end Scrap(Kgs)</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            style={{ width: "140px" }}
                            value={pendingFilter?.flogEndScrapInKgs}
                            onChange={(e) =>  setFilterData(e.target.value, "flogEndScrapInKgs")}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.logEndScrapInKgs)}</div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                {
                  title: <div className="table-title">Operator Name</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            value={pendingFilter?.foperatorName}
                            onChange={(e) =>  setFilterData(e.target.value, "foperatorName")}
                            style={{ width: "140px" }}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.operatorName)}</div>
                          </>
                        );
                      },
                    },
                  ],
                
                },
                {
                  title: <div className="table-title">Operator Remarks</div>,
                  dataIndex: "",
                  width: 200,

                  align: "center",
                  ellipsis: true,
                  children: [
                    {
                      title: (
                        <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <Input type="search"
                            className="small-input-filter jc"
                            placeholder="Enter"
                            value={pendingFilter?.foperatorEntryRemarks}
                            onChange={(e) =>  setFilterData(e.target.value, "foperatorEntryRemarks")}
                            style={{ width: "140px" }}
                          />
                        </div>
                      ),
                      width: 200,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {item?.operatorEntryRemarks != null &&
                                item?.operatorEntryRemarks?.length > 0
                                ? item?.operatorEntryRemarks
                                : "-"}
                            </div>
                          </>
                        );
                      },
                    },
                  ],
                 
                },
                // {
                //   title: <div className="table-title">Finish Quantity (Kgs)</div>,
                //   dataIndex: "",
                //   width: 200,
                //   align: "center",
                //   children: [
                //     {
                //       title: (
                //         <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                //            <Input type="search"
                //             className="small-input-filter jc"
                //             placeholder="Enter"
                //             style={{ width: "140px" }}
                //             value={pendingFilter?.ffinishQuantity}
                //             onChange={(e) =>  setFilterData(e.target.value, "ffinishQuantity")}
                //           />
                //         </div>
                //       ),
                //       width: 200,
                //       render: (item: any) => {
                //         return (
                //           <>
                //             <div className="table-data">{checkValueExist(item?.finishQuantity)}</div>
                //           </>
                //         );
                //       },
                //     },
                //   ],
                  
                // },
                // {
                //   title: <div className="table-title">No. of Pcs Per Bundle</div>,
                //   dataIndex: "",
                //   width: 200,
                //   align: "center",
                //   children: [
                //     {
                //       title: (
                //         <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                //            <Input type="search"
                //             className="small-input-filter jc"
                //             placeholder="Enter"
                //             style={{ width: "140px" }}
                //             value={pendingFilter?.fpiecesPerBundle}
                //             onChange={(e) =>  setFilterData(e.target.value, "fpiecesPerBundle")}
                            
                //           />
                //         </div>
                //       ),
                //       width: 200,
                //       render: (item: any) => {
                //         return (
                //           <>
                //             <div className="table-data">{checkValueExist(item?.piecesPerBundle)}</div>
                //           </>
                //         );
                //       },
                //     },
                //   ],
                // },
                // {
                //   title: <div className="table-title">Bundle Weight(Kg)</div>,
                //   dataIndex: "",
                //   width: 200,
                //   children: [
                //     {
                //       title: (
                //         <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                //            <Input type="search"
                //             className="small-input-filter jc"
                //             placeholder="Enter"
                //             style={{ width: "140px" }}
                //             value={pendingFilter?.fbundleWeight}
                //             onChange={(e) =>  setFilterData(e.target.value, "fbundleWeight")}
                //           />
                //         </div>
                //       ),
                //       width: 200,
                //       render: (item: any) => {
                //         return (
                //           <div className="table-data">{checkValueExist(item?.bundleWeight)}</div>
                //         );
                //       },
                //     },
                //   ],
                // },
                // {
                //   title: <div className="table-title">No. of Bundles</div>,
                //   dataIndex: "",
                //   width: 200,
                //   children: [
                //     {
                //       title: (
                //         <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                //            <Input type="search"
                //             className="small-input-filter jc"
                //             placeholder="Enter"
                //             style={{ width: "140px" }}
                //             value={pendingFilter?.fnoOfBundles}
                //             onChange={(e) =>  setFilterData(e.target.value, "fnoOfBundles")}
                //           />
                //         </div>
                //       ),
                //       width: 200,
                //       render: (item: any) => {
                //         return (
                //           <div className="table-data">{checkValueExist(item?.noOfBundles)}</div>
                //         );
                //       },
                //     },
                //   ],
                // },
                // {
                //   title: <div className="table-title">Total No.of Pcs</div>,
                //   dataIndex: "",
                //   width: 200,
                //   align: "center",
                //   children: [
                //     {
                //       title: (
                //         <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                //            <Input type="search"
                //             className="small-input-filter jc"
                //             placeholder="Enter"
                //             style={{ width: "140px" }}
                //             value={pendingFilter?.ftotalNoOfPieces}
                //             onChange={(e) =>  setFilterData(e.target.value, "ftotalNoOfPieces")}
                //           />
                //         </div>
                //       ),
                //       width: 200,
                //       render: (item: any) => {
                //         return (
                //           <>
                //             <div className="table-data">{checkValueExist(item?.totalNoOfPieces)}</div>
                //           </>
                //         );
                //       },
                //     },
                //   ],
                  
                // },
                // {
                //   title: <div className="table-title">Correction Qty(Kgs)</div>,
                //   dataIndex: "",
                //   width: 200,
                //   children: [
                //     {
                //       title: (
                //         <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                //            <Input type="search"
                //             className="small-input-filter jc"
                //             placeholder="Enter"
                //             style={{ width: "140px" }}
                //             value={pendingFilter?.fcorrectionQty}
                //             onChange={(e) =>  setFilterData(e.target.value, "fcorrectionQty")}
                //           />
                //         </div>
                //       ),
                //       width: 200,
                //       render: (item: any) => {
                //         return (
                //           <div className="table-data">{checkValueExist(item?.correctionQty)}</div>
                //         );
                //       },
                //     },
                //   ],
                // },
                // {
                //   title: (
                //     <div className="table-title">
                //       Actual Front end coring length(mm)
                //     </div>
                //   ),
                //   dataIndex: "",
                //   width: 300,
                //   children: [
                //     {
                //       title: (
                //         <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                //            <Input type="search"
                //             className="small-input-filter jc"
                //             placeholder="Enter"
                //             style={{ width: "140px" }}
                //             value={pendingFilter?.factualFrontEndCoringLength}
                //             onChange={(e) =>  setFilterData(e.target.value, "factualFrontEndCoringLength")}
                //           />
                //         </div>
                //       ),
                //       width: 200,
                //       render: (item: any) => {
                //         return (
                //           <div className="table-data">{checkValueExist(String(item?.actualFrontEndCoringLength))}</div>
                //         );
                //       },
                //     },
                //   ],
                // },
                // {
                //   title: (
                //     <div className="table-title">
                //       Actual Back end coring length(mm)
                //     </div>
                //   ),
                //   dataIndex: "",
                //   width: 300,
                //   children: [
                //     {
                //       title: (
                //         <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                //            <Input type="search"
                //             className="small-input-filter jc"
                //             placeholder="Enter"
                //             style={{ width: "140px" }}
                //             value={pendingFilter?.factualBackEndCoringLength}
                //             onChange={(e) =>  setFilterData(e.target.value, "factualBackEndCoringLength")}
                //           />
                //         </div>
                //       ),
                //       width: 200,
                //       render: (item: any) => {
                //         return (
                //           <div className="table-data">{checkValueExist(String(item?.actualBackEndCoringLength))}</div>
                //         );
                //       },
                //     },
                //   ],
                // },
                // {
                //   title: <div className="table-title">Recovery(Calculated)</div>,
                //   dataIndex: "",
                //   width: 200,
                //   children: [
                //     {
                //       title: (
                //         <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                //            <Input type="search"
                //             className="small-input-filter jc"
                //             placeholder="Enter"
                //             style={{ width: "140px" }}
                //             value={pendingFilter?.frecovery}
                //             onChange={(e) =>  setFilterData(e.target.value, "frecovery")}
                //           />
                //         </div>
                //       ),
                //       width: 200,
                //       render: (item: any) => {
                //         return (
                //           <>
                //             <div className="table-data">{checkValueExist(item?.recovery)}</div>
                //           </>
                //         );
                //       },
                //     },
                //   ],
                // },
                // {
                //   title: <div className="table-title">Bundling Remarks</div>,
                //   dataIndex: "",
                //   width: 200,
                //   children: [
                //     {
                //       title: (
                //         <div className="clear-close-input-inprogress js" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                //            <Input type="search"
                //             className="small-input-filter jc"
                //             placeholder="Enter"
                //             style={{ width: "140px" }}
                //             value={pendingFilter?.fbundlingSupervisorRemarks}
                //             onChange={(e) =>  setFilterData(e.target.value, "fbundlingSupervisorRemarks")}
                            
                //           />
                //         </div>
                //       ),
                //       width: 200,
                //       render: (item: any) => {
                //         return (
                //           <>
                //             <div className="table-data">{checkValueExist(item?.bundlingSupervisorRemarks)}</div>
                //           </>
                //         );
                //       },
                //     },
                //   ],
                // },
              ];

              const columns =
              user?.roleId === 2
                ? [
                  {
                    title: (
                      <div className="jc">
                        <img
                          src={AppImages?.filterIcon}
                          onClick={() => setFilterMenu(!filterMenu)}
                        />
                        <div className="table-title">PO No.</div>
                      </div>
                    ),
                    dataIndex: "",
                    width: 250,
                    fixed: "left",
                    render: (item: any, _: any, index: any) => {
                      return (
                        <div className="table-with-checkbox-data jc">
                          <div className="table-data">
                            {item?.poNo != null ? item?.poNo : "-"}
                          </div>
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="table-title">Customer Name</div>,
                    dataIndex: "",
                    width: 200,
                    fixed: "left",
                    align: "center",
                    ellipsis: true,
                    render: (item: any) => {
                      return <div className="table-data">{checkValueExist(item?.customer_name)} </div>;
                    },
                  },
                  {
                    title: <div className="table-title">Sales Order No.</div>,
                    dataIndex: "",
                    width: 200,
                    align: "center",
                    ellipsis: true,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.soNo != null ? item?.soNo : "-"}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="table-title">Section No.</div>,
                    dataIndex: "",
                    width: 200,
        
                    align: "center",
                    ellipsis: true,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                          {item?.sectionNo != null && item?.sectionNo?.length > 0
                            ? item?.sectionNo
                            : "-"}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="table-title">Alloy Temper</div>,
                    dataIndex: "",
                    width: 200,
        
                    align: "center",
                    ellipsis: true,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.alloyTemper != null && item?.alloyTemper?.length > 0
                            ? item?.alloyTemper
                            : "-"}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="table-title">PO Total Quantity</div>,
                    width: 200,
                    dataIndex: "",
        
                    align: "center",
                    ellipsis: true,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.po_qty != null ? item?.po_qty : "-"}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="table-title">Extruded Quantity (Kgs)</div>,
                    dataIndex: "",
                    width: 200,
        
                    align: "center",
                    ellipsis: true,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.extruded_qty != null &&
                            item?.extruded_qty?.length > 0
                            ? item?.extruded_qty
                            : "-"}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="table-title">Balance PO Quantity</div>,
                    dataIndex: "",
                    width: 200,
        
                    align: "center",
                    ellipsis: true,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.balance_po_qty != null &&
                            item?.balance_po_qty?.length > 0
                            ? item?.balance_po_qty
                            : "-"}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="table-title">Cut Length</div>,
                    dataIndex: "",
                    width: 200,
                    align: "center",
                    ellipsis: true,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.cut_len != null && item?.cut_len?.length > 0
                            ? item?.cut_len
                            : "-"}
                        </div>
                      );
                    },
                  },
                  {
                    title: (
                      <div className="table-title">Cut Length tolerance (mm)</div>
                    ),
                    dataIndex: "",
                    width: 200,
        
                    align: "center",
                    ellipsis: true,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.cut_len_tolerance != null &&
                            item?.cut_len_tolerance?.length > 0
                            ? item?.cut_len_tolerance
                            : "-"}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="table-title">Quantity Tolerance (%)</div>,
                    dataIndex: "",
                    width: 150,
        
                    align: "center",
                    ellipsis: true,
                    render: (item: any) => {
                      return (
                        <div className="table-data">
                          {item?.qty_tolerance != null &&
                            item?.qty_tolerance?.length > 0
                            ? item?.qty_tolerance
                            : "-"}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="table-title">Priority assignment</div>,
                    dataIndex: "",
                    width: 200,
                    align: "center",
                    ellipsis: true,
                    render: (item: any) => {
                      return (
                        //Immediate
                        <div
                          className={
                            item?.priority == "High"
                              ? "table-data_immediate"
                              : "table-data"
                          }
                        >
                          {item?.priority != null && item?.priority?.length > 0
                            ? item?.priority
                            : "-"}
                        </div>
                      );
                    },
                  },
                  {
                    title: <div className="table-title">Marketing remarks</div>,
                    dataIndex: "",
                    width: 200,
        
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data" title={item?.marketing_remarks}>
                            {item?.marketing_remarks != null &&
                            item?.marketing_remarks?.length > 0
                            ? item?.marketing_remarks
                            : "-"}
                        </div>
                      );
                    },
                  },
                  // other columns...
                ]
                : user?.roleId === 3
                  ? [
                    {
                      title: (
                        <div className="jc">
                          <img
                            src={AppImages?.filterIcon}
                            onClick={() => setFilterMenu(!filterMenu)}
                          />
                          <div className="table-title">PO No.</div>
                        </div>
                      ),
                      dataIndex: "",
                      key: "PO No.",
                      width: 250,
                      fixed: "left",
                      render: (item: any, _: any, index: any) => {
                        return (
                          <div className="table-with-checkbox-data jc">
                            <div className="table-data">
                              {item?.poNo != null ? item?.poNo : "-"}
                            </div>
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Customer Name</div>,
                      dataIndex: "",
                      width: 200,
                      fixed: "left",
                      align: "center",
                      key: "Customer Name",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data" title={item?.customer_name}>
                            {item?.customer_name != null ? item?.customer_name : "-"}{" "}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Sales Order No.</div>,
                      dataIndex: "",
                      width: 200,
                      key: "Sales Order No.",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.soNo != null ? item?.soNo : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Section No.</div>,
                      dataIndex: "",
                      width: 200,
                      key: "Section No.",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                            {item?.sectionNo != null && item?.sectionNo?.length > 0
                              ? item?.sectionNo
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Alloy Temper</div>,
                      dataIndex: "",
                      width: 200,
                      key: "Alloy Temper",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.alloyTemper != null && item?.alloyTemper?.length > 0
                              ? item?.alloyTemper
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">PO Total Quantity</div>,
                      width: 200,
                      dataIndex: "",
                      key: "PO Total Quantity",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.po_qty != null ? item?.po_qty : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Extruded Quantity (Kgs)</div>,
                      dataIndex: "",
                      width: 200,
                      key: "Extruded Quantity (Kgs)",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.extruded_qty != null &&
                              item?.extruded_qty?.length > 0
                              ? item?.extruded_qty
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">Balance PO Quantity(Kgs)</div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "Balance PO Quantity(Kgs)",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.balance_po_qty != null &&
                              item?.balance_po_qty?.length > 0
                              ? item?.balance_po_qty
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Cut Length</div>,
                      dataIndex: "",
                      width: 200,
                      key: "Cut Length",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.cut_len != null && item?.cut_len?.length > 0
                              ? item?.cut_len
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">Cut Length tolerance (mm)</div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "Cut Length tolerance ",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.cut_len_tolerance != null &&
                              item?.cut_len_tolerance?.length > 0
                              ? item?.cut_len_tolerance
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Quantity Tolerance (%)</div>,
                      dataIndex: "",
                      width: 200,
                      key: "Quantity Tolerance",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.qty_tolerance != null &&
                              item?.qty_tolerance?.length > 0
                              ? item?.qty_tolerance
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Priority assignment</div>,
                      dataIndex: "",
                      width: 200,
                      key: "Priority assignment",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          //Immediate
                          <div
                            className={
                              item?.priority == "High"
                                ? "table-data_immediate"
                                : "table-data"
                            }
                          >
                            {item?.priority != null && item?.priority?.length > 0
                              ? item?.priority
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Marketing remarks</div>,
                      dataIndex: "",
                      width: 200,
                      key: "Marketing",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data" title={item?.marketing_remarks}>
                            {item?.marketing_remarks != null &&
                              item?.marketing_remarks?.length > 0
                              ? item?.marketing_remarks
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">{AppConstants.plantSelected}</div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "plantSelected",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                              <div className="table-data">{checkValueExist(item?.plantSelected)}</div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.pressAllocation}
                        </div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "pressAllocation",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                              <div className="table-data">{checkValueExist(item?.pressAllocation)}</div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.plannedQuantity}
                        </div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "plannedQuantity",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.plannedQty)}</div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.plannedInternalAlloy}
                        </div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "plannedInternalAlloy",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {checkValueExist(item?.plannedInternalAlloy)}
                            </div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.plannedNoOfBillets}
                        </div>
                      ),
                      dataIndex: "",
                      width: 300,
                      key: "plannedNoOfBillets",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        let billetLength: any =
                          item?.plannedNoOfBilletAndLength &&
                          JSON.parse(item?.plannedNoOfBilletAndLength);
                          let billetString = ""
                          {(billetLength || []).map((e: any, index: any) => {
                            billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                          })}  
                          let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                          billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                          return (
                            <>
                              <div
                                className="jfs ellipse-none table-data"
                                style={{ marginLeft: "25px" }}
                                title={billetString}
                              >
                               {isArrayNotEmpty(billetLength) ? billetString : "-"}
                              </div>
                            </>
                          );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">{AppConstants.prodRateReq}</div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "prodRateReq",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                              <div className="table-data">
                                {checkValueExist(item?.productionRateRequired)}
                              </div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.plannedQuenching}
                        </div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "plannedQuenching",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                              <div className="table-data">{checkValueExist(item?.plannedQuenching)}</div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.plannedFrontEndCoringLength}
                        </div>
                      ),
                      dataIndex: "",
                      width: 300,
                      key: "plannedFrontEndCoringLength",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                              <div className="table-data">
                                {checkValueExist(String(item?.frontEndCoringLength))}
                              </div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.plannedBackEndCoringLength}
                        </div>
                      ),
                      dataIndex: "",
                      width: 300,
                      key: "plannedBackEndCoringLength",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                              <div className="table-data">
                                {checkValueExist(String(item?.backEndCoringLength))}
                              </div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.plannedExtrusionLength}
                        </div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "plannedExtrusionLength",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                            {
                            (item?.plantExtrusionLength && item?.extrusionLength) ? 
                            item?.plantExtrusionLength+" "+item?.extrusionLength
                            : '-'
                            }
                            </div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.plannedButtThickness}
                        </div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "plannedButtThickness",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                              <div className="table-data">
                                {checkValueExist(item?.plannedButtThickness)}
                              </div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">{AppConstants.cutBillet}</div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "cutBillet",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                              <div className="table-data">{checkValueExist(item?.cutBillets)}</div>
                            
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.buttWeightPerInch}
                        </div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "buttWeightPerInch",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                              <div className="table-data">
                                {checkValueExist(item?.buttWeightPerInch)}
                              </div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">{AppConstants.ppcRemarks}</div>
                      ),
                      dataIndex: "",
                      width: 200,
                      key: "ppcRemarks",
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data" title={item?.ppcRemarks}>
                              {(item?.ppcRemarks != null &&
                                item?.ppcRemarks?.length > 0)
                                ? item?.ppcRemarks
                                : "-"}
                            </div>
                          </>
                        );
                      },
                    },
                    // other columns...
                  ]
                  : user?.roleId === 4
                    ? [
                      {
                        title: (
                          <div className="jc">
                            <img
                              src={AppImages?.filterIcon}
                              onClick={() => setFilterMenu(!filterMenu)}
                            />
                            <div className="table-title">PO No.</div>
                          </div>
                        ),
                        dataIndex: "",
                        width: 250,
                        fixed: "left",
                        render: (item: any, _: any, index: any) => {
                          return (
                            <div className="table-with-checkbox-data jc">
                              <div className="table-data">
                                {item?.poNo != null ? item?.poNo : "-"}
                              </div>
                            </div>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">Customer Name</div>,
                        dataIndex: "",
                        width: 200,
                        fixed: "left",
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return <div className="table-data">{checkValueExist(item?.customer_name)} </div>;
                        },
                      },
                      {
                        title: <div className="table-title">Sales Order No.</div>,
                        dataIndex: "",
                        width: 200,
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <div className="table-data">
                              {item?.soNo != null ? item?.soNo : "-"}
                            </div>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">Section No.</div>,
                        dataIndex: "",
                        width: 200,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <div className="table-data">
                              {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                              {item?.sectionNo != null && item?.sectionNo?.length > 0
                                ? item?.sectionNo
                                : "-"}
                            </div>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">Alloy Temper</div>,
                        dataIndex: "",
                        width: 200,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <div className="table-data">
                              {item?.alloyTemper != null && item?.alloyTemper?.length > 0
                                ? item?.alloyTemper
                                : "-"}
                            </div>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">PO Total Quantity</div>,
                        width: 200,
                        dataIndex: "",
        
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.po_qty != null ? item?.po_qty : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Extruded Quantity (Kgs)</div>,
                      dataIndex: "",
                      width: 200,
        
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.extruded_qty != null &&
                            item?.extruded_qty?.length > 0
                              ? item?.extruded_qty
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Balance PO Quantity</div>,
                      dataIndex: "",
                      width: 200,
        
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.balance_po_qty != null &&
                            item?.balance_po_qty?.length > 0
                              ? item?.balance_po_qty
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Cut Length</div>,
                      dataIndex: "",
                      width: 200,
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.cut_len != null && item?.cut_len?.length > 0
                              ? item?.cut_len
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">Cut Length tolerance (mm)</div>
                      ),
                      dataIndex: "",
                      width: 200,
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.cut_len_tolerance != null &&
                            item?.cut_len_tolerance?.length > 0
                              ? item?.cut_len_tolerance
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Quantity Tolerance (%)</div>,
                      dataIndex: "",
                      width: 150,
        
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data">
                            {item?.qty_tolerance != null &&
                            item?.qty_tolerance?.length > 0
                              ? item?.qty_tolerance
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Priority assignment</div>,
                      dataIndex: "",
                      width: 200,
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          //Immediate
                          <div
                            className={
                              item?.priority == "High"
                                ? "table-data_immediate"
                                : "table-data"
                            }
                          >
                            {item?.priority != null && item?.priority?.length > 0
                              ? item?.priority
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: <div className="table-title">Marketing remarks</div>,
                      dataIndex: "",
                      width: 200,
        
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <div className="table-data" title={item?.marketing_remarks}>
                            {item?.marketing_remarks != null &&
                            item?.marketing_remarks?.length > 0
                              ? item?.marketing_remarks
                              : "-"}
                          </div>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">{AppConstants.plantSelected}</div>
                      ),
                      dataIndex: "",
                      width: 200,
        
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.plantSelected)}</div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.pressAllocation}
                        </div>
                      ),
                      dataIndex: "",
                      width: 200,
        
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.pressAllocation)}</div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.plannedQuantity}
                        </div>
                      ),
                      dataIndex: "",
                      width: 200,
        
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">{checkValueExist(item?.plannedQty)}</div>
                          </>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="table-title">
                          {AppConstants.plannedInternalAlloy}
                        </div>
                      ),
                      dataIndex: "",
                      width: 200,
        
                      align: "center",
                      ellipsis: true,
                      render: (item: any) => {
                        return (
                          <>
                            <div className="table-data">
                              {item?.po_qty != null ? item?.po_qty : "-"}
                            </div>
                          </>
                          );
                        },
                      },
                      {
                        title: (
                          <div className="table-title">
                            {AppConstants.plannedNoOfBillets}
                          </div>
                        ),
                        dataIndex: "",
                        width: 300,
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          let billetLength: any =
                            item?.plannedNoOfBilletAndLength &&
                            JSON.parse(item?.plannedNoOfBilletAndLength);
                            let billetString = ""
                            {(billetLength || []).map((e: any, index: any) => {
                              billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                            })}  
                            let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                            billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                            return (
                              <>
                                <div
                                  className="jfs ellipse-none table-data"
                                  style={{ marginLeft: "25px" }}
                                  title={billetString}
                                >
                                 {isArrayNotEmpty(billetLength) ? billetString : "-"}
                                </div>
                              </>
                            );
                        },
                      },
                      {
                        title: (
                          <div className="table-title">{AppConstants.prodRateReq}</div>
                        ),
                        dataIndex: "",
                        width: 200,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">
                                {checkValueExist(item?.productionRateRequired)}
                              </div>
                            </>
                          );
                        },
                      },
                      {
                        title: (
                          <div className="table-title">
                            {AppConstants.plannedQuenching}
                          </div>
                        ),
                        dataIndex: "",
                        width: 200,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">{checkValueExist(item?.plannedQuenching)}</div>
                            </>
                          );
                        },
                      },
                      {
                        title: (
                          <div className="table-title">
                            {AppConstants.plannedFrontEndCoringLength}
                          </div>
                        ),
                        dataIndex: "",
                        width: 300,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">
                                {checkValueExist(String(item?.frontEndCoringLength))}
                              </div>
                            </>
                          );
                        },
                      },
                      {
                        title: (
                          <div className="table-title">
                            {AppConstants.plannedBackEndCoringLength}
                          </div>
                        ),
                        dataIndex: "",
                        width: 300,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">
                                {checkValueExist(String(item?.backEndCoringLength))}
                              </div>
                            </>
                          );
                        },
                      },
                      {
                        title: (
                          <div className="table-title">
                            {AppConstants.plannedExtrusionLength}
                          </div>
                        ),
                        dataIndex: "",
                        width: 200,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">
                              {
                              (item?.plantExtrusionLength && item?.extrusionLength) ? 
                              item?.plantExtrusionLength+" "+item?.extrusionLength
                              : '-'
                              }
                              </div>
                            </>
                          );
                        },
                      },
                      {
                        title: (
                          <div className="table-title">
                            {AppConstants.plannedButtThickness}
                          </div>
                        ),
                        dataIndex: "",
                        width: 200,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">
                                {checkValueExist(item?.plannedButtThickness)}
                              </div>
                            </>
                          );
                        },
                      },
                      {
                        title: (
                          <div className="table-title">{AppConstants.cutBillet}</div>
                        ),
                        dataIndex: "",
                        width: 200,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">{checkValueExist(item?.cutBillets)}</div>
                            </>
                          );
                        },
                      },
                      {
                        title: (
                          <div className="table-title">
                            {AppConstants.buttWeightPerInch}
                          </div>
                        ),
                        dataIndex: "",
                        width: 200,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">{checkValueExist(item?.buttWeightPerInch)}</div>
                            </>
                          );
                        },
                      },
                      {
                        title: (
                          <div className="table-title">{AppConstants.ppcRemarks}</div>
                        ),
                        dataIndex: "",
                        width: 200,
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">
                                {(item?.ppcRemarks != null &&
                                  item?.ppcRemarks?.length > 0)
                                  ? item?.ppcRemarks
                                  : "-"}
                              </div>
                            </>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">DIE</div>,
                        dataIndex: "",
                        width: 200,
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">{checkValueExist(item?.die)}</div>
                            </>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">No. of Cavity</div>,
                        dataIndex: "",
                        width: 200,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">{checkValueExist(item?.noOfCavity)}</div>
                            </>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">Bolster Entry</div>,
                        dataIndex: "",
                        width: 200,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">{checkValueExist(item?.bolsterEntry)}</div>
                            </>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">Backer Entry</div>,
                        dataIndex: "",
                        width: 200,
        
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">{checkValueExist(item?.backerEntry)}</div>
                            </>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">Special Baker Entry</div>,
                        dataIndex: "",
                        width: 200,
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">{checkValueExist(item?.specialBackerEntry)}</div>
                            </>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">Ring Entry</div>,
                        dataIndex: "",
                        width: 200,
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">{checkValueExist(item?.ringEntry)}</div>
                            </>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">Welding Chamber</div>,
                        dataIndex: "",
                        width: 200,
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">{checkValueExist(item?.weldingChamber)}</div>
                            </>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">Die Setter</div>,
                        dataIndex: "",
                        width: 200,
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data">{checkValueExist(item?.dieSetter)}</div>
                            </>
                          );
                        },
                      },
                      {
                        title: <div className="table-title">Tool Shop Remarks</div>,
                        dataIndex: "",
                        width: 200,
                        align: "center",
                        ellipsis: true,
                        render: (item: any) => {
                          return (
                            <>
                              <div className="table-data" title={item?.toolShopRemarks}>
                                {item?.toolShopRemarks != null &&
                                  item?.toolShopRemarks?.length > 0
                                  ? item?.toolShopRemarks
                                  : "-"}
                              </div>
                            </>
                          );
                        },
                      },
                      // other columns...
                    ]
                    : user?.roleId === 5
                      ? [
                        {
                          title: (
                            <div className="jc">
                              <img
                                src={AppImages?.filterIcon}
                                onClick={() => setFilterMenu(!filterMenu)}
                              />
                              <div className="table-title">PO No.</div>
                            </div>
                          ),
                          dataIndex: "",
                          width: 250,
                          fixed: "left",
                          render: (item: any, _: any, index: any) => {
                            return (
                              <div className="table-with-checkbox-data jc">
                                <div className="table-data">
                                  {item?.poNo != null ? item?.poNo : "-"}
                                </div>
                              </div>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Customer Name</div>,
                          dataIndex: "",
                          width: 200,
                          fixed: "left",
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <div className="table-data" title={item?.customer_name}>
                                {item?.customer_name != null ? item?.customer_name : "-"}{" "}
                              </div>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Sales Order No.</div>,
                          dataIndex: "",
                          width: 200,
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <div className="table-data">
                                {item?.soNo != null ? item?.soNo : "-"}
                              </div>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Section No.</div>,
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <div className="table-data">
                                {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                                {item?.sectionNo != null && item?.sectionNo?.length > 0
                                  ? item?.sectionNo
                                  : "-"}
                              </div>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Alloy Temper</div>,
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <div className="table-data">
                                {item?.alloyTemper != null && item?.alloyTemper?.length > 0
                                  ? item?.alloyTemper
                                  : "-"}
                              </div>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">PO Total Quantity</div>,
                          width: 200,
                          dataIndex: "",
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <div className="table-data">
                                {item?.po_qty != null ? item?.po_qty : "-"}
                              </div>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Extruded Quantity (Kgs)</div>,
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <div className="table-data">
                                {item?.extruded_qty != null &&
                                  item?.extruded_qty?.length > 0
                                  ? item?.extruded_qty
                                  : "-"}
                              </div>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">Balance PO Quantity(Kgs)</div>
                          ),
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <div className="table-data">
                                {item?.balance_po_qty != null &&
                                  item?.balance_po_qty?.length > 0
                                  ? item?.balance_po_qty
                                  : "-"}
                              </div>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Cut Length</div>,
                          dataIndex: "",
                          width: 200,
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <div className="table-data">
                                {item?.cut_len != null && item?.cut_len?.length > 0
                                  ? item?.cut_len
                                  : "-"}
                              </div>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">Cut Length tolerance (mm)</div>
                          ),
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <div className="table-data">
                                {item?.cut_len_tolerance != null &&
                                  item?.cut_len_tolerance?.length > 0
                                  ? item?.cut_len_tolerance
                                  : "-"}
                              </div>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Quantity Tolerance (%)</div>,
                          dataIndex: "",
                          width: 150,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <div className="table-data">
                                {item?.qty_tolerance != null &&
                                  item?.qty_tolerance?.length > 0
                                  ? item?.qty_tolerance
                                  : "-"}
                              </div>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Priority assignment</div>,
                          dataIndex: "",
                          width: 200,
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              //Immediate
                              <div
                                className={
                                  item?.priority == "High"
                                    ? "table-data_immediate"
                                    : "table-data"
                                }
                              >
                                {item?.priority != null && item?.priority?.length > 0
                                  ? item?.priority
                                  : "-"}
                              </div>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Marketing remarks</div>,
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <div className="table-data" title={item?.marketing_remarks}>
                                {item?.marketing_remarks != null &&
                                  item?.marketing_remarks?.length > 0
                                  ? item?.marketing_remarks
                                  : "-"}
                              </div>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">{AppConstants.plantSelected}</div>
                          ),
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.plantSelected)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">
                              {AppConstants.pressAllocation}
                            </div>
                          ),
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.pressAllocation)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">
                              {AppConstants.plannedQuantity}
                            </div>
                          ),
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.plannedQty)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">
                              {AppConstants.plannedInternalAlloy}
                            </div>
                          ),
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">
                                  {checkValueExist(item?.plannedInternalAlloy)}
                                </div>
                              </>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">
                              {AppConstants.plannedNoOfBillets}
                            </div>
                          ),
                          dataIndex: "",
                          width: 300,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            let billetLength: any =
                              item?.plannedNoOfBilletAndLength &&
                              JSON.parse(item?.plannedNoOfBilletAndLength);
                              let billetString = ""
                              {(billetLength || []).map((e: any, index: any) => {
                                billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                              })}  
                              let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                              billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                              return (
                                <>
                                  <div
                                    className="jfs ellipse-none table-data"
                                    style={{ marginLeft: "25px" }}
                                    title={billetString}
                                  >
                                    {isArrayNotEmpty(billetLength) ? billetString : "-"}
                                  </div>
                                </>
                              );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">{AppConstants.prodRateReq}</div>
                          ),
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">
                                  {checkValueExist(item?.productionRateRequired)}
                                </div>
                              </>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">
                              {AppConstants.plannedQuenching}
                            </div>
                          ),
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.plannedQuenching)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">
                              {AppConstants.plannedFrontEndCoringLength}
                            </div>
                          ),
                          dataIndex: "",
                          width: 300,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">
                                  {checkValueExist(String(item?.frontEndCoringLength))}
                                </div>
                              </>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">
                              {AppConstants.plannedBackEndCoringLength}
                            </div>
                          ),
                          dataIndex: "",
                          width: 300,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">
                                  {checkValueExist(String(item?.backEndCoringLength))}
                                </div>
                              </>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">
                              {AppConstants.plannedExtrusionLength}
                            </div>
                          ),
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">
                                {
                                (item?.plantExtrusionLength && item?.extrusionLength) ? 
                                item?.plantExtrusionLength+" "+item?.extrusionLength
                                : '-'
                                }
                              </div>
                              </>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">
                              {AppConstants.plannedButtThickness}
                            </div>
                          ),
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">
                                  {checkValueExist(item?.plannedButtThickness)}
                                </div>
                              </>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">{AppConstants.cutBillet}</div>
                          ),
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.cutBillets)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">
                              {AppConstants.buttWeightPerInch}
                            </div>
                          ),
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.buttWeightPerInch)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: (
                            <div className="table-title">{AppConstants.ppcRemarks}</div>
                          ),
                          dataIndex: "",
                          width: 200,
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data" title={item?.ppcRemarks}>
                                  {(item?.ppcRemarks != null &&
                                    item?.ppcRemarks?.length > 0)
                                    ? item?.ppcRemarks
                                    : "-"}
                                </div>
                              </>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">DIE</div>,
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.die)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">No. of Cavity</div>,
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.noOfCavity)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Bolster Entry</div>,
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.bolsterEntry)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Backer Entry</div>,
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.backerEntry)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Special Baker Entry</div>,
                          dataIndex: "",
                          width: 200,
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.specialBackerEntry)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Ring Entry</div>,
                          dataIndex: "",
                          width: 200,
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.ringEntry)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Welding Chamber</div>,
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.weldingChamber)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Die Setter</div>,
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data">{checkValueExist(item?.dieSetter)}</div>
                              </>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">Tool Shop Remarks</div>,
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data" title={item?.toolShopRemarks}>
                                  {item?.toolShopRemarks != null &&
                                    item?.toolShopRemarks?.length > 0
                                    ? item?.toolShopRemarks
                                    : "-"}
                                </div>
                              </>
                            );
                          },
                        },
                        {
                          title: <div className="table-title">QA Remarks</div>,
                          dataIndex: "",
                          width: 200,
        
                          align: "center",
                          ellipsis: true,
                          render: (item: any) => {
                            return (
                              <>
                                <div className="table-data" title={item?.qaRemarks}>
                                  {item?.qaRemarks != null && item?.qaRemarks?.length > 0
                                    ? item?.qaRemarks
                                    : "-"}{" "}
                                </div>
                              </>
                            );
                          },
                        },
                      ]
                      : user?.roleId === 6
                        ? [
                          {
                            title: (
                              <div className="jc">
                                <img
                                  src={AppImages?.filterIcon}
                                  onClick={() => setFilterMenu(!filterMenu)}
                                />
                                <div className="table-title">PO No.</div>
                              </div>
                            ),
                            dataIndex: "",
                            width: 250,
                            fixed: "left",
                            render: (item: any, _: any, index: any) => {
                              return (
                                <div className="table-with-checkbox-data jc">
                                  <div className="table-data">
                                    {item?.poNo != null ? item?.poNo : "-"}
                                  </div>
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Customer Name</div>,
                            dataIndex: "",
                            width: 200,
                            fixed: "left",
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <div className="table-data" title={item?.customer_name}>
                                  {item?.customer_name != null ? item?.customer_name : "-"}{" "}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Sales Order No.</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {item?.soNo != null ? item?.soNo : "-"}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Section No.</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                                  {item?.sectionNo != null && item?.sectionNo?.length > 0
                                    ? item?.sectionNo
                                    : "-"}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Alloy Temper</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {item?.alloyTemper != null && item?.alloyTemper?.length > 0
                                    ? item?.alloyTemper
                                    : "-"}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">PO Total Quantity</div>,
                            width: 200,
                            dataIndex: "",
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {item?.po_qty != null ? item?.po_qty : "-"}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Extruded Quantity (Kgs)</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {item?.extruded_qty != null &&
                                    item?.extruded_qty?.length > 0
                                    ? item?.extruded_qty
                                    : "-"}
                                </div>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">Balance PO Quantity(Kgs)</div>
                            ),
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {item?.balance_po_qty != null &&
                                    item?.balance_po_qty?.length > 0
                                    ? item?.balance_po_qty
                                    : "-"}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Cut Length</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {item?.cut_len != null && item?.cut_len?.length > 0
                                    ? item?.cut_len
                                    : "-"}
                                </div>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">Cut Length tolerance (mm)</div>
                            ),
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {item?.cut_len_tolerance != null &&
                                    item?.cut_len_tolerance?.length > 0
                                    ? item?.cut_len_tolerance
                                    : "-"}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Quantity Tolerance (%)</div>,
                            dataIndex: "",
                            width: 150,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {item?.qty_tolerance != null &&
                                    item?.qty_tolerance?.length > 0
                                    ? item?.qty_tolerance
                                    : "-"}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Priority assignment</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                //Immediate
                                <div
                                  className={
                                    item?.priority == "High"
                                      ? "table-data_immediate"
                                      : "table-data"
                                  }
                                >
                                  {item?.priority != null && item?.priority?.length > 0
                                    ? item?.priority
                                    : "-"}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Marketing remarks</div>,
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <div className="table-data" title={item?.marketing_remarks}>
                                  {item?.marketing_remarks != null &&
                                    item?.marketing_remarks?.length > 0
                                    ? item?.marketing_remarks
                                    : "-"}
                                </div>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">{AppConstants.plantSelected}</div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.plantSelected)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.pressAllocation}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.pressAllocation)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedQuantity}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.plannedQty)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedInternalAlloy}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(item?.plannedInternalAlloy)}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedNoOfBillets}
                              </div>
                            ),
                            dataIndex: "",
                            width: 300,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              let billetLength: any =
                                item?.plannedNoOfBilletAndLength &&
                                JSON.parse(item?.plannedNoOfBilletAndLength);
                                let billetString = ""
                                {(billetLength || []).map((e: any, index: any) => {
                                  billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                                })}  
                                let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                                billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                                return (
                                  <>
                                    <div
                                      className="jfs ellipse-none table-data"
                                      style={{ marginLeft: "25px" }}
                                      title={billetString}
                                    >
                                     {isArrayNotEmpty(billetLength) ? billetString : "-"}
                                    </div>
                                  </>
                                );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">{AppConstants.prodRateReq}</div>
                            ),
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(item?.productionRateRequired)}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedQuenching}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.plannedQuenching)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedFrontEndCoringLength}
                              </div>
                            ),
                            dataIndex: "",
                            width: 300,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(String(item?.frontEndCoringLength))}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedBackEndCoringLength}
                              </div>
                            ),
                            dataIndex: "",
                            width: 300,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(String(item?.backEndCoringLength))}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedExtrusionLength}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                  {
                                  (item?.plantExtrusionLength && item?.extrusionLength) ? 
                                  item?.plantExtrusionLength+" "+item?.extrusionLength
                                  : '-'
                                  }
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedButtThickness}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(item?.plannedButtThickness)}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">{AppConstants.cutBillet}</div>
                            ),
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.cutBillets)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.buttWeightPerInch}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.buttWeightPerInch)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">{AppConstants.ppcRemarks}</div>
                            ),
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data" title={item?.ppcRemarks}>
                                    {(item?.ppcRemarks != null &&
                                      item?.ppcRemarks?.length > 0)
                                      ? item?.ppcRemarks
                                      : "-"}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">DIE</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.die)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">No. of Cavity</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.noOfCavity)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Bolster Entry</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.bolsterEntry)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Backer Entry</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.backerEntry)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Special Baker Entry</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.specialBackerEntry)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Ring Entry</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.ringEntry)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Welding Chamber</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.weldingChamber)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Die Setter</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.dieSetter)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Tool Shop Remarks</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data" title={item?.toolShopRemarks}>
                                    {item?.toolShopRemarks != null &&
                                      item?.toolShopRemarks?.length > 0
                                      ? item?.toolShopRemarks
                                      : "-"}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">QA Remarks</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data" title={item?.qaRemarks}>
                                    {item?.qaRemarks != null && item?.qaRemarks?.length > 0
                                      ? item?.qaRemarks
                                      : "-"}{" "}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Die Trial</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.dieTrial)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Die With Aluminium</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.dieWithAluminium)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">Previous Day Die Continue</div>
                            ),
                            dataIndex: "",
                            width: 300,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(item?.previousDayDie_continue)}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Batch No.</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.batchNo)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Actual Internal Alloy</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(item?.actualInternalAlloy)}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Start Time</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {moment(item?.startTime)?.isValid()
                                    ? moment(item?.startTime)?.format("hh:mm A")
                                    : "-"}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">End Time</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {moment(item?.endTime)?.isValid()
                                      ? moment(item?.endTime)?.format("hh:mm A")
                                      : "-"}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Process Time</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.processTime)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                No.of Billet and Billet Length
                              </div>
                            ),
                            dataIndex: "",
                            width: 300,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              let billetLength: any =
                                item?.noOfBilletAndLength &&
                                JSON.parse(item?.noOfBilletAndLength);
                                let billetString = ""
                                {(billetLength || []).map((e: any, index: any) => {
                                  billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                                })}  
                                let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                                billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                                return (
                                  <>
                                    <div
                                      className="jfs ellipse-none table-data"
                                      style={{ marginLeft: "25px" }}
                                      title={billetString}
                                    >
                                      {isArrayNotEmpty(billetLength) ? billetString : "-"}
                                    </div>
                                  </>
                                );
                            },
                          },
                          {
                            title: <div className="table-title">Actual Butt thickness</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                             
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(item?.actualButtThickness)}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Breakthrough Pressure</div>,
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(item?.breakThroughPressure)}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Push on Billet Length</div>,
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.pushOnBilletLength)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Push Qty (Kgs)</div>,
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.pushQtyInKgs)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Actual Production Rate</div>,
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(String(item?.actualProductionRate))}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Butt Weight (Kgs)</div>,
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.buttWeightInKgs)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Die Fail</div>,
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.diefail)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Die Failure Reason</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.dieFailureReason)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Breakdown</div>,
                            dataIndex: "",
                            width: 400,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              let data: any = JSON.parse(item?.breakDown);
                              // let value =  (data || []).map((e: any) => {
                              //     return (
                              //         `${e?.startTime} - ${e?.endTime}, ${e?.reason}, ${e?.responsibleDepartment} | `
                              //     );
                              // })
                              let value = ""
                              {(data || []).map((e: any, index: any) => {
                                value += `${e?.startTime} - ${e?.endTime}, ${e?.reason}, ${e?.responsibleDepartment} ${index != data.length - 1 ? " | " : ""}`;
                              })}
                              return (
                                  <div
                                      className="jfs completed-ellipse table-data"
                                      title={value}
                                  >
                                      {checkValueExist(value)}
                                  </div>
                              );
                          },
                          },
                          {
                            title: <div className="table-title">Breakdown Duration</div>,
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.breakDownDuration)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">Log end scrap length (mm)</div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(item?.logEndScrapLengthInMm)}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Log end Scrap(Kgs)</div>,
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.logEndScrapInKgs)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Operator Name</div>,
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(item?.operatorName)}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Operator Remarks</div>,
                            dataIndex: "",
                            width: 200,
        
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data" title={item?.operatorRemarks}>
                                    {item?.operatorEntryRemarks != null &&
                                      item?.operatorEntryRemarks?.length > 0
                                      ? item?.operatorEntryRemarks
                                      : "-"}
                                  </div>
                                </>
                              );
                            },
                          },
                        ]
                        :[
                          {
                            title: (
                              <div className="jc">
                                {user?.roleId != 1 && (
                                   <Input
                                    type={"checkbox"}
                                    className="table-title-checkbox"
                                    checked={
                                      checkRecords?.length == getOrderData?.length
                                        ? true
                                        : false
                                    }
                                    onChange={(e: any) => selectAll(e)}
                                  />
                                )}
                                <img
                                  src={AppImages?.filterIcon}
                                  onClick={() => setFilterMenu(!filterMenu)}
                                />
                                <div className="table-title">PO No.</div>
                              </div>
                            ),
                            dataIndex: "",
                            width: 250,
                            fixed: "left",
                            render: (item: any, _: any, index: any) => {
                              return (
                                  <div className="table-data">{checkValueExist(item?.poNo)}</div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Customer Name</div>,
                            dataIndex: "",
                            width: 200,
                            fixed: "left",
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return <div className="table-data">{checkValueExist(item?.customer_name)} </div>;
                            },
                          },
                          {
                            title: <div className="table-title">Sales Order No.</div>,
                            dataIndex: "",
                            width: 200,
                            align: "center",
                            ellipsis: true,
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {checkValueExist(item?.soNo)}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Section No.</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                                  { checkValueExist(item?.sectionNo)}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Process Stage</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return <div className="table-data">{checkValueExist(item?.processStage)}</div>;
                            },
                          },
                          {
                            title: <div className="table-title">Alloy Temper</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  { checkValueExist(item?.alloyTemper)}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">PO Total Quantity</div>,
                            width: 200,
                            dataIndex: "",
        
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {checkValueExist(item?.po_qty)}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Extruded Quantity (Kgs)</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {checkValueExist(item?.extruded_qty)}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Balance PO Quantity</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {checkValueExist(item?.balance_po_qty)}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Cut Length</div>,
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {checkValueExist(item?.cut_len)}
                                </div>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">Cut Length tolerance (mm)</div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {checkValueExist(item?.cut_len_tolerance)}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Quantity Tolerance (%)</div>,
                            dataIndex: "",
                            width: 150,
        
                            render: (item: any) => {
                              return (
                                <div className="table-data">
                                  {checkValueExist(item?.qty_tolerance)}
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Priority assignment</div>,
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              return (
                                //Immediate
                                <div
                                  className={
                                    item?.priority == "Immediate"
                                      ? "table-data_immediate"
                                      : "table-data"
                                  }
                                >
                                  {/* {checkValueExist(item?.priority)} */}
                                  {(item != null && item != undefined && item != "" && item != 'null') ? 
                                      item?.priority
                                      : "-"
                                  }
                                </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Marketing remarks</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                <div className="table-data"  title={item?.marketing_remarks}>
                                  {checkValueExist(item?.marketing_remarks)}
                                </div>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">{AppConstants.plantSelected}</div>
                            ),
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.plantSelected)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.pressAllocation}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.pressAllocation)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedQuantity}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.plannedQty)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedInternalAlloy}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(item?.plannedInternalAlloy)}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedNoOfBillets}
                              </div>
                            ),
                            dataIndex: "",
                            width: 300,
                            render: (item: any) => {
                              let billetLength: any =
                                item?.plannedNoOfBilletAndLength &&
                                JSON.parse(item?.plannedNoOfBilletAndLength);
                                let billetString = ""
                                {(billetLength || []).map((e: any, index: any) => {
                                  billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                                })}  
                                let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                                billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                                return (
                                  <>
                                    <div
                                      className="jfs ellipse-none table-data"
                                      style={{ marginLeft: "25px" }}
                                      title={billetString}
                                    >
                                     {isArrayNotEmpty(billetLength) ? billetString : "-"}
                                    </div>
                                  </>
                                );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">{AppConstants.prodRateReq}</div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(item?.productionRateRequired)}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedQuenching}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                    <div className="table-data">
                                      {checkValueExist(item?.plannedQuenching)}
                                    </div>
                                 
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedFrontEndCoringLength}
                              </div>
                            ),
                            dataIndex: "",
                            width: 300,
        
                            render: (item: any) => {
                              return (
                                    <div className="table-data">
                                      {checkValueExist(String(item?.frontEndCoringLength))}
                                    </div>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedBackEndCoringLength}
                              </div>
                            ),
                            dataIndex: "",
                            width: 300,
        
                            render: (item: any) => {
                              return (
                                    <div className="table-data">
                                      {checkValueExist(String(item?.backEndCoringLength))}
                                    </div>
                                  
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedExtrusionLength}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                  {
                                  (item?.plantExtrusionLength && item?.extrusionLength) ? 
                                  item?.plantExtrusionLength+" "+item?.extrusionLength
                                  : '-'
                                  }
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.plannedButtThickness}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">
                                    {checkValueExist(item?.plannedButtThickness)}
                                  </div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">{AppConstants.cutBillet}</div>
                            ),
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              return (
                                <>
                                  <div className="table-data">{checkValueExist(item?.cutBillets)}</div>
                                </>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                {AppConstants.buttWeightPerInch}
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                  <div className="table-data">
                                    {checkValueExist(item?.buttWeightPerInch)}
                                  </div>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">{AppConstants.ppcRemarks}</div>
                            ),
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              return (
                                  <div className="table-data" title={item?.ppcRemarks}>
                                    {checkValueExist(item?.ppcRemarks)}
                                  </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">DIE</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                <div className="table-data">{checkValueExist(item?.die)}</div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">No. of Cavity</div>,
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              return (
                                <div className="table-data">{checkValueExist(item?.noOfCavity)}</div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Bolster Entry</div>,
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              return (
                                    <div className="table-data">{checkValueExist(item?.bolsterEntry)}</div>
                                  
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Backer Entry</div>,
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              return (
                                <div className="table-data">{checkValueExist(item?.backerEntry)}</div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Special Baker Entry</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">
                                      {checkValueExist(item?.specialBackerEntry)}
                                    </div>
                                 
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Ring Entry</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">{checkValueExist(item?.ringEntry)}</div>
                                
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Welding Chambar</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">{checkValueExist(item?.weldingChamber)}</div>
                                  
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Die Setter</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">{checkValueExist(item?.dieSetter)}</div>
                                 
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Tool Shop Remarks</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">
                                      {checkValueExist(item?.toolShopRemarks)}
                                    </div>
                                  
                              );
                            },
                          },
                          {
                            title: <div className="table-title">QA Remarks</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">
                                      {checkValueExist(item?.qaRemarks)}
                                    </div>
                                  
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Die Trial</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                  <div className="table-data">
                                    {checkValueExist(item?.dieTrial)}
                                  </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Die With Aluminium</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">{checkValueExist(item?.dieWithAluminium)}</div>
                                  
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">Previous Day Die Continue</div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                  <div className="table-data">
                                    {checkValueExist(item?.previousDayDie_continue)}
                                  </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Batch No.</div>,
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              return (
                                    <div className="table-data">{checkValueExist(item?.batchNo)}</div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Actual Internal Alloy</div>,
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              return (
                                    <div className="table-data">
                                      {checkValueExist(item?.actualInternalAlloy)}
                                    </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Start Time</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">
                                      {moment(item?.startTime)?.isValid()
                                      ? moment(item?.startTime)?.format("hh:mm A")
                                      : "-"}
                                    </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">End Time</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">
                                      {moment(item?.endTime)?.isValid()
                                      ? moment(item?.endTime)?.format("hh:mm A")
                                      : "-"}
                                    </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Process Time</div>,
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              return (
                                  <div className="table-data">{checkValueExist(item?.processTime)}</div>
                                 
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">
                                No.of Billet and Billet Length
                              </div>
                            ),
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              let billetLength: any =
                                item?.noOfBilletAndLength &&
                                JSON.parse(item?.noOfBilletAndLength);
                                let billetString = ""
                                {(billetLength || []).map((e: any, index: any) => {
                                  billetString += `Batch${index+1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                                })}  
                                let total = billetLength?.reduce((total: number, x: any) => total+parseInt(x?.noOfBillet) , 0)
                                billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                                return (
                                  <>
                                    <div
                                      className="jfs ellipse-none table-data"
                                      style={{ marginLeft: "25px" }}
                                      title={billetString}
                                    >
                                      {isArrayNotEmpty(billetLength) ? billetString : "-"}
                                    </div>
                                  </>
                                );
                            },
                          },
                          {
                            title: <div className="table-title">Actual Butt thickness</div>,
                            dataIndex: "",
                            width: 200,
                            render: (item: any) => {
                              return (
                                    <div className="table-data">
                                      {checkValueExist(item?.actualButtThickness)}
                                    </div>
                                
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Breakthrough Pressure</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">
                                      {checkValueExist(item?.breakThroughPressure)}
                                    </div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Push on Billet Length</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">
                                      {checkValueExist(item?.pushOnBilletLength)}
                                    </div>
                                 
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Push Qty (Kgs)</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">{checkValueExist(item?.pushQtyInKgs)}</div>
                                 
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Actual Production Rate</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                             
                              return (
                                    <div className="table-data">
                                      {checkValueExist(String(item?.actualProductionRate))}
                                    </div>
                                 
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Butt Weight (Kgs)</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                    <div className="table-data">{checkValueExist(item?.buttWeightInKgs)}</div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Die Fail</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                    <div className="table-data">{checkValueExist(item?.diefail)}</div>
                                 
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Die Failure Reason</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                    <div className="table-data">{checkValueExist(item?.dieFailureReason)}</div>
                                 
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Breakdown</div>,
                            dataIndex: "",
                            align: "true",
                            ellipsis: true,
                            width: 400,
                            render: (item: any) => {
                              let data: any = JSON.parse(item?.breakDown);
                              let value = ""
                              {(data || []).map((e: any, index: any) => {
                                value += `${e?.startTime} - ${e?.endTime}, ${e?.reason}, ${e?.responsibleDepartment} ${index != data.length - 1 ? " | " : ""}`;
                              })}
                              return (
                                  <div
                                      className="jfs completed-ellipse table-data"
                                      title={value}
                                  >
                                      {checkValueExist(value)}
                                  </div>
                              );
                          },
                          },
                          {
                            title: <div className="table-title">Breakdown Duration</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                    <div className="table-data">
                                      {checkValueExist(item?.breakDownDuration)}
                                    </div>
                                 
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">log end scrap length (mm)</div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                    <div className="table-data">
                                      {checkValueExist(item?.logEndScrapLengthInMm)}
                                    </div>
                              );
                            },
                          },
                          {
                            title: (
                              <div className="table-title">log end scrap length (Kgs)</div>
                            ),
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                    <div className="table-data">{checkValueExist(item?.logEndScrapInKgs)}</div>
                                 
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Operator Name</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                    <div className="table-data">{checkValueExist(item?.operatorName)}</div>
                              );
                            },
                          },
                          {
                            title: <div className="table-title">Operator Remarks</div>,
                            dataIndex: "",
                            width: 200,
        
                            render: (item: any) => {
                              return (
                                    <div className="table-data">
                                      {checkValueExist(item?.operatorEntryRemarks) }
                                    </div>
                                  
                              );
                            },
                          },
                          // {
                          //   title: <div className="table-title">Finish Quantity (Kgs)</div>,
                          //   dataIndex: "",
                          //   width: 200,
        
                          //   render: (item: any) => {
                          //     return (
                          //           <div className="table-data">{checkValueExist(item?.finishQuantity)}</div>
                                 
                          //     );
                          //   },
                          // },
                          // {
                          //   title: <div className="table-title">No. of Pcs Per Bundle</div>,
                          //   dataIndex: "",
                          //   width: 200,
        
                          //   render: (item: any) => {
                          //     return (
                          //           <div className="table-data">{checkValueExist(item?.piecesPerBundle)}</div>
                          //     );
                          //   },
                          // },
                          // {
                          //   title: <div className="table-title">Bundle Weight(Kg)</div>,
                          //   dataIndex: "",
                          //   width: 200,
        
                          //   render: (item: any) => {
                          //     return (
                          //           <div className="table-data">{checkValueExist(item?.bundleWeight)}</div>
                                  
                          //     );
                          //   },
                          // },
                          // {
                          //   title: <div className="table-title">No. of Bundles</div>,
                          //   dataIndex: "",
                          //   width: 200,
        
                          //   render: (item: any) => {
                          //     return (
                          //           <div className="table-data">{checkValueExist(item?.noOfBundles)}</div>
                          //     );
                          //   },
                          // },
                          // {
                          //   title: <div className="table-title">Total No.of Pcs</div>,
                          //   dataIndex: "",
                          //   width: 200,
        
                          //   render: (item: any) => {
                          //     return (
                          //           <div className="table-data">
                          //             {checkValueExist(item?.totalNoOfPieces)}
                          //           </div>
                          //     );
                          //   },
                          // },
                          // {
                          //   title: <div className="table-title">Correction Qty(Kgs)</div>,
                          //   dataIndex: "",
                          //   width: 200,
        
                          //   render: (item: any) => {
                          //     return (
                          //           <div className="table-data">{checkValueExist(item?.correctionQty)}</div>
                          //     );
                          //   },
                          // },
                          // {
                          //   title: (
                          //     <div className="table-title">
                          //       Actual Front end coring length(mm)
                          //     </div>
                          //   ),
                          //   dataIndex: "",
                          //   width: 300,
        
                          //   render: (item: any) => {
                          //     return (
                          //           <div className="table-data">
                          //             {checkValueExist(String(item?.actualFrontEndCoringLength))}
                          //           </div>
                          //     );
                          //   },
                          // },
                          // {
                          //   title: (
                          //     <div className="table-title">
                          //       Actual Back end coring length(mm)
                          //     </div>
                          //   ),
                          //   dataIndex: "",
                          //   width: 300,
        
                          //   render: (item: any) => {
                          //     return (
                          //           <div className="table-data">
                          //             {checkValueExist(String(item?.actualBackEndCoringLength))}
                          //           </div>
                                  
                          //     );
                          //   },
                          // },
                          // {
                          //   title: <div className="table-title">Recovery(Calculated)</div>,
                          //   dataIndex: "",
                          //   width: 200,
        
                          //   render: (item: any) => {
                          //     return (
                          //       <div className="table-data">{checkValueExist(item?.recovery)}</div>
                          //     );
                          //   },
                          // },
                          // {
                          //   title: <div className="table-title">Bundling Remarks</div>,
                          //   dataIndex: "",
                          //   width: 200,
        
                          //   render: (item: any) => {
                          //     return (
                          //           <div className="table-data">
                          //             {checkValueExist(item?.bundlingSupervisorRemarks) }
                          //           </div>
                          //     );
                          //   },
                          // },
                        ];

    const expandFun = (key: boolean, record: any)=>{
        setIsExpand(false)
        getDataApis(record)
        dispatch(updateIsExpandedOnGetPendingList(key, "isExpanded", record, "inprogressdata"))
        if(key){
            setExpandedRowkey([record?.orderId])
        }
        else{
            setExpandedRowkey([])
        }
        setIsExpand(key)
    }
   
    const withOutFilterTable = () => {
      let filter: any =  filterColumns;
      let colArr: any = columns;
      return (
        < >
          {
          (getPendingOnLoad) ? (
            <Row gutter={16}>
              {skeletonList.map((item: any) => (
                <Col lg={24} md={24}>
                  <div className="skeleton-card-box">
                    <Skeleton paragraph={{ rows: 0 }} loading={true} active />
                  </div>
                </Col>
              ))}
            </Row>
          )
           : (
            <Table
              expandedRowKeys={expandedRowkey}
              rowClassName={(record, index) => "updatedRow"
              }
              className="onhold-new-table"
              dataSource={getOrderData}
              columns={colArr}
              pagination={false}
              scroll={{ x: 1500 , y: getOrderDataPage?.totalCount > 50 ? (tableHeight - 235) : (tableHeight - 195) }}
              expandable={{
                expandedRowRender: (record, index) => {
                  return (record?.workFlowId == workFlowIds.PPCInprogress) ? (
                    <FormUpdate
                      type={"INPROGRESS"}
                      ppcdata={record}
                      getInProgressData={getData}
                      isExpand={isExpand}
                    />
                  ) : (record?.workFlowId == workFlowIds.ToolShopInprogress) ? (
                    <ToolShopFormUpdate
                      type={"INPROGRESS"}
                      data={record}
                      getInProgressData={getData}
                      isExpand={isExpand}
                    />
                  ) : (record?.workFlowId == workFlowIds.QAInprogress)? (
                    <QaFormUpdates
                      type={"INPROGRESS"}
                      data={record}
                      getInProgressData={getData}
                      isExpand={isExpand}
                    />
                  ) : (record?.workFlowId == workFlowIds.OperatorEntryInprogress) ? (
                    <OperatorEntryFormUpdate
                      type={"INPROGRESS"}
                      getInProgressData={getData}
                      data={record}
                      isExpand={isExpand}
                    />
                  ) : (
                    <BundlingSupervisorForm
                      type={"INPROGRESS"}
                      data={record}
                      getInProgressData={getData}
                      isExpand={isExpand}
                    />
                  );
                },
                rowExpandable: (record) =>
                  record?.workFlowId == 2 ||
                  record?.workFlowId == 5 ||
                  record?.workFlowId == 8 ||
                  record?.workFlowId == 11 ||
                  record?.workFlowId == 14,
                expandIcon: ({ expanded, onExpand, record }) =>
                  ((record?.workFlowId == 2 && user?.roleId == 2 || user?.roleId == 1) ||
                  (record?.workFlowId == 5 && user?.roleId == 3 || user?.roleId == 1) ||
                  (record?.workFlowId == 8 && user?.roleId == 4 || user?.roleId == 1) ||
                  (record?.workFlowId == 11 && user?.roleId == 5 || user?.roleId == 1) ||
                  (record?.workFlowId == 14 && user?.roleId == 6 || user?.roleId == 1)) && (user?.roleId != 1) ? (
                    expanded ? (
                      <DownOutlined
                        onClick={(e: any) => {
                          expandFun(false, record)
                          onExpand(record, e);
                        }}
                      />
                    ) : (
                      <RightOutlined
                        onClick={(e: any) => {
                          expandFun(true, record)
                          onExpand(record, e);
                        }}
                      />
                    )
                  ) : (
                    ""
                  ),
              }}
            />
          )
          }
        </>
      );
    };

    const withFilterTable = () => {
      return (
            <Table
              expandedRowKeys={expandedRowkey}
              rowClassName={(record, index) => "updatedRow"
              }
              className="onhold-new-table"
              dataSource={getOrderData}
              columns={filterColumns}
              pagination={false}
              scroll={{ x: 1500 , y: getOrderDataPage?.totalCount > 50 ? (tableHeight - 290) : (tableHeight - 250)}}
              expandable={{
                expandedRowRender: (record, index) => {
                  return (record?.workFlowId == workFlowIds.PPCInprogress) ? (
                    <FormUpdate
                      type={"INPROGRESS"}
                      ppcdata={record}
                      getInProgressData={getData}
                    />
                  ) : (record?.workFlowId == workFlowIds.ToolShopInprogress) ? (
                    <ToolShopFormUpdate
                      type={"INPROGRESS"}
                      data={record}
                      getInProgressData={getData}
                    />
                  ) : (record?.workFlowId == workFlowIds.QAInprogress)? (
                    <QaFormUpdates
                      type={"INPROGRESS"}
                      data={record}
                      getInProgressData={getData}
                    />
                  ) : (record?.workFlowId == workFlowIds.OperatorEntryInprogress) ? (
                    <OperatorEntryFormUpdate
                      type={"INPROGRESS"}
                      getInProgressData={getData}
                      data={record}
                    />
                  ) : (
                    <BundlingSupervisorForm
                      type={"INPROGRESS"}
                      data={record}
                      getInProgressData={getData}
                    />
                  );
                },

                // defaultExpandedRowKeys: [
                //   getOrderData ? getOrderData[1]?.key : "",
                // ],

                rowExpandable: (record) =>
                  record?.workFlowId == 2 ||
                  record?.workFlowId == 5 ||
                  record?.workFlowId == 8 ||
                  record?.workFlowId == 11 ||
                  record?.workFlowId == 14,

                expandIcon: ({ expanded, onExpand, record }) =>
                  ((record?.workFlowId == 2 && user?.roleId == 2 || user?.roleId == 1) ||
                  (record?.workFlowId == 5 && user?.roleId == 3 || user?.roleId == 1) ||
                  (record?.workFlowId == 8 && user?.roleId == 4 || user?.roleId == 1) ||
                  (record?.workFlowId == 11 && user?.roleId == 5 || user?.roleId == 1) ||
                  (record?.workFlowId == 14 && user?.roleId == 6 || user?.roleId == 1)) && (user?.roleId != 1)  ? (
                    expanded ? (
                      <DownOutlined
                        onClick={(e: any) => {
                          expandFun(false, record)
                          onExpand(record, e);
                        }}
                      />
                    ) : (
                      <RightOutlined
                        onClick={(e: any) => {
                          expandFun(true, record)
                          onExpand(record, e);
                        }}
                      />
                    )
                  ) : (
                    ""
                  ),
              }}
          />
      );
    };

    return (
      <div>
        {filterMenu === true ?  withFilterTable() : withOutFilterTable()}
      </div>
    );
  };
  const alreadyPickedToast = () => {
    setShowMessage(true);
  };

  const pickModal = () => {
    return (
      <Modal
        open={picking}
        closeIcon={false}
        footer={false}
        closable={false}
        onCancel={() => setPicking(false)}
        className="pickModal"
      >
        <div className="pick-question-cancel-pick-button">
          <div className="pick-question">
            Do you want to pick the selected PO:{" "}
            <span className="pick-token">100058181</span> ?
          </div>
          <div className="cancel-pick-button jf">
            <Button
              className="cancel-button"
              type="default"
              onClick={() => setPicking(false)}
            >
              Cancel
            </Button>
            <Button
              className="pick-button"
              type="primary"
              onClick={() => setPicking(false)}
            >
              Pick
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="new-cotainer" style={{ background: "#E3E2E3", paddingBottom:10}}>
      <TopMenuAndSider style={"2"} />
      <JindalSubMenu
        title={AppConstants?.INPROGRESS}
        showAlert={showMessage}
        setShowAlert={setShowMessage}
        showLasAsyncAndSelect={true}
        setAssignToMeKey={setAssignToMe}
        checkRecords={checkRecords}
        reasignToast={reasignToast}
        sectionNumModal={getOrderData}
        sectionName={getOrderData}
        filter={pendingFilter}
        variable={"inprogressdata"}
      />
      <div className="new-content">{pendingTable()}</div>
      <CommonPagination
        currentPage={getOrderDataPage?.currentPage}
        positionStatic={true}
        total={getOrderDataPage?.totalCount}
        handlePagination={handlePagination}
      />
      <div style={{marginBottom:20}}></div>
      {pickModal()}
    </div>
  );
}

export default NewInProgress;
