<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import addFireData from "@/components/dialogManagement/addFireData.vue"
const addFireDialog = ref()
const start= async () => {
  try {
    const response = await axios.get('/flask/fire_points')
    const data = response.data
    tableData.value = Object.values(data)
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}
start()
interface FirePoint {
  DATE: string
  AREA: string
  LEVEL: number
  X: number
  Y: number
}

const tableData = ref<FirePoint[]>([])
const sortKey = ref<string | null>(null)
const sortOrder = ref<'ascending' | 'descending' | null>(null)
const isAddDialogVisible = ref(false)
const newData = ref<FirePoint>({
  DATE: '',
  AREA: '',
  LEVEL: 1,
  X: 0,
  Y: 0,
})

const sortedData = computed(() => {
  if (!sortKey.value || !sortOrder.value) {
    return tableData.value
  }
  return [...tableData.value].sort((a, b) => {
    const order = sortOrder.value === 'ascending' ? 1 : -1
    const aValue = sortKey.value === 'LEVEL' || sortKey.value === 'AREA' ? a[sortKey.value] : new Date(a[sortKey.value]).getTime()
    const bValue = sortKey.value === 'LEVEL' || sortKey.value === 'AREA' ? b[sortKey.value] : new Date(b[sortKey.value]).getTime()
    if (aValue < bValue) {
      return -1 * order
    }
    if (aValue > bValue) {
      return 1 * order
    }
    return 0
  })
})

const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  sortKey.value = prop
  sortOrder.value = order as 'ascending' | 'descending' | null
}



const addRow = () => {
  if (newData.value.DATE && newData.value.AREA && newData.value.LEVEL && newData.value.X && newData.value.Y) {
    tableData.value.push({ ...newData.value })
    isAddDialogVisible.value = false
  } else {
    // 提示用户填写完整数据
    console.log('请填写完整的数据')
  }
}

const editRow = (row: FirePoint) => {
  // 在这里添加编辑行的逻辑
  console.log('Edit row:', row)
}

const deleteRow = (row: FirePoint) => {
  // 在这里添加删除行的逻辑
  console.log('Delete row:', row)
  // 删除操作示例
  tableData.value = tableData.value.filter(item => item !== row)
}

const tableRowClassName = ({ row }: { row: FirePoint }) => {
  switch (row.LEVEL) {
    case 1:
      return 'level-one-row'
    case 2:
      return 'level-two-row'
    case 3:
      return 'level-three-row'
    case 4:
      return 'level-four-row'
    case 5:
      return 'level-five-row'
    default:
      return ''
  }
}



</script>
<template>
  <div class="container">
    <div class="toolbar">
      <el-button class="topButton" @click="addFireDialog.initAndShow()">添加数据</el-button>
    </div>
    <el-table
        :data="sortedData"
        class="full-screen-table"
        :row-class-name="tableRowClassName"
        @sort-change="handleSortChange"
        height="100%"
    >
      <el-table-column prop="DATE" label="日期" sortable="custom" />
      <el-table-column prop="AREA" label="地区" sortable="custom" />
      <el-table-column prop="LEVEL" label="等级" sortable="custom" />
      <el-table-column prop="X" label="X 坐标" />
      <el-table-column prop="Y" label="Y 坐标" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button @click="editRow(scope.row)" type="primary" size="small">修改</el-button>
          <el-button @click="deleteRow(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加数据的弹出窗口 -->
    <el-dialog title="添加新数据" :visible.sync="isAddDialogVisible">
      <el-form :model="newData">
        <el-form-item label="日期">
          <el-date-picker v-model="newData.DATE" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="newData.AREA" />
        </el-form-item>
        <el-form-item label="等级">
          <el-input-number v-model="newData.LEVEL" :min="1" :max="5" />
        </el-form-item>
        <el-form-item label="X 坐标">
          <el-input v-model="newData.X" />
        </el-form-item>
        <el-form-item label="Y 坐标">
          <el-input v-model="newData.Y" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addRow">确定</el-button>
      </div>
    </el-dialog>
  </div>
  <addFireData ref="addFireDialog"/>
</template>
<style>
.container {
  height: 100%;
  width: 100%;
}

.toolbar {
  margin-bottom: 10px;
}

.full-screen-table {
  height: calc(100% - 40px); /* Adjust height to account for toolbar */
  width: 90%;
  overflow: auto;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  margin: auto;
}

.el-table__body-wrapper {
  height: 100% !important;
}

.el-table .level-one-row {
  --el-table-tr-bg-color: #f5f7fa; /* lightest */
}
.el-table .level-two-row {
  --el-table-tr-bg-color: #e4e7eb;
}
.el-table .level-three-row {
  --el-table-tr-bg-color: #cbd2d9;
}
.el-table .level-four-row {
  --el-table-tr-bg-color: #9aa5b1;
}
.el-table .level-five-row {
  --el-table-tr-bg-color: #7b8794; /* darkest */
}
.topButton{
  margin-left: 80px;
}
</style>
