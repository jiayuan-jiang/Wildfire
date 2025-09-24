import requests from "@/utils/requests";
import {fetchInfo} from 'fetch_info.cjs';


// 用户请求登录
type LoginInfo = {
    name: string,
    password: string
}
type LoginReturn = {
    success: boolean,
    state: string,
    message: string,
    content: string
}
export const login = async (loginInfo: LoginInfo) => {
    try {
        // 向后端发送请求来获取用户信息
        const response = await axios.post('/fetch_user_info', loginInfo);
        console.log(response.data)
        // 返回从后端获取的用户信息
        return response.data;
    } catch (error) {
        // 处理错误
        throw new Error('Failed to fetch user info');
    }
}

// 用户退出登录
export const logout = ()=> {
 return requests({
     method: "POST",
     url: "/flask/login_out",

 })
}