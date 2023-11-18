<template>
  <div>
    <el-space :fill="true" wrap style="width: 100%; align-content: center;">
      <el-card v-for="collectData in personalCollectData" :key="personalCollectData" style="height: 300px; margin: 0 100px">
        <template #header>
          <div style="display: flex; justify-content: space-between;">
            <div>
              <p style="font-size: 18px; font-weight: bold">{{ collectData.title }}</p>
              <p style="font-size: 14px; font-weight: bold">{{
                  getType(collectData.petType)
                }}({{ collectData.sex === 1 ? '公' : '母' }})</p>
            </div>
            <div style="margin-top: 20px">
              <el-button-group>
                <el-button type="primary" :icon="Delete"/>
              </el-button-group>
            </div>
          </div>
        </template>
        <div>
          <el-descriptions>
            <el-descriptions-item label="联系人">{{ collectData.contactsName }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ collectData.contactsPhone }}</el-descriptions-item>
            <el-descriptions-item label="微信">{{ collectData.contactsWechat }}</el-descriptions-item>
            <el-descriptions-item label="邮件">{{ collectData.contactsEmail }}</el-descriptions-item>
            <el-descriptions-item label="宠物类型">
              <el-tag size="small">{{ getType(collectData.petType) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="领养地址">{{ collectData.location }}</el-descriptions-item>
          </el-descriptions>
          <div style="font-size: 14px">详细描述 {{ collectData.text }}</div>
        </div>
      </el-card>
    </el-space>
  </div>
</template>
<script setup>
import {Delete, Edit} from "@element-plus/icons-vue";
import {get, takeAccId} from "@/api/request";
import {ElMessage} from "element-plus";
import {ref} from "vue";

const getType = (petType) => {
  if (petType === 'other' || petType === '' || petType === null) {
    return '其他'
  }
  return petType === 'dog' ? '狗狗' : '猫猫'
}

const personalCollectData = ref([])


get('/api/acc2pic/getCollectPB?id=' + takeAccId(), (data) => {
  personalCollectData.value = data
  console.log(data)
}, (err) => {
  ElMessage.error(err)
})
</script>