<script setup lang="ts">
import AppHeader from "@/components/App Layout/AppHeader.vue";
import AppAside from "@/components/App Layout/AppAside.vue";
</script>

<template>
  <div class="common-layout">
    <el-container class="aside">
      <AppAside class=""/>
      <el-container class="header-main">
        <el-header>
          <AppHeader/>
        </el-header>
        <el-main class="main">
          <el-scrollbar class="container">
              <router-view />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.header-main{
  flex-direction: column;
  height: 100vh;
}
.el-header {
  height: 60px;
  display: flex;
  align-items: center;
  background: url("@/assets/forest.jpg") no-repeat center center;
  justify-content: center;
  z-index: 1;
}

.main {
  background-color: #f4f4f5;
  padding: 10px 0;
  display: flex;
}

.aside {
  background-color: #dedfe0;
  z-index: 3;
}
:deep(.el--scrollbar){
  left: 0;
}
.container{
  height: 100%;
  width: 100%;
}
</style>

