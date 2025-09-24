<template>
  <el-dialog v-model="dialogFormVisible" width="500" custom-class="custom-dialog">
    <div class="dialog-content">
      <b class="title">火势预测</b>
      <el-divider class="divider"></el-divider>
      <b class="Description">依据火点位置通过元胞自动机模型预测火势面</b>
      <img src="@/assets/model.png" alt="模型图片" class="model-image"/>
      <el-form :model="form" class="center-form">
        <el-form-item label="模型步长" :label-width="formLabelWidth">
          <el-input v-model="form.stepLength" autocomplete="off" placeholder="请输入模型步长" />
        </el-form-item>
        <el-form-item label="预测精度" :label-width="formLabelWidth">
          <el-select v-model="form.accuracy" placeholder="请选择预测精度">
            <el-option label="10m" value="10m" />
            <el-option label="15m" value="15m" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="evacuateShow = false;BufferShow = false;isShow = true;dispatchShow = false;dialogFormVisible = false">确认</el-button>
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
</style>
<style>
.custom-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-dialog{
  background: rgba(255, 255, 255, 0.56);
  backdrop-filter: blur(10px) saturate(1.5);
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(112, 112, 112, 0.2), 0 6px 20px rgba(112, 112, 112, 0.2);
  overflow: hidden;
  padding: 20px;
}



.title {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 0;
  bottom: 0;
  padding-bottom: 0;
  border-bottom: 0;
}

.model-image {
  width: 45%;
  height: auto;
  margin-bottom: 20px;
  margin-left: 140px;
  left: 184px;
  margin-top: 10px;
}

.center-form {
  display: flex;
  flex-direction: column;
  left: 0;
}

.dialog-footer {
  text-align: right;
}

.el-form-item {
  width: 100%;
  max-width: 300px;
  margin-bottom: 15px;
  left: 0;
  padding-left: 0;
}

.el-button {
  margin-top: 10px;
  border-radius: 15px;
  background: #366476;
  color: rgb(255, 255, 255);
  border: none;
}

.center-form {
  display: flex;
  flex-direction: column;
}

.el-button span {
  font-size: 16px;
  font-weight: normal;
}

.divider {
  border-color: rgb(22, 38, 53);
  width: 100%;
  align-items: center;
  justify-content: center;


}

.el-input__wrapper{
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0);
  color: rgba(255, 255, 255, 0);
  width: 300px;
}
.el-select__wrapper{
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0);
  color: rgba(255, 255, 255, 0);
}
.Description{
  font-size: 18px;
}
</style>





