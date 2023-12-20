import { http } from "./jindalHttp";

let url: any = process.env.REACT_APP_URL;
let loginUrl: any = process.env.REACT_APP_LOGIN_URL;
let restUrl: any = process.env.REACT_APP_DOWNLOAD_URL;
let adminUrl: any = process.env.REACT_APP_ADMIN_URL;
let csvDashboardDownloadUrl: any = process.env.REACT_APP_CSV_DOWNLOAD_LOAD

// let url: any = "http://localhost:8080/jindal/api/jindal";
// let loginUrl: any = "http://localhost:8080/jindal/api/login";
// let restUrl: any = "http://localhost:8080/jindal/api/download/";
// let adminUrl: any = "http://localhost:8080/jindal/api/admin/jindal";
// let csvDashboardDownloadUrl: any = "http://localhost:8080/jindal/api/download/dashboard/csv"

let JindalAxiosApi = {
  getPendingList(payload: any) {
    return Method.dataQuery(payload, url)
  },
  getInProgressList(payload: any) {
    return Method.dataQuery(payload, url)
  },
  saveOrderUpdateStatus(payload: any) {
    return Method.dataQuery(payload, url)
  },
  savePPCData(payload: any) {
    return Method.dataQuery(payload, url)
  },
  getPpcOrderDataList(payload: any) {
    return Method.dataQuery(payload, url)
  },
  getViewDetails(payload: any) {
    return Method.dataQuery(payload, url)
  },
  jindalLogin(payload: any) {
    return Method.dataQuery(payload, loginUrl)
  },
  updateToolShop(payload: any) {
    return Method.dataQuery(payload, url)
  },
  updateQA(payload: any) {
    return Method.dataQuery(payload, url)
  },
  updateOperatorEntry(payload: any) {
    return Method.dataQuery(payload, url)
  },
  updateBundlingSupervisor(payload: any) {
    return Method.dataQuery(payload, url)
  },
  getToolShopInprogress(payload: any) {
    return Method.dataQuery(payload, url)
  },
  getQAInprogress(payload: any) {
    return Method.dataQuery(payload, url)
  },
  getOperatorEntryInprogress(payload: any) {
    return Method.dataQuery(payload, url)
  },
  getBundlingSupervisorInprogress(payload: any) {
    return Method.dataQuery(payload, url)
  },
  downloadCsv(payload: any) {
    return Method.dataRestGet(payload, restUrl + "csv")
  },
  getCommonReference(payload: any) {
    return Method.dataQuery(payload, url)
  },
  downloadPdf(payload: any) {
    return Method.dataPdfGet(payload, restUrl + "pdf")
  },
  logout(payload: any) {
    return Method.dataQuery(payload, loginUrl)
  },
  lastSyncData(payload: any) {
    return Method.dataQuery(payload, url)
  },
  reassignUpdate(payload: any) {
    return Method.dataQuery(payload, url)
  },
  dashboardTableData(payload: any) {
    return Method.dataQuery(payload, url)
  },
  createOrUpdateUserAxios(payload: any) {
    return Method.dataQuery(payload, adminUrl)
  },
  getRoleListAxios(payload: any) {
    return Method.dataQuery(payload, url)
  },
  getUserDetailsListAxios(payload: any) {
    return Method.dataQuery(payload, adminUrl)
  },
  downloadDashboardXLAxios(payload: any) {
    return Method.dataQuery(payload, url)
  },
  downloadDashboardCSVAxios(payload: any) {
    return Method.dataGet(csvDashboardDownloadUrl, payload)
  },
}

