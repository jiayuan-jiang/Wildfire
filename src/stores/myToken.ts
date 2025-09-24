import {defineStore} from "pinia";
import {computed} from "vue";
import {ref} from "vue";
import {ElMessage} from "element-plus";

interface Token{
    access_token: string
}

export const useTokenStore = defineStore('myToken', ()=>{
    // state
    const tokenJson = ref("")
    // getters
    const token = computed<Token>(()=>{

        try{
            return JSON.parse(tokenJson.value || window.localStorage.getItem("TokenInfo") || "{}")
        }catch (err){
            ElMessage.error("JSON字符串格式不符") // ignore
            window.localStorage.setItem("TokenInfo", "")
            throw err
        }
        // return tokenJson.value
    })
    // actions
    function saveToken(data: string){
        
        tokenJson.value = data
        window.localStorage.setItem("TokenInfo", data)
    }

    // 向外暴露
    return {token, saveToken}
})