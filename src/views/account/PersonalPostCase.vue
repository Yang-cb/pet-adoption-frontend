<template>
  <router-view/>
  <div v-show="$route.meta.showFooter">
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
                <el-button :type="getTagType(postData.bulletinStatus)">
                  {{ getBulletinStatus(postData.bulletinStatus) }}
                </el-button>
                <el-button type="primary" @click="openEditOnePost(postData.bulletinStatus,postData.petId)">
                  <el-icon>
                    <Edit/>
                  </el-icon>
                </el-button>
                <el-button type="primary" @click="openDeleteOnePost(postData.petId)">
                  <el-icon>
                    <Delete/>
                  </el-icon>
                </el-button>
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
    <!-- 如果没有帖子显示内容 -->
    <div v-if="personalPostData.length===0">
      <router-link to="/index/publish/publishAway" style="text-decoration: none">
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
import {ref, watch} from 'vue'
import {get, post, takeAccId} from '@/api/request.js'
import {ElMessage, ElMessageBox} from "element-plus";
import {Delete, Edit, Plus} from "@element-plus/icons-vue";
import {useRouter, useRoute} from 'vue-router'
import {getPetImageUrl} from '@/utils'

const router = useRouter()
const route = useRoute()

// 修改后刷新
watch(() => router.currentRoute.value, () => {
  if (route.path === '/index/personalData/post') {
    getPots()
  }
})

const personalPostData = ref([])
// 打开编辑一条宠物数据页面
const openEditOnePost = (bulletinStatus, petId) => {
  if (bulletinStatus === 0) {
    ElMessage.warning('该宠物布告还未审核，无法修改')
    return
  }
  router.push({
    path: '/index/personalData/post/personalEditPost',
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

// 宠物类型
const getType = (petType) => {
  if (petType === 'other' || petType === '' || petType === null) {
    return '其他'
  }
  return petType === 'dog' ? '狗狗' : '猫猫'
}

// 获取状态
const getBulletinStatus = (bulletinStatus) => {
  switch (bulletinStatus) {
    case 0:
      return '待审核'
    case 1:
      return '已通过'
    case 2:
      return '未通过'
  }
}

// 获取状态颜色
const getTagType = (bulletinStatus) => {
  switch (bulletinStatus) {
    case 0:
      return 'info'
    case 1:
      return 'success'
    case 2:
      return 'danger'
  }
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