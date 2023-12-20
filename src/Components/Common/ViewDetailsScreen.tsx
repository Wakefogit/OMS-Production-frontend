import { Col, Drawer, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import "./commonTableScreen.scss";
import "./CompletedListScreen.scss";
import AppConstants from '../../Global/AppConstants';
import "./ViewDetailsScreen.scss";
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { getUser } from '../../localStorage';
import moment from 'moment';

const ViewDetailsScreen = (props: any) => {  

    const { open, setOpen, sectionData, ppcList, toolShopList, qaList, operatorList, supervisorList} = props
    const [expandoPpcOpen, setExpandoPccOpen] = useState(true);
    const [expandoToolShopOpen, setExpandoToolShopOpen] = useState(false);
    const [expandoQaEntryOpen, setExpandoQaEntryOpen] = useState(false);
    const [expandoOperatorEntryOpen, setExpandoOperatorEntryOpen] = useState(false);
    const [expandoBundlingSupervisorOpen, setExpandoBundlingSupervisorOpen] = useState(false);
    const user = getUser();    

    const closeAll = () => {
        setExpandoPccOpen(true)
        setExpandoToolShopOpen(false)
        setExpandoQaEntryOpen(false)
        setExpandoOperatorEntryOpen(false)
        setExpandoBundlingSupervisorOpen(false)
    }

    useEffect(()=>{
        if(open == false){
            closeAll()
        }
    },[open])

    const batchNo: any = operatorList?.batchNo ? (JSON?.parse(operatorList?.batchNo)).toString() : "";
    const billetLength: any = operatorList?.pushOnBilletLength ? (JSON?.parse(operatorList?.pushOnBilletLength)).toString() : "";

    const operatorStartTime: any = operatorList?.startTime ? moment(operatorList?.startTime)?.format("HH:mm A") : "";
    const operatorEndTime: any = operatorList?.endTime ? moment(operatorList?.endTime)?.format("HH:mm A") : "";

    const operatorBreakDownStartTime = operatorList?.breakDownStartTime ? moment(operatorList?.breakDownStartTime)?.format("HH:mm A") : "";
    const operatorBreakDownEndTime = operatorList?.breakDownEndTime ? moment(operatorList?.breakDownEndTime)?.format("HH:mm A") : "";
    
    return(
        <div>
            <Drawer 
              placement="right" 
              open={open}
              onClose={() => setOpen(false)}    
              closable={false}
              closeIcon={false}   
              width={450}
              className="viewDetails-Drawer"
            >
                <div className='view-details'>
                    <div style={{position:"absolute", width:"100%", top:0}}>
                        <div className='view-details-header-close js'>
                            <div className='view-details-header'>{AppConstants?.viewDetails}</div>
                            <div className='view-details-close' onClick={() => setOpen(false)}>X</div>
                        </div>
                        <Row className='view-details-section-po-name-row'>
                            <Col span={8} className="view-details-section-po-name-col">
                                <div className='view-details-title-data'>
                                    <div className='view-details-title'>{AppConstants?.sectionNo}</div>
                                    <div className='view-details-data'>{sectionData?.sectionNo}</div>
                                </div>
                            </Col>
                            <Col span={8} className="view-details-section-po-name-col">
                                <div className='view-details-title-data'>
                                    <div className='view-details-title'>{AppConstants?.poNo}</div>
                                    <div className='view-details-data'>{sectionData?.orderNo}</div>
                                </div>
                            </Col>
                            <Col span={8} className="view-details-section-po-name-col">
                                <div className='view-details-title-data'>
                                    <div className='view-details-title'>{AppConstants?.customerName}</div>
                                    <div className='view-details-data'>{sectionData?.customerName}</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className='viewDetailsScroll' style={{height:"500px", overflow:"scroll", marginTop:159}}>
                        {(ppcList && (user?.roleId ===  1 || user?.roleId ===  2 || user?.roleId === 3 || user?.roleId === 4 || user?.roleId === 5 || user?.roleId === 6)) && 
                        (<div className='dataFromPPC-expando'>
                            {expandoPpcOpen === false &&
                            (<div className='dataFromPPC-expando-title' onClick={() => setExpandoPccOpen(!expandoPpcOpen)}>
                                <CaretRightOutlined className='rightArrow'/>
                                {AppConstants?.dataFromPPC}
                            </div>)
                            }
                            {expandoPpcOpen === true &&
                            (<div className='dataFromPPC-expando-data'>
                                <div className='dataFromPPC-expando-title' onClick={() => setExpandoPccOpen(!expandoPpcOpen)}>
                                    <CaretDownOutlined className='downArrow'/>
                                    {AppConstants?.dataFromPPC}
                                </div>
                                <div className='dataFromPPC-data'>
                                    <Row className='dataFromPPC-data-row'>
                                        <Col span={24} className="dataFromPPC-data-col">
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Alloy</div>
                                                <div className="dataFromPPC-text">{ppcList?.alloy}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Quenching</div>
                                                <div className="dataFromPPC-text">{ppcList?.quenching}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Production Rate Req (Kg/Hr)</div>
                                                <div className="dataFromPPC-text">{ppcList?.productionRate}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Billet lenght (Inches)</div>
                                                <div className="dataFromPPC-text">{ppcList?.billetLength}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">No of Billet</div>
                                                <div className="dataFromPPC-text">{ppcList?.noOfBillet}</div>    
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">No. of Pieces Per Billet</div>
                                                <div className="dataFromPPC-text">{ppcList?.piecesPerBillet}</div>    
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Butt Thickness (Inches)</div>
                                                <div className="dataFromPPC-text">{ppcList?.buttThickness}</div>    
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Extrusion Length</div>
                                                <div className="dataFromPPC-text">{ppcList?.extrusionLength}</div>    
                                            </div>
                                            {/* <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Butt Weight Per Inch</div>
                                                <div className="dataFromPPC-text">{ppcList?.buttThickness}</div>
                                            </div> */}
                                            {/* <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Billet Thickness (Inches)</div>
                                                <div className="dataFromPPC-text">{ppcList?.buttThickness}</div>
                                            </div> */}
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Coring/Piping Length (Front End)</div>
                                                <div className="dataFromPPC-text">{ppcList?.coringOrPipingLength_frontEnd}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Coring/Piping Length (Back End)</div>
                                                <div className="dataFromPPC-text">{ppcList?.coringOrPipingLength_backEnd}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Press Entry</div>
                                                <div className="dataFromPPC-text">{ppcList?.pressEntry}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Plant</div>
                                                <div className="dataFromPPC-text">{ppcList?.plant}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Balance Quantity (Kg)</div>
                                                <div className="dataFromPPC-text">{ppcList?.balanceQuantity}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">No. of Pieces Required</div>
                                                <div className="dataFromPPC-text">{ppcList?.noOfPiecesRequired}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Quantity Tolerance</div>
                                                <div className="dataFromPPC-text">{ppcList?.quantityTolerance}</div>
                                            </div>
                                            <div className='line'></div>
                                            <div className='dataFromPPC-remarks-title'>Remarks</div>
                                            <div className='dataFromPPC-remarks'>{ppcList?.remarks}</div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>)
                            }
                        </div>)}
                        {(toolShopList && (user?.roleId ===  1 || user?.roleId === 3 || user?.roleId === 4 || user?.roleId === 5 || user?.roleId === 6)) &&
                        (<div className='dataFromPPC-expando'>
                            {expandoToolShopOpen === false &&
                            (<div className='dataFromPPC-expando-title' onClick={() => setExpandoToolShopOpen(!expandoToolShopOpen)}>
                                <CaretRightOutlined className='rightArrow'/>
                                {AppConstants?.toolShopData}
                            </div>)
                            }
                            {expandoToolShopOpen === true &&
                            (<div className='dataFromPPC-expando-data'>
                                <div className='dataFromPPC-expando-title' onClick={() => setExpandoToolShopOpen(!expandoToolShopOpen)}>
                                    <CaretDownOutlined className='downArrow'/>
                                    {AppConstants?.toolShopData}
                                </div>
                                <div className='dataFromPPC-data'>
                                    <Row className='dataFromPPC-data-row'>
                                        <Col span={24} className="dataFromPPC-data-col">
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">DIE</div>
                                                <div className="dataFromPPC-text">{toolShopList?.die}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">No. of Cavity</div>
                                                <div className="dataFromPPC-text">{toolShopList?.noOfCavity}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Bolster Entry</div>
                                                <div className="dataFromPPC-text">{toolShopList?.bolsterEntry}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Backer Entry</div>
                                                <div className="dataFromPPC-text">{toolShopList?.backerEntry}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Special Backer Entry</div>
                                                <div className="dataFromPPC-text">{toolShopList?.specialBackerEntry}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Ring Entry</div>
                                                <div className="dataFromPPC-text">{toolShopList?.ringEntry}</div>    
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Die Setter</div>
                                                <div className="dataFromPPC-text">{toolShopList?.dieSetter}</div>    
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Welding Chamber</div>
                                                <div className="dataFromPPC-text">{toolShopList?.weldingChamber}</div>
                                            </div>
                                            <div className='line'></div>
                                            <div className='dataFromPPC-remarks-title'>Remarks</div>
                                            <div className='dataFromPPC-remarks'>{toolShopList?.remarks}</div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>)
                            }
                        </div>)}
                        {(qaList && (user?.roleId ===  1 || user?.roleId === 4 || user?.roleId === 5 || user?.roleId === 6)) && 
                        (<div className='dataFromPPC-expando'>
                            {expandoQaEntryOpen === false &&
                            (<div className='dataFromPPC-expando-title' onClick={() => setExpandoQaEntryOpen(!expandoQaEntryOpen)}>
                                <CaretRightOutlined className='rightArrow'/>
                                {AppConstants?.qaEntry}
                            </div>)
                            }
                            {expandoQaEntryOpen === true &&
                            (<div className='dataFromPPC-expando-data'>
                                <div className='dataFromPPC-expando-title' onClick={() => setExpandoQaEntryOpen(!expandoQaEntryOpen)}>
                                    <CaretDownOutlined className='downArrow'/>
                                    {AppConstants?.qaEntry}
                                </div>
                                <div className='dataFromPPC-data'>
                                    <Row className='dataFromPPC-data-row'>
                                        <Col span={24} className="dataFromPPC-data-col">
                                            <div className='line'></div>
                                            <div className='dataFromPPC-remarks-title'>Remarks</div>
                                            <div className='dataFromPPC-remarks'>{qaList.remarks}</div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>)
                            }
                        </div>)}
                        {(operatorList && (user?.roleId ===  1 || user?.roleId === 5 || user?.roleId === 6)) && 
                        (<div className='dataFromPPC-expando'>
                            {expandoOperatorEntryOpen === false &&
                            (<div className='dataFromPPC-expando-title' onClick={() => setExpandoOperatorEntryOpen(!expandoOperatorEntryOpen)}>
                                <CaretRightOutlined className='rightArrow'/>
                                {AppConstants?.dataFromOperatorEntry}
                            </div>)
                            }
                            {expandoOperatorEntryOpen == true &&
                            (<div className='dataFromPPC-expando-data'>
                                <div className='dataFromPPC-expando-title' onClick={() => setExpandoOperatorEntryOpen(!expandoOperatorEntryOpen)}>
                                    <CaretDownOutlined className='downArrow'/>
                                    {AppConstants?.dataFromOperatorEntry}
                                </div>
                                <div className='dataFromPPC-data'>
                                    <Row className='dataFromPPC-data-row'>
                                        <Col span={24} className="dataFromPPC-data-col">
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Batch No.</div>
                                                <div className="dataFromPPC-text">{batchNo ? batchNo : ""}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Butt Weight</div>
                                                <div className="dataFromPPC-text">{operatorList?.buttWeight}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Push On Billet Length</div>
                                                <div className="dataFromPPC-text">{billetLength}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Approx Push Qty (Kg)</div>
                                                <div className="dataFromPPC-text">{operatorList?.approxPushQty}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Start Time</div>
                                                <div className="dataFromPPC-text">{operatorStartTime}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">End Time</div>
                                                <div className="dataFromPPC-text">{operatorEndTime}</div>
                                            </div>
                                            {/* <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Time Difference</div>
                                                <div className="dataFromPPC-text">{operatorList?.batchNo}</div>
                                            </div> */}
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Time Taken (Min)</div>
                                                <div className="dataFromPPC-text">{operatorList?.processTime}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Production Rate Actual</div>
                                                <div className="dataFromPPC-text">{operatorList?.productionRateActual}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Remarks</div>
                                                <div className="dataFromPPC-text">{operatorList?.remarks} </div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Die With Aluminium</div>
                                                <div className="dataFromPPC-text">{operatorList?.dieWithAluminium}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Breakdown End Time</div>
                                                <div className="dataFromPPC-text">{operatorBreakDownStartTime}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Breakdown End Time</div>
                                                <div className="dataFromPPC-text">{operatorBreakDownEndTime}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Time Taken Breakdown</div>
                                                <div className="dataFromPPC-text">{operatorList?.timeTakenBreakDown}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Name of Operator</div>
                                                <div className="dataFromPPC-text">{operatorList?.nameOfOperator}</div>
                                            </div>
                                            <div className='jfsOutCenter'>
                                                <div className="dataFromPPC-title">Completed</div>
                                                <div className="dataFromPPC-text">Yes</div>
                                            </div>
                                            <div className='line'></div>
                                            <div className='dataFromPPC-remarks-title'>Reason For Break Down</div>
                                            <div className='dataFromPPC-remarks'>{operatorList?.reasonForBreakDown}</div>
                                            <div className='dataFromPPC-remarks-title'>Remarks</div>
                                            <div className='dataFromPPC-remarks'>{operatorList?.remarks}</div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>)
                            }
                        </div>)}
                        {(supervisorList && (user?.roleId ===  1 || user?.roleId === 6)) &&
                        (<div className='dataFromPPC-expando'>
                            {expandoBundlingSupervisorOpen === false &&
                            (<div className='dataFromPPC-expando-title' onClick={() => setExpandoBundlingSupervisorOpen(!expandoBundlingSupervisorOpen)}>
                                <CaretRightOutlined className='rightArrow'/>
                                {AppConstants?.dataFromBundlingSupervisor}
                            </div>)
                            }
                            {expandoBundlingSupervisorOpen === true &&
                            (<div className='dataFromPPC-expando-data'>
                                <div className='dataFromPPC-expando-title' onClick={() => setExpandoBundlingSupervisorOpen(!expandoBundlingSupervisorOpen)}>
                                    <CaretDownOutlined className='downArrow'/>
                                    {AppConstants?.dataFromBundlingSupervisor}
                                </div>
                                <div className='dataFromPPC-data'>
                                    <Row className='dataFromPPC-data-row'>
                                        <Col span={24} className="dataFromPPC-data-col">
                                            <div className='jfs'>
                                                <div className="dataFromPPC-title">Finish on PO Wise</div>
                                                <div className="dataFromPPC-text">{supervisorList?.finishQuantity}</div>
                                            </div>
                                            <div className='jfs'>
                                                <div className="dataFromPPC-title">No of PCS. per Bundel</div>
                                                <div className="dataFromPPC-text">{supervisorList?.noOfBundles}</div>
                                            </div>
                                            <div className='jfs'>
                                                <div className="dataFromPPC-title">Bundle Weight (Kg)</div>
                                                <div className="dataFromPPC-text">{supervisorList?.bundleWeight}</div>
                                            </div>
                                            <div className='jfs'>
                                                <div className="dataFromPPC-title">Billet lenght (Inches)</div>
                                                <div className="dataFromPPC-text">{supervisorList?.bundleWeight}</div>
                                            </div>
                                            <div className='jfs'>
                                                <div className="dataFromPPC-title">No. of Bundles</div>
                                                <div className="dataFromPPC-text">{supervisorList?.noOfBundles}</div>
                                            </div>
                                            <div className='jfs'>
                                                <div className="dataFromPPC-title">Correction Qty</div>
                                                <div className="dataFromPPC-text">{supervisorList?.correctionQty}</div>
                                            </div>
                                            <div className='jfs'>
                                                <div className="dataFromPPC-title">No of PCS/Coustomer Wise</div>
                                                <div className="dataFromPPC-text">{supervisorList?.totalNoOfPieces}</div>
                                            </div>
                                            <div className='jfs'>
                                                <div className="dataFromPPC-title">Total Finish Qty (KG)</div>
                                                <div className="dataFromPPC-text">{supervisorList?.totalFinishQty}</div>
                                            </div>
                                            <div className='jfs'>
                                                <div className="dataFromPPC-title">Recovery</div>
                                                <div className="dataFromPPC-text">{supervisorList?.recovery}</div>
                                            </div>
                                            <div className='jfs'>
                                                <div className="dataFromPPC-title">Log End Cut Scrap (Inch)</div>
                                                <div className="dataFromPPC-text">{supervisorList?.logEndCutSharpInch}</div>
                                            </div>
                                            <div className='jfs'>
                                                <div className="dataFromPPC-title">Log End Cut Scrap (Weight)</div>
                                                <div className="dataFromPPC-text">{supervisorList?.logEndCutSharpWeigth}</div>
                                            </div>
                                            <div className='line'></div>
                                            <div className='dataFromPPC-remarks-title'>Remarks</div>
                                            <div className='dataFromPPC-remarks'>{supervisorList?.remarks}</div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>)
                            }
                        </div>)}
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default ViewDetailsScreen ;