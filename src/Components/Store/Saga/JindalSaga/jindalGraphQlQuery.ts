import { isArrayNotEmpty } from "../../../../Global/Helpers";

const checkValue = (value: any)=>{
    let valueTemp = String(value);
    if(valueTemp && valueTemp != "null" && value != undefined){
      return value
    }
    else{
      return null
    }
}

const getPendingListQuery = (payload: any) => {
    try {
        let query = `
        query{
            getOrderData(input:{
                type: """${payload?.type}""",
                exportType: ${payload?.exportType ? payload?.exportType : 0} ,
                fpo: ${payload.fpo ? `"${payload.fpo}"` : `""`},
                fcustomer_name: ${payload.fcustomer_name ? `"${payload.fcustomer_name}"` : `""`},
                fso: ${payload.fso ? `"${payload.fso}"` : `""`},
                fsectionNo: ${payload.fsectionNo ? `"${payload.fsectionNo}"` : `""`},
                fAlloyTemper: ${payload.fAlloyTemper ? `"${payload.fAlloyTemper}"` : `""`},
                fpo_qty: ${payload.fpo_qty ? `"${payload.fpo_qty}"` : `""`},         
                fextruded_qty: ${payload.fextruded_qty ? `"${payload.fextruded_qty}"` : `""`},            
                fbalance_po_qty: ${payload.fbalance_po_qty ? `"${payload.fbalance_po_qty}"` : `""`},          
                fmarketing_remarks: ${payload.fmarketing_remarks ? `"${payload.fmarketing_remarks}"` : `""`},           
                fcut_len: ${payload.fcut_len ? `"${payload.fcut_len}"` : `""`},        
                fPriority: ${payload.fpriority ? `"${payload.fpriority}"` : `""`},
                fplantSelected: ${payload.fplantSelected ? `"${payload.fplantSelected}"` : `""`},            
                fpressAllocation: ${payload.fpressAllocation ? `"${payload.fpressAllocation}"` : `""`}, 
                fplannedQty: ${payload.fplannedQty ? `"${payload.fplannedQty}"` : `""`},           
                fplannedInternalAlloy: ${payload.fplannedInternalAlloy ? `"${payload.fplannedInternalAlloy}"` : `""`}, 
                fproductionRateRequired: ${payload.fproductionRateRequired ? `"${payload.fproductionRateRequired}"` : `""`},
                fplannedQuenching: ${payload.fplannedQuenching ? `"${payload.fplannedQuenching}"` : `""`},
                ffrontEndCoringLength: ${payload.ffrontEndCoringLength ? `"${payload.ffrontEndCoringLength}"` : `""`},
                fbackEndCoringLength: ${payload.fbackEndCoringLength ? `"${payload.fbackEndCoringLength}"` : `""`},
                fplantExtrusionLength: ${payload.fplantExtrusionLength ? `"${payload.fplantExtrusionLength}"` : `""`},
                fextrusionLengthRefId: ${payload.fextrusionLengthRefId ? `"${payload.fextrusionLengthRefId}"` : `""`},
                fplannedButtThickness: ${payload.fplannedButtThickness ? `"${payload.fplannedButtThickness}"` : `""`},
                fcutBilletsRefId: ${payload.fcutBilletsRefId ? `"${payload.fcutBilletsRefId}"` : `""`},
                fbuttWeightPerInch: ${payload.fbuttWeightPerInch ? `"${payload.fbuttWeightPerInch}"` : `""`},
                fppcRemarks: ${payload.fppcRemarks ? `"${payload.fppcRemarks}"` : `""`},
                fdieRefId: ${payload.fdieRefId ? `"${payload.fdieRefId}"` : `""`}, 
                fnoOfCavity: ${payload.fnoOfCavity ? `"${payload.fnoOfCavity}"` : `""`},
                fbolsterEntry: ${payload.fbolsterEntry ? `"${payload.fbolsterEntry}"` : `""`},
                fbackerEntry: ${payload.fbackerEntry ? `"${payload.fbackerEntry}"` : `""`},
                fspecialBackerEntry: ${payload.fspecialBackerEntry ? `"${payload.fspecialBackerEntry}"` : `""`},
                fringEntry: ${payload.fringEntry ? `"${payload.fringEntry}"` : `""`},
                fdieSetter: ${payload.fdieSetter ? `"${payload.fdieSetter}"` : `""`},
                fweldingChamber: ${payload.fweldingChamber ? `"${payload.fweldingChamber}"` : `""`},
                ftoolShopRemarks: ${payload.ftoolShopRemarks ? `"${payload.ftoolShopRemarks}"` : `""`},
                fqaRemarks: ${payload.fqaRemarks ? `"${payload.fqaRemarks}"` : `""`},
                fdieTrialRefId: ${payload.fdieTrialRefId ? `"${payload.fdieTrialRefId}"` : `""`},
                fdieWithAluminiumRefId: ${payload.fdieWithAluminiumRefId ? `"${payload.fdieWithAluminiumRefId}"` : `""`},
                fpreviousDayDie_continueRefId: ${payload.fpreviousDayDie_continueRefId ? `"${payload.fpreviousDayDie_continueRefId}"` : `""`},
                fbatchNo: ${payload.fbatchNo ? `"${payload.fbatchNo}"` : `""`},
                factualInternalAlloy: ${payload.factualInternalAlloy ? `"${payload.factualInternalAlloy}"` : `""`},
                fstartTime: ${payload.fstartTime ? `"${payload.fstartTime}"` : `""`},
                fendTime: ${payload.fendTime ? `"${payload.fendTime}"` : `""`},
                fprocessTime: ${payload.fprocessTime ? `"${payload.fprocessTime}"` : `""`},
                factualButtThickness: ${payload.factualButtThickness ? `"${payload.factualButtThickness}"` : `""`},
                fbreakThroughPressure: ${payload.fbreakThroughPressure ? `"${payload.fbreakThroughPressure}"` : `""`},
                fpushOnBilletLength: ${payload.fpushOnBilletLength ? `"${payload.fpushOnBilletLength}"` : `""`},
                fpushQtyInKgs: ${payload.fpushQtyInKgs ? `"${payload.fpushQtyInKgs}"` : `""`},
                factualProductionRate: ${payload.factualProductionRate ? `"${payload.factualProductionRate}"` : `""`},
                fbuttWeightInKgs: ${payload.fbuttWeightInKgs ? `"${payload.fbuttWeightInKgs}"` : `""`},
                fdiefailRefId: ${payload.fdiefailRefId ? `"${payload.fdiefailRefId}"` : `""`},
                fdieFailureReason: ${payload.fdieFailureReason ? `"${payload.fdieFailureReason}"` : `""`},
                fbreakDownDuration: ${payload.fbreakDownDuration ? `"${payload.fbreakDownDuration}"` : `""`},
                flogEndScrapLengthInMm: ${payload.flogEndScrapLengthInMm ? `"${payload.flogEndScrapLengthInMm}"` : `""`},
                flogEndScrapInKgs: ${payload.flogEndScrapInKgs ? `"${payload.flogEndScrapInKgs}"` : `""`},
                foperatorName: ${payload.foperatorName ? `"${payload.foperatorName}"` : `""`},
                foperatorEntryRemarks: ${payload.foperatorEntryRemarks ? `"${payload.foperatorEntryRemarks}"` : `""`},
                ffinishQuantity: ${payload.ffinishQuantity ? `"${payload.ffinishQuantity}"` : `""`},
                fpiecesPerBundle: ${payload.fpiecesPerBundle ? `"${payload.fpiecesPerBundle}"` : `""`},
                fbundleWeight: ${payload.fbundleWeight ? `"${payload.fbundleWeight}"` : `""`},
                fnoOfBundles: ${payload.fnoOfBundles ? `"${payload.fnoOfBundles}"` : `""`},
                ftotalNoOfPieces: ${payload.ftotalNoOfPieces ? `"${payload.ftotalNoOfPieces}"` : `""`},
                fcorrectionQty: ${payload.fcorrectionQty ? `"${payload.fcorrectionQty}"` : `""`},
                factualFrontEndCoringLength: ${payload.factualFrontEndCoringLength ? `"${payload.factualFrontEndCoringLength}"` : `""`},
                factualBackEndCoringLength: ${payload.factualBackEndCoringLength ? `"${payload.factualBackEndCoringLength}"` : `""`},
                frecovery: ${payload.frecovery ? `"${payload.frecovery}"` : `""`},
                fbundlingSupervisorRemarks: ${payload.fbundlingSupervisorRemarks ? `"${payload.fbundlingSupervisorRemarks}"` : `""`},       
                paging: {
                    limit: ${payload?.paging?.limit}
                    offset: ${payload?.paging?.offset}
                }
            })
        }`;
        return query;
    }
    catch (ex) {
        console.log("Error in getPendingListQuery::" + ex)
    }
}

