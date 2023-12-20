import { Button, Checkbox, Col, DatePicker, Drawer, Form, Input, Progress, Row, Select, Skeleton, Space, Table, TimePicker } from "antd";
import TopMenuAndSider from "../SubComponents/Top_Menu";
import "./reportListScreen.scss";
import { useDispatch, useSelector } from "react-redux";
import AppConstants from "../../Global/AppConstants";
import React,{ useEffect, useState } from "react";
import AppImages from "../../Global/AppImages";
import moment from "moment";
import { deepCopyFunction, isArrayNotEmpty } from "../../Global/Helpers";
import { commonReferenceDataAction, downloadDashboardCSVAction, downloadDashboardXLAction, getDashboardTableData } from "../Store/Action/jindalAction";
import CommonPagination from "../SubComponents/commonPagination";
import dayjs from "dayjs";
import SpinLoader from "../Common/SpinLoader";
import { getUser } from "../../localStorage";
import Modaldemo from "../modal";

const headers = [
    "PO No.",
    "Customer Name",
    "Sales Order No.",
    "PO release Date",
    "Section No.",
    "Alloy Temper",
    "PO Total Quantity",
    "Extruded Quantity(kgs)",
    "Balance PO Quantity(kgs)",
    "Cut Length",
    "Cut Length Tolerance(mm)",
    "Quantity Tolerance(%)",
    "Priority Assignment",
    "Marketing Remarks",
    "Plant Selected",
    "Press Allocation",
    "Planned Quantity(Kgs)",
    "Planned Internal Alloy",
    "Planned No. of Billet and Billet Length(Inches)",
    "Production Rate Req(Kg/Hr)",
    "Planned Quenching",
    "Planned FrontEnd Coring Length(mm)",
    "Planned BackEnd Coring Length(mm)",
    "Planned Extrusion Length",
    "Planned Butt Thickness(Inches)",
    "Cut Billets",
    "Butt Weight Per Inch",
    "PPC Remarks",
    "Die",
    "No. of Cavity",
    "Bolster Entry",
    "Backer Entry",
    "Special Backer Entry",
    "Ring Entry",
    "Welding Chamber",
    "Die Setter",
    "Tool Shop Remarks",
    "QA Remarks",
    "Die Trail",
    "Die with Aluminium",
    "Previous Day Die Continue",
    "Batch No.",
    "Actual Internal Alloy",
    "Start Time",
    "End Time",
    "Process Time",
    "No. of Billet and Billet Length",
    "Actual Butt Thickness",
    "Breakthrough Pressure",
    "Push On Billet Length",
    "Push Qty(Kgs)",
    "Actual Production Rate",
    "Butt Weight(Kgs)",
    "Die Fail",
    "Die Failure Reason",
    "Breakdown",
    "Breakdown Duration",
    "Log End Scrap Length(mm)",
    "Log End Scrap(Kgs)",
    "Operator Name",
    "Operator Entry Remarks",
    "Finish Quantity(Kgs)",
    "No. of Pcs Per Bundle",
    "Bundle Weight(Kg)",
    "No. of Bundles",
    "Total No. of Pcs",
    "Correction Qty(Kgs)",
    "Actual FrontEnd Coring Length(mm)",
    "Actual BackEnd Coring Length(mm)",
    "Recovery(Calculated)",
    "Bundling Supervisor Remarks"
];

const tableHeaderArr = [
    {
        color: "#40683F",
        Name: "PPC Data"

    },
    {
        color: "#555C9F",
        Name: "Tool Shop Data"

    },
    {
        color: "#774D78",
        Name: "QA Entry"

    },
    {
        color: "#B84C86",
        Name: "Operator Entry"

    },
    {
        color: "#DA874B",
        Name: "Bundling Supervisor"

    }

]
let skeletonList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const { Option } = Select;
let height: any = 0;
let isFilterInProgress = false;

