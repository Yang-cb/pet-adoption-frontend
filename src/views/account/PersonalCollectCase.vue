<template>
  <div>
    <el-space :fill="true" wrap style="width: 100%; align-content: center;">
      <span v-if="personalCollectData.length===0">暂无收藏</span>
      <el-card v-for="collectData in personalCollectData" :key="personalCollectData.petId"
               style="height: 300px; margin: 0 100px">
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
                <el-button @click="openUnCollect(collectData.petId)" type="text">
                  <el-icon size="25">
                    <StarFilled/>
                  </el-icon>
                </el-button>
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

const personalCollectData = ref([])


// 删除一条收藏记录
const openUnCollect = (petId) => {
  ElMessageBox.confirm(
      '确定要取消收藏该宠物吗?',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '手滑了',
        type: 'warning',
      })
      .then(() => {
            post('/api/acc2pic/collectPB', {
              accId: takeAccId(),
              petId: petId
            }, () => {
              ElMessage.success('取消收藏成功')
              getCollections()
            }, (err) => {
              ElMessage.error(err)
            })
          }
      )
      .catch(() => {
      })
}

const getCollections = () => {
  get('/api/acc2pic/getCollectPB?id=' + takeAccId(), (data) => {
    personalCollectData.value = data
    console.log(data)
  }, (err) => {
    ElMessage.error(err)
  })
}
getCollections()
</script>