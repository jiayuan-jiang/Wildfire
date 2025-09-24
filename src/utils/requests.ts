import axios from "axios";

const requests = axios.create({
    // 直接请求接口服务器
    // baseURL : import.meta.env.VITE_API_URL

})

export default requests