<template>
  <div style="margin-top: 10px;">
    <ul style="list-style: none; padding: 0;margin: 0;">
      <li v-for="(pet, index) in petList" style="height: 140px;">
        <a style="display: flex;">
          <!-- 图片 -->
          <div style=" margin: 10px; font-size: 0;">
            <el-image fit='cover' style="width: 120px; height: 100% ; "
              src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" />
          </div>
          <!-- 介绍 -->
          <div style="flex: 1;">
            <h4>{{ pet.title }}</h4>
            <div style="width: 200px;">
              <!-- 时间 -->
              <el-text translate>
                {{ pet.gmtCreate }}
              </el-text>
              <!-- 地址 -->
              <el-row>
                <el-text truncated>
                  {{ pet.location }}
                </el-text>
              </el-row>

              <!-- 详细介绍 -->
              <el-text truncated>
                {{ pet.text }}
              </el-text>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const petList = ref([])

axios.get('/api/pet/getAll').then(res => {
  ElMessage.success(`已发送请求`)
  petList.value = res.data.data;
}).catch(err => {
  ElMessage.error(err)
})


</script>

<style scoped></style>
