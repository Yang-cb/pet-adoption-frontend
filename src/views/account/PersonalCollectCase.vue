<template>
  <div>
    <el-space :fill="true" wrap style="width: 100%; align-content: center;">
      <el-card v-for="collectData in personalCollectData" :key="collectData.petId"
               shadow="hover" style="height: 300px; margin: 0 100px">
        <template #header>
          <div style="height: 50px; display: flex; justify-content: space-between;">
            <div>
              <p style="font-size: 20px; font-weight: bold">{{ collectData.title }}
                <div style="font-size: 14px;">
                  {{ getType(collectData.petType) }}({{ collectData.petSex === 1 ? '公' : '母' }})
                </div>
              </p>
            </div>
            <div style="margin-top: 20px">
              <el-button-group>
                <el-button @click="openUnCollect(collectData.petId)" link>
                  <el-icon size="25">
                    <StarFilled/>
                  </el-icon>
                </el-button>
              </el-button-group>
            </div>
          </div>
        </template>
        <div style="display: flex;">
          <div @click="petData(collectData.petId)">
            <el-image style="width: 170px; height: 170px;" v-bind:src="collectData.picName"/>
          </div>
          <div style="margin-left: 50px; width: 100%; font-size: 14px; color: #606266;">
            <el-row :gutter="20">
              <el-col :span="12">联系人： {{ collectData.contactsName }}</el-col>
              <el-col :span="12">联系电话： {{ collectData.contactsPhone }}</el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">微信： {{ getWechat(collectData.contactsWechat) }}</el-col>
              <el-col :span="12">邮件： {{ getEmail(collectData.contactsEmail) }}</el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">是否免费：
                <el-tag v-if="collectData.isFree===1">免费</el-tag>
                <el-tag v-else type="danger">付费</el-tag>
              </el-col>
              <el-col :span="12">宠物姓名： {{ getName(collectData.petName) }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="24">领养地址： {{ collectData.location }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-text line-clamp="2">
                  详细描述： {{ collectData.text }}
                </el-text>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-card>
    </el-space>
    <div v-if="personalCollectData.length===0">
      <el-empty description="暂无收藏"/>
    </div>
  </div>
</template>
<script setup>
import {StarFilled} from "@element-plus/icons-vue";
import {get, post, takeAccId} from "@/api/request";
import {ElMessage, ElMessageBox} from "element-plus";
import {ref} from "vue";
import {getPetImageUrl} from "@/utils";
import {useRouter} from "vue-router";

// 跳转详情页面并传递petId
const router = useRouter();
const petData = (petId) => {
  router.push({
    path: '/index/onePBData',
    query: {
      petId: petId
    }
  })
}

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

// 获取收藏列表
const personalCollectData = ref([])
const getCollections = () => {
  get('/api/acc2pic/getCollectPB?id=' + takeAccId(), (data) => {
    for (let i = 0; i < data.length; i++) {
      data[i].picName = getPetImageUrl(data[i].picName)
    }
    personalCollectData.value = data
    console.log(data)
  }, (err) => {
    ElMessage.error(err)
  })
}
getCollections()

// 微信
const getWechat = (wechat) => {
  if (wechat === null || wechat === '')
    return '未填写'
  return wechat
}

// 邮箱
const getEmail = (email) => {
  if (email === null || email === '')
    return '未填写'
  return email
}

// 宠物姓名
const getName = (name) => {
  if (name === null || name === '')
    return '未填写'
  return name
}

// 宠物类型
const getType = (petType) => {
  if (petType === 'other' || petType === '' || petType === null) {
    return '其他'
  }
  return petType === 'dog' ? '狗狗' : '猫猫'
}
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>