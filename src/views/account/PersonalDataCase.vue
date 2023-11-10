<template>
  <div>
    <!--  封面  -->
    <div class="title"></div>

    <!--  主体  -->
    <div class="main">
      <!-- 头像 -->
      <div>
        <el-avatar shape="circle" :size="120" :fit=fill
                   v-bind:src="viewImgData?viewImgData:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                   alt="无法显示" style="transform:translateY(-20px) "/>
      </div>
      <!-- 资料-->
      <div style="padding-top: 24px; padding-bottom: 24px; flex: 1 1 0;">
        <!-- 昵称 编辑-->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 30px">
          <h1>{{personalData.nikename}}</h1>
          <el-button type="primary" :icon="Edit">编辑个人资料</el-button>
        </div>
      </div>
    </div>
    <div style="margin: 0 76px; padding-left: 220px;">
      <!-- 个人简介 -->
      <div class="">
        <el-text >{{personalData.location}}</el-text>
      </div>
      <!-- 个人信息 -->
      <div class="">
        <el-link :underline="false">查看个人资料</el-link>
      </div>
    </div>

    <!--    发帖 收藏-->
    <el-menu style=" margin: 50px 76px; padding: 0 72px; "
             router
             mode="horizontal"
    >
      <el-menu-item index="/personalData/post">发帖</el-menu-item>
      <el-menu-item index="/personalData/collect">收藏</el-menu-item>
    </el-menu>
    <div class="PRoC">
      <router-view></router-view>
    </div>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import {get} from '@/api/request.js'
import {ElMessage} from "element-plus";
import {takeUsername} from '@/api/request.js'
import {base64ToUrl} from '@/utils'
import {Edit} from "@element-plus/icons-vue";

// 图片数据
const viewImgData = ref('')
// 用户数据
const personalData = ref([])

// 获取当前登录者数据
get('/api/account?username=' + takeUsername(), (data) => {
  viewImgData.value = base64ToUrl(data.picData)
  personalData.value = data
}, (err) => {
  ElMessage.error(err)
})

</script>

<style>
.title {
  height: 100px;
  background-color: #333;
}

.main {
  height: 100px;
  background-color: #555;
  display: flex;
  margin: 0 76px;
  padding: 0 72px;
}

.PRoC {
  margin: 0 76px;
  padding: 0 72px;
}
</style>
