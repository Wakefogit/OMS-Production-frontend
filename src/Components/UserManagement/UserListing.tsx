
import { ArrowLeftOutlined, ArrowRightOutlined, EyeInvisibleOutlined, EyeTwoTone, MoreOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Drawer, Dropdown, Empty, Form, Input, Menu, Modal, Pagination, Radio, Row, Select, Skeleton, Space, message } from 'antd';
import {useEffect,useState } from 'react';
import { PaginationProps } from "antd/lib/pagination";
import AppImages from '../../Global/AppImages';
import TopMenuAndSider from '../SubComponents/Top_Menu';
import './UserListing.scss';
import '../SubComponents/commonPagination.scss';
import { deepCopyFunction, isArrayNotEmpty } from '../../Global/Helpers';
import { createOrUpdateUserAction, getRoleListAction, getUserDetailsListAction } from '../Store/Action/jindalAction';
import { useDispatch, useSelector } from 'react-redux';
import AppConstants from '../../Global/AppConstants';

export default function UserListing() {
    //top check box data
    const userCheckData = [
        {
            id: 1,
            data: "PPC Data",
            roleId: "F95F6025-C156-436A-81E2-FC36FC28EB0A"
        },
        {
            id: 2,
            data: "Tool Shop Data",
            roleId: "553C15DB-13F4-435E-9857-90B0752885B8"
        },
        {
            id: 3,
            data: "QA Entry",
            roleId: "00CD8354-AF11-49A3-A9C0-26F418EDEC33"
        },
        {
            id: 4,
            data: "Operator Entry",
            roleId: "0E3EA069-5CBC-4963-97B2-72821D3829BC"
        },
        {
            id: 5,
            data: "Bundling Supervisor",
            roleId: "ABACE2F6-AC73-4D0E-806E-6E460D7A997D"
        },
    ]
    const [openAddDrawer, setOpenAddDrawer] = useState(false);//for Add drawer
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const { Option } = Select;
    const [status, setStatus] = useState(1);
    const [changeUserStatus, setChangeUserStatus] = useState(false);
    const [statusPopUp, setStatusPopUp] = useState(false);//for user active popup
    const [checkedDownloadDataActive, setCheckedDownloadDataActive] = useState<any>(userCheckData?.map((x: any) => x?.roleId));
    // const [checkedDownloadDataInactive, setCheckedDownloadDataInactive] = useState<any>([]);
    const [editUser, setEditUser] = useState(false);
    const dispatch = useDispatch();
    const [userSaveOnload, setUserSaveOnload] = useState(false);
    const [initialCheck, setInitialCheck] = useState(false);
    const [openChangePasswordDrawer, setOpenChangePasswordDrawer] = useState(false);
    const jindalReducerState: any = useSelector(
        (state: any) => state.JindalReducerState
    );
    const {
        getRoleList,
        getUserDetailsList,
        getUserDetailsListOnload,
        saveUserOnload,
        createUserMessage
    } = jindalReducerState;
    const userDetails = getUserDetailsList?.getUserDetailsList?.data;//get user list 
    const userCount = getUserDetailsList?.getUserDetailsList?.page?.totalCount;//users count
    const userCurrentPage = getUserDetailsList?.getUserDetailsList?.page?.currentPage;//user current page
    const userInfoTemp = {
        firstName: null,
        lastName: null,
        selectRole: null,
        email: null,
        phoneNumber: null,
        password: null,
        userId: null
    }
    const [userInfo, setUserInfo] = useState(
        deepCopyFunction(userInfoTemp)
    );
    const [value, setValue] = useState({
        userId: null,
        roleId: null,
        isActive: null,
        firstName: null,
        lastName: null
    });
    const [drawerUserInfo, setDrawerUserInfo] = useState<any>({});
    const [resetPasswordOnload, setResetPasswordOnload] = useState(false);

    const showAddDrawer = () => {
        setOpenAddDrawer(true);
        setEditUser(false);
        getRoleListItem();
        // setStatus(1)
    };

    const [perPage, setPerPage] = useState({
        limit: 12,
        offset: 0
    })

    const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
        if (type === 'prev') {
            return <a className='prev-arrow'><ArrowLeftOutlined />{AppConstants.prev}</a>;
        }
        if (type === 'next') {
            return <a className='next-arrow'>{AppConstants.next}<ArrowRightOutlined /></a>;
        }
        return originalElement;
    };

    const onAddClose = () => {
        setOpenAddDrawer(false);
        form.resetFields();
    };

    const saveUserForm = () => {
        let payload = {
            userId: editUser == true ? (userInfo?.userId || value?.userId) : "",
            roleId: userInfo?.selectRole || value?.roleId,
            firstName: openChangePasswordDrawer == true ? null : changeUserStatus == true ? null : userInfo?.firstName,
            lastName: openChangePasswordDrawer == true ? null : changeUserStatus == true ? null : userInfo?.lastName,
            email: openChangePasswordDrawer == true ? null : changeUserStatus == true ? null : userInfo?.email,
            password: openChangePasswordDrawer == true ? userInfo?.password : (changeUserStatus == true || editUser == true) ? null : userInfo?.password,
            phoneNumber: openChangePasswordDrawer == true ? null : changeUserStatus == true ? null : userInfo?.phoneNumber,
            isActive: editUser === true ? (statusPopUp == false ? status : status == 1 ? 0 : 1) : 1
        }
        dispatch(createOrUpdateUserAction(payload));
        setUserSaveOnload(true);
    }

    const changePasswordForm = () => {
        setResetPasswordOnload(true)
        setEditUser(true)
        saveUserForm()
    }

    const updateUserStatus = () => {
        setEditUser(true)
        saveUserForm();
    }

    useEffect(() => {
        if (saveUserOnload === false && editUser === true) {
            setStatusPopUp(false)
            getUserDetails()
        }
    }, [saveUserOnload, editUser])

    useEffect(() => {
        if (saveUserOnload === false && resetPasswordOnload === true) {
            setOpenChangePasswordDrawer(false)
            passwordForm.resetFields()
        }
    }, [saveUserOnload, resetPasswordOnload])

    useEffect(() => {
        if (userSaveOnload === true && saveUserOnload === false) {
            setUserSaveOnload(false)
            if (createUserMessage?.createOrUpdateUser == "Email Already Exist") {
                message.error("Email Already Exist")
            }
            else {
                if (createUserMessage?.createOrUpdateUser == "Updated Successfully") {
                    message.success("Updated Successfully")
                }
                getUserDetails();
                onAddClose()
                userStatusPopUpCancel()
            }
        }
    }, [userSaveOnload, saveUserOnload])

    const handleStatus = (value: any) => {
        setStatus(value);
        setCheckedDownloadDataActive(userCheckData?.map((x: any) => x?.roleId))
    }

    const onCheckAllChange = (isChecked: any, data: any) => {
        let checkedDownloadDataTempActive = [...checkedDownloadDataActive];
        // let checkedDownloadDataTempInactive = [...checkedDownloadDataInactive];
        // if (status == 1) {
            if (isChecked === true) {
                checkedDownloadDataTempActive.push(data.roleId)
            } else {
                // let index = checkedDownloadDataTempActive.findIndex((x: any) => x === data.roleId);
                checkedDownloadDataTempActive = checkedDownloadDataTempActive.filter((x: any) => x !== data.roleId)
            }
            setCheckedDownloadDataActive(checkedDownloadDataTempActive);
        // }
        // else {
        //     if (isChecked === true) {
        //         // checkedDownloadDataTempInactive.push(data.roleId)
        //     } else {
        //         let index = checkedDownloadDataTempInactive.findIndex((x: any) => x === data.roleId);
        //         checkedDownloadDataTempInactive.splice(index, 1);
        //     }
        //     // setCheckedDownloadDataInactive(checkedDownloadDataTempInactive);
        // }

    };

    const prePopulationUser = (value: any) => {
        form?.setFieldsValue(
            {
                ["firstName"]: value?.firstName,
                ["lastName"]: value?.lastName,
                ["email"]: value?.email,
                ["phoneNumber"]: value?.phoneNumber,
                ["password"]: value?.password,
                ["selectRole"]: value?.roleName
            });
        setUserInfo({
            ...userInfo,
            firstName: value?.firstName,
            lastName: value?.lastName,
            email: value?.email,
            phoneNumber: value?.phoneNumber,
            password: value?.password,
            selectRole: value?.roleId,
            userId: value?.userId
        });

    }

    useEffect(() => {
        getUserDetails()
    }, [checkedDownloadDataActive, perPage, status])

    useEffect(() => {
        setPerPage({ ...perPage, offset: 0 });
    }, [checkedDownloadDataActive])

    const getUserDetails = () => {
        let payload = {
            isActive: status,
            roleId: checkedDownloadDataActive,
            paging: {
                limit: perPage?.limit,
                offset: perPage?.offset,
            },
        };
        dispatch(getUserDetailsListAction(payload));
    }

    const getRoleListItem = () => {
        dispatch(getRoleListAction());
    }

    const changeStatus = (value: any) => {
        setValue(value)
        setEditUser(true)
    }
    const navigateToUserEdit = (item: any) => {
        setStatus(item?.isActive)
        setEditUser(true)
        setOpenAddDrawer(true)
        setChangeUserStatus(false)
        prePopulationUser(item)
        getRoleListItem();
    }

    const showPopUpModal = (activeUser: any) => {
        setStatusPopUp(true)
        setChangeUserStatus(true)
    }

    const userStatusPopUpCancel = () => {
        setStatusPopUp(false)
    }

    const showChangePasswordDrawer = (users: any) => {
        setOpenChangePasswordDrawer(true)
        setDrawerUserInfo(users)
    }

    const onChangePasswordClose = () => {
        setOpenChangePasswordDrawer(false)
        passwordForm.resetFields();
    }

    const defaultThumbnail = (userName: any) => {
        try {
            let flName = "";
            flName = userName?.firstName ? (userName?.firstName[0]).toUpperCase() : "";
            flName += userName?.lastName ? (userName?.lastName[0]).toUpperCase() : ""
            return flName;
        } catch (ex) {
            console.log("Error in getUserProfileDefaultThumbnail::" + ex);
        }
    }

    const drawerView = ()=>{
        return(
            <div>
                <Drawer
                    title={"Reset Password"}
                    placement="right"
                    onClose={onChangePasswordClose}
                    open={openChangePasswordDrawer}
                    className="add-user-drawer-container"
                    extra={
                        <Space>
                            <div onClick={onChangePasswordClose} style={{ cursor: "pointer" }}><img src={AppImages.closeIcon} /></div>
                        </Space>
                    }
                >
                    <div className='user-card-container bg-color'>
                        <div className='user-image-container'>
                            <div className='d-flex'>
                                <div className={status == 1 ? 'default-thumbnail-active' : 'default-thumbnail-inactive'}>{defaultThumbnail(drawerUserInfo)}</div>
                                <div className='user-role-content ml-10'>
                                    <div className='name'>{`${drawerUserInfo?.firstName} ${drawerUserInfo?.lastName}`}</div>
                                    <div className='role'>{drawerUserInfo?.roleName ? drawerUserInfo?.roleName : "-"}</div>
                                </div>
                            </div>
                        </div>
                        <div className={status == 1 ? 'email-content-active email-bg-color' : 'email-content-inactive'}>
                            <div className='d-flex '>
                                <div className=''>< img src={AppImages.emailIconSvg} /></div>
                                <div className='ml-10 ff-inter'>{drawerUserInfo.email}</div>
                            </div>
                            <div className='d-flex mt-10'>
                                <div><img src={AppImages.userPhone} /></div>
                                <div className='ml-10 ff-inter'>{drawerUserInfo.phoneNumber ? drawerUserInfo.phoneNumber : "-"}</div>
                            </div>
                        </div>
                    </div>
                    <div className='change-user-password-content'>
                        <Form
                            id='changePasswordForm'
                            form={passwordForm}
                            layout='vertical'
                            onFinish={changePasswordForm}
                        >
                            <Form.Item
                                label={AppConstants.newPassword}
                                name={AppConstants.newPassword}
                                className='form-item-content'
                                rules={[
                                    {
                                        required: true,
                                        message: "Field is required",
                                    },
                                    {
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s).{3,50}$/,
                                        message: 'Password must be greater than 8 characters and use a combination of the following: uppercase letters, lowercase letters, numbers, and special characters'
                                    },

                                ]}
                            >
                                <Input.Password
                                    onChange={(e: any) => setUserInfo({ ...userInfo, password: e.target.value })}
                                    placeholder='Enter'
                                    className='input-content'
                                />
                            </Form.Item>
                            <Form.Item
                                label="Confirm Password"
                                className='form-item-content'
                                rules={[
                                    {
                                        required: true,
                                        message: "Field is required",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value || getFieldValue(AppConstants?.newPassword) === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('New Password and Confirm Password does not match!');
                                        },
                                    })
                                ]}
                                dependencies={[AppConstants?.newPassword]}
                                name={AppConstants?.confirmPassword}

                            >
                                <Input.Password
                                    placeholder='Enter'
                                    className='input-content'
                                />
                            </Form.Item>
                            <div className='footer-container'>
                                <Button className="footer-cancel-button" onClick={onChangePasswordClose}>
                                    <div >Cancel</div>
                                </Button>
                                <Button className="footer-save-button" htmlType='submit'>
                                    <div>Save</div>
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Drawer>
            </div>
        )
    }

    const userMangementHeader = () => {
        try {
            return (
                <div className="user-view">
                    <div className="d-flex">
                        <div className="user-text">User Management</div>
                        <div className="radio">
                            <Radio.Group buttonStyle="solid"
                                value={status}
                                onChange={(e: any) => handleStatus(e.target.value)}
                            >
                                <Radio.Button value={1}>
                                    Active
                                </Radio.Button>
                                <Radio.Button value={0}>
                                    In Active
                                </Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className='d-flex'>
                        <div className='checkbox-container'>
                            {(userCheckData || []).map((data: any, index: any) =>
                                <Checkbox
                                    className='check-box-data'
                                    value={data.roleId}
                                    checked={checkedDownloadDataActive.some((x: any) => x === data.roleId)}
                                    onChange={(e: any) => onCheckAllChange(e.target.checked, data)}
                                >
                                    {data.data}
                                </Checkbox>
                            )}
                        </div>
                        <div className="add-user-container">
                            <Button className='add-user-button' onClick={showAddDrawer}>
                                + Add User
                            </Button>
                            <Drawer
                                title={editUser === true ? "Edit User" : "Add User"}
                                placement="right"
                                onClose={onAddClose}
                                open={openAddDrawer}
                                className="add-user-drawer-container"
                                extra={
                                    <Space>
                                        <div onClick={onAddClose} style={{ cursor: "pointer" }}><img src={AppImages.closeIcon} /></div>
                                    </Space>
                                }
                            >
                                <div className='user-add-form'>
                                    <Form
                                        id="userForm"
                                        form={form}
                                        layout="vertical"
                                        onFinish={() => saveUserForm()}
                                    >
                                        <Form.Item
                                            label="First Name"
                                            name="firstName"
                                            style={{ fontSize: "20px" }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Enter first name",
                                                },
                                                {
                                                    whitespace: true,
                                                    message: "Enter Valid first name",
                                                }
                                            ]}
                                            className="form-item-content"
                                        >
                                            <Input
                                                autoComplete='off'
                                                maxLength={50}
                                                className='input-content'
                                                onChange={(e: any) => setUserInfo({ ...userInfo, firstName: e.target.value.trim() })}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Last Name"
                                            name="lastName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Enter last name",
                                                },
                                                {
                                                    whitespace: true,
                                                    message: "Enter Valid last name",
                                                }
                                            ]}
                                        >
                                            <Input
                                                autoComplete='off'
                                                maxLength={50}
                                                className='input-content'
                                                onChange={(e: any) => setUserInfo({ ...userInfo, lastName: e.target.value.trim() })}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Select Role"
                                            name="selectRole"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Select Role",
                                                },
                                            ]}
                                        >
                                            <Select className='select-content'
                                                onChange={(e: any) => setUserInfo({ ...userInfo, selectRole: e })}
                                            >
                                                {(getRoleList?.getRoleList || []).map((item: any) =>
                                                    <Option
                                                        value={item?.roleId}
                                                        key={item?.roleId}
                                                    >
                                                        {item?.name}
                                                    </Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            label="E-Mail ID"
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Enter email id",
                                                },
                                                {
                                                    pattern: new RegExp("^[0-9a-zA-Z!@#$%&*+.]*$"),
                                                    message: "Enter valid email"
                                                },
                                                {
                                                    type: 'email',
                                                    message: 'Enter valid email',
                                                },
                                            ]}
                                        >
                                            <Input
                                                disabled={editUser == true}
                                                autoComplete='off'
                                                className='input-content'
                                                maxLength={100}
                                                onChange={(e: any) => setUserInfo({ ...userInfo, email: e.target.value.trim() })}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Phone Number"
                                            name="phoneNumber"
                                            rules={[
                                                {
                                                    pattern: new RegExp("^[0-9!@#$%&*+]*$"),
                                                    message: "Enter valid phone number"
                                                },
                                                {
                                                    required: true,
                                                    message: "Field is required",
                                                },
                                            ]}
                                        >
                                            <Input
                                                type='text'
                                                // minLength={5}
                                                maxLength={13}
                                                autoComplete='off'
                                                className='input-content'
                                                onChange={(e: any) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
                                            />
                                        </Form.Item>
                                        {editUser == false && <Form.Item
                                            label="Password"
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Enter password",
                                                },
                                                {
                                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s).{3,50}$/,
                                                    message: 'Password must be greater than 8 characters and use a combination of the following: uppercase letters, lowercase letters, numbers, and special characters'
                                                },
                                            ]}
                                        >
                                            <Input.Password
                                                autoComplete='off'
                                                type='password'
                                                className='input-content'
                                                maxLength={50}
                                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                onChange={(e: any) => setUserInfo({ ...userInfo, password: e.target.value.trim() })}
                                            />
                                        </Form.Item>}
                                        <div className='footer-container'>
                                            <Button className="footer-cancel-button" onClick={onAddClose}>
                                                <div >Cancel</div>
                                            </Button>
                                            <Button className="footer-save-button" htmlType='submit' disabled={saveUserOnload}>
                                                <div>Save</div>
                                            </Button>
                                        </div>
                                    </Form>

                                </div>
                            </Drawer>
                        </div>
                    </div>
                </div>
            )
        }
        catch (ex) {
            console.log("Error in userMangementHeader::" + ex);
        }
    }

    const menuItem = ((item: any) => {
        return (
            <div className="menu-container" style={{ marginTop: "-2rem" }}>
                <Menu onClick={() => changeStatus(item)}>
                    <Menu.Item>
                        <div className="edit-option-text" onClick={() => navigateToUserEdit(item)}>Edit</div>
                    </Menu.Item>
                    {status == 0 && <Menu.Item>
                        <div className="edit-option-text" onClick={() => showPopUpModal(item)}>Active User</div>
                    </Menu.Item>}
                    {status == 1 && <Menu.Item>
                        <div className="edit-option-text" onClick={() => showPopUpModal(item)}>In-Active User</div>
                    </Menu.Item>}
                    {status == 1 && <Menu.Item>
                        <div className="edit-option-text" onClick={() => showChangePasswordDrawer(item)}>Reset password</div>
                    </Menu.Item>}
                </Menu>
            </div>
        )
    })

    const userCardView = (data: any)=>{
        return(
            <Col span={6} className='col-style'>
                <div className='user-card-container'>
                    <div className='user-image-container'>
                        <div className='d-flex'>
                            <div className={status == 1 ? 'default-thumbnail-active' : 'default-thumbnail-inactive'}>{defaultThumbnail(data)}</div>
                            <div className='user-role-content ml-10'>
                                <div className='name'>{`${data?.firstName} ${data?.lastName}`}</div>
                                <div className='role'>{data?.roleName ? data?.roleName : "-"}</div>
                            </div>
                        </div>
                        <Dropdown overlay={menuItem(data)}>
                            <div className="user-edit-container"><MoreOutlined /></div>
                        </Dropdown>
                    </div>
                    <div className={status == 1 ? 'email-content-active' : 'email-content-inactive'}>
                        <div className='d-flex '>
                            <div>{status == 1 ? < img src={AppImages.emailIconSvg} /> : < img src={AppImages.emailIconInactive} />}</div>
                            <div className='ml-10 ff-inter ellipse-none' title={data.email}>{data.email}</div>
                        </div>
                        <div className='d-flex mt-10'>
                            <div>{status == 1 ? <img src={AppImages.userPhone} /> : <img src={AppImages.phoneInactive} />}</div>
                            <div className='ml-10 ff-inter'>{data.phoneNumber ? data.phoneNumber : "-"}</div>
                        </div>
                    </div>
                </div>
            </Col>
        )
    }

    const userListingData = () => {
        try {
            let render: any;
            if (userDetails == null) {
                render = (
                    <><Empty className='no-data-image' /></>
                )
            }
            else {
                if (isArrayNotEmpty(userDetails) && getUserDetailsListOnload === false) {
                    render = (
                        <Row className='row-padding' gutter={[0, 10]}>
                            {(userDetails || []).map((data: any, index: any) =>
                                userCardView(data)
                            )}
                        </Row>
                    )
                } else {
                    render = (
                        <Row style={{padding: "0px 25px"}}>
                            {([1, 2, 3, 4, 5, 6, 7, 8]).map(() =>
                                <Col span={6}>
                                    <div className='user-card-container'>
                                        <Skeleton
                                            loading={getUserDetailsListOnload}
                                            active
                                            avatar>
                                        </Skeleton>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    )
                }
            }
            return (
                render
            )
        }
        catch (ex) {
            console.log("Error in userListingData::", ex)
        }
    }

    const userStatusPopUp = () => {
        return (
            <>
                <Modal
                    className='Conform-modal'
                    open={statusPopUp}
                    footer={null}
                    closeIcon={
                        null
                    }
                >
                    <p className="popup-text">Are you sure you want to {status == 1 ? "in-activate" : "activate"}  user <b className='popup-user-name'>{`${value?.firstName} ${value?.lastName}`}</b>? </p>
                    <div className='popup-container'>
                        <Button
                            onClick={userStatusPopUpCancel}
                            className="footer-cancel"
                        >
                            Cancel
                        </Button>
                        <Button
                            className='footer-active'
                            onClick={() => updateUserStatus()}
                        >
                            {status == 1 ? "Inactive" : "Active"}
                        </Button>
                    </div>
                </Modal>
            </>
        )
    }

    const handlePagination = (page: any, pageSize: any) => {
        perPage.offset = (page * pageSize) - pageSize;
        perPage.limit = pageSize;
        setPerPage({ ...perPage });
    }

    return (
        <div className='user-management-container'>
            <TopMenuAndSider />
            {userMangementHeader()}
            {userListingData()}
            {userStatusPopUp()}
            <Pagination
                hideOnSinglePage
                current={userCurrentPage}
                pageSize={perPage.limit}
                onChange={handlePagination}
                itemRender={itemRender}
                className="ml-auto user-pagination"
                total={userCount}
            />
            {drawerView()}
        </div>
    )
}