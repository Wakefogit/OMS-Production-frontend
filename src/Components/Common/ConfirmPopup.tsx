import { Modal } from 'antd';
import React from 'react';
import AppButtons from '../../CustomComponents/AppButton';

interface modalProps {
    open: boolean,
    // callBack: () => {},
    setOpen: any,
    content: any,
    callback: any,
    buttonText: string
}

function ConfirmPopup(props: modalProps) {
    const {
        open,
        // callBack,
        setOpen,
        content,
        callback,
        buttonText
    } = props;

    return (
        <div>
            <Modal open={open}
            footer={null}
            >
                <div className='modal-text'>
                  {content}
                </div>
                <div className='jf '>
                    <AppButtons
                    className={'outline-blue-button'} 
                    text={'Cancel'}
                    onClick={()=>setOpen(false)}
                    />
                    <AppButtons
                    onClick={()=>{
                        setOpen(false);
                        callback();
                    }}
                    className={'app-blue-button'} 
                    text={buttonText}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default ConfirmPopup;