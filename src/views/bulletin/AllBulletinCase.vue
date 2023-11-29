<template>
  <div style="margin-top: 20px; margin-bottom: 100px">
    <div>
      <div>
        <el-affix :offset="120">
          <el-button type="primary">Offset top 120px</el-button>
        </el-affix>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0; width: 70%;">
        <li v-for="(pb, index) in pBList" :key="pb.petId"
            v-show="currentPage * pageSize >= index + 1 && (currentPage - 1) * pageSize < index + 1"
            @click="petData(pb.petId)"
            style="height: 140px;">
          <div style="display: flex;">
            <!-- 图片 -->
            <div style="margin: 10px; font-size: 0;">
              <el-image fit='cover' style="width: 120px; height: 100%;"
                        v-bind:src="pb.picName"/>
            </div>
            <!-- 标题 -->
            <div style="flex: 1;">
              <h4>{{ pb.title }}</h4>
              <div>
                <div>
                  <el-tag>{{ getType(pb.getType) }}</el-tag>
                  <!-- 发布时间 -->
                  <el-text>
                    <el-icon>
                      <Calendar/>
                    </el-icon>
                    {{ pb.gmtCreate }}
                  </el-text>
                </div>
                <div style="display: flex">
                  <el-tag v-if="pb.isFree===1">免费</el-tag>
                  <el-tag v-else type="danger">付费</el-tag>
                  <div style="width: 200px;">
                    <!-- 领养地址 -->
                    <el-text truncated>
                      <el-icon>
                        <Location/>
                      </el-icon>
                      {{ pb.location }}
                    </el-text>
                  </div>
                </div>
                <div style="width: 300px;">
                  <!-- 详细介绍 -->
                  <el-text truncated>
                    {{ pb.text }}
                  </el-text>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 分页 -->
    <div>
      <!-- 中文包 -->
      <el-config-provider :locale="zhCn">
        <!--
        layout：显示内容
        :current-page：当前页
        :page-sizes：选择每页显示多少条数据
        :page-size：每页多少条数据
        :total：总共多少条数据
        @size-change：每页显示多少条数据改变时触发
        @current-change：当前页改变时触发
         -->
        <el-pagination
            layout="sizes, prev, pager, next, jumper, total"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15]"
            :page-size="pageSize"
            :total="pBList.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-config-provider>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {Calendar, Location} from '@element-plus/icons-vue'
import {ElMessage, ElConfigProvider} from 'element-plus'
import {get} from '@/api/request.js'
import {getPetImageUrl} from '@/utils'
import {useRouter} from 'vue-router'
// 中文包
import zhCn from 'element-plus/es/locale/lang/zh-cn';

// 第几页，默认1
const currentPage = ref(1)

// 每页的数据数，默认5
const pageSize = ref(5)

// 每页多少条数据
const handleSizeChange = (size) => {
  pageSize.value = size;
}

// 前往第几页
const handleCurrentChange = (page) => {
  currentPage.value = page;
}

// 跳转页面并传递petId
const router = useRouter();
const petData = (petId) => {
  router.push({
    path: '/index/onePBData',
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

// 宠物类型
const getType = (petType) => {
  if (petType === 'other' || petType === '' || petType === null) {
    return '其他'
  }
  return petType === 'dog' ? '狗狗' : '猫猫'
}
</script>

<style scoped>
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
