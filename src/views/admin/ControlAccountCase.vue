<template>
  <div class="table-box" ref="tableBox">
    <el-table v-if="tableHeight"
              :max-height="tableHeight + 'px'"
              :data="accounts" style="width: 100%;"
              :default-sort="{ prop: 'accountId', order: 'ascending' }"
    >
      <el-table-column fixed="left" sortable prop="accountId" label="ID" width="100"/>
      <el-table-column label="头像" width="100">
        <template #default="scope">
          <el-image preview-teleported :src="scope.row.picName" :preview-src-list="srcList"
                    @click="preview(scope.row.picName)" style="width: 60px; height: 60px"/>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="150"/>
      <el-table-column prop="email" label="邮箱" width="200"/>
      <el-table-column prop="nikeName" label="昵称" width="180"/>
      <el-table-column prop="signature" label="个性签名" width="200"/>
      <el-table-column prop="birthday" label="生日" width="120"/>
      <el-table-column prop="location" label="地址" width="200"/>
      <el-table-column prop="authority" label="权限" width="120"/>
      <el-table-column prop="gmtCreate" label="创建时间" width="120"/>
      <el-table-column prop="gmtModified" label="修改时间" width="120"/>
      <el-table-column fixed="right" prop="accountStatus" label="状态" width="55">
        <template #default="props">
          <el-tag :type="props.row.accountStatus===1?'success':'danger'">
            {{ props.row.accountStatus === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="props">
          <el-popconfirm title="禁用此账户?" v-if="props.row.accountStatus===1"
                         @confirm="editAccountStatus(props.row.accountId, 0)">
            <template #reference>
              <el-button link v-if="props.row.accountStatus===1" type="danger">禁用</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="启用此账户?" v-if="props.row.accountStatus===0"
                         @confirm="editAccountStatus(props.row.accountId, 1)">
            <template #reference>
              <el-button link v-if="props.row.accountStatus===0" type="success">启用</el-button>
            </template>
          </el-popconfirm>
          <el-button link type="primary">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {get, put} from "@/api/request.js";
import {getAccImageUrl} from "@/utils";
import {ElMessage} from "element-plus";

// el表格高度
const tableHeight = ref(0)
const getTableHeight = () => {
  tableHeight.value = document.documentElement.clientHeight - 60
}
getTableHeight()

// 图片预览
const srcList = ref([]);
const preview = (photo) => {
  // 清除原本的预览
  srcList.value = [];
  srcList.value.push(photo);
}

// 修改账户状态
const editAccountStatus = (accountId, accountStatus) => {
  put('/api/admin/updateAccountStatus', {
    accountId: accountId,
    accountStatus: accountStatus
  }, () => {
    ElMessage.success('操作成功')
    getAllAccount()
  })
}

// 所有账户信息
const accounts = ref([])
// 获取所有账户信息
const getAllAccount = () => {
  get('/api/admin/getAllAccount', (data) => {
    for (let i = 0; i < data.length; i++) {
      data[i].picName = getAccImageUrl(data[i].picName)
    }
    accounts.value = data
    console.log(data)
  })
}
getAllAccount()
</script>