const ReportListScreen = () => {
    const dispatch = useDispatch()
    const [filterMenu, setFilterMenu] = useState<any>(false);
    const [open, setOpen] = useState(false);
    const [checkedDownloadData, setCheckedDownloadData] = useState<any>(new Set(headers))
    const jindalReducerState = useSelector((state: any) => state?.JindalReducerState);
    const {
        dashboardData,
        downloadXLOnLoad,
        downloadXLData,
        downloadCSVOnLoad,
        downloadCSVData,
        dashboardOnload,
        pressAllocationData,
        plannedQuenchingData,
        ExtrusionLengthUnitData
    } = jindalReducerState;
    const [limit, setLimit] = useState(50);
    const [offset, setOffset] = useState(0);
    const [downloadOnload, setDownloadOnLoad] = useState(false)
    const [downloadCSVOnload, setDownloadCSVOnLoad] = useState(false)
    const [onLoad, setOnLoad] = useState(false)
    const [tableHeight, setTableHeight] = useState(0);
    const [modalOpen , setModalOpen] = useState(false);
    const [cellData , setCellData] = useState<any>();
    const user = getUser();
    const [form] = Form.useForm();

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

    const [pendingFilter, setPendingFilter] = useState(
        deepCopyFunction(pendingListFilter)
    );

    useEffect(() => {
        getPressallocation();
        let doc: any = document.getElementById('root');
        height = doc?.clientHeight ;
        setTableHeight(height);
        plannnedQuenchingReferenceDataApi();
        ExtrusionLengthUnitReferenceData()
    }, []);

    useEffect(()=>{
        if(!dashboardOnload && onLoad){
            setOnLoad(false)
            isFilterInProgress = false;
        }
    }, [onLoad, dashboardOnload]);

    const handlePagination = (offsetVal: any, pagesize: any) => {
        getData(pagesize, offsetVal);
        setLimit(pagesize)
        setOffset(offsetVal)
      }    

    const ExtrusionLengthUnitReferenceData = () => {
        let payload = {
            name: "Extrusion Length Unit"
        };
        dispatch(commonReferenceDataAction(payload))
    }
    

    useEffect(() => {
        let filterFilterApplied = JSON.stringify(pendingFilter) != JSON.stringify(pendingListFilter);
        let debounce = setTimeout(() => {
            if(pendingFilter.ffromDate && pendingFilter.ftoDate){
                getData(limit, offset);
            }
            else if(!pendingFilter.ffromDate && !pendingFilter.ftoDate){
                getData(limit, offset);
            }
          }, (filterFilterApplied ? 500 : 0));
        return ()=>{
            clearTimeout(debounce)
        }
    }, [pendingFilter]);

    const plannnedQuenchingReferenceDataApi = () => {
        let payload = {
            name: "Planned Quenching"
        };
        dispatch(commonReferenceDataAction(payload));
    }
  
    const getData = (limitVal: number, offsetVal: number)=>{
        let payload = {
            exportType: 0,
            ...pendingFilter,
            limit: limitVal,
            offset: isFilterInProgress ? 0 : offsetVal,
        }
        dispatch(getDashboardTableData(payload))
        setOnLoad(true)
    }

    const getPressallocation = ()=>{
        let payload = {
            name: "Press Allocation"
        }
        dispatch(commonReferenceDataAction(payload));
    }

    useEffect(() => {
        if(modalOpen == false){
            getData(limit,offset)
        }
    }, [modalOpen])
    const showDrawer = () => {
        setOpen(true);
        onCheckAllChange(true,headers,"All")
    };

    const onClose = () => {
        setOpen(false);
    };

    const saveAsXlsxFile = () => {
        var pre: any =
            "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
        var inp: any = downloadXLData?.downloadDashboardAsExcel;
        var link = document.createElement("a");
        link.href = pre + inp;
        link.download = "download.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const saveAsCsvFile = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        var inp: any = downloadCSVData;
        var link = document.createElement("a");
        link.href = csvContent + inp;
        link.download = "download.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        if (downloadCSVOnload && !downloadCSVOnLoad) {
            setDownloadCSVOnLoad(false);
            saveAsCsvFile();
            onClose();
            setDownloadOnLoad(false);
        }
    }, [downloadCSVOnload, downloadCSVOnLoad])

    useEffect(() => {
        if (downloadOnload && !downloadXLOnLoad) {
            saveAsXlsxFile()
            onClose()
            setDownloadOnLoad(false)
        }
    }, [downloadOnload, downloadXLOnLoad])

    const downloadCSV = () => {
        let Arr = JSON.stringify([...checkedDownloadData]).replace(/"([^(")"]+)":/g, "$1:");
        let payload ={
            headers: JSON.parse(Arr),
            ...pendingFilter
        }
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
        dispatch(downloadDashboardCSVAction(payload));
        setDownloadCSVOnLoad(true)
    }

    const downloadXL = () => {
        let Arr = JSON.stringify([...checkedDownloadData]).replace(/"([^(")"]+)":/g, "$1:");
        let payload ={
            headers: Arr,
            ...pendingFilter
        }
        dispatch(downloadDashboardXLAction(payload))
        setDownloadOnLoad(true)
    }

    const onCheckAllChange = (isChecked: any, data: any, key: any) => {
        let checkedDownloadDataTemp = [...checkedDownloadData];
        if (key === "All") {
            checkedDownloadDataTemp = [];
            if (isChecked === true) {
                for (let item of headers) {
                    checkedDownloadDataTemp.push(item);
                }
            }
        } else {
            if (isChecked === true) {
                checkedDownloadDataTemp.push(data)
            } else {
                let index = checkedDownloadDataTemp.findIndex((x: any) => x === data);
                checkedDownloadDataTemp.splice(index, 1);
            }
        }
        setCheckedDownloadData(new Set([...checkedDownloadDataTemp]));
    }

    const closeFilter = () => {
        setFilterMenu(false);
        isFilterInProgress = true;
        setPendingFilter(pendingListFilter);
    };
    const modalOpenforDashBoard = (item:any) =>{
        if(user?.roleId == 1){
            setModalOpen(true)
            setCellData(item)
        }
    };

    const clearFilter = ()=>{
        setPendingFilter(pendingListFilter);
        isFilterInProgress = true;
    }

    const checkData = (item: any) => {
        try {
            if(item != null && item != undefined 
                && item != "" && item != 'null'){
                    return <div className="table-data" title={item}>{item}</div>;
            }
            else{
                return '-';
            }
        } catch (ex) {
            console.log("Err in checkData::" + ex);
        }
    }

    const setFilterData = (value: unknown, key: string) => {
        isFilterInProgress = true;
        setPendingFilter({ ...pendingFilter, [key]: value })
    }

    const dashBoardHeaderView = () => {
        try {
            return (
                <div className="d-flex jc-sb dashboard-container " style={{ paddingTop: "80px", height: '50px' }}>
                    <div className="d-flex">
                        <div className="submenu-action">
                            <div className="submenu-action-title">From Date</div>
                            <div className="submenu-action-select">
                                <DatePicker
                                    placeholder="Select"
                                    className="submenu-action-menu date-selection"
                                    style={{height: "30px"}}
                                    onChange={(e: any) => {
                                        let value = dayjs(e).format('YYYY-MM-DD');
                                        if(value === 'Invalid Date'){
                                            setPendingFilter({ ...pendingFilter, ffromDate: "", ftoDate: "" });
                                            form.resetFields();
                                        }
                                        else{
                                            setFilterData(value, 'ffromDate');
                                            form.validateFields();
                                        }
                                    }}
                                    disabledDate={(e: any) => {
                                        let var1 = dayjs(e).format('YYYY-MM-DD');
                                        let var2 = dayjs(pendingFilter.ftoDate).format('YYYY-MM-DD');
                                        return ( var1 > var2) ? true : false
                                    }}
                                   value={pendingFilter.ffromDate && dayjs(pendingFilter.ffromDate)}
                                />
                            </div>
                        </div>
                        <div className="submenu-action ">
                            <div className="submenu-action-title">To Date</div>
                            <div className="submenu-action-select">
                                <Form form={form}>
                                    <Form.Item name="toDate"
                                        rules={[
                                            {required: true, message: "Field is required"},
                                        ]} 
                                    >
                                        <DatePicker
                                        placeholder="Select"
                                        style={{height: "30px"}}
                                        className="submenu-action-menu date-selection"
                                        disabled={!pendingFilter?.ffromDate}
                                        disabledDate={(e: any) => {
                                            let var1 = dayjs(e).format('YYYY-MM-DD');
                                            let var2 = dayjs(pendingFilter.ffromDate).format('YYYY-MM-DD');
                                            return ( var1 < var2) ? true : false
                                        }}
                                        onChange={(e: any) => {
                                        let value = dayjs(e).format('YYYY-MM-DD');
                                        setFilterData(value != 'Invalid Date' ? value : '', 'ftoDate')
                                        }}
                                        value={pendingFilter.ftoDate && dayjs(pendingFilter.ftoDate)}
                                        />
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                        <div className="submenu-action">
                            <div className="submenu-action-title">Press Number</div>
                            <div className="submenu-action-select" style={{height: "30px"}}>
                                <Select
                                    style={{ width: 140, height: "30px"}}
                                    className="submenu-action-menu"
                                    placeholder={"Select"}
                                    // defaultValue={0}
                                    value={pendingFilter?.fpressAllocation  ? pendingFilter?.fpressAllocation : 'All'}
                                    onChange={(e)=>setFilterData(e, 'fpressAllocation')}
                                >
                                     <Option className="submenu-action-option" value={0}>
                                        All
                                    </Option>
                                    {pressAllocationData?.map((x: any) =>
                                    <Option className="submenu-action-option" value={x?.id}>
                                        {x?.name}
                                    </Option>)}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="side-drawer-content">
                        <Button onClick={showDrawer} className="drawer-button-container">
                            <div><img src={AppImages.downloadicon} /></div>
                            <div style={{ marginLeft: "10px" }}>Download Preview</div>
                        </Button>
                        <Drawer
                            title="Download Preview"
                            placement="right"
                            onClose={onClose}
                            open={open}
                            className="drawer-container"
                            extra={
                                <Space>
                                    <div onClick={onClose} style={{ cursor: "pointer" }}><img src={AppImages.closeIcon} /></div>
                                </Space>
                            }
                            footer={
                                <Space >
                                    <Button 
                                    className="footer-button-container"
                                    onClick={() => downloadCSV()}
                                    disabled={checkedDownloadData?.size < 1}
                                    >
                                        <div >Download As CSV</div>
                                    </Button>
                                    <Button 
                                    className="footer-button-container" 
                                    onClick={() => downloadXL()}
                                    disabled={checkedDownloadData?.size < 1}
                                    >
                                        <div>Download As Excel</div>
                                    </Button>
                                </Space>
                            }
                        >
                            <div>
                                <Checkbox
                                    checked={checkedDownloadData.size === headers.length}
                                    onChange={(e: any) => onCheckAllChange(e.target.checked, headers, "All")}>

                                    {"All"}
                                </Checkbox>
                                {(headers || []).map((data: any, index: any) =>
                                    <Checkbox
                                        checked={checkedDownloadData.has(data)}
                                        onChange={(e: any) => onCheckAllChange(e.target.checked, data, "individual")}>
                                        {data}
                                    </Checkbox>
                                )}
                            </div>
                        </Drawer>
                    </div>
                </div>
            )
        }
        catch (ex) {
            console.log("Error in dashBoardHeaderView", ex)
        }
    }

    const filterColumns: any = [
        {
            title: (
                <div className='gray-title'>
                    <img
                        src={AppImages?.filterIcon}
                        onClick={() => setFilterMenu(false)}
                    />
                    <div className="table-title">PO No.</div>
                </div>
            ),
            dataIndex: "",
            width: 160,
            fixed: "left",
            children: [
                {
                    title: (
                        <Row
                            gutter={10}
                            className='gray-title'
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
                                    onClick={()=>{clearFilter()}}
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
                                    // suffix={<CloseCircleOutlined}
                                    className="small-input-filter jc"
                                    placeholder="Enter"
                                    // prefixCls={}
                                    onChange={(e: any) => setFilterData(e.target.value, 'fpo')}
                                    value={pendingFilter?.fpo}
                                />
                            </Col>
                        </Row>
                    ),
                    fixed: "left",
                    width: 200,
                    render: (item: any, _: any, index: any) => {
                        return (
                            <div className='table-with-checkbox-data jc'>
                                <div className={user?.roleId == 1 ? 'table-data-blue' : 'table-data'}
                                    onClick={() =>  modalOpenforDashBoard(item)
                                    }>
                                    {(item?.poNo)}
                                </div>
                            </div>
                        )
                    }
                },
            ],

        },
        {
            title: <div className='gray-title'>Customer Name</div>,
            dataIndex: "",
            width: 200,
            fixed: "left",
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fcustomer_name}
                                onChange={(e) => setFilterData(e.target.value, 'fcustomer_name')}
                            />
                        </div>
                    ),
                    width: 300,
                    fixed: "left",
                    render: (item: any) => {
                        return <div className="table-data">{checkData(item?.customer_name)} </div>;
                    },
                },
            ],

        },
        {
            title: <div className='gray-title'>Status</div>,
            dataIndex: "",
            width: 150,
            fixed: 'left',
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Select 
                             className="small-input-filter jc"
                            placeholder="Select"
                            style={{ width: "140px" }}
                            onChange={(e) => setFilterData(e, 'fstatusOrWeightage')}
                            value={pendingFilter?.fstatusOrWeightage != -1 && pendingFilter?.fstatusOrWeightage}
                            >
                                <Select.Option value={String(0)}>PPC Data In-Progress</Select.Option>
                                <Select.Option value={20}>PPC Data Completed</Select.Option>
                                <Select.Option value={40}>Tool Shop Data Completed</Select.Option>
                                <Select.Option value={60}>QA Entry Completed</Select.Option>
                                <Select.Option value={80}>Operator Entry Completed</Select.Option>
                                <Select.Option value={100}>Bundling Supervisor Completed</Select.Option>
                             </Select>
                        </div>
                    ),
                    width: 150,
                    fixed: "left",
                    render: (item: any, _: any, index: any) => {
                        return (
                            <div className='table-with-checkbox-data jc'>
                                <div className='table-data'>{checkData(item?.status)}</div>
                            </div>
                        )
                    }
                },
            ],

        },
        {
            title: <div className='gray-title'>Weightage</div>,
            dataIndex: "",
            width: 100,
            fixed: 'left',
            align: 'center', ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             {/* <Select 
                             className="small-input-filter jc"
                             placeholder="Select"
                             style={{ width: "140px" }}
                             onChange={(e) => setFilterData(e, 'weightage')}
                             value={(weightage && weightage != -1) && pendingFilter?.fstatusOrWeightage}
                            >
                                <Select.Option value={String(0)}>0%</Select.Option>
                                <Select.Option value={20}>20%</Select.Option>
                                <Select.Option value={40}>40%</Select.Option>
                                <Select.Option value={60}>60%</Select.Option>
                                <Select.Option value={80}>80%</Select.Option>
                                <Select.Option value={100}>100%</Select.Option>
                             </Select> */}
                        </div>
                    ),
                    width: 150,
                    fixed: "left",
                    render: (item: any) => {
                        return (
                            <div style={{ padding: 6 }}>
                                <Progress percent={item?.weightage} />
                            </div>
                        )
                    }
                },
            ],

        },
        {
            title: <div className='gray-title'>Sales Order No.</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fso}
                                onChange={(e) => setFilterData(e.target.value, 'fso')}
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
            title: <div className='gray-title'>PO release Date</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             {/* <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fso}
                                onChange={(e) => setFilterData(e.target.value, 'fso')}
                            /> */}
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <div className="table-data">
                                {item?.po_release_dt != null ? moment(item?.po_release_dt).format('DD-MMM-YYYY') : "-"}
                            </div>
                        );
                    },
                },
            ],

        },
        {
            title: <div className='gray-title'>Section No.</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fsectionNo}
                                onChange={(e) => setFilterData(e.target.value, 'fsectionNo')}
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
            title: <div className='gray-title'>Alloy Temper</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fAlloyTemper}
                                onChange={(e) => setFilterData(e.target.value, 'fAlloyTemper')}
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
            title: <div className='gray-title'>PO Total Quantity</div>,
            width: 200,
            dataIndex: "",
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fpo_qty}
                                onChange={(e) => setFilterData(e.target.value, 'fpo_qty')}
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
            title: <div className='gray-title'>Extruded Quantity (Kgs)</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fextruded_qty}
                                onChange={(e) => setFilterData(e.target.value, 'fextruded_qty')}
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
            title: <div className='gray-title'>Balance PO Quantity</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fbalance_po_qty}
                                onChange={(e) => setFilterData(e.target.value, 'fbalance_po_qty')}
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
            title: <div className='gray-title'>Cut Length</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fcut_len}
                                onChange={(e) => setFilterData(e.target.value, 'fcut_len')}
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
                <div className='gray-title'>Cut Length tolerance (mm)</div>
            ),
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
            title: <div className='gray-title'>Quantity Tolerance (%)</div>,
            dataIndex: "",
            width: 150,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             {/* <Input type="search"
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
            title: <div className='gray-title'>Priority assignment</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Select className="small-input-filter jc"
                                placeholder="Select"
                                style={{ width: "140px" }}
                                onChange={(e) => setFilterData(e, 'fpriority')}
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
            title: <div className='gray-title'>Marketing remarks</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className='gray-title' style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fmarketing_remarks}
                                onChange={(e) => setFilterData(e.target.value, 'fmarketing_remarks')}
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
                <div className="green-title">{AppConstants.plantSelected}</div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fplantSelected}
                                onChange={(e) => setFilterData(e.target.value, 'fplantSelected')}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className='green-table-data'>{checkData(item?.plantSelected)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="green-title">
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
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Select
                                style={{ width: 140 }}
                                className="submenu-action-menu"
                                placeholder="Select"
                                value={pendingFilter?.fpressAllocation ? pendingFilter?.fpressAllocation : "All"}
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
                                <div className='green-table-data'>{checkData(item?.pressAllocation)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="green-title">
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
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className='green-table-data'>{checkData(item?.plannedQty)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="green-title">
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
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className='green-table-data'>
                                    {checkData(item?.plannedInternalAlloy)}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="green-title">
                    {AppConstants.plannedNoOfBillets}
                </div>
            ),
            dataIndex: "",
            width: 400,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            {/*  <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
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
                                className="jfs ellipse-none green-table-data"
                                // style={{ marginLeft: "25px" }}
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
                <div className="green-title">{AppConstants.prodRateReq}</div>
            ),
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fproductionRateRequired}
                                onChange={(e) => setFilterData(e.target.value, 'fproductionRateRequired')}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className='green-table-data'>
                                    {checkData(item?.productionRateRequired)}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="green-title">
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
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Select className="small-input-filter jc"
                                placeholder="Select"
                                style={{ width: "140px" }}
                                onChange={(e) => setFilterData(e, 'fplannedQuenching')}
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
                                <div className='green-table-data'>{checkData(item?.plannedQuenching)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="green-title">
                    {AppConstants.plannedFrontEndCoringLength}
                </div>
            ),
            dataIndex: "",
            width: 480,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.ffrontEndCoringLength}
                                onChange={(e) => setFilterData(e.target.value, 'ffrontEndCoringLength')}
                            />
                        </div>
                    ),
                    width: 380,
                    render: (item: any) => {
                        return (
                            <>
                                <div className='green-table-data'>
                                    {checkData(String(item?.frontEndCoringLength))}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="green-title">
                    {AppConstants.plannedBackEndCoringLength}
                </div>
            ),
            dataIndex: "",
            width: 480,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fbackEndCoringLength}
                                onChange={(e) => setFilterData(e.target.value, 'fbackEndCoringLength')}
                            />
                        </div>
                    ),
                    width: 380,
                    render: (item: any) => {
                        return (
                            <>
                                <div className='green-table-data'>
                                    {checkData(String(item?.backEndCoringLength))}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="green-title">
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
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                            <Input type="search" 
                            placeholder="Enter" 
                            style={{ width: 80 }}
                            value={pendingFilter?.fplantExtrusionLength}
                            onChange={(e) => setFilterData(e.target.value, "fplantExtrusionLength")}
                          />
                          <Select style={{ width: 60 }} placeholder="Select"
                              value={pendingFilter?.fextrusionLengthRefId && pendingFilter?.fextrusionLengthRefId}
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
                                <div className='green-table-data'>
                                    {item?.plantExtrusionLength !== null && item?.extrusionLength !== null ? `${item?.plantExtrusionLength}${item?.extrusionLength}` : "-"}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="green-title">
                    {AppConstants.plannedButtThickness}
                </div>
            ),
            dataIndex: "",
            width: 250,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className='green-table-data'>
                                    {checkData(String(item?.plannedButtThickness))}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="green-title">{AppConstants.cutBillet}</div>
            ),
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className='green-table-data'>{checkData(item?.cutBillets)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="green-title">
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
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className='green-table-data'>{checkData(String(item?.buttWeightPerInch))}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="green-title">{AppConstants.ppcRemarks}</div>
            ),
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="green-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className='green-table-data' title={item?.ppcRemarks}>
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
            title: <div className="laventor-title">DIE</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="laventor-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="laventor-table-data">{checkData(item?.die)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="laventor-title">No. of Cavity</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="laventor-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="laventor-table-data">{checkData(String(String(item?.noOfCavity)))}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="laventor-title">Bolster Entry</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="laventor-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="laventor-table-data">{checkData(item?.bolsterEntry)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="laventor-title">Backer Entry</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="laventor-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="laventor-table-data">{checkData(item?.backerEntry)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="laventor-title">Special Baker Entry</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="laventor-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="laventor-table-data">{checkData(item?.specialBackerEntry)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="laventor-title">Ring Entry</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="laventor-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="laventor-table-data">{checkData(item?.ringEntry)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="laventor-title">Welding Chamber</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="laventor-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="laventor-table-data">{checkData(item?.weldingChamber)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="laventor-title">Die Setter</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="laventor-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="laventor-table-data">{checkData(item?.dieSetter)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="laventor-title">Tool Shop Remarks</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="laventor-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="laventor-table-data" title={item?.toolShopRemarks}>
                                    {checkData(item?.toolShopRemarks)}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="violate-title">QA Remarks</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="violate-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="violate-table-data" title={item?.qaRemarks}>
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
            title: <div className="pink-title">Die Trial</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Select
                                className="small-input-filter jc"
                                placeholder="Select"
                                style={{ width: "140px" }}
                                onChange={(e) => setFilterData(e, 'fdieTrialRefId')}
                                value={pendingFilter?.fdieTrialRefId}
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
                                <div className="pink-table-data">{checkData(item?.dieTrial)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Die With Aluminium</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="pink-table-data">{checkData(item?.dieWithAluminium)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="pink-title">Previous Day Die Continue</div>
            ),
            dataIndex: "",
            width: 300,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Select
                                className="small-input-filter jc"
                                placeholder="Select"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fpreviousDayDie_continueRefId}
                                onChange={(e) => setFilterData(e, 'fpreviousDayDie_continueRefId')}
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
                                <div className="pink-table-data">
                                    {checkData(item?.previousDayDie_continue)}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Batch No.</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="pink-table-data">{checkData(item?.batchNo)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Actual Internal Alloy</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter.factualInternalAlloy}
                                onChange={(e) => setFilterData(e.target.value, 'factualInternalAlloy')}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="pink-table-data">
                                    {checkData(item?.actualInternalAlloy)}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Start Time</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <TimePicker
                              className="inputbox"
                              format={"h:mm A"}
                              style={{ width: 100 }}
                              suffixIcon={false}
                              use12Hours
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
                                <div className="pink-table-data">
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
            title: <div className="pink-title">End Time</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="pink-table-data">
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
            title: <div className="pink-title">Process Time</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="pink-table-data">{checkData(item?.processTime)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="pink-title">
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
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                        {
                            (billetLength || []).map((e: any, index: any) => {
                                billetString += `Batch${index + 1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                            })
                        }
                        let total = billetLength?.reduce((total: number, x: any) => total + parseInt(x?.noOfBillet), 0)
                        billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                        return (
                            <>
                                <div
                                    className="jfs ellipse-none pink-table-data"
                                    // style={{ marginLeft: "25px" }}
                                    title={billetString}
                                >
                                    {isArrayNotEmpty(JSON.parse(item?.noOfBilletAndLength)) ?  billetString : "-"}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Actual Butt Thickness</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="pink-table-data">
                                    {checkData(String(item?.actualButtThickness))}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Breakthrough Pressure</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="pink-table-data">
                                    {checkData(String(item?.breakThroughPressure))}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Push on Billet Length</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="pink-table-data">{checkData(String(item?.pushOnBilletLength))}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Push Qty (Kgs)</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="pink-table-data">{checkData(String(item?.pushQtyInKgs))}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Actual Production Rate</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="pink-table-data">
                                    {checkData(String(item?.actualProductionRate))}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Butt Weight (Kgs)</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="pink-table-data">{checkData(String(item?.buttWeightInKgs))}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Die Fail</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="pink-table-data">{checkData(item?.diefail)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Die Failure Reason</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                <div className="pink-table-data">{checkData(item?.dieFailureReason)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Breakdown</div>,
            dataIndex: "",
            width: 400,
            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            {/*  <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
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
                                className="jfs completed-ellipse pink-table-data"
                                title={value}
                            >
                                {checkData(value)}
                            </div>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Breakdown Duration</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fbreakDownDuration}
                                onChange={(e) => setFilterData(e.target.value, "fbreakDownDuration")}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="pink-table-data">{checkData(item?.breakDownDuration)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="pink-title">Log End Scrap Length (mm)</div>
            ),
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.flogEndScrapLengthInMm}
                                onChange={(e) => setFilterData(e.target.value, "flogEndScrapLengthInMm")}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="pink-table-data">
                                    {checkData(String(item?.logEndScrapLengthInMm))}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Log End Scrap(Kgs)</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.flogEndScrapInKgs}
                                onChange={(e) => setFilterData(e.target.value, "flogEndScrapInKgs")}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="pink-table-data">{checkData(String(item?.logEndScrapInKgs))}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Operator Name</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.foperatorName}
                                onChange={(e) => setFilterData(e.target.value, "foperatorName")}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="pink-table-data">{checkData(item?.operatorName)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="pink-title">Operator Entry Remarks</div>,
            dataIndex: "",
            width: 200,

            align: "center",
            ellipsis: true,
            children: [
                {
                    title: (
                        <div className="pink-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.foperatorEntryRemarks}
                                onChange={(e) => setFilterData(e.target.value, "foperatorEntryRemarks")}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="pink-table-data"  title={item?.operatorEntryRemarks}>
                                    {checkData(item?.operatorEntryRemarks)}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="orange-title">Finish Quantity (Kgs)</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            children: [
                {
                    title: (
                        <div className="orange-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.ffinishQuantity}
                                onChange={(e) => setFilterData(e.target.value, "ffinishQuantity")}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="orange-table-data">{checkData(String(item?.finishQuantity))}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="orange-title">No. of Pcs Per Bundle</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            children: [
                {
                    title: (
                        <div className="orange-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fpiecesPerBundle}
                                onChange={(e) => setFilterData(e.target.value, "fpiecesPerBundle")}

                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="orange-table-data">{checkData(String(item?.piecesPerBundle))}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="orange-title">Bundle Weight (Kg)</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            children: [
                {
                    title: (
                        <div className="orange-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fbundleWeight}
                                onChange={(e) => setFilterData(e.target.value, "fbundleWeight")}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="orange-table-data">{checkData(String(item?.bundleWeight))}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="orange-title">No. of Bundles</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            children: [
                {
                    title: (
                        <div className="orange-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fnoOfBundles}
                                onChange={(e) => setFilterData(e.target.value, "fnoOfBundles")}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="orange-table-data">{checkData(String(item?.noOfBundles))}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="orange-title">Total No. of Pcs</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            children: [
                {
                    title: (
                        <div className="orange-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.ftotalNoOfPieces}
                                onChange={(e) => setFilterData(e.target.value, "ftotalNoOfPieces")}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="orange-table-data">{checkData(String(item?.totalNoOfPieces))}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="orange-title">Correction Qty (Kgs)</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            children: [
                {
                    title: (
                        <div className="orange-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fcorrectionQty}
                                onChange={(e) => setFilterData(e.target.value, "fcorrectionQty")}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="orange-table-data">{checkData(item?.correctionQty)}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="orange-title">
                    Actual FrontEnd Coring Length (mm)
                </div>
            ),
            dataIndex: "",
            width: 300,
            align: "center",
            children: [
                {
                    title: (
                        <div className="orange-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.factualFrontEndCoringLength}
                                onChange={(e) => setFilterData(e.target.value, "factualFrontEndCoringLength")}
                            />
                        </div>
                    ),
                    width: 300,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="orange-table-data">
                                    {checkData(String(item?.actualFrontEndCoringLength))}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: (
                <div className="orange-title">
                    Actual BackEnd Coring Length (mm)
                </div>
            ),
            dataIndex: "",
            width: 300,
            align: "center",
            children: [
                {
                    title: (
                        <div className="orange-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.factualBackEndCoringLength}
                                onChange={(e) => setFilterData(e.target.value, "factualBackEndCoringLength")}
                            />
                        </div>
                    ),
                    width: 300,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="orange-table-data">
                                    {checkData(String(item?.actualBackEndCoringLength))}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="orange-title">Recovery (Calculated)</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            children: [
                {
                    title: (
                        <div className="orange-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.frecovery}
                                onChange={(e) => setFilterData(e.target.value, "frecovery")}
                            />
                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div className="orange-table-data">{checkData(String(item?.recovery))}</div>
                            </>
                        );
                    },
                },
            ],

        },
        {
            title: <div className="orange-title">Bundling Supervisor Remarks</div>,
            dataIndex: "",
            width: 300,
            align: "center",
            children: [
                {
                    title: (
                        <div className="orange-title" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                             <Input type="search"
                                className="small-input-filter jc"
                                placeholder="Enter"
                                style={{ width: "140px" }}
                                value={pendingFilter?.fbundlingSupervisorRemarks}
                                onChange={(e) => setFilterData(e.target.value, "fbundlingSupervisorRemarks")}
                            />

                        </div>
                    ),
                    width: 200,
                    render: (item: any) => {
                        return (
                            <>
                                <div
                                    className="orange-table-data"
                                    title={item?.bundlingSupervisorRemarks}
                                >
                                    {item?.bundlingSupervisorRemarks != null &&
                                        item?.bundlingSupervisorRemarks?.length > 0
                                        ? item?.bundlingSupervisorRemarks
                                        : "-"}
                                </div>
                            </>
                        );
                    },
                },
            ],

        },
    ];

    const columns: any = [
        {
            title: <div className='gray-title'>
                <img
                    onClick={() => setFilterMenu(true)}
                    src={AppImages?.filterIcon}
                /> PO No. </div>,
            dataIndex: "",
            width: 200,
            fixed: 'left',
            render: (item: any, _: any, index: any) => {
                return (
                    <div className='table-with-checkbox-data jc'
                    >
                    <div className={user?.roleId == 1 ? 'table-data-blue' : 'table-data'}
                              onClick={() => 
                                // setModalOpen(true)
                                // setCellData(item)
                                modalOpenforDashBoard(item)
                            
                            }
                        >{(item?.poNo)}</div>
                    </div>
                )
            }
        },
        {
            title: <div className='gray-title'>Customer Name</div>,
            dataIndex: "",
            width: 300,
            fixed: 'left',
            align: 'center', ellipsis: true,
            render: (item: any) => {
                return (
                    <div className='table-data'>
                        {checkData(item?.customer_name)} </div>
                )
            }
        },
        {
            title: <div className='gray-title'>Status</div>,
            dataIndex: "",
            width: 150,
            fixed: 'left',
            render: (item: any, _: any, index: any) => {
                return (
                    <div className='table-with-checkbox-data jc'>
                        <div className='table-data'>{checkData(item?.status)}</div>
                    </div>
                )
            }
        },
        {
            title: <div className='gray-title'>Weightage</div>,
            dataIndex: "",
            width: 150,
            fixed: 'left',
            align: 'center', ellipsis: true,
            render: (item: any) => {
                return (
                    <div style={{ padding: 6 }}>
                        <Progress percent={item?.weightage} />
                    </div>
                )
            }
        },
        {
            title: <div className='gray-title'>Sales Order No.</div>,
            dataIndex: "",
            width: 200,
            align: 'center', ellipsis: true,
            render: (item: any) => {
                return (
                    <div className='table-data'>
                        {checkData(item?.soNo)}
                    </div>
                )
            }
        },
        {
            title: <div className='gray-title'>PO Release Date</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            render: (item: any) => {
                return (
                    <div className="table-data">
                        {item?.po_release_dt != null ? moment(item?.po_release_dt).format('DD-MMM-YYYY') : "-"}
                    </div>
                );
            },
        },
        {
            title: <div className='gray-title'>Section No.</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <div className='table-data'>
                        {/* {moment(item?.sectionNo)?.isValid() ? moment(item?.sectionNo)?.format("DD-MMM-YYYY") : ''} */}
                        {checkData(item?.sectionNo)}
                    </div>
                )
            }
        },
        // {
        //     title: <div className='gray-title'>Process Stage</div>,
        //     dataIndex: "",
        //     width: 200,

        //     render: (item: any) => {
        //         return (
        //             <div className='table-data'>
        //                 {checkData(item?.processStage)}
        //             </div>
        //         )
        //     }
        // },
        {
            title: <div className='gray-title'>Alloy Temper</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <div className='table-data'>
                        {checkData(item?.alloyTemper)}
                    </div>
                )
            }
        },
        {
            title: <div className='gray-title'>PO Total Quantity</div>,
            width: 200,
            dataIndex: "",

            render: (item: any) => {
                return (
                    <div className='table-data'>
                        {checkData(item?.po_qty)}
                    </div>
                )
            }
        },
        {
            title: <div className='gray-title'>Extruded Quantity (Kgs)</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <div className='table-data'>
                        {checkData(item?.extruded_qty)}
                    </div>
                )
            }
        },
        {
            title: <div className='gray-title'>Balance PO Quantity</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <div className='table-data'>
                        {checkData(item?.balance_po_qty)}
                    </div>
                )
            }
        },
        {
            title: <div className='gray-title'>Cut Length</div>,
            dataIndex: "",
            width: 200,
            render: (item: any) => {
                return (
                    <div className='table-data'>
                        {checkData(item?.cut_len)}
                    </div>
                )
            }
        },
        {
            title: <div className='gray-title'>Cut Length Tolerance (mm)</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <div className='table-data'>
                        {checkData(item?.cut_len_tolerance)}
                    </div>
                )
            }
        },
        {
            title: <div className='gray-title'>Quantity Tolerance (%)</div>,
            dataIndex: "",
            width: 150,

            render: (item: any) => {
                return (
                    <div className='table-data'>
                        {checkData(item?.qty_tolerance)}
                    </div>
                )
            }
        },
        {
            title: <div className='gray-title'>Priority Assignment</div>,
            dataIndex: "",
            width: 200,
            render: (item: any) => {
                return (//Immediate
                    <div className={item?.priority == 'High' ? 'table-data_immediate' : 'table-data'}>
                        {(item != null && item != undefined && item != "" && item != 'null') ? 
                            item?.priority
                            : "-"
                        }
                    </div>
                )
            }
        },
        {
            title: <div className='gray-title'>Marketing Remarks</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <div className='table-data'  title={item?.marketing_remarks}>
                        {checkData(item?.marketing_remarks)}
                    </div>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.plantSelected}</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='green-table-data'>
                            {checkData(item?.plantSelected)}
                        </div>
                    </>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.pressAllocation}</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='green-table-data'>
                            {checkData(item?.pressAllocation)}
                        </div>
                    </>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.plannedQuantity}</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='green-table-data'>
                            {checkData(item?.plannedQty)}
                        </div>
                    </>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.plannedInternalAlloy}</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='green-table-data'>
                            {checkData(item?.plannedInternalAlloy)}
                        </div>
                    </>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.plannedNoOfBillets}</div>,
            dataIndex: "",
            width: 400,
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
                        className="jfs ellipse-none green-table-data"
                        // style={{ marginLeft: "25px" }}
                        title={billetString}
                      >
                        {isArrayNotEmpty(billetLength) ? billetString : "-"}
                      </div>
                    </>
                  );
              },
        },
        {
            title: <div className='green-title'>{AppConstants.prodRateReq}</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (

                    <>
                        <div className="green-table-data">
                            {checkData(item?.productionRateRequired)}
                        </div>
                    </>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.plannedQuenching}</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='green-table-data'>
                            {checkData(item?.plannedQuenching)}
                        </div>
                    </>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.plannedFrontEndCoringLength}</div>,
            dataIndex: "",
            width: 300,

            render: (item: any) => {
                return (
                    <>
                        <div className='green-table-data'>
                            {checkData(String(item?.frontEndCoringLength))}
                        </div>
                    </>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.plannedBackEndCoringLength}</div>,
            dataIndex: "",
            width: 300,

            render: (item: any) => {
                return (
                    <>
                        <div className='green-table-data'>
                            {checkData(String(item?.backEndCoringLength))}
                        </div>
                    </>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.plannedExtrusionLength}</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='green-table-data'>
                            {item?.plantExtrusionLength !== null && item?.extrusionLength !== null ? `${item?.plantExtrusionLength}${item?.extrusionLength}` : "-"}
                        </div>
                    </>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.plannedButtThickness}</div>,
            dataIndex: "",
            width: 250,

            render: (item: any) => {
                return (
                    <>
                        <div className='green-table-data'>
                            {checkData(String(item?.plannedButtThickness))}
                        </div>
                    </>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.cutBillet}</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='green-table-data'>
                            {checkData(item?.cutBillets)}
                        </div>
                    </>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.buttWeightPerInch}</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='green-table-data'>
                            {checkData(String(item?.buttWeightPerInch))}
                        </div>
                    </>
                )
            }
        },
        {
            title: <div className='green-title'>{AppConstants.ppcRemarks}</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='green-table-data' title={item?.ppcRemarks}>
                            {checkData(item?.ppcRemarks)}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='laventor-title'>DIE</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='laventor-table-data'>
                            {checkData(item?.die)}
                        </div>
                    </>
                );
            }

        },
        {
            title: <div className='laventor-title'>No. of Cavity</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='laventor-table-data'>
                            {checkData(String(String(item?.noOfCavity)))}
                        </div>
                    </>
                );
            }

        },
        {
            title: <div className='laventor-title'>Bolster Entry</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='laventor-table-data'>
                            {checkData(item?.bolsterEntry)}
                        </div>
                    </>
                );
            }

        },
        {
            title: <div className='laventor-title'>Backer Entry</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='laventor-table-data'>
                            {checkData(item?.backerEntry)}
                        </div>
                    </>
                );
            }

        },
        {
            title: <div className='laventor-title'>Special Baker Entry</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='laventor-table-data'>
                            {checkData(item?.specialBackerEntry)}
                        </div>
                    </>
                );
            }

        },
        {
            title: <div className='laventor-title'>Ring Entry</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='laventor-table-data'>
                            {checkData(item?.ringEntry)}
                        </div>
                    </>
                );
            }

        },
        {
            title: <div className='laventor-title'>Welding Chambar</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='laventor-table-data'>
                            {checkData(item?.weldingChamber)}
                        </div>
                    </>
                );
            }

        },
        {
            title: <div className='laventor-title'>Die Setter</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='laventor-table-data'>
                            {checkData(item?.dieSetter)}
                        </div>
                    </>
                );
            }

        },
        {
            title: <div className='laventor-title'>Tool Shop Remarks</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='laventor-table-data' title={item?.toolShopRemarks}>
                            {checkData(item?.toolShopRemarks)}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='violate-title'>QA Remarks</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='violate-table-data'  title={item?.qaRemarks}>
                            {checkData(item?.qaRemarks)}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Die Trial</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(item?.dieTrial)}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Die With Aluminium</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(item?.dieWithAluminium)}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Previous Day Die Continue</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(item?.previousDayDie_continue)}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Batch No.</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(item?.batchNo)}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Actual Internal Alloy</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(item?.actualInternalAlloy)}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Start Time</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <div className="pink-table-data">
                        {checkData(moment(item?.startTime)?.isValid()
                            ? moment(item?.startTime)?.format("h:mm A")
                            : "-")}
                    </div>
                );
            }
        },
        {
            title: <div className='pink-title'>End Time</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className="pink-table-data">
                            {checkData(moment(item?.endTime)?.isValid()
                                ? moment(item?.endTime)?.format("h:mm A")
                                : "-")}
                        </div>
                    </>
                );
            },
        },
        {
            title: <div className='pink-title'>Process Time</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <div className='pink-table-data'>
                        {checkData(item?.processTime)}
                    </div>
                );
            }
        },
        {
            title: <div className='pink-title'>No.of Billet and Billet Length</div>,
            dataIndex: "",
            width: 300,
            render: (item: any) => {
                let billetLength: any =
                    item?.noOfBilletAndLength &&
                    JSON.parse(item?.noOfBilletAndLength);
                let billetString = ""
                {
                    (billetLength || []).map((e: any, index: any) => {
                        billetString += `Batch${index + 1}: ${e?.noOfBillet} Billets, ${e?.billetLength} ${index != billetLength.length - 1 ? " - " : ""}`;
                    })
                }
                let total = billetLength?.reduce((total: number, x: any) => total + parseInt(x?.noOfBillet), 0)
                billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`
                return (
                    <>
                        <div
                            className="jfs ellipse-none pink-table-data"
                            // style={{ marginLeft: "25px" }}
                            title={billetString}
                        >
                            {isArrayNotEmpty(JSON.parse(item?.noOfBilletAndLength)) ?  billetString : "-"}
                        </div>
                    </>
                );
            },
        },
        {
            title: <div className='pink-title'>Actual Butt Thickness</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(String(item?.actualButtThickness))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Breakthrough Pressure</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(String(item?.breakThroughPressure))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Push on Billet Length</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(String(item?.pushOnBilletLength))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Push Qty (Kgs)</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(String(item?.pushQtyInKgs))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Actual Production Rate</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(String(item?.actualProductionRate))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Butt Weight (Kgs)</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(String(item?.buttWeightInKgs))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Die Fail</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(item?.diefail)}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Die Failure Reason</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(item?.dieFailureReason)}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className="pink-title">Breakdown</div>,
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
                        className="jfs completed-ellipse pink-table-data"
                        title={value}
                    >
                        {checkData(value)}
                    </div>
                );
            },
        },
        {
            title: <div className="pink-title">Breakdown Duration</div>,
            dataIndex: "",
            width: 200,
            align: "center",
            ellipsis: true,
            render: (item: any) => {
                return (
                    <>
                        <div className="pink-table-data">{checkData(item?.breakDownDuration)}</div>
                    </>
                );
            },
        },
        // {
        //     title: <div className='pink-title'>Reason for Breakdown</div>,
        //     dataIndex: "",
        //     width: 200,

        //     render: (item: any) => {
        //         let breakdown = item?.breakDown && JSON.parse(item?.breakDown);
        //         return (
        //             <div className='pink-table-data'>
        //                 {(breakdown || []).map(
        //                     (e: any, index: any) => {
        //                         return (
        //                             // <div className='table-data' style={{marginRight:"3px"}} title={`${e?.startTime} - ${e?.endTime}, ${e?.reason}, ${e?.responsibleDepartment} |`}>
        //                             `${e?.reason}`
        //                         );
        //                     }
        //                 )}
        //             </div>
        //         );
        //     }
        // },
        // {
        //     title: <div className='pink-title'>Responsible Department for Breakdown</div>,
        //     dataIndex: "",
        //     width: 300,

        //     render: (item: any) => {
        //         return (
        //             <>
        //                 <div className='pink-table-data'>
        //                     {((JSON.parse(item?.breakDown)) || []).map(
        //                         (e: any, index: any) => {
        //                             return (
        //                                 // <div className='table-data' style={{marginRight:"3px"}} title={`${e?.startTime} - ${e?.endTime}, ${e?.reason}, ${e?.responsibleDepartment} |`}>
        //                                 `${e?.responsibleDepartment}`
        //                             );
        //                         }
        //                     )}
        //                 </div>
        //             </>
        //         );
        //     }
        // },
        {
            title: <div className='pink-title'>Log End Scrap Length (mm)</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(String(item?.logEndScrapLengthInMm))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Log End Scrap Length (Kgs)</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(String(item?.logEndScrapInKgs))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Operator Name</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data'>
                            {checkData(item?.operatorName)}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='pink-title'>Operator Entry Remarks</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='pink-table-data' title={item?.operatorEntryRemarks}>
                            {checkData(item?.operatorEntryRemarks)}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='orange-title'>Finish Quantity (Kgs)</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='orange-table-data'>
                            {checkData(String(item?.finishQuantity))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='orange-title'>No. of Pcs Per Bundle</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='orange-table-data'>
                            {checkData(String(item?.piecesPerBundle))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='orange-title'>Bundle Weight(Kg)</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='orange-table-data'>
                            {checkData(String(item?.bundleWeight))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='orange-title'>No. of Bundles</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='orange-table-data'>
                            {checkData(String(item?.noOfBundles))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='orange-title'>Total No. of Pcs</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='orange-table-data'>
                            {checkData(String(item?.totalNoOfPieces))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='orange-title'>Correction Qty(Kgs)</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='orange-table-data'>
                            {checkData(String(item?.correctionQty))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='orange-title'>Actual FrontEnd Coring Length(mm)</div>,
            dataIndex: "",
            width: 300,

            render: (item: any) => {
                return (
                    <>
                        <div className='orange-table-data'>
                            {checkData(String(item?.actualFrontEndCoringLength))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='orange-title'>Actual BackEnd Coring Length(mm)</div>,
            dataIndex: "",
            width: 300,

            render: (item: any) => {
                return (
                    <>
                        <div className='orange-table-data'>
                            {checkData(String(item?.actualBackEndCoringLength))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='orange-title'>Recovery(Calculated)</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='orange-table-data'>
                            {checkData(String(item?.recovery))}
                        </div>
                    </>
                );
            }
        },
        {
            title: <div className='orange-title'>Bundling Supervisor Remarks</div>,
            dataIndex: "",
            width: 200,

            render: (item: any) => {
                return (
                    <>
                        <div className='orange-table-data' title={item?.bundlingSupervisorRemarks}>
                            {checkData(item?.bundlingSupervisorRemarks)}
                        </div>
                    </>
                );
            }
        }
    ];


    const tableContainer = () => {
        try {
            let page = dashboardData?.getReportData?.page;
            // let isFilterInProgress = JSON.stringify(pendingListFilter) == JSON.stringify(pendingFilter)
            return (
                <>{dashBoardHeaderView()}
                    <div className="table-container">
                        {(dashboardOnload && !isFilterInProgress) ?
                        <Row gutter={16}>
                            {skeletonList.map((item: any) => (
                            <Col lg={24} md={24}>
                                <div className="skeleton-card-box">
                                <Skeleton paragraph={{ rows: 0 }} loading={true} active />
                                </div>
                            </Col>
                            ))}
                        </Row>
                        :
                        <Table 
                        columns={filterMenu === true ? filterColumns : columns} 
                        dataSource={dashboardData?.getReportData?.orderData} 
                        scroll={{ x: 1300, 
                            y: filterMenu ? ((page?.totalCount > 50) ? (tableHeight - 295) : (tableHeight - 250))
                                : ((page?.totalCount > 50) ? (tableHeight - 240) : (tableHeight - 200))
                            }} 
                        pagination={false} 
                        />
                        
                        }
                        <Row style={{ display: "flex", alignItems: "center", marginTop: 3, }}>
                            <Col style={{ display: "flex", alignItems: "center" }} span={14}>
                                {(tableHeaderArr).map((x: any) => {
                                    return (
                                        <div style={{ display: "flex", alignItems: "center", marginRight: 8, marginTop: 15 }}>
                                            <div style={{ height: 15, width: 15, backgroundColor: x?.color }}></div>
                                            <span style={{ marginLeft: 5 }}>{x?.Name}</span>
                                        </div>
                                    )
                                })}
                            </Col>
                            <Col style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }} span={10}>
                                <CommonPagination
                                    currentPage={page?.currentPage}
                                    total={page?.totalCount}
                                    handlePagination={handlePagination}
                                />
                            </Col>
                        </Row>

                    </div>

                </>
            )
        } catch (ex) {
            console.log("Err in tableContainer:: " + ex)
        }
    }


    return (
        <div className="report-cotainer" style={{ background: "#E3E2E3" }}>
            <TopMenuAndSider style={"0"} />
            {tableContainer()}
            <SpinLoader loading={downloadCSVOnload || downloadOnload}/>
            {(modalOpen) && <Modaldemo
                isModalopen ={modalOpen}
                data={cellData}
                isModalClose ={setModalOpen}
            />}
        </div>
    )
}

export default ReportListScreen;