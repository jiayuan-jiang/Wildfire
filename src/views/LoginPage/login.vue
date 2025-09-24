<script setup lang="ts">
import {reactive, ref} from "vue";
import {type FormRules, type FormInstance, } from "element-plus";
import {login} from "@/api/users";
import axios from "axios";
import {useTokenStore} from "@/stores/myToken"
import {useRouter} from "vue-router";

const router = useRouter()

// 实例化useTokenStore对象
const store = useTokenStore()

// 表单响应式数据
const form = reactive({
  name: "",
  password: "",
  register: "",
  register_password:"",
  register_code:""
})
// 登录事件处理
const onSubmit = async () => {
  // isLoading.value = true
  await formLogin.value?.validate().catch((err) => {
    ElMessage.error("表单校验失败...")
    isLoading.value = false
    throw err
  })

  // // 正式登录请求,调用第三方API
  // const data = await login(form).then((res)=>{
  //   if(! res.data.success){
  //     ElMessage.error("登录信息有误！")
  //     isLoading.value = false
  //     throw new Error("登录信息有误")
  //   }
  //   return res.data
  // })
  //
  // isLoading.value = false

  // 正式登录请求
  console.log(form)
  const response = await axios.post('/flask/checkLoginInfo', {
    name: form.name,
    password: form.password
  });
  console.log(response["data"])

  if(response["data"]["status"] == 'fail'){
    ElMessage.error("登录信息有误！")
    throw new Error("登录信息有误")
  }
  else if(response["data"]["status"] == 'success'){
    console.log(JSON.stringify(response["data"]))
    console.log(typeof JSON.stringify(response["data"]))
    store.saveToken( JSON.stringify(response["data"]))
    ElMessage.success("登录成功！")
    router.push("/")
  }


}

const onRegister = () => {
  ElMessage.info("注册功能仍在开发中...")
}

const active = ref(1)
const buttonContent = computed(() => {
  return active.value === 1 ? '没有账户？ 点击注册' : '已有账户？ 点击登录';
});

// 定义表单校验规则
const rules = reactive<FormRules>({
  name: [
    {required: true, message: "登录账号不能为空", trigger: 'blur'}
  ],
  password: [
    {required: true, message: "密码不能为空", trigger: 'blur'},
    {min: 6, max: 18, message: "密码长度不符", trigger: 'blur'}
  ]
})

// 定义是否加载中
const isLoading = ref(false)


// 提交校验
const formLogin = ref<FormInstance>()
</script>

<template>

  <div class="login-container">
    <div class="slider">
      <el-form :model="form" label-width="auto" style="max-width: 600px" :class="active === 1 ? 'form' : 'form hidden'"
               label-position="top" size="large" :rules="rules" ref="formLogin">
        <div class="title">登录 <b>林火管理系统</b></div>
        <div class="subtitle">登录管理员用户</div>

        <el-divider class="divider"/>
        <el-form-item label="管理员账号" class="el-form-item" prop="name">
          <el-input v-model="form.name" class="input"/>
        </el-form-item>

        <el-form-item label="密码" class="el-form-item" prop="password">
          <el-input v-model="form.password" class="input"/>
        </el-form-item>

        <el-form-item class="login-foot; el-form-item">
          <el-button type="primary" @click="onSubmit" :loading = "isLoading" class="login-button" onsubmit="">
            登录
          </el-button>
          <!--        <el-button>Cancel</el-button>-->
        </el-form-item>

      </el-form>

      <el-form :model="form" label-width="auto" style="max-width: 600px" :class="active === 2 ? 'form' : 'form hidden'"
               label-position="top" size="large">
        <div class="title"><b>注册管理员用户</b></div>
        <el-divider class="divider"/>
        <el-form-item label="注册管理员" class="el-form-item">
          <el-input v-model="form.register" class="input"/>
        </el-form-item>

        <el-form-item label="输入密码" class="el-form-item">
          <el-input v-model="form.register_password" class="input"/>
        </el-form-item>

        <el-form-item label="输入管理员注册码" class="el-form-item">
          <el-input v-model="form.register_code" class="input"/>
        </el-form-item>

        <el-form-item class="login-foot; el-form-item">
          <el-button type="primary" @click="onRegister" class="login-button">
            申请注册
          </el-button>
          <!--        <el-button>Cancel</el-button>-->
        </el-form-item>
      </el-form>

      <el-card style="width: 480px" shadow="always" :class="active === 1 ? 'card' : 'card active'">
        <h1 class="h1">切换登录与注册状态</h1>
        <!--        <el-divider class="divider"/>-->
        <!--        <div class="content">-->
        <!--          <div class="left">-->
        <!--            <b class="text">林火综合管理系统提供集火灾预测与应急处理功能于智能化解决方案，快速响应火灾事件，减少灾害损失</b>-->
        <!--          </div>-->
        <!--          <div class="right">-->
        <!--            <img src="@/assets/landscape.png" alt="" style="width: 200px; height: 150px;" class="img">-->
        <!--          </div>-->
        <!--        </div>-->
        <el-button type="primary" @click="active = (active===1) ? 2 : 1"
                   class="swop">
          {{ buttonContent }}
        </el-button>
      </el-card>
    </div>

  </div>
