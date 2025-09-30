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
    customClass: "custom-message-box",
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

<!-- 全局样式：用于 MessageBox -->
<style>
.custom-message-box {
  background-color: rgba(238, 238, 238, 0.5) !important;
  backdrop-filter: blur(10px) saturate(1.2);
  border-radius: 15px !important;
  border: 1px solid rgba(17, 17, 17, 0) !important;
  box-shadow: rgba(50, 50, 93, ) 0px 50px 100px -20px,
  rgba(0, 0, 0, 0.5) 0px 30px 60px -30px,
  rgba(212, 217, 222, 0) 0px -2px 6px 0px inset !important;
}

.custom-message-box .el-message-box__header .el-message-box__title {
  color: rgb(22, 38, 53);
  font-weight: 600;
  text-shadow: 2px 2px 2px rgba(200, 201, 204, 0.3);
}

.custom-message-box .el-message-box__content {
  color: rgb(22, 38, 53);
  font-weight: 500;
}

.custom-message-box .el-message-box__btns {
  padding: 10px 20px 20px;
}

.custom-message-box .el-button--primary:hover,
.custom-message-box .el-button--primary:focus,
.custom-message-box .el-button--primary:active {
  background-color: #2d5260 !important;
  border: none !important;
}

.custom-message-box .el-button--default:hover {
  background-color: rgba(255, 255, 255, 0.5) !important;
  border: 1px solid rgba(17, 17, 17, ) !important;
  color: rgb(22, 38, 53) !important;
}

.custom-message-box .el-button--default:focus {
  background-color: rgba(255, 255, 255, 0) !important;
  border: 1px solid rgba(17, 17, 17, 0) !important;
  color: rgb(22, 38, 53) !important;
  outline: none !important;
}

.custom-message-box .el-button--default:active {
  background-color: rgba(255, 255, 255, 0.6) !important;
  border: 1px solid rgba(17, 17, 17, 0) !important;
  color: rgb(22, 38, 53) !important;
}

/* 完整的下拉菜单毛玻璃效果 - 覆盖所有层级 */

/* Popper 外层容器 */
.el-popper.is-light,
.el-popper.is-light.el-popper__arrow {
  background: transparent !important;
  border: none !important;
}

/* 下拉菜单主体 - 包含所有状态 */
.el-dropdown-menu.el-popper,
.el-dropdown-menu,
.el-zoom-in-top-enter-active .el-dropdown-menu,
.el-zoom-in-top-enter-to .el-dropdown-menu,
.el-zoom-in-top-leave-active .el-dropdown-menu {
  background: rgba(255, 255, 255, 0.25) !important;
  background-color: rgba(255, 255, 255, 0) !important;
  backdrop-filter: blur(20px) saturate(1.8) !important;
  -webkit-backdrop-filter: blur(20px) saturate(1.8) !important;
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow:
    rgba(0, 0, 0, 0.15) 0px 10px 40px,
    rgba(255, 255, 255, 0.3) 0px 1px 3px inset !important;
  padding: 10px 0 !important;
  overflow: visible !important;
}

/* 确保过渡状态也有模糊效果 */
.el-zoom-in-top-enter-active,
.el-zoom-in-top-enter-to,
.el-zoom-in-top-leave-active {
  backdrop-filter: blur(20px) saturate(1.8) !important;
  -webkit-backdrop-filter: blur(20px) saturate(1.8) !important;
}

/* Popper 在所有状态下都透明 */
.el-popper.is-light,
.el-popper.is-light.el-zoom-in-top-enter-active,
.el-popper.is-light.el-zoom-in-top-leave-active {
  background: transparent !important;
  border: none !important;
}

/* 移除所有可能的白色背景伪元素 */
.el-dropdown-menu::before,
.el-dropdown-menu::after,
.el-popper::before,
.el-popper::after {
  content: none !important;
  display: none !important;
  background: none !important;
}

/* Popper 箭头（如果需要隐藏） */
.el-popper__arrow,
.el-popper[data-popper-placement] .el-popper__arrow::before {
  display: none !important;
}

/* 下拉菜单项 */
.el-dropdown-menu__item {
  color: rgb(22, 38, 53) !important;
  font-weight: 600 !important;
  font-size: 15px !important;
  padding: 12px 24px !important;
  margin: 0 8px !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
  background: transparent !important;
}

.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: rgba(255, 255, 255, 0.4) !important;
  color: rgb(22, 38, 53) !important;
}

/* 分割线 */
.el-dropdown-menu__item--divided {
  border-top: 1px solid rgba(22, 38, 53, 0.15) !important;
  margin-top: 8px !important;
}

.el-dropdown-menu__item--divided::before {
  display: none !important;
}

/* 退出登录链接 */
.el-dropdown-menu__item .exit {
  color: rgb(22, 38, 53) !important;
  font-weight: 600 !important;
}
</style>