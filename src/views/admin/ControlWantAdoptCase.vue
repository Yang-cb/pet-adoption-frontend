<template>
  <div class="table-box" ref="tableBox">
    <el-table v-if="tableHeight"
              :max-height="tableHeight + 'px'"
              :data="wantAdopts"
              :default-sort="{ prop: 'petId', order: 'ascending' }">
      <el-table-column prop="wantId" label="请求ID" width="100"/>
      <el-table-column prop="wantContactsName" label="联系人" width="150"/>
      <el-table-column prop="wantContactsPhone" label="电话" width="180"/>
      <el-table-column prop="wantContactsLocation" label="地址" width="180"/>
      <el-table-column prop="wantContactsWechat" label="微信" width="150"/>
      <el-table-column prop="WantContactsEmail" label="邮箱" width="200"/>
      <el-table-column prop="wantText" label="领养条件 " width="200"/>
      <el-table-column prop="gmtCreate" label="创建时间" width="120"/>
      <el-table-column prop="gmtModified" label="修改时间" width="120"/>
      <el-table-column fixed="right" label="状态" width="80">
        <template #default="props">
          <el-tag :type="getTagType(props.row.wantStatus)">
            {{ getWantStatus(props.row.wantStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="审核" width="120">
        <template #default="props">
          <el-popconfirm title="一次性操作，你确定要同意吗?" width="250"
                         @confirm="editWantAdoptStatus(props.row.accountId, props.row.wantId, 1)">
            <template #reference>
              <el-button link :disabled="props.row.wantStatus!==0" type="primary">同意
              </el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="一次性操作，你确定要拒绝吗?" width="250"
                         @confirm="editWantAdoptStatus(props.row.accountId, props.row.wantId, 2)">
            <template #reference>
              <el-button link :disabled="props.row.wantStatus!==0" type="danger">拒绝
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {get, put} from "@/api/request.js";
import {ElMessage} from "element-plus";

// el表格高度
const tableHeight = ref(0)
const getTableHeight = () => {
  tableHeight.value = document.documentElement.clientHeight - 60
}
getTableHeight()


// 修改想领状态
const editWantAdoptStatus = (accountId, wantId, wantStatus) => {
  put('/api/admin/updateWantStatus', {
    accountId: accountId,
    wantId: wantId,
    initStatus: 0,
    wantStatus: wantStatus
  }, () => {
    ElMessage.success('操作成功')
    getAllWantAdopt()
  })
}

// 所有账户信息
const wantAdopts = ref([])
// 获取所有账户信息
const getAllWantAdopt = () => {
  get('/api/admin/getAllWantAdopt', (data) => {
    wantAdopts.value = data
    console.log(data)
  })
}
getAllWantAdopt()

// 获取状态
const getWantStatus = (wantStatus) => {
  switch (wantStatus) {
    case 0:
      return '待审核'
    case 2:
      return '未通过'
    default:
      return '已通过'
  }
}

// 获取状态颜色
const getTagType = (wantStatus) => {
  switch (wantStatus) {
    case 0:
      return 'info'
    case 2:
      return 'danger'
    default:
      return 'success'
  }
}
</script>

<style>
.table-box {
  height: calc(100vh - 60px);
}
</style>