<template>
  <div>
    <el-space :fill="true" wrap style="width: 100%; align-content: center;">
      <el-card v-for="postData in personalPostData" :key="postData.petId"
               shadow="hover" style="height: 300px; margin: 0 100px">
        <template #header>
          <div style="height: 50px; display: flex; justify-content: space-between;">
            <div>
              <p style="font-size: 20px; font-weight: bold">{{ postData.title }}
                <div style="font-size: 14px;">
                  {{ getType(postData.petType) }}({{ postData.petSex === 1 ? '公' : '母' }})
                </div>
              </p>
            </div>
            <div style="margin-top: 20px">
              <el-button-group>
                <el-button type="primary" @click="openEditOnePost(postData.petId)" :icon="Edit"/>
                <el-button type="primary" @click="openDeleteOnePost(postData.petId)" :icon="Delete"/>
              </el-button-group>
            </div>
          </div>
        </template>
        <div style="display: flex;">
          <div>
            <el-image style="width: 170px; height: 170px;" v-bind:src="postData.picName"/>
          </div>
          <div style="margin-left: 50px; width: 100%; font-size: 14px; color: #606266;">
            <el-row :gutter="20">
              <el-col :span="12">联系人： {{ postData.contactsName }}</el-col>
              <el-col :span="12">联系电话： {{ postData.contactsPhone }}</el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">微信： {{ getWechat(postData.contactsWechat) }}</el-col>
              <el-col :span="12">邮件： {{ getEmail(postData.contactsEmail) }}</el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">是否免费：
                <el-tag v-if="postData.isFree===1">免费</el-tag>
                <el-tag v-else type="danger">付费</el-tag>
              </el-col>
              <el-col :span="12">宠物姓名： {{ getName(postData.petName) }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="24">领养地址： {{ postData.location }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-text line-clamp="2">
                  详细描述： {{ postData.text }}
                </el-text>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-card>
    </el-space>
    <div v-if="personalPostData.length===0">
      <router-link to="/index/publishAway" style="text-decoration: none">
        <div
            style="display: flex; align-items: center; justify-content: center; height: 288px; width: 288px; background: rgba(0, 0, 0, 0.02);">
          <div style="font-weight: bold; color: rgb(133, 133, 133);">
            <el-icon size="30">
              <Plus/>
            </el-icon>
            <div style="text-align: center">添加</div>
          </div>
        </div>
      </router-link>
      <el-empty description="暂无发帖"/>
    </div>
  </div>
</template>


<script setup>
import {ref} from 'vue'
import {get, post, takeAccId} from '@/api/request.js'
import {ElMessage, ElMessageBox} from "element-plus";
import {Delete, Edit, Plus} from "@element-plus/icons-vue";
import {useRouter} from 'vue-router'
import {getPetImageUrl} from '@/utils'

const getType = (petType) => {
  if (petType === 'other' || petType === '' || petType === null) {
    return '其他'
  }
  return petType === 'dog' ? '狗狗' : '猫猫'
}

const personalPostData = ref([])

const router = useRouter()

// 打开编辑一条宠物数据页面
const openEditOnePost = (petId) => {
  router.push({
    path: '/index/personalEditPost',
    query: {
      petId: petId
    }
  })
}

// 删除一条用户发布的宠物布告数据
const openDeleteOnePost = (petId) => {
  ElMessageBox.confirm(
      '此操作不可逆，你确定要删除吗?',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '手滑了',
        type: 'warning',
      }
  )
      .then(() => {
        post('/api/postBul/deletePostPB', {
          petId: petId,
          accId: takeAccId()
        }, () => {
          ElMessage.success('删除成功')
          getPots()
        }, (err) => {
          ElMessage.error(err)
        })
      })
      .catch(() => {
      })
}

// 获取用户发布的宠物数据
const getPots = () => {
  get('/api/postBul/getPostPB?id=' + takeAccId(), (data) => {
    for (let i = 0; i < data.length; i++) {
      data[i].picName = getPetImageUrl(data[i].picName)
    }
    personalPostData.value = data
    console.log(data)
  }, (err) => {
    ElMessage.error(err)
  })
}
getPots()


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
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>