import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppConstants from "../../Global/AppConstants";
import AppImages from "../../Global/AppImages";
import { getUser } from "../../localStorage";
import FormUpdate from "../Common/FormUpdate";
import { getPendingListAction } from "../Store/Action/jindalAction";
import "./rollTable.scss";
const RollTable = (props: any) => {
    const {setExpando, expando} = props;
    const dispatch = useDispatch();
    const [inprogressLoad, setInprogressLoad] = useState(false);
    const jindalReducerState: any = useSelector((state: any) => state.JindalReducerState);
    const {getPendingList, getPendingOnLoad} = jindalReducerState;
    const getOrderData = getPendingList?.getOrderData?.orderData;
    const getOrderPage = getPendingList?.getOrderData?.page;
    const [completedOrder, setCompletedOrder] = useState<any>();
    const [updatedOrder, setUpdatedOrder] = useState<any>();
    const user = getUser();
    
    const getInprogressDataApi = () => {
        let payload = {
            type: AppConstants.INPROGRESS,         
            paging:{
            limit:10,
            offset:0 
                }                    
            }
        dispatch(getPendingListAction(payload))
        setInprogressLoad(true);
    }

    useEffect(()=>{
        getInprogressDataApi()
    },[])

    useEffect(()=>{
        if(inprogressLoad && !getPendingOnLoad){
            setCompletedOrder(getOrderData[0])
            setUpdatedOrder(getOrderData[1])
        }
    },[inprogressLoad, getPendingOnLoad])
    const header = () => {
        return(
            // <table>
            //     <tr>
            //         <th>Po no</th>
            //         <th>Customer Name</th>
            //     </tr>
            //     <tr>
            //         <th>
            //             Sales Order No
            //         </th>
            //         <th>
            //             Section No
            //         </th>
            //         <th>
            //             Alloy Temper
            //         </th>
            //         <th>
            //             PO Total Quantity
            //         </th>
            //         <th>
            //             Sales Order No
            //         </th>
            //         <th>
            //             Extruded Quantity(kgs)
            //         </th>
            //         <th>
            //             Balance PO Quantity
            //         </th>
            //         <th>
            //             Cut lenght tolerance
            //         </th>
            //         <th>
            //             Quantity Tolerance(%)
            //         </th>
            //         <th>
            //             Marketing remarks
            //         </th>
            //         <th>
            //             PO Total Quantity
            //         </th>
            //         <th>
            //             Cut Length
            //         </th>
            //         <th>
            //             Priority Assignment
            //         </th>
            //     </tr>
            // </table>
            // <Row className="rollTableRow">
            //     <Col className="staticTableHeaderFirstCol jfs" span={3}>
            //         <img src={AppImages?.filterIcon}/>
            //         <div style={{margin:"0px 15px"}}>PO no</div>
            //     </Col>
            //     <Col className="staticTableHeaderLastCol jc" span={3}>Customer Name</Col>
            //     <Col span={1}></Col>
            //     <Col span={17} className="">
            //         <Row style={{display:"flex"}}>
            //             <Col span={2} className="mainTableHeaderFirstCol jc">
            //                 <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
            //                     <div style={{display:"flex", whiteSpace:"break-spaces"}}>Section No</div>
            //                     <div style={{ color: "#8D8D8D" }}>|</div>
            //                 </div>
            //             </Col>
            //             <Col span={2} className="mainTableHeaderCol jc">
            //                 <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
            //                     <div style={{display:"flex", whiteSpace:"break-spaces"}}>Alloy Temper</div>
            //                     <div style={{ color: "#8D8D8D" }}>|</div>
            //                 </div>
            //             </Col>
            //             <Col span={2} className="mainTableHeaderCol jc">
            //                 <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
            //                     <div style={{display:"flex", whiteSpace:"break-spaces"}}>PO Total quantity</div>
            //                     <div style={{ color: "#8D8D8D" }}>|</div>
            //                 </div>
            //             </Col>
            //             <Col span={3} className="mainTableHeaderCol jc">
            //                 <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
            //                     <div style={{display:"flex", whiteSpace:"break-spaces"}}>Extruded Quantity(kgs)</div>
            //                     <div style={{ color: "#8D8D8D" }}>|</div>
            //                 </div>
            //             </Col>
            //             <Col span={3} className="mainTableHeaderCol jc">
            //                 <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
            //                     <div style={{display:"flex", whiteSpace:"break-spaces"}}>Balance PO Quantity(kgs)</div>
            //                     <div style={{ color: "#8D8D8D" }}>|</div>
            //                 </div>
            //             </Col>
            //             <Col span={2} className="mainTableHeaderCol jc">
            //                 <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
            //                     <div style={{display:"flex", whiteSpace:"break-spaces"}}>Cut length tolerance(mm)</div>
            //                     <div style={{ color: "#8D8D8D" }}>|</div>
            //                 </div>
            //             </Col>
            //             <Col span={2} className="mainTableHeaderCol jc">
            //                 <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
            //                     <div style={{display:"flex", whiteSpace:"break-spaces"}}>Quantity Tolerance(%)</div>
            //                     <div style={{ color: "#8D8D8D" }}>|</div>
            //                 </div>
            //             </Col>
            //             <Col span={2} className="mainTableHeaderCol jc">
            //                 <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
            //                     <div style={{display:"flex", whiteSpace:"break-spaces"}}>Marketing remarks</div>
            //                     <div style={{ color: "#8D8D8D" }}>|</div>
            //                 </div>
            //             </Col>
            //             <Col span={2} className="mainTableHeaderCol jc">
            //                 <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
            //                     <div style={{display:"flex", whiteSpace:"break-spaces"}}>PO Total quantity</div>
            //                     <div style={{ color: "#8D8D8D" }}>|</div>
            //                 </div>
            //             </Col>
            //             <Col span={2} className="mainTableHeaderCol jc">
            //                 <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
            //                     <div style={{display:"flex", whiteSpace:"break-spaces"}}>Cut Length</div>
            //                     <div style={{ color: "#8D8D8D" }}>|</div>
            //                 </div>
            //             </Col>
            //             <Col span={2} className="mainTableHeaderLastCol jc">
            //                 <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
            //                     <div style={{display:"flex", whiteSpace:"break-spaces"}}>Priority assignment</div>
            //                     <div style={{ color: "#8D8D8D" }}>|</div>
            //                 </div>
            //             </Col>
            //         </Row>
            //     </Col>
            // </Row>
            <Row className="rollTableRow">
                <Col className="staticTableHeaderFirstCol jfs" span={3}>
                    <img src={AppImages?.filterIcon}/>
                    <div style={{margin:"0px 15px"}}>PO no</div>
                </Col>
                <Col className="staticTableHeaderLastCol jc" span={3}>Customer Name</Col>
                <Col span={1}></Col>
                <Col span={17} className="scroll">
                    <Row style={{display:"flex"}}>
                        <Col span={2} className="mainTableHeaderFirstCol jc">
                            <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                <div style={{display:"flex", whiteSpace:"break-spaces"}}>Section No</div>
                                <div style={{ color: "#8D8D8D" }}>|</div>
                            </div>
                        </Col>
                        <Col span={2} className="mainTableHeaderCol jc">
                            <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                <div style={{display:"flex", whiteSpace:"break-spaces"}}>Alloy Temper</div>
                                <div style={{ color: "#8D8D8D" }}>|</div>
                            </div>
                        </Col>
                        <Col span={2} className="mainTableHeaderCol jc">
                            <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                <div style={{display:"flex", whiteSpace:"break-spaces"}}>PO Total quantity</div>
                                <div style={{ color: "#8D8D8D" }}>|</div>
                            </div>
                        </Col>
                        <Col span={2} className="mainTableHeaderCol jc">
                            <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                <div style={{display:"flex", whiteSpace:"break-spaces"}}>Extruded Quantity(kgs)</div>
                                <div style={{ color: "#8D8D8D" }}>|</div>
                            </div>
                        </Col>
                        <Col span={3} className="mainTableHeaderCol jc">
                            <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                <div style={{display:"flex", whiteSpace:"break-spaces"}}>Balance PO Quantity(kgs)</div>
                                <div style={{ color: "#8D8D8D" }}>|</div>
                            </div>
                        </Col>
                        <Col span={3} className="mainTableHeaderCol jc">
                            <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                <div style={{display:"flex", whiteSpace:"break-spaces"}}>Cut length tolerance(mm)</div>
                                <div style={{ color: "#8D8D8D" }}>|</div>
                            </div>
                        </Col>
                        <Col span={2} className="mainTableHeaderCol jc">
                            <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                <div style={{display:"flex", whiteSpace:"break-spaces"}}>Quantity Tolerance (%)</div>
                                <div style={{ color: "#8D8D8D" }}>|</div>
                            </div>
                        </Col>
                        <Col span={2} className="mainTableHeaderCol jc">
                            <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                <div style={{display:"flex", whiteSpace:"break-spaces"}}>Marketing remarks</div>
                                <div style={{ color: "#8D8D8D" }}>|</div>
                            </div>
                        </Col>
                        <Col span={2} className="mainTableHeaderCol jc">
                            <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                <div style={{display:"flex", whiteSpace:"break-spaces"}}>PO Total quantity</div>
                                <div style={{ color: "#8D8D8D" }}>|</div>
                            </div>
                        </Col>
                        <Col span={2} className="mainTableHeaderCol jc">
                            <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                <div style={{display:"flex", whiteSpace:"break-spaces"}}>Cut Length</div>
                                <div style={{ color: "#8D8D8D" }}>|</div>
                            </div>
                        </Col>
                        <Col span={2} className="mainTableHeaderLastCol jc">
                            <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                <div style={{display:"flex", whiteSpace:"break-spaces"}}>Priority assignment</div>
                                <div style={{ color: "#8D8D8D" }}>|</div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>


            // <div className="maincontent">
            //     <div className="static">
            //         <div>
            //             <img src={AppImages?.filterIcon}/>
            //             <div style={{margin:"0px 15px"}}>PO no</div>
            //         </div>
            //         <div>Customer Name</div>
            //     </div>
            //     <div className="scrollmenu">
            //         <div>Home</div>
            //         <div >Home</div>
            //         <div >Home</div>
            //         <div >Home</div>
            //         <div >Home</div>
            //         <div >Home</div>
            //         <div >Home</div>
            //         <div >Home</div>
            //         <div >Home</div>
            //     </div>
            // </div>
            

            // <Row className="rollTableRow">
            //     <Col className="staticTableHeaderFirstCol jfs" span={3}>
            //         <img src={AppImages?.filterIcon}/>
            //         <div style={{margin:"0px 15px"}}>PO no</div>
            //     </Col>
            //     <Col className="staticTableHeaderLastCol jc" span={3}>Customer Name</Col>
            //     <Col span={1}></Col>
            //     <Col className="scroll">
            //     <Row className="mainTableHeaderContainer">
            //         <Col span={2} className="mainTableHeaderCol">Section No</Col>
            //         <Col span={2} className="mainTableHeaderCol">Alloy Temper</Col>
            //         <Col span={2} className="mainTableHeaderCol">PO Total quantity</Col>
            //         <Col span={2} className="mainTableHeaderCol">Extruded Quantity (kgs)</Col>
            //         <Col span={2} className="mainTableHeaderCol">Balance PO Quantity (kgs)</Col>
            //         <Col span={2} className="mainTableHeaderCol">Cut length tolerance (mm)</Col>
            //         <Col span={2} className="mainTableHeaderCol">Quantity Tolerance (%)</Col>
            //         <Col span={2} className="mainTableHeaderCol">Marketing remarks</Col>
            //         <Col span={2} className="mainTableHeaderCol">PO Total quantity</Col>
            //         <Col span={2} className="mainTableHeaderCol">Cut Length</Col>
            //         <Col span={2} className="mainTableHeaderLastCol">Priority assignment</Col>
            //     </Row>
            //     </Col>
            // </Row>
            
        )
    }

    const completedRow = () => {
        return(
            <>
                <Row className="rollTableCompletedRow">
                    <Col className="staticCompletedTableDataFirstCol jc" span={3}>
                        {completedOrder?.poNo}
                    </Col>
                    <Col className="staticCompletedTableDataLastCol jc" span={3}>
                        {completedOrder?.customer_name}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={17}  className="">
                        <Row style={{display:"flex"}}>
                            <Col span={2} className="mainCompletedTableDataFirstCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center" }}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{completedOrder?.sectionNo}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainCompletedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center" }}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{completedOrder?.alloyTemper}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainCompletedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center" }}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{completedOrder?.po_qty}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={3} className="mainCompletedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center" }}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{completedOrder?.extruded_qty}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={3} className="mainCompletedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center" }}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{completedOrder?.balance_po_qty}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainCompletedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center" }}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{completedOrder?.cut_len_tolerance}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainCompletedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center" }}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{completedOrder?.qty_tolerance}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainCompletedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center" }}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{completedOrder?.marketing_remarks}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainCompletedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center" }}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{completedOrder?.cut_len}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainCompletedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center" }}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{completedOrder?.cut_len}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainCompletedTableDataLastCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center" }}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{completedOrder?.priority}</div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            {/* {expandoOpen == true ? <FormUpdate/> : ""} */}
            </>
        )
    }

    const inProgressRow = () => {
        return(
            <>
                <Row className="rollTableUpdatedRow">
                    <Col className="staticUpdatedTableDataFirstCol jfs" span={3}>
                        {
                            expando === true ? (
                                <DownOutlined
                                    className="rightOutlined-Icon"
                                    onClick={() => setExpando(!expando)}
                                />
                                ) : (
                                <RightOutlined
                                    className="rightOutlined-Icon"
                                    onClick={() => setExpando(!expando)}
                                />
                                )
                        }
                        <div style={{marginLeft:"10px"}}>{updatedOrder?.poNo}</div>
                    </Col>
                    <Col className="staticUpdatedTableDataLastCol jc" span={3}>{updatedOrder?.customer_name}</Col>
                    <Col span={1}></Col>
                    <Col span={17} className="">
                        <Row style={{display:"flex"}}>
                            <Col span={2} className="mainUpdatedTableDataFirstCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{updatedOrder?.sectionNo}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainUpdatedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{updatedOrder?.alloyTemper}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainUpdatedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{updatedOrder?.po_qty}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={3} className="mainUpdatedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{updatedOrder?.extruded_qty}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={3} className="mainUpdatedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{updatedOrder?.balance_po_qty}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainUpdatedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{updatedOrder?.cut_len_tolerance}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainUpdatedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{updatedOrder?.qty_tolerance}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainUpdatedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{updatedOrder?.marketing_remarks}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainUpdatedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{updatedOrder?.cut_len}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainUpdatedTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{updatedOrder?.cut_len}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainUpdatedTableDataLastCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{updatedOrder?.priority}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {expando == true ? <FormUpdate/> : ""}
            </>
        )
    }

    const yetToStartRow = (data: any) => {
        return(
            <>
                <Row className="rollTableYetToStartRow">
                    <Col className="staticYetToStartTableDataFirstCol jfs" span={3}>
                        {
                            <DownOutlined
                                className="rightOutlined-Icon"
                            />
                        }
                        <div style={{marginLeft:"10px"}}>{data?.poNo}</div>
                    </Col>
                    <Col className="staticYetToStartTableDataLastCol jc" span={3}>{data?.customer_name}</Col>
                    <Col span={1}></Col>
                    <Col span={17} className="">
                        <Row style={{display:"flex"}}>
                            <Col span={2} className="mainYetToStartTableDataFirstCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{data?.soNo}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainYetToStartTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{data?.alloyTemper}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainYetToStartTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{data?.po_qty}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={3} className="mainYetToStartTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{data?.extruded_qty}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={3} className="mainYetToStartTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{data?.balance_po_qty}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainYetToStartTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{data?.cut_len_tolerance}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainYetToStartTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{data?.qty_tolerance}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainYetToStartTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{data?.marketing_remarks}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainYetToStartTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{data?.cut_len}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainYetToStartTableDataCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{data?.cut_len}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                            <Col span={2} className="mainYetToStartTableDataLastCol jc">
                                <div style={{ display: "flex", margin: "14px 5px", alignItems:"center"}}>
                                    <div style={{display:"flex", whiteSpace:"break-spaces"}}>{data?.priority}</div>
                                    <div style={{ color: "#8D8D8D" }}>|</div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        )
    }
    return(
        <div className="rollTableContainer">
            {header()}
            {(completedOrder?.workFlowId >= 4 && user?.roleId == 2) ? completedRow() : ""}
            {(updatedOrder?.workFlowId == 2 && user?.roleId == 2) ? inProgressRow() : ""}
            {(getOrderData || []).map((item: any) => {
                return(
                    yetToStartRow(item)
                )
            })
            }
        </div>
    )
}

export default RollTable;