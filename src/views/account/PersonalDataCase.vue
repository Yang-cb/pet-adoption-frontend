<template>
  <div>
    <!--    封面-->
    <div class="title" style="height: 100px; background-color: #333;"></div>


    <div class="tou x" style="height: 100px; background-color: #555; display: inline-flex">
      <!-- 头像-->
      <div class="avatar">
        <el-avatar shape="circle" :size="130" :fit=fill v-bind:src="viewImgData" alt="无法显示"
        />
      </div>
      <!-- 资料-->
      <div style="padding-top: 24px;padding-bottom: 24px;flex: 1 1 0;">
        <div>
          <!-- 昵称 编辑-->
          <div style="display: flex;grid-template-columns: 1fr auto;">
            <h1>昵称</h1>
            <div style="float: right">
              <el-button>编辑个人资料</el-button>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!--    查看个人资料 按钮-->
    <div class=""></div>

    <!--    发帖 收藏-->
    <div></div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {get} from '@/api/request.js'
import {ElMessage} from "element-plus";
import {takeUsername} from '@/api/request.js'
import {base64ToUrl} from '@/utils/imgSwitch.js'

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
</style>
