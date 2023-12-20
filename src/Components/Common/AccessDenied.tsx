import AppImages from "../../Global/AppImages";

const AccessDenied = () => {
    return(
        <div className="accesDenied">
            <img src={AppImages?.accessDeniedImg} style={{height:"650px", width:"100%"}}/>
        </div>
    )
}

export default AccessDenied;