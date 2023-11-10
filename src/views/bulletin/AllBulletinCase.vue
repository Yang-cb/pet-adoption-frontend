<template>
  <div style="margin-top: 10px;">
    <ul style="list-style: none; padding: 0;margin: 0;">
      <li v-for="(pb) in pBList" style="height: 140px;">
        <a style="display: flex;">
          <!-- 图片 -->
          <div style=" margin: 10px; font-size: 0;">
            <el-image fit='cover' style="width: 120px; height: 100% ; "
                      src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"/>
          </div>
          <!-- 标题 -->
          <div style="flex: 1;">
            <h4>{{ pb.title }}</h4>
            <!-- 发布时间 -->
            <el-text>
              <el-icon>
                <Calendar/>
              </el-icon>
              {{ pb.gmtModified }}
            </el-text>
            <div style="width: 200px;">
              <!-- 领养地址 -->
              <el-text truncated>
                <el-icon>
                  <Location/>
                </el-icon>
                {{ pb.location }}
              </el-text>
            </div>
            <div style="width: 300px;">
              <!-- 详细介绍 -->
              <el-text truncated>
                {{ pb.text }}
              </el-text>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {Calendar, Location} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus';
import {get} from '@/api/request.js'

const pBList = ref([])

// 获取数据
get('/api/pet/getAllPB', (data) => {
  pBList.value = data
}, (err) => {
  ElMessage.error(err)
})

</script>

<style scoped></style>
