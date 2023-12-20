import axios from "axios";
import { getAuthToken } from "../../../../localStorage";

const http = axios.create({
    baseURL:""
    // baseURL: process.env.REACT_APP_URL
});

http.interceptors.request.use(function (config:any) {
    // const token = localStorage.token;
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = token;
    }
    // config.headers.roleid = getRoleId() ? getRoleId() : null
    // config.headers.roleid = 5
    return config;
});

export { http };