const getInProgressListQuery = (payload: any) => {
    try {
        let query = `
        getInProgressList(input:{
            workFlowId: ${payload?.workFlowId}
            paging:{
                limit: ${payload?.limit}
                offset: ${payload?.offset}
            }
        }){
            orderId
            sectionNo
            orderNo
            soNo
            orderDate
            customerName
            orderQty
            alloyTemper
            cutLength
            priority
            workflowId
            historyDetails
        }
        `;
        return query;
    }
    catch (ex) {
        console.log("Error in getPendingListQuery::" + ex)
    }
}

const reassignOrderQuery = (payload: any) => {
    try {
        let query = `
        mutation{
            reassignOrder(input:{
                type:"${payload?.type}"
                uniqueKey:"${payload?.uniqueKey}"
                orderId: "${payload?.orderId}"
                processStage: ${payload?.processStage ? `"${payload?.processStage}"` : `""`}
                workFlowId: ${payload?.workFlowId}
                remarks: ${payload?.remarks ? `"""${payload.remarks}"""` : null}
                plannedQuenching: ${payload?.plannedQuenching ? payload?.plannedQuenching : null}
                plannedInternalAlloy:${payload?.plannedInternalAlloy ? `"${payload?.plannedInternalAlloy}"` : null}
                frontEndCoringLength:${checkValue(payload?.frontEndCoringLength)}
                backEndCoringLength:${checkValue(payload?.backEndCoringLength)}
                cut_len_tolerance_upper:${checkValue(payload?.cut_len_tolerance_upper)}
                cut_len_tolerance_lower:${checkValue(payload?.cut_len_tolerance_lower)}
            })
        }
        `;
        return query;
    }
    catch (ex) {
        console.log("Error in getPendingListQuery::" + ex)
    }
}

