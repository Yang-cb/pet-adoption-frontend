<template>
  <el-row style="margin: 20px 100px">
    <el-col v-for="(want ,index) in personalWantData" :key="want.petId"
            :span="11" :offset="(index % 2) === 0 ? 0 : 2"
            style="margin-bottom: 8px">
      <el-card shadow="hover">
        <template #header>
          <div style=" display: flex; justify-content: space-between; height: 40px;">
            <div>
              <p style="font-size: 18px; font-weight: bold">请求人信息</p>
            </div>
            <!-- 按钮组/操作结果 -->
            <div style="margin-top: 20px">
              <el-button-group v-if="want.wantStatus===1">
                <el-button @click="controls(want.wantId, 3)" type="primary">同意</el-button>
                <el-button @click="controls(want.wantId, 4)" type="danger">拒绝</el-button>
              </el-button-group>
              <el-tag type="success" v-if="want.wantStatus===3">
                您已同意
              </el-tag>
              <el-tag type="danger" v-if="want.wantStatus===4">
                您已拒绝
              </el-tag>
            </div>
          </div>
        </template>
        <div style="display: flex">
          <div style="width: 100%;">
            <el-form :model="want" label-width="80px">
              <el-form-item label="详细地址">
                <el-input readonly v-model="want.wantContactsLocation"/>
              </el-form-item>
              <el-form-item label="联系人">
                <el-input readonly v-model="want.wantContactsName"/>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input readonly v-model="want.wantContactsPhone"/>
              </el-form-item>
              <el-form-item label="微信号">
                <el-input readonly v-model="want.wantContactsWechat"/>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input readonly v-model="want.wantContactsEmail"/>
              </el-form-item>
              <el-form-item label="领养条件">
                <el-input type="textarea" readonly v-model="want.wantText"/>
              </el-form-item>
            </el-form>
            <div style="display: flex; justify-content: right;">
              <el-button @click="handleAdopt2visible(want.wantId)">查看宠物信息</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <el-dialog v-model="handleAdoptVisible" title="宠物信息" style="position: relative;">
    <div style="display:flex;  margin-bottom: 20px">
      <div style="margin: auto">
        <el-image style="width: 170px; height: 170px;" v-bind:src="personalWantOneData.picName"/>
        <div style="text-align: center; font-size: 18px; font-weight: bold">{{ personalWantOneData.title }}</div>
      </div>
    </div>
    <div style="margin: 0 60px">
      <el-row :gutter="20">
        <el-col :span="12">宠物类型： {{ getType(personalWantOneData.petType) }}</el-col>
        <el-col :span="12">宠物性别： {{ personalWantOneData.sex === 1 ? '公' : '母' }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">宠物姓名： {{ getName(personalWantOneData.petName) }}</el-col>
        <el-col :span="12">是否免费：
          <el-tag v-if="personalWantOneData.isFree===1" size="small">免费</el-tag>
          <el-tag v-else type="danger" size="small">付费</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-text line-clamp="2">
            详细介绍： {{ personalWantOneData.text }}
          </el-text>
        </el-col>
      </el-row>
    </div>
    <div style="position: absolute; right: 0; bottom: 0">
      <el-button @click="petData(personalWantOneData.petId)">前往详情页
        <el-icon>
          <ArrowRight/>
        </el-icon>
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import {put, get, takeAccId} from "@/api/request";
import {ElMessage, ElMessageBox} from "element-plus";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {getPetImageUrl} from "@/utils";
import {ArrowRight} from "@element-plus/icons-vue";

// 更新领养状态
const controls = (wantId, status) => {
  ElMessageBox.confirm(
      `同意/拒绝后不能撤销，你确定要"${status === 3 ? '同意' : '拒绝'}"吗?`,
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '手滑了',
        type: 'warning',
      }
  ).then(() => {
    put('/api/wantAdopt/updateWantAdoptStatus', {
      // 发布宠物布告的账号id
      accountId: takeAccId(),
      wantId: wantId,
      wantStatus: status
    }, () => {
      ElMessage.success('操作成功')
      getReceiveWant()
    }, (err) => {
      ElMessage.error(err)
    })
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 查看宠物信息
const personalWantOneData = ref('')
const handleAdoptVisible = ref(false)
const handleAdopt2visible = (wantId) => {
  // 根据wantId读取宠物信息
  for (let i = 0; i < personalWantData.value.length; i++) {
    if (wantId === personalWantData.value[i].wantId) {
      personalWantOneData.value = personalWantData.value[i]
    }
  }
  handleAdoptVisible.value = true
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

// 获取收到的想领养信息
const personalWantData = ref([])
const getReceiveWant = () => {
  get('/api/wantAdopt/getReceiveWantAdopt?accountId=' + takeAccId(), (data) => {
    for (let i = 0; i < data.length; i++) {
      data[i].picName = getPetImageUrl(data[i].picName)
    }
    personalWantData.value = data
    console.log(data)
  }, (err) => {
    ElMessage.error(err)
  })
}
getReceiveWant()

// 宠物类型
const getType = (petType) => {
  if (petType === 'other' || petType === '' || petType === null) {
    return '其他'
  }
  return petType === 'dog' ? '狗狗' : '猫猫'
}

// 宠物姓名
const getName = (name) => {
  if (name === null || name === '')
    return '未知'
  return name
}
</script>

<style scoped>
.o_table tbody tr td {
  padding: 2px 50px;
}

.o_table tbody tr td:first-child {
  font-weight: bold;
}

.el-row {
  margin-bottom: 10px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>