import { Button, Col, Input, message, Row, Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppConstants from "../../Global/AppConstants";
import AppImages from "../../Global/AppImages";
import { deepCopyFunction, encryptValue } from "../../Global/Helpers";
import { setAuthToken, setUser } from "../../localStorage";
import "./login.scss";
import { jindalLoginAction } from "../Store/Action/jindalAction";
const Login = () => {   
    const jindalReducerState = useSelector((state: any) => state.JindalReducerState);
    const {jindalLoginOnLoad, jindalLoginData} = jindalReducerState;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form]: any = Form.useForm();
    let loginDataTemp = {
        email:"",
        password:""
    }
    const [loginData, setLoginData] = useState(deepCopyFunction(loginDataTemp));
    const [loginLoad, setLoginLoad] = useState(false);
    const loginApi = () => {
        let emailAndPassword = loginData?.email + ":" + loginData?.password;
        let payload = {
            credential:encryptValue(emailAndPassword, AppConstants?.SECRET_KEY)
        }
        dispatch(jindalLoginAction(payload));
        setLoginLoad(true);
    }

    useEffect(()=>{
        if(loginLoad && !jindalLoginOnLoad){
            if(jindalLoginData?.login?.auth_token){
                setLoginLoad(false);
                setAuthToken(jindalLoginData?.login?.auth_token)
                setUser(jindalLoginData?.login?.user)
                if(jindalLoginData?.login?.user?.roleId == 1){
                    window.location.href = "/dashboard";
                }
                else{
                    window.location.href = "/pending";
                }
            }else{
                message?.warning("Incorrect Email or Password");
            }
        }
    },[loginLoad, jindalLoginOnLoad]) 
    const rightSideLogin = () => {
        return(
            <div className="rightSideLogin-Content">
                <div className="jindalIcon jf-end"><img src={AppImages?.jindalIcon}/></div>
                <Form
                    form={form}
                    autoComplete="off"
                    id="form"
                    onFinish={() => loginApi()}
                >
                <div className="jindal-login-content">
                    <div className="jindal-login-title">LOGIN</div>
                    <div className="jindalEmailId-title-text-box">
                        <div className="jindalEmailId-title">Email Id</div>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: AppConstants?.login?.email },
                                {
                                    validator: (_, value) =>{
                                    if(value && value?.includes(" ")){
                                       return Promise.reject("Enter valid email id")
                                    } 
                                    else{
                                        return Promise.resolve()
                                    }   
                                    }
                                }
                            ]}
                        >
                            <Input className="jindalEmailId-text-box" placeholder="Enter Email ID"
                                onChange={(e: any) => setLoginData({...loginData,email:e?.target?.value})} 
                            />
                        </Form.Item>
                    </div>
                    <div className="jindalEmailId-title-text-box">
                        <div className="jindalEmailId-title">Password</div>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: AppConstants?.login?.password },
                                {
                                    validator: (_, value) =>{
                                        if(value && value?.includes(" ")){
                                           return Promise.reject("Enter valid password")
                                        } 
                                        else{
                                            return Promise.resolve();
                                        }   
                                    }
                                }
                            ]}
                        >
                            <Input.Password className="jindalEmailId-text-box" placeholder="Enter Password"
                                onChange={(e: any) => setLoginData({...loginData,password:e?.target?.value})} />
                        </Form.Item>
                    </div>
                    {/* <div className="forget-password-reset jfs">
                        <div className="jindal-forget-password">Forgot your password?</div>
                        <div className="jindal-reset"> Click here to reset</div>
                    </div> */}
                    <Button type="primary" className="login-button" htmlType="submit">Login</Button>
                </div>
                </Form>
            </div>
        )
    }
    return (
        <Row className="jindal-login-row" style={{height:"100vh"}}>
            <Col span={11} className="left-side-login-col"></Col>
            <Col span={13} className="right-side-login-col">{rightSideLogin()}</Col>
        </Row>
    )
}

export default Login;