const savePPCDataQuery = (payload: any) => {
    try {     
        let billetsTemp = JSON.stringify(payload?.plannedNoOfBilletAndLength);
        let billetarr = billetsTemp.replace(/"([^(")"]+)":/g, "$1:");
        let mutation = `
        mutation{
            createOrUpdatePpcData(input:{
                ppcId: ${payload?.ppcId ? `"${payload.ppcId}"` : `""`},
                orderId: "${payload?.orderId}",
                plantSelected: ${payload?.plantSelected ? `"${payload.plantSelected}"` : null},
                pressAllocationRefId: ${payload?.pressAllocationRefId ? payload.pressAllocationRefId : null},
                plannedQty: ${payload?.plannedQty ? payload.plannedQty : null},
                plannedInternalAlloy: ${payload?.plannedInternalAlloy ? `"${payload.plannedInternalAlloy}"` : null},
                plannedNoOfBilletAndLength: ${payload?.plannedNoOfBilletAndLength ? billetarr : null},
                productionRateRequired: ${payload?.productionRateRequired ? payload.productionRateRequired : null},
                plannedQuenching: ${payload?.plannedQuenching ? payload?.plannedQuenching : null},
                frontEndCoringLength: ${(payload?.frontEndCoringLength !== null && String(payload.frontEndCoringLength)) ? payload.frontEndCoringLength : null},
                backEndCoringLength: ${(payload?.backEndCoringLength !== null && String(payload.backEndCoringLength)) ? payload.backEndCoringLength : null},
                plantExtrusionLength: ${payload?.plantExtrusionLength ? payload.plantExtrusionLength : null},
                extrusionLengthRefId: ${payload?.extrusionLengthRefId ? payload.extrusionLengthRefId : null},
                plannedButtThickness: ${payload?.plannedButtThickness ? payload.plannedButtThickness : null},
                cutBilletsRefId: ${payload?.cutBilletsRefId ? payload?.cutBilletsRefId : null},
                buttWeightPerInch: ${payload?.buttWeightPerInch ? payload?.buttWeightPerInch : null},
                priorityRefId: ${payload?.priorityRefId ? payload?.priorityRefId : null},
                remarks: ${payload?.remarks ? `"""${payload.remarks}"""` : null},
            })
        }
        `;
        return mutation;
    }
    catch (ex) {
        console.log("Error in savePPCDataQuery::" + ex)
    }
}

const updateOrderStatusQuery = (payload: any) => {
    let roleDetails = payload?.roleData;
    let roles = JSON.stringify(roleDetails);
    if (roleDetails) {
        roles.replace(`"${roleDetails?.remarks}"`, `"""${payload?.roleData?.remarks}"""`);
    }
    let roleData = roles.replace(/"([^(")"]+)":/g, "$1:");
    try {
        let query = `
        mutation{
            updateOrderStatus_withMapping(input: {
                orderId: ${payload?.orderId},
                type: "${payload?.type}",
                roleData: ${roleData},
            })
        }`
        return query;
    }
    catch (ex) {
        console.log("Error in updateOrderStatusQuery::" + ex)
    }
}

const getPpcOrderDataQuery = (payload: any) => {
    try {
        let query = `
        query{
            getPpcInprogressData(orderId:"${payload?.orderId}")
        }
        `;
        return query;
    }
    catch (ex) {
        console.log("Error in getPpcOrderDataQuery::" + ex)
    }
}

const getViewDetailsQuery = (payload: any) => {
    try {
        let query = `
        query{
            getViewDetails(orderId: "${payload?.orderId}")
        }
        `;
        return query;
    }
    catch (ex) {
        console.log("Error in getPpcOrderDataQuery::" + ex)
    }
}

