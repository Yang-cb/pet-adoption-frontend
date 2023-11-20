<template>
  <div style="margin-top: 10px;">
    <ul style="list-style: none; padding: 0;margin: 0; ">
      <li v-for="(pb) in pBList" style="width: 100% ;height: 140px; ">
        <a @click="petData(pb.petId)" style="display: flex;">
          <!-- 图片 -->
          <div style=" margin: 10px; font-size: 0;">
            <el-image fit='cover' style="width: 120px; height: 100% ; "
                      v-bind:src="pb.picName"/>
          </div>
          <!-- 标题 -->
          <div style="flex: 1;">
            <h4>{{ pb.title }}</h4>
            <div>
              <el-tag>{{ getType(pb.getType) }}</el-tag>
              <el-tag v-if="pb.isFree===1">免费</el-tag>
              <el-tag v-else type="danger">付费</el-tag>
              <!-- 发布时间 -->

              <el-text>
                <el-icon>
                  <Calendar/>
                </el-icon>
                {{ pb.gmtCreate }}
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
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {Calendar, Location} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {get} from '@/api/request.js'
import {getPetImageUrl} from '@/utils'
import {useRouter} from 'vue-router'

const getType = (petType) => {
  if (petType === 'other' || petType === '' || petType === null) {
    return '其他'
  }
  return petType === 'dog' ? '狗狗' : '猫猫'
}

// 跳转页面并传递petId
const router = useRouter();
const petData = (petId) => {
  router.push({
    path: 'onePBData',
    query: {
      petId: petId
    }
  })
}

const pBList = ref([])

// 获取数据
get('/api/pet/getAllPB', (data) => {
  for (let i = 0; i < data.length; i++) {
    data[i].picName = getPetImageUrl(data[i].picName)
  }
  console.log(data)
  pBList.value = data
}, (err) => {
  ElMessage.error(err)
})

</script>

<style scoped></style>
