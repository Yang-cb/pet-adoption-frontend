<template>
  <div>
    <el-space :fill="true" wrap style="width: 100%; align-content: center; margin: 20px 0">
      <el-card v-for="want in personalWantData" :key="want.petId"
               @click="petData(want.petId)"
               style="height: 290px; margin: 0 100px"
               shadow="hover">
        <template #header>
          <div style="display: flex; justify-content: space-between; height: 40px;">
            <div>
              <p style="font-size: 18px; font-weight: bold">凭证ID：{{ want.wantId }}</p>
            </div>
            <div style="margin-top: 20px">
              <el-tag type="info" v-if="want.wantStatus===0">
                等待审核
              </el-tag>
              <el-tag v-else-if="want.wantStatus===1">
                审核通过
              </el-tag>
              <el-tag type="danger" v-else-if="want.wantStatus===2">
                审核未通过
              </el-tag>
              <el-tag type="success" v-else-if="want.wantStatus===3">
                发布者已同意
              </el-tag>
              <el-tag type="danger" v-else>
                发布者已拒绝
              </el-tag>
            </div>
          </div>
        </template>
        <div style="display: flex">
          <div>
            <el-image style="width: 170px; height: 170px;" v-bind:src="want.picName"/>
          </div>
          <div>
            <el-descriptions :column="2" size="large" style="margin: 0 40px">
              <el-descriptions-item width="300px" label="联系人">{{ want.wantContactsName }}</el-descriptions-item>
              <el-descriptions-item width="300px" label="联系电话">{{ want.wantContactsPhone }}</el-descriptions-item>
              <el-descriptions-item label="微信">{{ want.wantContactsWechat }}</el-descriptions-item>
              <el-descriptions-item label="邮件">{{ want.wantContactsEmail }}</el-descriptions-item>
              <el-descriptions-item label="宠物类型">
                <el-tag size="small">{{ getType(want.petType) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="领养地址">{{ want.location }}</el-descriptions-item>
              <el-descriptions-item label="详细描述">{{ want.wantText }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </el-card>
    </el-space>
  </div>
</template>

<script setup>
import {get, takeAccId} from "@/api/request";
import {ElMessage} from "element-plus";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {getPetImageUrl} from "@/utils";

// 跳转详情页面并传递petId
const router = useRouter();
const petData = (petId) => {
  router.push({
    path: '/index/allPB/onePBData',
    query: {
      petId: petId
    }
  })
}

const personalWantData = ref([])
const getWant = () => {
  get('/api/wantAdopt/getWantAdopt?accountId=' + takeAccId(), (data) => {
    for (let i = 0; i < data.length; i++) {
      data[i].picName = getPetImageUrl(data[i].picName)
    }
    personalWantData.value = data
    console.log(data)
  }, (err) => {
    ElMessage.error(err)
  })
}
getWant()

const getType = (petType) => {
  if (petType === 'other' || petType === '' || petType === null) {
    return '其他'
  }
  return petType === 'dog' ? '狗狗' : '猫猫'
}
</script>

<style scoped>
.o_table tbody tr td {
  padding: 2px 50px;
}

.o_table tbody tr td:first-child {
  font-weight: bold;
}
</style>