export const getDashboardData = (payload: any) => {
    try {
        let query = `
            query{
                getReportData(input:{
                exportType: ${payload?.exportType} ,
                fstatusOrWeightage:  ${payload.fstatusOrWeightage ? payload.fstatusOrWeightage : -1},
                ffromDate: ${payload.ffromDate ? `"${payload.ffromDate}"` : `""`},
                ftoDate: ${payload.ftoDate ? `"${payload.ftoDate}"` : `""`},
                fpress: ${payload.fpress ? `"${payload.fpress}"` : `""`},
                fpo: ${payload.fpo ? `"${payload.fpo}"` : `""`},
                fcustomer_name: ${payload.fcustomer_name ? `"${payload.fcustomer_name}"` : `""`},
                fso: ${payload.fso ? `"${payload.fso}"` : `""`},
                fsectionNo: ${payload.fsectionNo ? `"${payload.fsectionNo}"` : `""`},
                fAlloyTemper: ${payload.fAlloyTemper ? `"${payload.fAlloyTemper}"` : `""`},
                fpo_qty: ${payload.fpo_qty ? `"${payload.fpo_qty}"` : `""`},         
                fextruded_qty: ${payload.fextruded_qty ? `"${payload.fextruded_qty}"` : `""`},            
                fbalance_po_qty: ${payload.fbalance_po_qty ? `"${payload.fbalance_po_qty}"` : `""`},          
                fmarketing_remarks: ${payload.fmarketing_remarks ? `"${payload.fmarketing_remarks}"` : `""`},           
                fcut_len: ${payload.fcut_len ? `"${payload.fcut_len}"` : `""`},        
                fPriority: ${payload.fpriority ? `"${payload.fpriority}"` : `""`},
                fplantSelected: ${payload.fplantSelected ? `"${payload.fplantSelected}"` : `""`},            
                fpressAllocation: ${payload.fpressAllocation ? `"${payload.fpressAllocation}"` : `""`}, 
                fplannedQty: ${payload.fplannedQty ? `"${payload.fplannedQty}"` : `""`},           
                fplannedInternalAlloy: ${payload.fplannedInternalAlloy ? `"${payload.fplannedInternalAlloy}"` : `""`}, 
                fproductionRateRequired: ${payload.fproductionRateRequired ? `"${payload.fproductionRateRequired}"` : `""`},
                fplannedQuenching: ${payload.fplannedQuenching ? `"${payload.fplannedQuenching}"` : `""`},
                ffrontEndCoringLength: ${payload.ffrontEndCoringLength ? `"${payload.ffrontEndCoringLength}"` : `""`},
                fbackEndCoringLength: ${payload.fbackEndCoringLength ? `"${payload.fbackEndCoringLength}"` : `""`},
                fplantExtrusionLength: ${payload.fplantExtrusionLength ? `"${payload.fplantExtrusionLength}"` : `""`},
                fextrusionLengthRefId: ${payload.fextrusionLengthRefId ? `"${payload.fextrusionLengthRefId}"` : `""`},
                fplannedButtThickness: ${payload.fplannedButtThickness ? `"${payload.fplannedButtThickness}"` : `""`},
                fcutBilletsRefId: ${payload.fcutBilletsRefId ? `"${payload.fcutBilletsRefId}"` : `""`},
                fbuttWeightPerInch: ${payload.fbuttWeightPerInch ? `"${payload.fbuttWeightPerInch}"` : `""`},
                fppcRemarks: ${payload.fppcRemarks ? `"${payload.fppcRemarks}"` : `""`},
                fdieRefId: ${payload.fdieRefId ? `"${payload.fdieRefId}"` : `""`}, 
                fnoOfCavity: ${payload.fnoOfCavity ? `"${payload.fnoOfCavity}"` : `""`},
                fbolsterEntry: ${payload.fbolsterEntry ? `"${payload.fbolsterEntry}"` : `""`},
                fbackerEntry: ${payload.fbackerEntry ? `"${payload.fbackerEntry}"` : `""`},
                fspecialBackerEntry: ${payload.fspecialBackerEntry ? `"${payload.fspecialBackerEntry}"` : `""`},
                fringEntry: ${payload.fringEntry ? `"${payload.fringEntry}"` : `""`},
                fdieSetter: ${payload.fdieSetter ? `"${payload.fdieSetter}"` : `""`},
                fweldingChamber: ${payload.fweldingChamber ? `"${payload.fweldingChamber}"` : `""`},
                ftoolShopRemarks: ${payload.ftoolShopRemarks ? `"${payload.ftoolShopRemarks}"` : `""`},
                fqaRemarks: ${payload.fqaRemarks ? `"${payload.fqaRemarks}"` : `""`},
                fdieTrialRefId: ${payload.fdieTrialRefId ? `"${payload.fdieTrialRefId}"` : `""`},
                fdieWithAluminiumRefId: ${payload.fdieWithAluminiumRefId ? `"${payload.fdieWithAluminiumRefId}"` : `""`},
                fpreviousDayDie_continueRefId: ${payload.fpreviousDayDie_continueRefId ? `"${payload.fpreviousDayDie_continueRefId}"` : `""`},
                fbatchNo: ${payload.fbatchNo ? `"${payload.fbatchNo}"` : `""`},
                factualInternalAlloy: ${payload.factualInternalAlloy ? `"${payload.factualInternalAlloy}"` : `""`},
                fstartTime: ${payload.fstartTime ? `"${payload.fstartTime}"` : `""`},
                fendTime: ${payload.fendTime ? `"${payload.fendTime}"` : `""`},
                fprocessTime: ${payload.fprocessTime ? `"${payload.fprocessTime}"` : `""`},
                factualButtThickness: ${payload.factualButtThickness ? `"${payload.factualButtThickness}"` : `""`},
                fbreakThroughPressure: ${payload.fbreakThroughPressure ? `"${payload.fbreakThroughPressure}"` : `""`},
                fpushOnBilletLength: ${payload.fpushOnBilletLength ? `"${payload.fpushOnBilletLength}"` : `""`},
                fpushQtyInKgs: ${payload.fpushQtyInKgs ? `"${payload.fpushQtyInKgs}"` : `""`},
                factualProductionRate: ${payload.factualProductionRate ? `"${payload.factualProductionRate}"` : `""`},
                fbuttWeightInKgs: ${payload.fbuttWeightInKgs ? `"${payload.fbuttWeightInKgs}"` : `""`},
                fdiefailRefId: ${payload.fdiefailRefId ? `"${payload.fdiefailRefId}"` : `""`},
                fdieFailureReason: ${payload.fdieFailureReason ? `"${payload.fdieFailureReason}"` : `""`},
                fbreakDownDuration: ${payload.fbreakDownDuration ? `"${payload.fbreakDownDuration}"` : `""`},
                flogEndScrapLengthInMm: ${payload.flogEndScrapLengthInMm ? `"${payload.flogEndScrapLengthInMm}"` : `""`},
                flogEndScrapInKgs: ${payload.flogEndScrapInKgs ? `"${payload.flogEndScrapInKgs}"` : `""`},
                foperatorName: ${payload.foperatorName ? `"${payload.foperatorName}"` : `""`},
                foperatorEntryRemarks: ${payload.foperatorEntryRemarks ? `"${payload.foperatorEntryRemarks}"` : `""`},
                ffinishQuantity: ${payload.ffinishQuantity ? `"${payload.ffinishQuantity}"` : `""`},
                fpiecesPerBundle: ${payload.fpiecesPerBundle ? `"${payload.fpiecesPerBundle}"` : `""`},
                fbundleWeight: ${payload.fbundleWeight ? `"${payload.fbundleWeight}"` : `""`},
                fnoOfBundles: ${payload.fnoOfBundles ? `"${payload.fnoOfBundles}"` : `""`},
                ftotalNoOfPieces: ${payload.ftotalNoOfPieces ? `"${payload.ftotalNoOfPieces}"` : `""`},
                fcorrectionQty: ${payload.fcorrectionQty ? `"${payload.fcorrectionQty}"` : `""`},
                factualFrontEndCoringLength: ${payload.factualFrontEndCoringLength ? `"${payload.factualFrontEndCoringLength}"` : `""`},
                factualBackEndCoringLength: ${payload.factualBackEndCoringLength ? `"${payload.factualBackEndCoringLength}"` : `""`},
                frecovery: ${payload.frecovery ? `"${payload.frecovery}"` : `""`},
                fbundlingSupervisorRemarks: ${payload.fbundlingSupervisorRemarks ? `"${payload.fbundlingSupervisorRemarks}"` : `""`},       
                paging: {
                    limit: ${payload?.limit}
                    offset: ${payload?.offset}
                }
                })
            }`;
        return query;
    } catch (ex) {
        console.log("Err in getdashboarddata::" + ex);

    }
}

