import { Navigate } from "react-router-dom";
import { getAuthToken } from "../localStorage";

const PrivateNavigates = ({children}: any) => {
    const auth =  getAuthToken();
    return auth ? children : <Navigate to="/login"/>
}

export{
    PrivateNavigates
}