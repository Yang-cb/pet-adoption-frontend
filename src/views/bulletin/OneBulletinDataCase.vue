<template>
  <div>
    <!--  主体  -->
    <div class="b_main">
      <div>
        <h1>{{ pBData.title }}</h1>
      </div>
      <el-row>
        <el-col :span="12">
          <!-- 图片 -->
          <div style="width: 300px;height: 300px">
            <el-image style="width: 100%" v-bind:src="pBData.picName" >
              <template #error>
                <div style="width: 100%;height: 100%">
                  <el-icon>
                    <icon-picture/>
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>
        </el-col>
        <el-col :span="12">
          <!-- 资料 -->
          <div>
            <p>{{ pBData.isFree === 1 ? '免费领养' : '收费' }}</p>
            <p>发布时间：{{ pBData.gmtModified }}</p>
            <p>宠物种类：{{ getType(pBData.petType) }}({{ pBData.petSex === 1 ? '公' : '母' }})</p>
            <p>领养地点：{{ pBData.location }}</p>
            <p>联系人：{{ pBData.contactsName }}</p>
            <p>联系电话：{{ pBData.contactsPhone }}</p>
            <p>微信号：{{ pBData.contactsWechat }}</p>
            <p>电子邮件：{{ pBData.contactsEmail }}</p>
          </div>

          <div>
            <div>
              <el-button @click="collectPB">点击收藏</el-button>
            </div>
            <div>
              <el-button @click="cancelCollectPB">取消收藏</el-button>
            </div>
          </div>
          <el-button>我想领养它</el-button>
        </el-col>
      </el-row>
      <!-- 详细介绍 -->
      <div class="b_text">
        {{ pBData.text }}
        <p style="color: red">安全提示：请不要相信任何需要金钱交易的无偿领养！例如宠物免费，骗取运费等常见骗术！</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {get, post, takeAccId} from '@/api/request.js'
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {Picture as IconPicture} from '@element-plus/icons-vue'
import {ref} from "vue";
import {base64ToUrl, getImageUrl} from "@/utils";

const pBData = ref([])


// 收藏
const collectPB = () => {
  post('/api/account/collectPB', {
    accId: takeAccId(),
    petId: route.query.petId
  }, () => {
    ElMessage.success('收藏成功')
  }, (err) => {
    ElMessage.error(err)
  })
}
// 取消收藏
const cancelCollectPB = () => {
  post('/api/account/cancelCollectPB', {
    accId: takeAccId(),
    petId: route.query.petId
  }, () => {
    ElMessage.success('取消收藏成功')
  }, (err) => {
    ElMessage.error(err)
  })
}
// 种类
const getType = (petType) => {
  if (petType === 'other' || petType === '' || petType === null) {
    return '其他'
  }
  return petType === 'dog' ? '狗狗' : '猫猫'
}

const collectAccIds = []

// TODO 该用户是否已收藏该宠物
const isCollect = (collectAccIds) => {
  console.log('collectAccIds='+ collectAccIds)
  let id = takeAccId();
  return collectAccIds.indexOf(id)
}

// 获取跳转页面传来的数据
const route = useRoute();
get('/api/pet/getPBByPetId?petId=' + route.query.petId, (data) => {
  data.picName = getImageUrl(data.picName)
  console.log(data)
  pBData.value = data
}, (err) => {
  ElMessage.error(err)
})
</script>

<style>
.b_main {
  height: 100px;
  margin: 0 76px;
  padding: 0 72px;
}

.b_text {
  height: 300px;
  padding: 28px;
  font-size: 15px;
  margin-top: 50px;
  box-shadow: var(--el-box-shadow-light);
}
</style>