const jindalLoginQuery = (payload: any) => {
    try {
        let query = `
        query {
            login(credential:"${payload?.credential}")
        }
        `;
        return query;
    }
    catch (ex) {
        console.log("Error in jindalLoginQuery::" + ex)
    }
}

const updateToolShopDataQuery = (payload: any) => {
    try {
        let mutation = `
        mutation{
            createOrUpdateToolShopData(input:{
                toolShopId: ${payload?.toolShopId ? `"${payload?.toolShopId}"` : `""`}
                orderId:  "${payload?.orderId}"
                dieRefId: ${payload?.dieRefId ? `"${payload?.dieRefId}"` : null}
                noOfCavity: ${checkValue(payload?.noOfCavity)}
                bolsterEntry: ${payload?.bolsterEntry ? `"${payload?.bolsterEntry}"` : null}
                backerEntry: ${payload?.backerEntry ? `"${payload?.backerEntry}"` : null}
                specialBackerEntry: ${payload?.specialBackerEntry ? `"${payload?.specialBackerEntry}"` : null}
                ringEntry: ${payload?.ringEntry ? `"${payload?.ringEntry}"` : null}
                dieSetter: ${payload?.dieSetter ? `"${payload?.dieSetter}"` : null}
                weldingChamber: ${payload?.weldingChamber ? `"${payload?.weldingChamber}"` : null}
                isActive: 1
                remarks: ${payload?.remarks ? `"""${payload.remarks}"""` : null}
            })
        }`;
        return mutation;
    }
    catch (ex) {
        console.log("Error in updateToolShopDataQuery::" + ex)
    }
}

const updateQADataQuery = (payload: any) => {
    try {
        let mutation = `
        mutation{
            createOrUpdateQAData(input:{
                qaId:"${payload?.qaId}"
                orderId: "${payload?.orderId}"
                remarks: ${payload?.remarks ? `"""${payload?.remarks}"""` : null}
                plannedQuenching: ${checkValue(payload?.plannedQuenching)}
                plannedInternalAlloy:${payload?.plannedInternalAlloy ? `"${payload?.plannedInternalAlloy}"` : null}
                frontEndCoringLength:${checkValue(payload?.frontEndCoringLength)}
                backEndCoringLength:${checkValue(payload?.backEndCoringLength)}
                cut_len_tolerance_upper:${checkValue(payload?.cut_len_tolerance_upper)}
                cut_len_tolerance_lower:${checkValue(payload?.cut_len_tolerance_lower)}
                isActive:1   
            })    
        }
        `;
        return mutation;
    }
    catch (ex) {
        console.log("Error in updateQADataQuery::" + ex)
    }
}

