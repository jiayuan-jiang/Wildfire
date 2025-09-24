<script setup lang="ts">
import {reactive} from "vue";

// 表单响应式数据
const form = reactive({
  name: "",
  password: ""
})

// 登录事件处理
const onSubmit = () => {
  ElMessage.success("提交表单数据")
}
</script>

<template>
  <div class="login">
    <el-form :model="form" label-width="auto" style="max-width: 600px" class="form" label-position="top" size="large">
      <h1 class="title">登录</h1>
      <el-form-item label="管理员账户" class="el-form-item">
        <el-input v-model="form.name"/>
      </el-form-item>

      <el-form-item label="密码" class="el-form-item">
        <el-input v-model="form.password"/>
      </el-form-item>

      <el-form-item class="login-foot; el-form-item">
        <el-button type="primary" @click="onSubmit" class="login-button">
          登录
        </el-button>
        <!--        <el-button>Cancel</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.title {
  color: black;
  text-align: center;
  text-shadow: 4px 4px 3px #c8c9cc;
}

.login {
  background-color: #ddd;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  width: 300px;
  background-color: #eee;
  padding: 30px;
  border-radius: 10px;

  .el-form-item {
    margin-top: 20px;

    .login-button {
      width: 100%;
      margin: 30px auto;
    }
  }
}

</style>