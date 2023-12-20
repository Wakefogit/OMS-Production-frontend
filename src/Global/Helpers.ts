import moment from "moment";


const dataModify = (date: any) => {
    let data = new Date(date);
    let todayData = moment.utc(data, "YYYY-MM-DD\THH:mm:ss\Z").format("DD-MMM-yyyy");
    return todayData
}

export function calculateSum(array: any, property: any) {
  const total = array.reduce((accumulator: any, object: any) => {
    return accumulator + object[property];
  }, 0);

  return total;
}

const dataModifyWithTime = (date: any) => {
  let data = new Date(date);
  let todayData = moment.utc(data, "YYYY-MM-DD\THH:mm:ss\Z").format("DD-MMM-yyyy,h:mm A");
  return todayData
}

const deepCopyFunction = (inObject: any) => {
    let outObject: any, value: any, key: any
    if (typeof inObject !== "object" || inObject === null) {
      return inObject // Return the value if inObject is not an object
    }
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}
    for (key in inObject) {
      value = inObject[key]
      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = (typeof value === "object" && value !== null) ? deepCopyFunction(value) : value
    }
    return outObject
  }

  const encryptValue = (value: any, secretKey: any) => {
    const CryptoJS = require("crypto-js");
    return CryptoJS.AES.encrypt(value, secretKey).toString();
  }

  const isArrayNotEmpty = (array: any) => {
    if (array && array.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  // const concatBilletAndLength = (billet: Array<Object>) {
  //   try {
  //     let result = '', i = 1;
  //     for (let data of billet) {
  //       if (result.length > 0)
  //         result = result + ' | ' + `${"Billet" + i}: ${data["billet" + i]}`
  //       else
  //     result = `${"Billet" + i}: ${data["billet" + i]}`
  //     i++;
  // }
  // return result;
  // } catch (error) {
  // console.log("Error_in_concatBilletAndLength ", error);
  // throw error;
  // }}

export {
    dataModify,
    deepCopyFunction,
    encryptValue,
    isArrayNotEmpty,
    dataModifyWithTime
}