const updateOperatorEntryQuery = (payload: any) => {
    try {
        let breakDown = JSON.stringify(payload?.breakDown)
        let breakDownObj = breakDown.replace(/"([^(")"]+)":/g, "$1:");

        let noOfBilletAndLength = JSON.stringify(payload?.noOfBilletAndLength);
        let noOfBillet = noOfBilletAndLength.replace(/"([^(")"]+)":/g, "$1:");
        let mutation = `
        mutation{
            createOrUpdateOperatorEntryData(input:{
                operatorId: ${payload?.operatorId ? `"${payload?.operatorId}"` : `""`}
                orderId: "${payload?.orderId}"
                dieTrialRefId:${payload?.dieTrialRefId ? payload?.dieTrialRefId : null}
                dieWithAluminiumRefId:${payload?.dieWithAluminiumRefId ? payload?.dieWithAluminiumRefId : null}
                previousDayDie_continueRefId:${payload?.previousDayDie_continueRefId ? payload?.previousDayDie_continueRefId : null}
                batchNo:${payload?.batchNo ? payload?.batchNo : null}
                actualInternalAlloy: ${payload?.actualInternalAlloy ? `"${payload?.actualInternalAlloy}"` : null}
                startTime: ${(payload?.startTime != 'Invalid date' && payload?.startTime) ? `"${payload?.startTime}"` : null}
                endTime: ${(payload?.endTime != 'Invalid date' && payload?.endTime) ? `"${payload?.endTime}"` : null}
                processTime: ${(payload?.processTime != "NaN.undefined" && payload?.processTime) ? `"${payload?.processTime}"`: null}
                noOfBilletAndLength: ${isArrayNotEmpty(noOfBilletAndLength) ? noOfBillet : null}
                actualButtThickness: ${payload?.actualButtThickness ? payload?.actualButtThickness : null}
                breakThroughPressure: ${payload?.breakThroughPressure ? payload?.breakThroughPressure : null}
                pushOnBilletLength: ${!isNaN(payload?.pushOnBilletLength) ? payload?.pushOnBilletLength : null}
                pushQtyInKgs: ${payload?.pushQtyInKgs ? payload?.pushQtyInKgs : null}
                actualProductionRate: ${(!isNaN(payload?.pushOnBilletLength) &&!isNaN(payload?.actualProductionRate) && payload?.actualProductionRate != null ) ? payload?.actualProductionRate : null}
                buttWeightInKgs: ${(!isNaN(payload?.buttWeightInKgs) && payload?.actualButtThickness)  ? payload?.buttWeightInKgs : null}
                diefailRefId: ${payload?.diefailRefId ? payload?.diefailRefId : null} 
                dieFailureReason: ${payload?.dieFailureReason ? `"${payload?.dieFailureReason}"` : null}
                breakDown:${payload?.breakDown ? breakDownObj : null}
                breakDownDuration:${payload?.processTime ? `"${payload?.breakDownDuration}"` : null}
                logEndScrapLengthInMm: ${payload?.logEndScrapLengthInMm ? `${payload?.logEndScrapLengthInMm}` : null}
                logEndScrapInKgs: ${payload?.logEndScrapInKgs ? `${payload?.logEndScrapInKgs}` : null}
                operatorName:${payload?.operatorName ? `"${payload?.operatorName}"` : null}
                remarks: ${payload?.remarks ? `"""${payload.remarks}"""` : null}
                isActive: ${payload?.isActive}
            })
        }
        `;
        return mutation;
    }
    catch (ex) {
        console.log("Error in updateQADataQuery::" + ex)
    }
}

const updateBundlingSupervisorQuery = (payload: any) => {
    try {
        let mutation = `
            mutation{
                    createOrUpdateBundlingSupervisor(input:{
                    bundlingSupervisorId: "${payload?.bundlingSupervisorId}"
                    orderId: "${payload?.orderId}"
                    finishQuantity: ${checkValue(payload?.finishQuantity)}
                    piecesPerBundle: ${checkValue(payload?.piecesPerBundle)}
                    bundleWeight: ${checkValue(payload?.bundleWeight) }
                    noOfBundles: ${checkValue(payload?.noOfBundles)}
                    totalNoOfPieces: ${checkValue(payload?.totalNoOfPieces)}
                    correctionQty: ${checkValue(payload?.correctionQty)}
                    actualFrontEndCoringLength: ${checkValue(payload?.actualFrontEndCoringLength)}
                    actualBackEndCoringLength: ${checkValue(payload?.actualBackEndCoringLength)}
                    recovery: ${(!isNaN(payload?.recovery) && payload?.finishQuantity && payload?.recovery) ? payload?.recovery : null}
                    remarks: ${payload?.remarks ? `"""${payload?.remarks}"""` : null}
                    isActive: ${payload?.isActive}
                })
            }
        `;
        return mutation;
    }
    catch (ex) {
        console.log("Error in updateQADataQuery::" + ex)
    }
}

const getToolShopInprogressQuery = (payload: any) => {
    try {
        let query = `
        query {
            getToolShopInprogressData(orderId: "${payload?.orderId}")
        }
        `;
        return query;
    }
    catch (ex) {
        console.log("Error in getToolShopInprogressQuery::" + ex)
    }
}

const getQAInprogressQuery = (payload: any) => {
    try {
        let query = `
        query{
            getQAInprogressData(orderId:"${payload?.orderId}")
        }
        `;
        return query;
    }
    catch (ex) {
        console.log("Error in getQAInprogressQuery::" + ex)
    }
}

const getOperatorEntryInprogressQuery = (payload: any) => {
    try {
        let query = `
        query{
            getOperatorEntry_inprogressData(orderId:"${payload?.orderId}")
        }
        `;
        return query;
    }
    catch (ex) {
        console.log("Error in getOperatorEntryInprogressQuery::" + ex)
    }
}

const getBundlingSupervisorInprogressQuery = (payload: any) => {
    try {
        let query = `
        query {
            getBundlingSupervisor_inprogressData(orderId: "${payload?.orderId}")
        }
        `;
        return query;
    }
    catch (ex) {
        console.log("Error in getOperatorEntryInprogressQuery::" + ex)
    }
}

const getCommonReferenceQuery = (payload: any) => {
    try {
        let query = `
        query{
            getReferenceData(name: "${payload?.name}")
        }
        `;
        return query;
    }
    catch (ex) {
        console.log("Error in getCommonReferenceQuery::" + ex)
    }
}

const logoutQuery = (payload: any) => {
    try {
        let query = `
        mutation{
            logout(userId:"${payload?.userId}")
        }
        `;
        return query;
    } catch (ex) {
        console.log("Error in logoutQuery::" + ex)
    }
}

const lastSyncQuery = () => {
    try {
        let query = `
        mutation {
            manualOrderSync
        }
        `;
        return query;
    } catch (ex) {
        console.log("Error in lastSyncMutation::" + ex)
    }
}