const Method = {
  async dataQuery(body: any, url: any) {
    return await new Promise((resolve, reject) => {
      http.post(url, {
        query: body,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'access-control-allow-origin': '*'
        }
      }).then((result) => {
        if (result.status === 200) {
          return resolve({
            status: 1,
            result: result,
          });
        } else if (result.status === 212) {
          return resolve({
            status: 4,
            result: result,
          });
        } else {
          if (result) {
            return reject({
              status: 3,
              error: "Something went wrong.",
            });
          } else {
            return reject({
              status: 4,
              error: "Something went wrong.",
            });
          }
        }
      }).catch((err) => {
        if (err.response) {
          if (
            err.response.status !== null &&
            err.response.status !== undefined
          ) {
            if (err.response.status === 401) {
              let unauthorizedStatus = err.response.status;
              if (unauthorizedStatus === 401) {
                //   logout();
                //   message.error("401 unauthorized");
              }
            } else {
              return reject({
                status: 5,
                error: err,
              });
            }
          }
        } else {
          return reject({
            status: 5,
            error: err,
          });
        }
      });
    });
  },
  async dataRestGet(body?: any, url?: any) {
    return await new Promise((resolve, reject) => {
      http.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          'access-control-allow-origin': '*'
        }
      }).then((result) => {
        if (result.status === 200) {
          return resolve({
            status: 1,
            result: result,
          });
        } else if (result.status === 212) {
          return resolve({
            status: 4,
            result: result,
          });
        } else {
          if (result) {
            return reject({
              status: 3,
              error: "Something went wrong.",
            });
          } else {
            return reject({
              status: 4,
              error: "Something went wrong.",
            });
          }
        }
      }).catch((err) => {
        console.log("Error ", err)
        if (err.response) {
          if (
            err.response.status !== null &&
            err.response.status !== undefined
          ) {
            if (err.response.status === 401) {
              let unauthorizedStatus = err.response.status;
              if (unauthorizedStatus === 401) {
              }
            } else {
              return reject({
                status: 5,
                error: err,
              });
            }
          }
        } else {
          return reject({
            status: 5,
            error: err,
          });
        }
      });
    });
  },
  async dataPdfGet(body?: any, url?: any) {
    return await new Promise((resolve, reject) => {
      http.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          'access-control-allow-origin': '*'
        },
        responseType: "blob"
      }).then((result) => {
        if (result.status === 200) {
          return resolve({
            status: 1,
            result: result,
          });
        } else if (result.status === 212) {
          return resolve({
            status: 4,
            result: result,
          });
        } else {
          if (result) {
            return reject({
              status: 3,
              error: "Something went wrong.",
            });
          } else {
            return reject({
              status: 4,
              error: "Something went wrong.",
            });
          }
        }
      }).catch((err) => {
        console.log("Error ", err)
        if (err.response) {
          if (
            err.response.status !== null &&
            err.response.status !== undefined
          ) {
            if (err.response.status === 401) {
              let unauthorizedStatus = err.response.status;
              if (unauthorizedStatus === 401) {
              }
            } else {
              return reject({
                status: 5,
                error: err,
              });
            }
          }
        } else {
          return reject({
            status: 5,
            error: err,
          });
        }
      });
    });
  },
  async dataGet(newurl: any, body: any) {
    const url = newurl;
    // let ARR = JSON.parse(payload)
    return await new Promise((resolve, reject) => {
      http.post(url, body).then((result) => {
        if (result.status === 200) {
          return resolve({
            status: 1,
            result: result,
          });
        } else if (result.status === 212) {
          return resolve({
            status: 4,
            result: result,
          });
        } else {
          if (result) {
            return reject({
              status: 3,
              error: "Something went wrong.",
            });
          } else {
            return reject({
              status: 4,
              error: "Something went wrong.",
            });
          }
        }
      }).catch((err) => {
        console.log("Error ", err)
        if (err.response) {
          if (
            err.response.status !== null &&
            err.response.status !== undefined
          ) {
            if (err.response.status === 401) {
              let unauthorizedStatus = err.response.status;
              if (unauthorizedStatus === 401) {
              }
            } else {
              return reject({
                status: 5,
                error: err,
              });
            }
          }
        } else {
          return reject({
            status: 5,
            error: err,
          });
        }
      });
    });
  },
}

export { JindalAxiosApi };