<script setup lang="ts">
import {isCollapse} from "@/components/App Layout/isCollapse";
import AppAside from "@/components/App Layout/AppAside.vue";
import {useToggleStore} from '@/stores/handleHide';
import {logout} from "@/api/users";
import {useTokenStore} from "@/stores/myToken";
import {useRouter} from "vue-router";
import viewer from "@/components/cesium/mapcanvas.vue"
import * as Cesium from 'cesium';

const router = useRouter()

const toggle = () => {
  useToggleStore().toggle();
}

// 退出事件处理
const handleLogout = async () => {
  // 首先询问。防止误操作
  await ElMessageBox.confirm("是否确认退出登录？", "确认退出登录", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).catch(() => {
    return new Promise(() => {
    })
  })
  // 执行退出
  await logout().catch(() => {
  })
  // 清空token信息
  useTokenStore().saveToken("")
  ElMessage.info("成功退出登录")
  router.push("/login")
}


</script>

<template>
  <!--图标-->
  <el-icon :size="30" class="icon" @click="isCollapse = !isCollapse">
    <IEpExpand v-show="isCollapse" @click="toggle"/>
    <IEpFold v-show="!isCollapse" @click="toggle"/>
  </el-icon>
  <!--  <span class="span">nihao </span>-->

  <!--标题-->
  <span class="span">林火综合管理系统</span>

  <!--下拉菜单-->
  <el-dropdown class="dropdown">
    <span class="el-dropdown-link">
      <el-avatar :size="35" :src="'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"/>
      <el-icon class="el-icon--right">
        <IEpArrow-down/>
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu router>
        <el-dropdown-item>管理员用户</el-dropdown-item>
        <el-dropdown-item divided>
          <a @click="handleLogout" class="exit">退出登录</a>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.dropdown {
  margin-left: auto;
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.icon {
  color: #EEEEEE;
}

.span {
  color: #EEEEEE;
  margin-left: auto;
  font-weight: bold; /* 设置字体加粗 */
  font-size: 30px; /* 设置字体大小 */
}

.el-icon--right {
  color: #EEEEEE;
  font-weight: bold;
}

.exit {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}
</style>