const createOrUpdateUserQuery = (payload: any) => {
    try {
        let query = `
        mutation{
           createOrUpdateUser(input:{
             userId:${payload?.userId ? `"${payload?.userId}"` : `""`}
             roleId:${payload?.roleId ? `"${payload?.roleId}"` : ""}
             firstName:${payload?.firstName ? `"${payload?.firstName}"` : `""`}
             lastName:${payload?.lastName ? `"${payload?.lastName}"` : `""`}
             email:${payload?.email ? `"${payload?.email}"` : `""`}
             password: ${payload?.password ? `"${payload?.password}"` : `""`}
             phoneNumber:${payload?.phoneNumber ? `"${payload?.phoneNumber}"` : `""`}
             isActive:${payload?.isActive}
             })
            }`;
        return query;
    } catch (ex) {
        console.log("Error in createOrUpdateUserQuery::" + ex)
    }
}

const getRoleListQuery = (payload: any) => {
    try {
        let query = `
        query{
            getRoleList
            }`;
        return query;
    } catch (ex) {
        console.log("Error in getRoleListQuery::" + ex)
    }
}

const getUserDetailsListQuery = (payload: any) => {
    let roles = JSON.stringify(payload?.roleId)
    try {
        let query = `
        query{
             getUserDetailsList(input:{
             isActive:${payload?.isActive }          
             roleId:${roles}
             paging:{
             limit:${payload?.paging?.limit}
             offset:${payload?.paging?.offset}           
            }           
            })           
            }`;
        return query;
    } catch (ex) {
        console.log("Error in getUserDetailsList::" + ex)
    }
}

