<template>
  <el-dialog v-model="dialogFormVisible"  width="500">
    <div class="dialog-content">
      <b class="title">范围选择</b>
      <el-divider class="divider"></el-divider>
      <b class="Description">根据火灾影响范围建立缓冲区</b>
      <img src="@/assets/bufferPic.svg" alt="模型图片" class="model-image"/>

    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="evacuateShow = false;BufferShow = true;isShow = false;dispatchShow = false;dialogFormVisible = false">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits, defineProps } from 'vue';
import {isShow} from "@/components/AMap/hidePanel";
import {BufferShow} from "@/components/AMap/bufferProcessParameter";
import {dispatchShow} from "@/components/AMap/stationDispatchParameter.vue";
import {evacuateShow} from "@/components/AMap/evacuateParameter";

const dialogFormVisible = ref(false);
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});
const formLabelWidth = '140px';

const isCreate = ref(false);
const msgText = ref('');
const initAndShow = (id: number = 0) => {
  dialogFormVisible.value = true;
  if (id) {
    isCreate.value = false;
    msgText.value = '更新';
  } else {
    isCreate.value = true;
    msgText.value = '创建';
  }
};

defineExpose({
  initAndShow,
});

</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
.model-image{
  width: 40%;
}
.description{
  font-size: 15px;
}
</style>
