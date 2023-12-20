import React,{useEffect, useState} from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, theme,Modal, Button } from 'antd';
import "./modal.scss"
import { Spin } from 'antd';
import FormUpdate from './Common/FormUpdate';
import ToolShopFormUpdate from './SubComponents/ToolShopFormUpdate';
import BundlingSupervisorForm from './SubComponents/BundlingSupervisorForm';
import QaFormUpdates from './SubComponents/QaFormUpdate';
import OperatorEntryFormUpdate from './Common/OperatorEntryFormUpdate';
import { useDispatch } from 'react-redux';
import { getBundlingSupervisorInprogressDataAction, getOperatorEntryInprogressDataAction, getPpcOrderData, getQAInprogressDataAction, getToolShopInprogressDataAction } from './Store/Action/jindalAction';

const { Header, Content, Sider } = Layout;


const Modaldemo = (props:any) => {
//   const {
//     token: { colorBgContainer },
//   } = theme.useToken();
    
    const [selectedMenuKey , setselectedMenuKey] = useState("0")
    const [picking, setPicking] = useState(false);
    const [isLoading,setisLoading] = useState(false)
    const {isModalopen,data,isModalClose} = props;
    const dispatch = useDispatch();

    const selectedKey = (key:any) => {
            setselectedMenuKey(key)
    };
    useEffect(() => {
        if(isModalopen == false){
            setselectedMenuKey('0')
        }
    }, [isModalopen])

    // useEffect(() =>{
    //     getDataApis(data)
    // }, [selectedKey])

    // const getDataApis = (record: any)=>{
    //     let payload = {
    //       orderId: record?.orderId,
    //     };
    //     if(selectedMenuKey == '0'){
    //       dispatch(getPpcOrderData(payload));
    //     }
    //     else if(selectedMenuKey == '1'){
    //       dispatch(getToolShopInprogressDataAction(payload));
    //     }
    //     else if(selectedMenuKey == '2'){
    //       dispatch(getQAInprogressDataAction(payload));
    //     }
    //     else if(selectedMenuKey == '3'){
    //       dispatch(getOperatorEntryInprogressDataAction(payload));
    //     }
    //     else{
    //       dispatch(getBundlingSupervisorInprogressDataAction(payload));
    //     }
    //   }

    const viewModal = () =>{
        return(
            <Modal
                open={isModalopen}
                footer={false}
                closeIcon={false}
                // onCancel={() => setPicking(false)}
                className="main-modal"
            >
                <div className='modelDiv'>
                    <div className='main-div js'>
                        <div className='Edit-po'>{`Edit PO - ${data?.poNo}`}</div>
                        <button className='x-button' onClick={() => 
                        {isModalClose(false)                            
                        }
                        }>X</button>
                    </div>
                    <Layout>
                        <Sider>
                            <div className="logo" />
                            <Menu
                            defaultSelectedKeys={['0']}
                            selectedKeys={[selectedMenuKey]}
                            onClick={(e: any) => selectedKey(e?.key)}
                            >
                            <Menu.Item key='0'>
                                <span>PPC Data</span>
                            </Menu.Item>
                            <Menu.Item key='1'>
                                <span>Tool Shop Data</span>
                            </Menu.Item>
                            <Menu.Item key='2'>
                                <span>QA Entry</span>
                            </Menu.Item>
                            <Menu.Item key='3'>
                                <span>Operator Entry</span>
                            </Menu.Item>
                            <Menu.Item key='4'>
                                <span>Bundling Supervisor</span>
                            </Menu.Item>
                            </Menu>
                        </Sider>
                        <div style={{ height: "80vh" , width: "100%", background: "white" , overflowY:"scroll"}}
                        // className = {isLoading == true ? 'modalMainDiv': 'modalMainDiv spinDiv'}
                        >
                        {(selectedMenuKey === "0") ? (
                        <FormUpdate
                        //   type={"INPROGRESS"}
                        modalKey={"valid"}
                        ppcdata={data}
                        //   ppcdata={data}
                        //   getInProgressData={getPendingListApi}
                        />
                            ):
                            
                            (selectedMenuKey === "1") ? (
                                <ToolShopFormUpdate
                                type={"INPROGRESS"}
                                modalKey={"true"}
                                data={data}      
                                //   getInProgressData={getPendingListApi}
                                />
                            ):(selectedMenuKey === "2") ? (
                                <QaFormUpdates
                                type={"INPROGRESS"}
                                modalKey={"true"}
                                data={data}
                                />
                            ):(selectedMenuKey === "3") ? (
                                <OperatorEntryFormUpdate
                                type={"INPROGRESS"}
                                modalKey={"true"}
                                data={data}
                                />
                            ):
                                <BundlingSupervisorForm
                                type={"INPROGRESS"}
                                modalKey={"true"}
                                data={data}
                                />
                            }
                        </div>
                    </Layout>
                </div>
            </Modal>
        )
    }

  return (
    // <button>press</button>
    <div>
        {/* <Button onClick={() => setPicking(true)}>Button</Button> */}
    {viewModal()}
    </div>
  );
};

export default Modaldemo;