</template>

<style scoped lang="scss">
.login-container {
  //width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  //min-width: 100vh;
  min-height: 100vh;
  background: url("@/assets/forest.jpg") no-repeat center center;
  background-size: cover;

  .slider {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .form {
    width: 300px;
    background-color: rgba(238, 238, 238, 0.5);
    backdrop-filter: blur(5px) saturate(1);
    padding: 40px 60px;
    border-radius: 15px;
    border: 1px solid rgba(17, 17, 17, 0.15);
    box-shadow: rgba(50, 50, 93, 0.25) 50px 50px 100px -20px,
    rgba(0, 0, 0, 0.5) 30px 30px 60px -30px,
    rgba(212, 217, 222, 0.35) 2px -2px 6px 0px inset;
    margin: 0 20px;
    transition: 0.4s ease-in-out;

    :deep(.el-divider) {
      border-color: rgb(22, 38, 53);
    }

    :deep(.el-form-item__error) {
      color: #9b4949;
    }

    :deep(.el-button) {
      background-color: #366375;
      border: none;
      align-items: center;

      span {
        font-size: 16px; /* 设置字体大小 */
        font-weight: normal;
      }
    }

    &.hidden {
      background-color: transparent;
      z-index: 1;
    }

    &.hidden > * {
      display: none;
    }

    .title {
      font-size: 25px;
      color: rgb(22, 38, 53);
      text-shadow: 4px 4px 3px #c8c9cc;
      font-weight: 300;
    }

    .subtitle {
      margin-top: 5px;
      font-size: 15px;
      color: rgb(22, 38, 53);
      font-weight: bolder;

    }

    :deep(.el-form-item) {
      margin-top: 20px;
      font-size: 15px;
    }

    :deep(.el-input) {
      border-radius: 8px;

      .el-input__wrapper {
        background: transparent;
        border-radius: 15px;
        box-shadow: 0 0 0 1px #162635 inset;
      }


    }
  }
}

:deep(.el-button) {
  width: 100%;
  margin: 30px auto;
  border-radius: 15px;
}

.login {
  background-color: rgb(81, 134, 152);
  letter-spacing: 1px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}


:deep(.el-card) {
  background: url("@/assets/night.jpg");
  background-size: cover;
  height: 390px;
  border-radius: 0 15px 15px 0;
  border: none;
  //border: 1px solid rgba(17, 17, 17, 0.15);
  //box-shadow: rgba(50, 50, 93, 0.25) 50px 50px 100px -20px,
  //rgba(0, 0, 0, 0.5) 30px 30px 60px -30px,
  //rgba(212, 217, 222, 0.35) 2px -2px 6px 0px inset;
  transition: 0.5s ease-in-out;
  position: absolute;
  right: 2px;
  //transform: translate(0, -50%);
  z-index: 2;
  padding: 0;
  display: flex;

  .divider {
    border-color: rgb(22, 38, 53);
    width: 80%;
    align-items: center;
    display: none;
    justify-content: center;
    margin: 20px 0 0 40px;
  }

  .el-card__body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .content {
    display: flex;
    padding: 15px 0;

    > * {
      margin: 10px;
    }

    .right {
      .img {
        border-radius: 15px;
      }
    }

    .left {
      .text {
        line-height: 2;
      }
    }
  }

  .el-button {
    margin-top: 100px;
    margin-bottom: 0;
    height: 40px;
    background-color: #366476;
    border: none;
    align-items: center;
    justify-content: center;
    display: flex;
    position: relative;
  }

  .h1 {
    padding-top: 60px;
    color: #f6faff;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: center;
    box-shadow: rgba(50, 50, 93, 0.25)
  }

  &.active {
    right: calc(100% - 482px);
    border-radius: 10px 0 0 10px;
  }

  .el-button {
    width: 60%;
    //top: 130px;
    bottom: 0;
  }

  .el-button span {
    font-size: 16px; /* 设置字体大小 */
    font-weight: normal;
  }
}

</style>