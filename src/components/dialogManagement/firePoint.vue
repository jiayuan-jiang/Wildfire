<script setup lang="ts">
import {reactive} from "vue";
import { useRouter } from 'vue-router';
const dialogFormVisible = ref(false)
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})
const formLabelWidth= '140px'

const isCreate = ref(true)
const msgText = ref("")
const initAndShow = (id: number = 0) => {
  // 获取当前路径
  dialogFormVisible.value = true
  if (id){
    isCreate.value = false
    msgText.value = '更新'
  } else {
    isCreate.value = true
    msgText.value = "创建"
  }
  console.log("zheli")
}

defineExpose({
  initAndShow,
})

const predictHandle = ()=>{

}
</script>

<template>
  <el-dialog v-model="dialogFormVisible" title="Shipping address" width="500">
    <el-form :model="form">
      <el-form-item label="Promotion name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Zones" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>