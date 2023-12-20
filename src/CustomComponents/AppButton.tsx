import React from 'react';
import {
    Button
} from 'antd';
import "./index.scss";

function AppButtons(props: any) {
    const {
        className,
        text,
        htmlType,
        onClick,
        disabled,
        image,
    } = props;

    //app-save-button
    //app-cancel-button
    return (
        <Button
            htmlType={htmlType}
            className={className}
            onClick={onClick}
            disabled={disabled}>
            {text}
        </Button>
    );
}

export default AppButtons;