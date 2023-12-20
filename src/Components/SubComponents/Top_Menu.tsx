import React, { useState } from "react";
import AppImages from "../../Global/AppImages";
import "./Top_Menu.scss";
import { Menu, Col, Row, Drawer, Tooltip, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { getUser, setAuthToken, setUser } from "../../localStorage";
import { useDispatch } from "react-redux";
import { logoutAction } from "../Store/Action/jindalAction";


const TopMenuAndSider = (props: any) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const user = getUser();
    const dispatch = useDispatch();

    const logoutApi = () => {
        let payload = {
            userId: user?.userId
        }
        dispatch(logoutAction(payload));
    }
    const clearUserDetailsAndToken = () => {
        logoutApi()
        setAuthToken("")
        setUser("")
        navigate("/login")
    }

    const defaultThumbnail = () => {
        try {
            let flName = "";
            flName = user?.firstName ? (user?.firstName[0]).toUpperCase() : "";
            flName += user?.lastName ? (user?.lastName[0]).toUpperCase() : ""
            return flName;
        } catch (ex) {
            console.log("Error in getUserProfileDefaultThumbnail::" + ex);
        }
    }


    const menuOptionLinks = (key: any) => {
        if (key === "1") {
            navigate("/pending")
        } else if (key === "2") {
            navigate("/in-progress/list")
        } else if (key === "3") {
            navigate("/hold-on/list")
        } else if (key === "4") {
            navigate("/completed/list")
        } else if (key === '0'){
            navigate("/dashboard")
        }
    }

    const handleChange = (value: string) => {
        user.roleId = value;

    };

    // const showDrawer = () => {
    //     setOpen(true);  
    // };

    // const onClose = () => {
    // setOpen(afalse);
    // };

    const customReports = () => {
        return (
            <>
                <Drawer
                    placement="left"
                    open={open}
                    onClose={() => setOpen(false)}
                    closable={false}
                    closeIcon={false}
                >
                    <p>Custom Reports...</p>
                </Drawer>
            </>
        )

    }

    // onClick={ ()=> showDrawer()}

    const profileProcess = (key: any) => {
        if (key === 1) {
            clearUserDetailsAndToken();
        }
    }
    const profileMenu = () => {
        return (
            // <Menu onClick={(e: any) => profileProcess(e?.key)}>
            //     <Menu.Item key={1} style={{fontFamily:"Roboto-Regular", fontSize:"14px", color:"black"}}>Log out</Menu.Item>
            // </Menu>
            <>
                {user?.roleId == 1 && <div className="log-out-menu jc" onClick={() => navigate("/userlisting")}>
                    <img src={AppImages?.adminUser} alt="logoutIcon" />
                    <div className="logoutText">User Management</div>
                </div>}
                <div className="log-out-menu jfe" onClick={() => profileProcess(1)}>
                    <img src={AppImages?.logoutIcon} alt="logoutIcon" />
                    <div className="logoutText">Log out</div>
                </div>
                
            </>
        )
    }

    const topMenu = () => {
        return (
            <div className="top_menu_container">
                <Row>
                    {/* <Col span={1}>
                        {/* <div onClick={() => setOpen(true)} className="menu_out_line"><MenuOutlined /></div> */}
                    {/* </Col> */} 

                    <Col span={3} className="jfe" style={{paddingLeft: "30px"}}>
                        <div><img src={AppImages.jindalIcon} alt="logoutIcon" /></div>
                    </Col>

                    <Col span={12}>
                        <Menu mode="horizontal"
                            selectedKeys={props.style}
                            onClick={(e: any) => menuOptionLinks(e?.key)}>
                            <Menu.Item key="0" className="top_menus Dashboard">
                                <span>Dashboard</span>
                            </Menu.Item>
                            <Menu.Item key="1" className="top_menus Pending">
                                <span>Pending</span>
                            </Menu.Item>
                            <Menu.Item key="2" className="top_menus In_Progress">
                                <span>In-Progress</span>
                            </Menu.Item>
                            <Menu.Item key="3" className="top_menus On_Hold">
                                <span>On Hold</span>
                            </Menu.Item>
                            <Menu.Item key="4" className="top_menus Completed">
                                <span>Completed</span>
                            </Menu.Item>
                        </Menu>
                    </Col>
                    <Col span={4}></Col>
                    {/* <div className="profile_pic_end"> */}
                    <Col span={3}>
                        {/* <div className="top_menu_container_2"> */}
                        <div className="top_menu_container_2_sub_1">
                            <div className="userName">{user?.firstName + " " + user?.lastName + " User"}</div>
                            <div className="role">{user?.roleId === 2 ? "PPC Data" :
                                user?.roleId === 3 ? "Tool Shop Data" :
                                    user?.roleId === 4 ? "QA Data" :
                                        user?.roleId === 5 ? "Operator Entry" :
                                            user?.roleId === 1 ? "Admin" :
                                                "Bundling Supervisor"
                            }

                            </div>

                        </div>
                    </Col>
                    <Col span={1}>
                        <div className="top_menu_container_2_sub_1_profilePic">
                            {/* <Dropdown overlay={profileMenu()}> */}
                            <Tooltip placement="bottomRight" title={profileMenu()} className="toolTip-menu">
                                <div className="profile-image-div jc">{defaultThumbnail()}
                                    {/* <img src={AppImages.guyImage} alt="logoutIcon" /> */}
                                </div>
                            </Tooltip>
                            {/* </Dropdown> */}
                            {/* <Avatar className="avatar_user_pic" src={AppImages.guyImage} onClick={() => clearUserDetailsAndToken()}/> */}
                        </div>
                    </Col>
                    {/* </div> */}

                </Row>
            </div>
        )
    }

    return (
        <>
            {topMenu()}
            {customReports()}
        </>
    )
}

export default TopMenuAndSider;