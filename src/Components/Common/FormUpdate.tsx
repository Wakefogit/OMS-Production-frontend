import { Form, Row, Col, Select, Input, message, Button, } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import AppImages from "../../Global/AppImages";
import AppConstants from "../../Global/AppConstants";
import "./FormUpdate.scss";
import { useDispatch, useSelector } from "react-redux";
import { commonReferenceDataAction, updateIsExpandedOnGetPendingList, updateOrderStatus } from "../Store/Action/jindalAction";
import { deepCopyFunction, isArrayNotEmpty } from "../../Global/Helpers";
import { getPpcOrderData, savePCCDataAction } from "../Store/Action/jindalAction";
import { getUser } from "../../localStorage";
import SpinLoader from "./SpinLoader";
import ConfirmPopup from "./ConfirmPopup";

let statusKey = '';
let modalKey = '';
let billetAdded = false;

const FormUpdate = (props: any) => {
    //use state for complete button and hold button..
    const [completeapicall, setcompleteapicall] = useState(false);
    const [holdapicall, setholdapicall] = useState(false);
    const [billetlength, setbilletlength] = useState<any>([{ id: 1, billetLength: null, noOfBillet: null }]);
    const [form]: any = Form.useForm();
    const { Option } = Select;
    const { updateStatus, ppcdata, getInProgressData, types ,modalKey} = props;
    const user = getUser();
    const dispatch = useDispatch();
    const jindalReducerState: any = useSelector((state: any) => state.JindalReducerState);
    const { plannedQuenchingData,
        CutBilletsData,
        PriorityData,
        pressAllocationData,
        ExtrusionLengthUnitData,
        savePPCData,
        ppcOrderDataList,
        ppcOrderDataOnLoad,
        updateStatusOnLoad,
        savePPCDataOnLoad,
        updateStatusData
    } = jindalReducerState;
    const [ppcDataLoad, setPpcDataLoad] = useState(false);
    const [saveInProgressLoad, setSaveInProgressLoad] = useState(false);
    const ppcOrderDetails = ppcOrderDataList?.getPpcInprogressData;
    const [statusOnload, setStatusOnload] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    // for get api call
    const saveInProgressDataTemp = {
        ppcId: null,
        orderId: null,
        plantSelected: null,
        pressAllocationRefId: null,
        plannedQty: null,
        plannedInternalAlloy: null,
        plannedNoOfBilletAndLength: null,
        productionRateRequired: null,
        plannedQuenching: null,
        frontEndCoringLength: null,
        backEndCoringLength: null,
        plantExtrusionLength: null,
        extrusionLengthRefId: null,
        plannedButtThickness: null,
        cutBilletsRefId: null,
        buttWeightPerInch: null,
        priorityRefId: null,
        remarks: null,

    };
    const [saveInProgressData, setSaveInProgressData] = useState(
        deepCopyFunction(saveInProgressDataTemp)
    );

    const saveOrUpdateInprogressData = (data: any) => {
        try {
            billetlength?.forEach((x: any, index: any) => {
                x.id = index + 1;
            })
            let isBilletAvaiable = true;
            console.log("billetlength[0]?.billetLength", billetlength[0]?.billetLength == (" inches" || null), billetlength)
            if(billetlength?.length == 1 &&
            (billetlength[0]?.billetLength == " inches" || billetlength[0]?.billetLength == null) 
            || (billetlength[0]?.noOfBillet == "" || billetlength[0]?.noOfBillet == null)){
                isBilletAvaiable = false;
            }
            let payload = {
                ppcId: saveInProgressData?.ppcId ? saveInProgressData?.ppcId : "",
                orderId: ppcdata?.orderId,
                plantSelected: saveInProgressData?.plantSelected,
                pressAllocationRefId: saveInProgressData?.pressAllocationRefId,
                plannedQty: saveInProgressData?.plannedQty,
                plannedInternalAlloy: saveInProgressData?.plannedInternalAlloy,
                plannedNoOfBilletAndLength: isBilletAvaiable ? billetlength : null,
                //plannedNoOfBilletAndLength: [{id:1,billet1:"10 inches"},{id:2,billet2:"20 inches"}],
                productionRateRequired: saveInProgressData?.productionRateRequired,
                plannedQuenching: saveInProgressData?.plannedQuenching,
                frontEndCoringLength: saveInProgressData?.frontEndCoringLength,
                backEndCoringLength: saveInProgressData?.backEndCoringLength,
                plantExtrusionLength:
                    saveInProgressData?.plantExtrusionLength,
                extrusionLengthRefId:
                    saveInProgressData?.extrusionLengthRefId,
                plannedButtThickness: saveInProgressData?.plannedButtThickness,
                cutBilletsRefId: saveInProgressData?.cutBilletsRefId,
                buttWeightPerInch: saveInProgressData?.buttWeightPerInch,
                priorityRefId: saveInProgressData?.priorityRefId,
                remarks: saveInProgressData?.remarks,
            };
            dispatch(savePCCDataAction(payload));
            setSaveInProgressLoad(true);
        } catch (error) {
            console.log("Error in saveOrUpdateInprogressData::", error)
        }
    };
    console.log("saveInProgressData", saveInProgressData)
    const updateStatusDataApi = (type: any) => {
        let orderList = [];
        orderList?.push(ppcdata?.orderId);
        let orderArr = JSON.stringify(orderList).replace(/"([^(")"]+)":/g, "$1:");
        billetlength?.forEach((element: any) => {
            delete element.id;
        })
        let isBilletAvaiable = true;
        if(billetlength?.length == 1 &&
        (billetlength[0]?.billetLength == " inches" || billetlength[0]?.billetLength == null) 
        || (billetlength[0]?.noOfBillet == "" || billetlength[0]?.noOfBillet == null)){
            isBilletAvaiable = false;
        }
        let ppcRolesData = {
            ppcId: ppcOrderDetails?.ppcId != undefined || ppcOrderDetails?.ppcId != null ? ppcOrderDetails?.ppcId : "",
            plantSelected: saveInProgressData?.plantSelected ? saveInProgressData?.plantSelected : null,  
            pressAllocationRefId: saveInProgressData?.pressAllocationRefId ? Number(saveInProgressData?.pressAllocationRefId) : null,
            plannedInternalAlloy: saveInProgressData?.plannedInternalAlloy ? saveInProgressData?.plannedInternalAlloy : null, 
            plannedNoOfBilletAndLength: isBilletAvaiable ? billetlength : null ,
            productionRateRequired: saveInProgressData?.productionRateRequired ? Number(saveInProgressData?.productionRateRequired) : null,
            plannedQty: (saveInProgressData?.plannedQty) ? Number(saveInProgressData?.plannedQty) : null,
            plannedQuenching: saveInProgressData?.plannedQuenching ? Number(saveInProgressData?.plannedQuenching) : null,
            frontEndCoringLength: saveInProgressData?.frontEndCoringLength,
            backEndCoringLength: saveInProgressData?.backEndCoringLength,
            // frontEndCoringLength: (String(saveInProgressData?.frontEndCoringLength) && saveInProgressData?.frontEndCoringLength) ? Number(saveInProgressData?.frontEndCoringLength) : null,
            // backEndCoringLength: (String(saveInProgressData?.backEndCoringLength) && saveInProgressData?.backEndCoringLength) ? Number(saveInProgressData?.backEndCoringLength) : null,
            plantExtrusionLength: saveInProgressData?.plantExtrusionLength ? Number(saveInProgressData?.plantExtrusionLength) : null,
            extrusionLengthRefId: saveInProgressData?.extrusionLengthRefId ? Number(saveInProgressData?.extrusionLengthRefId) : null,
            plannedButtThickness: saveInProgressData?.plannedButtThickness ? Number(saveInProgressData?.plannedButtThickness) : null,
            cutBilletsRefId: saveInProgressData?.cutBilletsRefId ? Number(saveInProgressData?.cutBilletsRefId) : null,
            buttWeightPerInch: saveInProgressData?.buttWeightPerInch ? Number(saveInProgressData?.buttWeightPerInch) : null,
            priorityRefId: saveInProgressData?.priorityRefId ? Number(saveInProgressData?.priorityRefId) : null,
            remarks: saveInProgressData?.remarks ? saveInProgressData?.remarks : null,
            processStage: user?.roleId == 1 ? ppcdata?.processStage : null
        };
        let payload = {
            orderId: [orderArr],
            type: type,
            roleData: ppcRolesData
        }
        dispatch(updateOrderStatus(payload))
        setStatusOnload(true)
    }

    useEffect(() => {
        if (isArrayNotEmpty(billetlength)) {
            (billetlength || [])?.map((item: any, index: number) => {
                let value = item["billetLength"] ? item["billetLength"]?.replace(" inches", "") : "";
                form?.setFieldsValue({
                    [`billet${item?.id}`]: parseFloat(value),
                    [`noOfBillet${item?.id}`]: parseInt(item["noOfBillet"])
                })
            })
        }
    }, [billetlength])
    
    useEffect(() => {
        if (statusOnload && updateStatusOnLoad === false) {
            setTimeout(()=>{
                let Message = updateStatusData?.updateOrderStatus_withMapping?.Message;
                if(Message == "Updated Successfully"){
                    message.success(statusKey == 'complete' ? "Completed Successfully" : "Holded Succesfully")
                    setcompleteapicall(false);
                    setholdapicall(false);
                    statusKey = '';
                }
                setStatusOnload(false);
            }, 800)
            getInProgressData();
            getPpcOrderList();
            // isSaveInProgress = false;
        }
    }, [statusOnload, updateStatusOnLoad]);

    useEffect(() => {
        if (saveInProgressLoad && !savePPCDataOnLoad) {
            getPpcOrderList();
            billetAdded = false;
            setTimeout(()=>{
                setSaveInProgressLoad(false);
                if (savePPCData?.createOrUpdatePpcData?.message == "Updated Successfully") {
                    message?.success("Successfully Updated");
                }
            }, 800);
            // isSaveInProgress = false;
        }
    }, [saveInProgressLoad, savePPCDataOnLoad]);
    //

    const prePopulateInprogressData = () => {
        try {
            // if (!ppcOrderDetails) {
            //     setbilletlength([{ id: 1, billetLength: null, noOfBillet: null}])
            // }
            if (ppcOrderDetails) {
                setSaveInProgressData({ ...ppcOrderDetails, 
                    priorityAssignmentRefId: ppcOrderDetails?.priorityRefId ? ppcOrderDetails?.priorityRefId : ppcdata.priorityRefId 
                })
                form?.setFieldsValue({
                    [`ppcdata-plantSelected`]: ppcOrderDetails?.plantSelected,
                    [`ppcdata-pressAllocationRefId`]: ppcOrderDetails?.pressAllocationRefId,
                    [`ppcdata-plannedQty`]: ppcOrderDetails?.plannedQty,
                    [`ppcdata-plannedInternalAlloy`]: ppcOrderDetails?.plannedInternalAlloy,
                    [`ppcdata-productionRateRequired`]: ppcOrderDetails?.productionRateRequired,
                    [`ppcdata-plannedQuenching`]: ppcOrderDetails?.plannedQuenching,
                    [`ppcdata-frontEndCoringLength`]: ppcOrderDetails?.frontEndCoringLength,
                    [`ppcdata-backEndCoringLength`]: ppcOrderDetails?.backEndCoringLength,
                    [`ppcdata-plantExtrusionLength`]: ppcOrderDetails?.plantExtrusionLength,
                    [`ppcdata-extrusionLengthRefId`]: ppcOrderDetails?.extrusionLengthRefId,
                    [`ppcdata-plannedButtThickness`]: ppcOrderDetails?.plannedButtThickness,
                    [`ppcdata-cutBilletsRefId`]: ppcOrderDetails?.cutBilletsRefId,
                    [`ppcdata-buttWeightPerInch`]: ppcOrderDetails?.buttWeightPerInch,
                    [`ppcdata-priorityAssignmentRefId`]: ppcOrderDetails?.priorityRefId ? ppcOrderDetails?.priorityRefId : ppcdata.priorityRefId,
                    [`ppcdata-remarks`]: ppcOrderDetails?.remarks
                }
                );

                let billetsArr = JSON.parse(ppcOrderDetails?.plannedNoOfBilletAndLength);
                billetsArr?.forEach((x: any, index: number) => {
                    x['id'] = index + 1;
                })
                {isArrayNotEmpty(billetsArr) ? setbilletlength(billetsArr) : setbilletlength([{ id: 1, billetLength: null, noOfBillet: null}])}
               
            } else {
                form?.resetFields();
                setbilletlength([{ id: 1, billetLength: null, noOfBillet: null }])
            }
        }
        catch (error) {
            console.log("error in prePopulateInprogressData", error);
        }
    };

    const getPpcOrderList = () => {
        let payload = {
            orderId: ppcdata?.orderId
        };
        dispatch(getPpcOrderData(payload));
        setPpcDataLoad(true);
        form?.resetFields();
        setbilletlength([{ id: 1, billetLength: null, noOfBillet: null }])
        setSaveInProgressData(saveInProgressDataTemp)
    };

    useEffect(() => {
        setLoader(true)
        setTimeout(()=>{
            getPpcOrderList();
        },(modalKey === 'valid' ?  700 : 0))
    }, []);

    useEffect(() => {
        getMetaDatas();
    }, []);

    const getMetaDatas = () => {
        setTimeout(()=>{
            plannnedQuenchingReferenceDataApi();
            CutBilletsReferenceDataApi();
            ExtrusionLengthUnitReferenceData();
            PriorityReferenceDataApi();
            pressAllocationReferenceDataApi();
        }, 1000)
    }

    useEffect(() =>{
        form.resetFields();
        setSaveInProgressData(saveInProgressDataTemp)
        if(ppcOrderDataList){
         prePopulateInprogressData();
        }
    },[ppcOrderDataList])

    useEffect(() => {
        if (ppcDataLoad && !ppcOrderDataOnLoad) {
            setPpcDataLoad(false);
            setLoader(false);
        }
    }, [ppcDataLoad, ppcOrderDataOnLoad]);

    
    const plannnedQuenchingReferenceDataApi = () => {
        let payload = {
            name: "Planned Quenching"
        };
        dispatch(commonReferenceDataAction(payload));
    }
    const CutBilletsReferenceDataApi = () => {
        let payload = {
            name: "Cut Billets"
        };
        dispatch(commonReferenceDataAction(payload))
    }

    const ExtrusionLengthUnitReferenceData = () => {
        let payload = {
            name: "Extrusion Length Unit"
        };
        dispatch(commonReferenceDataAction(payload))
    }
    const PriorityReferenceDataApi = () => {
        let payload = {
            name: "Priority"
        };
        dispatch(commonReferenceDataAction(payload))
    }
    const pressAllocationReferenceDataApi =() =>{
        let payload ={
            name : "Press Allocation"
        };
        dispatch(commonReferenceDataAction(payload))
    }

    let addFormField = (type: any) => {
        let lastObj = billetlength[billetlength?.length - 1];
        if (type == "Billetlength") {
            let obj: any = {
                id: (lastObj ? lastObj?.id : 0) + 1,
                // id: billetlength?.length + 1,
                billetLength: null,
                noOfBillet: null
            }
            // obj[`billet`] = null
            setbilletlength([...billetlength, obj])
        }
    }

    let handleMultipleDataBL = (index: any, e: any, type: any) => {
        if (type == "Billetlength") {
            let newFormBatch = [...billetlength];
            newFormBatch[index] = parseInt(e.target.value);
            setbilletlength(newFormBatch);
        }
    }

    let removeFormField = (index: any, type: any, item: any) => {
        if (type == "Billetlength") {
            let newFormBatch = [...billetlength];
            // newFormBatch.splice(index, 1);
            let filterbatch = newFormBatch?.filter((x: any) => x?.id != item?.id)
            setbilletlength(filterbatch)
            form?.setFieldsValue({
                [`billet${item?.id}`]: ''
            })
        }
    }

    const setBilletValue = (e: any, id: number, key: string) => {
        billetAdded = true;
        let checkExist = billetlength?.find((x: any) => x?.id == id);
        if(key == 'noOfBillet'){
            checkExist[key] = e.target.value
        }
        else{
            checkExist[key] = e.target.value + " inches";
        }
        setbilletlength([...billetlength]);
    }

    const multiplInputBoxForBilletlength = (type: any) => {
        try {
            let total = billetlength?.reduce(((total: number, x: any) => total+parseInt(x?.noOfBillet)), 0);
            return (
                <div>
                    {(billetlength || [])?.map((item: any, index: any) => {
                        return (
                            <Row className="jfe" style={{ margin: "0px 0px 10px 0px" }} key={item?.id}>
                                <Col span={6} className="text-center"><pre className="roboto">Batch{index+1}    No.of Billets</pre></Col>
                                <Col span={4} className="h-35">
                                    <Form.Item name={`noOfBillet${item?.id}`}
                                        rules={[{   required: completeapicall, message: 'Field is required' },
                                        {
                                            validator(rule, value, callback) {
                                                if (!value && completeapicall || ppcOrderDetails?.plannedNoOfBilletAndLength && !value) {
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
                                            min={0}
                                            step={1}
                                            type="number" 
                                            pattern="[0-9]*"
                                            onChange={(e) => setBilletValue(e, item?.id, 'noOfBillet')}
                                            className="" />
                                    </Form.Item>
                                </Col>
                                <Col span={4} className="text-center">Billet Length</Col>
                                <Col span={user?.roleId == 1 ? 6 : 5} className="multiple-inputBox-container h-35" style={{ margin: "0px 10px" }}>
                                    <div className="d-flex">
                                        <Form.Item name={`billet${item?.id}`}
                                            rules={[{   required: completeapicall, message: 'Field is required' },
                                            {
                                                validator(rule, value, callback) {
                                                    if (!value && completeapicall || ppcOrderDetails?.plannedNoOfBilletAndLength && !value) {
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
                                    {billetlength.length > 1 &&
                                    <div className={user?.roleId == 1 ? "closeButtonInDashboard jc" : "closeButton jc"} onClick={() => removeFormField(index, type, item)}>X</div>}
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
    }

    const confirmProcess = (key: string,)=>{
        setcompleteapicall(true)
        form.validateFields().then(()=>{
            setConfirmOpen(true)
            statusKey = key;
            // if(key == 'complete'){
            //     setcompleteapicall(true);
            // }
            // else{
            //     setholdapicall(true);
            // }
        })
    }

    const closePopup = ()=>{
        setConfirmOpen(false);
        setcompleteapicall(false);
        setholdapicall(false)
    }

    return (
        <Form
            form={form}
            autoComplete="off"
            id="form"
            // onFinish={() => saveOrUpdateInprogressData(data)}
            onFinish={() => saveOrUpdateInprogressData(ppcdata)}
        >
            <div className={modalKey!= "valid" ? "ppc-inprogress-expando-collapse" : "ppc-inprogress-with-Modal ppc-inprogress-expando-collapse"}>
                <Row className="ppc-inprogress-data-with-box padding">
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing">
                        <div className="  required-field-1">
                            {AppConstants?.plantSelected}
                        </div>
                        <Form.Item name="ppcdata-plantSelected"
                            rules={[{   required: completeapicall, message: 'Field is required' }]}>
                            <Input maxLength={500} style={{ width: 100 }}
                                value={saveInProgressData?.plantSelected ? saveInProgressData?.plantSelected : ""}
                                onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, plantSelected: e?.target?.value }) }} />
                        </Form.Item>
                    </Col>
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing">
                        <div className="  required-field-1">
                            {AppConstants?.pressAllocation}
                        </div>
                        <Form.Item name="ppcdata-pressAllocationRefId"
                            rules={[{   required: completeapicall, message: 'Field is required' }]}>
                            {/* <Input maxLength={500} style={{ width: 100 }}
                                onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, pressAllocation: e?.target?.value }) }} /> */}
                            <Select style={{ width: 100 }}
                                onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, pressAllocationRefId: e }) }}
                            >
                                {(pressAllocationData || []).map((item: any) => {
                                    return (
                                        <Option value ={item?.id}>{item?.name}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing">
                        <div className="  required-field-1">
                            {AppConstants?.plannedQty}
                        </div>
                        <Form.Item name="ppcdata-plannedQty"
                            rules={[{   required: completeapicall, message: 'Field is required' }]}>
                            <Input 
                             step={0.0001}
                             min={0.0001}
                             type="number" 
                             style={{ width: 100 }}
                             onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, plannedQty: e?.target?.value }) }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing">
                        <div className="  required-field-1">
                            {AppConstants?.plannedInternalAlloy}
                        </div>
                        <Form.Item name="ppcdata-plannedInternalAlloy"
                            rules={[{   required: completeapicall, message: 'Field is required' }]}>
                            <Input type="text" maxLength={500} style={{ width: 100 }}
                                onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, plannedInternalAlloy: e?.target?.value }) }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="billet-set">
                    <Col span={24} className="ppc-inprogress-data-with-box-title d-flex">
                        <div className="  required-field-1">
                            {AppConstants?.plannedNoOfBilletAndLength}
                        </div>
                        {/* Billetlength */}
                        <Form.Item name="ppcdata-plannedNoOfBilletAndLength"
                        //rules={[{   required: completeapicall, message: 'Field is required' }]}
                        >
                            {(billetlength?.length >= 0) &&
                                <div className={billetlength?.length >= 5 ? "d-flex disabled" : 'd-flex '}>
                                    <div className={billetlength?.length >= 5  ? "addButton disabled d-flex" : "addButton d-flex" } 
                                    onClick={() =>{billetlength?.length < 5 && addFormField("Billetlength")}}
                                    >
                                        +
                                    </div>
                                </div>
                            }
                        </Form.Item>
                    </Col>
                    <Col span={17} className="ppc-inprogress-data-with-box-title spacing">
                        {multiplInputBoxForBilletlength("Billetlength")}
                    </Col>
                </Row>
                <Row className="ppc-inprogress-data-with-box padding">
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing ">
                        <div className="  required-field-1">
                            {AppConstants?.productionRateRequired}
                        </div>
                        <Form.Item name="ppcdata-productionRateRequired"
                            rules={[{   required: completeapicall, message: 'Field is required' }]}>
                            <Input min={0.0001} type="number" step={0.0001} style={{ width: 100 }}
                                onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, productionRateRequired: e?.target?.value }) }} />
                        </Form.Item>
                    </Col>
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing">
                        <div className="  required-field-1">
                            {AppConstants?.plannedQuenching}
                        </div>
                        <Form.Item name="ppcdata-plannedQuenching"
                            rules={[{   required: completeapicall, message: 'Field is required' }]}>
                            <Select style={{ width: 100 }}
                                onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, plannedQuenching: e }) }}
                            >

                                {(plannedQuenchingData || []).map((item: any) => {
                                    return (
                                        <Option value={item?.id}>{item?.name}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing ">
                        <div className="  required-field-1">
                            {AppConstants?.plannedFrontEndCoringLength}
                        </div>
                        <Form.Item name="ppcdata-frontEndCoringLength"
                            rules={[{   required: completeapicall, message: 'Field is required' }]}>
                            <Input min={0.0000} type="number" step={0.0001} style={{ width: 100 }}
                                onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, frontEndCoringLength: e?.target?.value }) }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing">
                        <div className="  required-field-1">
                            {AppConstants?.plannedBackEndCoringLength}
                        </div>
                        <Form.Item name="ppcdata-backEndCoringLength"
                            rules={[{   required: completeapicall, message: 'Field is required' }]}>
                            <Input min={0.0000} type="number" step={0.0001} style={{ width: 100 }}
                                onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, backEndCoringLength: e?.target?.value }) }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="ppc-inprogress-data-with-box padding-1">
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing">
                        <div className="  required-field-1">
                            {AppConstants?.plannedExtrusionLength}
                        </div>
                        <div style={{ display: "inline-flex", gap: "5px" }}>
                            <Form.Item name="ppcdata-plantExtrusionLength"
                                rules={[{   required: completeapicall, message: 'Field is required' }]}>
                                <Input min={0.0001} type="number" step={0.0001} style={{ width: 80 }}
                                    onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, plantExtrusionLength: e?.target?.value }) }}
                                />
                            </Form.Item>
                            <Form.Item name="ppcdata-extrusionLengthRefId"
                                rules={[{   required: completeapicall, message: 'Field is required' }]}>
                                <Select style={{ width: 60 }}
                                    onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, extrusionLengthRefId: e }) }}
                                >
                                    {(ExtrusionLengthUnitData || []).map((item: any) => {
                                        return (
                                            <Option key={item?.id} value={item?.id}>{item?.name}</Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </div>
                    </Col>
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing">
                        <div className="  required-field-1">
                            {AppConstants?.plannedButtThickness}
                        </div>
                        <Form.Item name="ppcdata-plannedButtThickness"
                            rules={[{   required: completeapicall, message: 'Field is required' }]}>
                            <Input min={0.0001} type="number" step={0.0001} className="inprogress-data-with-box" style={{ width: 100 }}
                                onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, plannedButtThickness: e?.target?.value }) }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing">
                        <div className="  required-field-1">
                            {AppConstants?.cutBillets}
                        </div>
                        <Form.Item name="ppcdata-cutBilletsRefId"
                            rules={[{   required: completeapicall, message: 'Field is required' }]}>
                            <Select style={{ width: 100 }}
                                onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, cutBilletsRefId: e }) }}
                            >
                                {(CutBilletsData || []).map((item: any) => {
                                    return (
                                        <Option key={item?.id} value={item?.id}>{item?.name}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing">
                        <div className="  required-field-1">
                            {AppConstants?.buttWeightPerInch}
                        </div>
                        <Form.Item name="ppcdata-buttWeightPerInch"
                            rules={[{   required: completeapicall, message: 'Field is required' }]}>
                            <Input min={0.0001} type="number" step={0.0001} style={{ width: 100 }}
                                onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, buttWeightPerInch: e?.target?.value }) }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="ppc-inprogress-data-with-box padding">
                    <Col span={6} className="ppc-inprogress-data-with-box-title spacing">
                        <div className="  required-field-1">
                            {AppConstants?.priorityAssignment}
                        </div>
                        <Form.Item name="ppcdata-priorityAssignmentRefId"
                            rules={[{   required: completeapicall, message: 'Field is required' }]}>
                            <Select 
                            style={{ width: 100 }}
                            value={saveInProgressData?.priorityRefId}
                            onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, priorityRefId: e }) }}
                            >
                                {(PriorityData || []).map((item: any) => {
                                    return (
                                        <Option key={item.id} value={item.id}>{item?.name}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="inprogress-remark-title-text">
                    <div className="inprogress-remark-title">{AppConstants?.ppcRemarks}</div>
                    <Form.Item name="ppcdata-remarks"
                    // rules={[{   required: completeapicall, message: 'Field is required' }]}
                    >
                        <TextArea maxLength={5000}
                            onChange={(e: any) => { setSaveInProgressData({ ...saveInProgressData, remarks: e?.target?.value }) }}
                        />
                    </Form.Item>
                </div>
                {(modalKey !='valid')&&(
                <div className="inprogress-buttons js">
                    <div className="inprogress-hold-complete-button js">
                        {types != AppConstants?.HOLD && (
                        <Button className="inprogress-hold-button jc" 
                        type="primary"
                        onClick={() => {
                            setholdapicall(true); 
                            setConfirmOpen(true); 
                            setcompleteapicall(false)}}
                        >
                            <img src={AppImages?.holdIcon} />Hold
                        </Button>)}
                        <Button className="inprogress-complete-button jc" 
                            type="default"
                            onClick={() => confirmProcess('complete')}>
                            <img src={AppImages?.correctIcon} />Complete
                        </Button>
                    </div>
                    <div className= "inprogress-clear-update-button js">
                        <Button 
                        className="inprogress-clear-button" type="default"
                        onClick={() => getPpcOrderList()}
                        >
                            Clear
                        </Button>
                        <Button className="inprogress-update-button" 
                        // disabled={saveInProgressLoad}
                        onClick={()=>setcompleteapicall(false)}
                        htmlType="submit"
                        type="primary">Update</Button>
                    </div>
                </div>
            )}
            {(modalKey ==='valid')&&(
                <div className="inprogress-buttons position-fixed jf">
                    <Button className="inprogress-save-Modal-button" 
                    // disabled={saveInProgressLoad}
                    htmlType="submit"
                    type="primary">Save</Button>
                </div>
            )}
            </div>
            {(statusOnload || saveInProgressLoad || loader) && <SpinLoader loading={true}/>}
            <ConfirmPopup 
                open={confirmOpen}
                setOpen={closePopup}
                content={completeapicall ? 
                    <>Do you want to complete the process for PO: <b>{ppcdata?.poNo}</b> ?</>
                    : 
                    <>Do you want to move PO: <b>{ppcdata?.poNo}</b> to hold?</>
                }
                callback={() => updateStatusDataApi(completeapicall ? AppConstants?.COMPLETED : AppConstants?.HOLD)} 
                buttonText={completeapicall ? "Complete" : "Hold"}     
           />
        </Form>
    )
}

export default FormUpdate;