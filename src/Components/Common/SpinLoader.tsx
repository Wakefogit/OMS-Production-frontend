import { Modal, Spin } from 'antd';
import React from 'react';

function SpinLoader(props: any) {
    const {loading} = props;
    return (
        <Modal
        open={loading}
        className='spin-modal'
        footer={null}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        centered={true}
        width="unset"
        closable={false}
        style={{background: 'transparent'}}
        >
            <Spin style={{color: 'var(--app-004986)'}}/>
        </Modal>
    );
}

export default SpinLoader;