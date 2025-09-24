<script setup lang="ts">
import type {Instance} from "element-plus";
import {ref, watch} from "vue"
// 导入Collapse控制函数
import {isCollapse} from "@/components/App Layout/isCollapse.ts";
import {useRouter} from 'vue-router';
// 导入对话框
import predictFire from "@/components/dialogManagement/predictFire.vue"
import bufferDialog from "@/components/dialogManagement/bufferDialog.vue"
import stationDispatch from "@/components/dialogManagement/stationDispatch.vue"
import residentsEvacuation from "@/components/dialogManagement/residentsEvacuate.vue"
import anticipateDialog from "@/components/dialogManagement/anticipateDialog.vue"

//对话框组件引用
const predictFireDialog = ref()
const bufferDialogue = ref()
const dispatchDialog = ref()
const evacuateDialog = ref()
const anticipateDialogue = ref()

const router = useRouter()
const isFirePointEnabled = ref(true);
const isBufferShow = ref(true)
const dispatchShow = ref(true)
const isLeaflet = ref(true)


// 监听当前路由
watch(
    () => router.currentRoute.value,
    (newValue: any) => {
      console.log('当前路由是', newValue.path);
      isFirePointEnabled.value = (newValue.path === '/');
      isBufferShow.value = (newValue.path === '/')
      isLeaflet.value = (newValue.path === '/leaflet')
    },
    {immediate: true}
);
</script>

<template>
  <el-aside>
    <el-scrollbar>
      <el-menu router unique-opened :collapse="isCollapse" class="el-menu">

        <a href="./" class="logo">
          <img src="@/assets/prevent.svg" alt="" style="height: 40px; width: 40px">
          <h1 class="h1" v-show=false>综合管理</h1>
        </a>


        <el-sub-menu index="1">

          <template #title>
            <img src="@/assets/alarm.svg" alt="" style="height: 20px; width: 20px;margin-right: 10px;">
            <span>火情管理</span>
          </template>
          <!--          <el-menu-item :disabled="!isFirePointEnabled" @click="firePointDialog.initAndShow()">-->
          <!--            <el-icon>-->
          <!--              <IEpLock/>-->
          <!--            </el-icon>-->
          <!--            <span>火点信息</span>-->
          <!--          </el-menu-item>-->
          <el-menu-item :disabled="!isFirePointEnabled" @click="predictFireDialog.initAndShow()">
        <img src="@/assets/spread.svg" alt="" style="height: 30px; width: 30px;margin-right: 10px;">
        <span>火势预测</span>
        </el-menu-item>

        </el-sub-menu>


        <el-sub-menu index="2">
          <template #title>
            <img src="@/assets/plan.svg" alt="" style="height: 20px; width: 20px;margin-right: 10px;">
            <span>应急方案</span>
          </template>
          <el-menu-item :disabled="!isFirePointEnabled" @click="bufferDialogue.initAndShow()">
            <img src="@/assets/buffer.svg" alt="" style="height: 25px; width: 25px;margin-right: 10px;">
            <span>范围选择</span>
          </el-menu-item>

          <el-menu-item :disabled="!isFirePointEnabled" @click="dispatchDialog.initAndShow()">
            <img src="@/assets/dispatch.svg" alt="" style="height: 25px; width: 25px;margin-right: 10px;">
            <span>消防调度</span>
          </el-menu-item>

          <el-menu-item :disabled="!isFirePointEnabled" @click="evacuateDialog.initAndShow()">
            <img src="@/assets/evacuate.svg" alt="" style="height: 25px; width: 25px;margin-right: 10px;">
            <span>居民疏散</span>
          </el-menu-item>

        </el-sub-menu>


        <el-sub-menu index="3">
          <template #title>
            <img src="@/assets/distribute.svg" alt="" style="height: 20px; width: 20px;margin-right: 10px;">
            <span>频次分析</span>
          </template>
          <el-menu-item index="/leaflet">
            <img src="@/assets/frequence.svg" alt="" style="height: 25px; width: 25px;margin-right: 10px;">
            <span>历史信息查询</span>
          </el-menu-item>

          <el-menu-item index="/database">
            <img src="@/assets/database.svg" alt="" style="height: 25px; width: 25px;margin-right: 10px;">
            <span>数据库查询</span>
          </el-menu-item>

        </el-sub-menu>

        <el-sub-menu index="4">
          <template #title>
            <img src="@/assets/analysis.svg" alt="" style="height: 20px; width: 20px;margin-right: 10px;">
            <span>火灾防治</span>
          </template>
          <el-menu-item :disabled="!isLeaflet" @click="anticipateDialogue.initAndShow()">
            <img src="@/assets/risk.svg" alt="" style="height: 25px; width: 25px;margin-right: 10px;">
            <span>火险等级预测</span>
          </el-menu-item>

          <el-menu-item>
            <img src="@/assets/wait.svg" alt="" style="height: 25px; width: 25px;margin-right: 10px;">
            <span>等待补充</span>
          </el-menu-item>

        </el-sub-menu>

        <el-sub-menu index="5">
          <template #title>
            <img src="@/assets/info.svg" alt="" style="height: 20px; width: 20px;margin-right: 10px;">
            <span>项目介绍</span>
          </template>
          <el-menu-item index="./demo">
            <img src="@/assets/frame.svg" alt="" style="height: 20px; width: 20px;margin-right: 10px;">
            <span>关于本系统</span>
          </el-menu-item>

        </el-sub-menu>

      </el-menu>
    </el-scrollbar>
  </el-aside>

  <!--  存放对话框  -->
  <predictFire class="dislog" ref="predictFireDialog"/>
  <bufferDialog ref="bufferDialogue"/>
  <stationDispatch ref="dispatchDialog"/>
  <residentsEvacuation ref="evacuateDialog"/>
  <anticipateDialog ref="anticipateDialogue"/>
</template>


<style scoped>


.el-aside {
  height: 100vh;
  width: auto;
}


.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  text-decoration: none;

  img {
    width: 32px;
    height: 32px;
  }
}

.el-menu {
  border-right: none;
  width: 200px;
  background-color: #dedfe0;

  &.el-menu--collapse {
    width: 60px;

    & .h1 {
      display: none;
    }
  }
}

span {
  font-weight: bold;
}
</style>