export const downloadDashboardXLQuery = (payload: any) =>{
    try{
        let query = `
        mutation{
            downloadDashboardAsExcel(input:{
                headers:${payload?.headers}
                fpo: ${payload.fpo ? `"${payload.fpo}"` : `""`},
                fcustomer_name: ${payload.fcustomer_name ? `"${payload.fcustomer_name}"` : `""`},
                fso: ${payload.fso ? `"${payload.fso}"` : `""`},
                fstatusOrWeightage:  ${payload.fstatusOrWeightage ? payload.fstatusOrWeightage : -1},
                fsectionNo: ${payload.fsectionNo ? `"${payload.fsectionNo}"` : `""`},
                fAlloyTemper: ${payload.fAlloyTemper ? `"${payload.fAlloyTemper}"` : `""`},
                fpo_qty: ${payload.fpo_qty ? `"${payload.fpo_qty}"` : `""`},         
                fextruded_qty: ${payload.fextruded_qty ? `"${payload.fextruded_qty}"` : `""`},            
                fbalance_po_qty: ${payload.fbalance_po_qty ? `"${payload.fbalance_po_qty}"` : `""`},          
                fmarketing_remarks: ${payload.fmarketing_remarks ? `"${payload.fmarketing_remarks}"` : `""`},           
                fcut_len: ${payload.fcut_len ? `"${payload.fcut_len}"` : `""`},        
                fPriority: ${payload.fpriority ? `"${payload.fpriority}"` : `""`},
                fplantSelected: ${payload.fplantSelected ? `"${payload.fplantSelected}"` : `""`},            
                fpressAllocation: ${payload.fpressAllocation ? `"${payload.fpressAllocation}"` : `""`}, 
                fplannedQty: ${payload.fplannedQty ? `"${payload.fplannedQty}"` : `""`},           
                fplannedInternalAlloy: ${payload.fplannedInternalAlloy ? `"${payload.fplannedInternalAlloy}"` : `""`}, 
                fproductionRateRequired: ${payload.fproductionRateRequired ? `"${payload.fproductionRateRequired}"` : `""`},
                fplannedQuenching: ${payload.fplannedQuenching ? `"${payload.fplannedQuenching}"` : `""`},
                ffrontEndCoringLength: ${payload.ffrontEndCoringLength ? `"${payload.ffrontEndCoringLength}"` : `""`},
                fbackEndCoringLength: ${payload.fbackEndCoringLength ? `"${payload.fbackEndCoringLength}"` : `""`},
                fplantExtrusionLength: ${payload.fplantExtrusionLength ? `"${payload.fplantExtrusionLength}"` : `""`},
                fextrusionLengthRefId: ${payload.fextrusionLengthRefId ? `"${payload.fextrusionLengthRefId}"` : `""`},
                fplannedButtThickness: ${payload.fplannedButtThickness ? `"${payload.fplannedButtThickness}"` : `""`},
                fcutBilletsRefId: ${payload.fcutBilletsRefId ? `"${payload.fcutBilletsRefId}"` : `""`},
                fbuttWeightPerInch: ${payload.fbuttWeightPerInch ? `"${payload.fbuttWeightPerInch}"` : `""`},
                fppcRemarks: ${payload.fppcRemarks ? `"${payload.fppcRemarks}"` : `""`},
                fdieRefId: ${payload.fdieRefId ? `"${payload.fdieRefId}"` : `""`}, 
                fnoOfCavity: ${payload.fnoOfCavity ? `"${payload.fnoOfCavity}"` : `""`},
                fbolsterEntry: ${payload.fbolsterEntry ? `"${payload.fbolsterEntry}"` : `""`},
                fbackerEntry: ${payload.fbackerEntry ? `"${payload.fbackerEntry}"` : `""`},
                fspecialBackerEntry: ${payload.fspecialBackerEntry ? `"${payload.fspecialBackerEntry}"` : `""`},
                fringEntry: ${payload.fringEntry ? `"${payload.fringEntry}"` : `""`},
                fdieSetter: ${payload.fdieSetter ? `"${payload.fdieSetter}"` : `""`},
                fweldingChamber: ${payload.fweldingChamber ? `"${payload.fweldingChamber}"` : `""`},
                ftoolShopRemarks: ${payload.ftoolShopRemarks ? `"${payload.ftoolShopRemarks}"` : `""`},
                fqaRemarks: ${payload.fqaRemarks ? `"${payload.fqaRemarks}"` : `""`},
                fdieTrialRefId: ${payload.fdieTrialRefId ? `"${payload.fdieTrialRefId}"` : `""`},
                fdieWithAluminiumRefId: ${payload.fdieWithAluminiumRefId ? `"${payload.fdieWithAluminiumRefId}"` : `""`},
                fpreviousDayDie_continueRefId: ${payload.fpreviousDayDie_continueRefId ? `"${payload.fpreviousDayDie_continueRefId}"` : `""`},
                fbatchNo: ${payload.fbatchNo ? `"${payload.fbatchNo}"` : `""`},
                factualInternalAlloy: ${payload.factualInternalAlloy ? `"${payload.factualInternalAlloy}"` : `""`},
                fstartTime: ${payload.fstartTime ? `"${payload.fstartTime}"` : `""`},
                fendTime: ${payload.fendTime ? `"${payload.fendTime}"` : `""`},
                fprocessTime: ${payload.fprocessTime ? `"${payload.fprocessTime}"` : `""`},
                factualButtThickness: ${payload.factualButtThickness ? `"${payload.factualButtThickness}"` : `""`},
                fbreakThroughPressure: ${payload.fbreakThroughPressure ? `"${payload.fbreakThroughPressure}"` : `""`},
                fpushOnBilletLength: ${payload.fpushOnBilletLength ? `"${payload.fpushOnBilletLength}"` : `""`},
                fpushQtyInKgs: ${payload.fpushQtyInKgs ? `"${payload.fpushQtyInKgs}"` : `""`},
                factualProductionRate: ${payload.factualProductionRate ? `"${payload.factualProductionRate}"` : `""`},
                fbuttWeightInKgs: ${payload.fbuttWeightInKgs ? `"${payload.fbuttWeightInKgs}"` : `""`},
                fdiefailRefId: ${payload.fdiefailRefId ? `"${payload.fdiefailRefId}"` : `""`},
                fdieFailureReason: ${payload.fdieFailureReason ? `"${payload.fdieFailureReason}"` : `""`},
                fbreakDownDuration: ${payload.fbreakDownDuration ? `"${payload.fbreakDownDuration}"` : `""`},
                flogEndScrapLengthInMm: ${payload.flogEndScrapLengthInMm ? `"${payload.flogEndScrapLengthInMm}"` : `""`},
                flogEndScrapInKgs: ${payload.flogEndScrapInKgs ? `"${payload.flogEndScrapInKgs}"` : `""`},
                foperatorName: ${payload.foperatorName ? `"${payload.foperatorName}"` : `""`},
                foperatorEntryRemarks: ${payload.foperatorEntryRemarks ? `"${payload.foperatorEntryRemarks}"` : `""`},
                ffinishQuantity: ${payload.ffinishQuantity ? `"${payload.ffinishQuantity}"` : `""`},
                fpiecesPerBundle: ${payload.fpiecesPerBundle ? `"${payload.fpiecesPerBundle}"` : `""`},
                fbundleWeight: ${payload.fbundleWeight ? `"${payload.fbundleWeight}"` : `""`},
                fnoOfBundles: ${payload.fnoOfBundles ? `"${payload.fnoOfBundles}"` : `""`},
                ftotalNoOfPieces: ${payload.ftotalNoOfPieces ? `"${payload.ftotalNoOfPieces}"` : `""`},
                fcorrectionQty: ${payload.fcorrectionQty ? `"${payload.fcorrectionQty}"` : `""`},
                factualFrontEndCoringLength: ${payload.factualFrontEndCoringLength ? `"${payload.factualFrontEndCoringLength}"` : `""`},
                factualBackEndCoringLength: ${payload.factualBackEndCoringLength ? `"${payload.factualBackEndCoringLength}"` : `""`},
                frecovery: ${payload.frecovery ? `"${payload.frecovery}"` : `""`},
                fbundlingSupervisorRemarks: ${payload.fbundlingSupervisorRemarks ? `"${payload.fbundlingSupervisorRemarks}"` : `""`},
            })
        }`
        return query;
    }catch(ex){
        console.log("Err in downloadDashboardXLQuery::"+ ex);
        
    }
}

export {
    getPendingListQuery,
    getInProgressListQuery,
    savePPCDataQuery,
    updateOrderStatusQuery,
    getPpcOrderDataQuery,
    getViewDetailsQuery,
    jindalLoginQuery,
    updateToolShopDataQuery,
    updateQADataQuery,
    updateOperatorEntryQuery,
    updateBundlingSupervisorQuery,
    getToolShopInprogressQuery,
    getQAInprogressQuery,
    getOperatorEntryInprogressQuery,
    getBundlingSupervisorInprogressQuery,
    getCommonReferenceQuery,
    logoutQuery,
    lastSyncQuery,
    reassignOrderQuery,
    createOrUpdateUserQuery,
    getRoleListQuery,
    getUserDetailsListQuery
}