<template>
  <div>
    <el-space :fill="true" wrap style="width: 100%; align-content: center;">
      <span v-if="personalWantData.length===0">暂无收藏</span>
      <el-card v-for="want in personalWantData" :key="want.petId"
               style="height: 300px; margin: 0 100px">
        <template #header>
          <div style="display: flex; justify-content: space-between;">
            <div>
              <p style="font-size: 18px; font-weight: bold">{{ want.title }}</p>
              <p style="font-size: 14px; font-weight: bold">{{
                  getType(want.petType)
                }}({{ want.sex === 1 ? '公' : '母' }})</p>
            </div>
            <div style="margin-top: 20px">
              <el-tag>
                {{ getStatus(want.status) }}
              </el-tag>
            </div>
          </div>
        </template>
        <div>
          <el-descriptions>
            <el-descriptions-item label="联系人">{{ want.contactsName }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ want.contactsPhone }}</el-descriptions-item>
            <el-descriptions-item label="微信">{{ want.contactsWechat }}</el-descriptions-item>
            <el-descriptions-item label="邮件">{{ want.contactsEmail }}</el-descriptions-item>
            <el-descriptions-item label="宠物类型">
              <el-tag size="small">{{ getType(want.petType) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="领养地址">{{ want.location }}</el-descriptions-item>
          </el-descriptions>
          <div style="font-size: 14px">详细描述 {{ want.text }}</div>
        </div>
      </el-card>
    </el-space>
  </div>
</template>
<script setup>
import {StarFilled} from "@element-plus/icons-vue";
import {get, post, takeAccId} from "@/api/request";
import {ElMessage, ElMessageBox} from "element-plus";
import {ref} from "vue";

const getType = (petType) => {
  if (petType === 'other' || petType === '' || petType === null) {
    return '其他'
  }
  return petType === 'dog' ? '狗狗' : '猫猫'
}

const personalWantData = ref([])


// 删除一条收藏记录
const openUnCollect = (petId) => {
  ElMessageBox.confirm(
      '确定要取消收藏该宠物吗?',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '手滑了',
        type: 'warning',
      }).then(() => {
    post('/api/acc2pic/collectPB', {
      accId: takeAccId(),
      petId: petId
    }, () => {
      ElMessage.success('取消收藏成功')
      getWant()
    }, (err) => {
      ElMessage.error(err)
    })
  }).catch(() => {
  })
}

const getWant = () => {
  get('/api/wantAdopt/getWantAdopt?accountId=' + takeAccId(), (data) => {
    personalWantData.value = data
    console.log(data)
  }, (err) => {
    ElMessage.error(err)
  })
}
getWant()

const getStatus = (status) => {
  if (status === 0) {
    return '未审核'
  } else if (status === 1) {
    return '审核通过'
  } else if (status === 2) {
    return '审核未通过'
  } else if (status === 3) {
    return '同意'
  } else if (status === 4) {
    return '拒绝'
  }
}
</script>