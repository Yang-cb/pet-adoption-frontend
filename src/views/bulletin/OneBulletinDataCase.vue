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
            <el-image style="width: 100%" v-bind:src="pBData.picName">
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
            <el-tag v-if="pBData.isFree===1" style="font-size: 14px">免费</el-tag>
            <el-tag v-else type="danger" style="font-size: 14px">付费</el-tag>
            <span v-if="pBData.isFree===1" style="color: brown">【免费领养不要相信任何费用先付的骗术】</span>
            <p class="text"><span class="icon"><el-icon><Calendar/></el-icon></span>
              发布时间：{{ pBData.gmtModified }}
            </p>
            <p class="text"><span class="icon"><el-icon><Postcard/></el-icon></span>
              宠物种类：{{ getType(pBData.petType) }}({{ pBData.petSex === 1 ? '公' : '母' }})
            </p>
            <p class="text"><span class="icon"><el-icon><Location/></el-icon></span>
              领养地点：{{ pBData.location }}
            </p>
            <p class="text"><span class="icon"><el-icon><User/></el-icon></span>
              联系人：{{ pBData.contactsName }}
            </p>
            <p class="text"><span class="icon"><el-icon><Phone/></el-icon></span>
              联系电话：{{ pBData.contactsPhone }}
            </p>
            <p class="text"><span class="icon"><el-icon><ChatDotRound/></el-icon></span>
              微信号：{{ getWechat(pBData.contactsWechat) }}
            </p>
            <p class="text"><span class="icon"><el-icon><Message/></el-icon></span>
              电子邮件：{{ getEmail(pBData.contactsEmail) }}
            </p>
          </div>

          <!-- 收藏 -->
          <!-- 根据用户是否已经收藏该宠物，决定展示哪个图标 -->
          <div>
            <span class="icon"><el-icon><Star/></el-icon></span>
            <!-- 收藏 -->
            <el-button v-show="!isCollect" type="text" @click="collectPB" class="bu_text">
              {{ !collect ? '点击收藏' : '取消收藏' }}
            </el-button>
            <!-- 取消收藏 -->
            <el-button v-show="isCollect" type="text" style="margin-left: 3px;" @click="collectPB" class="bu_text">
              {{ collect ? '点击收藏' : '取消收藏' }}
            </el-button>
          </div>
          <div>
            <span class="icon"><el-icon><Plus/></el-icon></span>
            <el-button type="text" class="bu_text">我想领养它</el-button>
          </div>
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
import {
  Calendar,
  ChatDotRound,
  Location, Message, Phone,
  Picture as IconPicture, Plus,
  Postcard,
  Star,
  User
} from '@element-plus/icons-vue'
import {ref} from "vue";
import {getPetImageUrl} from "@/utils";

const pBData = ref([])

const collect = ref(false)

// 收藏/取消收藏
const collectPB = () => {
  post('/api/acc2pic/collectPB', {
    accId: takeAccId(),
    petId: route.query.petId
  }, (msg) => {
    ElMessage.success(msg)
    collect.value = !collect.value
  }, (err) => {
    ElMessage.error(err)
  })
}

// 获取跳转页面传来的数据
const route = useRoute();
get('/api/pet/getPBByPetId?petId=' + route.query.petId, (data) => {
  data.picName = getPetImageUrl(data.picName)
  console.log(data)
  pBData.value = data
}, (err) => {
  ElMessage.error(err)
})

// 该用户是否已收藏该宠物
const isCollect = ref(false)
const getIsCollect = () => {
  get('/api/acc2pic/isCollect?accId=' + takeAccId() + '&petId=' + route.query.petId, (data) => {
    isCollect.value = data
  }, (err) => {
    console.log(err)
  })
}
getIsCollect()

// 种类
const getType = (petType) => {
  if (petType === 'other' || petType === '' || petType === null) {
    return '其他'
  }
  return petType === 'dog' ? '狗狗' : '猫猫'
}

// 微信
const getWechat = (wechat) => {
  if (wechat === null || wechat === '')
    return '未知'
  return wechat
}

// 邮箱
const getEmail = (email) => {
  if (email === null || email === '')
    return '未知'
  return email
}
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

.icon {
  margin-right: 10px;
  vertical-align: middle;
}

.text {
  margin: 10px 0;
  font-size: 16px;
}

.bu_text {
  color: black;
  font-size: 16px;
  margin-left: 3px;
  margin-bottom: 3px;
}
</style>