const setUser = (user: any) => {
    localStorage.setItem("user",JSON.stringify(user));
}

const getUser = () => {
    let user: any = localStorage.getItem("user")
    if(user != "undefined"){
        return JSON.parse(user);
    }else{
        return null;
    }
}

const setAuthToken = (token: any) => {
    localStorage.setItem("authToken",token)
}

const getAuthToken = () => {
    return localStorage.getItem("authToken")
}

export {
    setUser,
    getUser,
    setAuthToken,
    getAuthToken
}