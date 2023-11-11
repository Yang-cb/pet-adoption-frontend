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
          <h1>{{ personalData.nikename }}</h1>
          <el-button :icon="Edit" @click="modifyDr = true">编辑个人资料</el-button>
        </div>
      </div>
    </div>
    <div style="margin: 0 76px; padding-left: 220px;">
      <!-- 个人简介 -->
      <div class="">
        <el-text>{{ personalData.location }}</el-text>
      </div>
      <!-- 个人信息 -->
      <div class="">
        <el-link :underline="false" @click="detailsDr = true">查看个人资料</el-link>
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

  <!-- 修改 -->
  <!-- direction抽屉出现位置 -->
  <el-drawer
      ref="modifyRef"
      v-model="modifyDr"
      title="编辑个人资料"
      :before-close="handleClose"
      direction="rtl"
      :size="drWidth"
  >
    <div>
      <el-form :model="form">
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="Area" :label-width="formLabelWidth">
          <el-select
              v-model="form.region"
              placeholder="Please select activity area"
          >
            <el-option label="Area1" value="shanghai"/>
            <el-option label="Area2" value="beijing"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onClick">{{
            loading ? '提交中 ...' : '提交'
          }}
        </el-button>
      </div>
    </div>
  </el-drawer>

  <!-- 详细资料 -->
  <el-drawer v-model="detailsDr" :with-header="false"
             :size="drWidth" direction="ltr">
    <div style="display: flex; justify-content: center; text-align: center; height: 225px">
      <!-- 头像，编辑资料 -->
      <div>
        <el-avatar shape="circle" :size="120" :fit=fill
                   v-bind:src="viewImgData?viewImgData:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                   alt="无法显示"/>
        <h4 style="margin: 10px 0">{{ personalData.nikename }}</h4>
        <el-button @click="dToM">编辑个人资料</el-button>
      </div>
    </div>

    <div style="text-align:center;">
      <!-- 地址 -->
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 40px">
        <el-icon>
          <Location/>
        </el-icon>
        <span style="margin-left: 2px">{{ personalData.location }}</span>
      </div>
      <!-- 分割线 -->
      <el-divider content-position="left">you're so cute</el-divider>
      <!-- 其他 -->
      <div style="display: flex;justify-content: center">
        <table class="o_table">
          <tbody>
          <tr>
            <td class="text">性别</td>
            <td class="text">{{ getSex(personalData.sex) }}</td>
          </tr>
          <tr>
            <td class="text">年龄</td>
            <td class="text">{{ getAge(personalData.birthday) }}</td>
          </tr>
          <tr>
            <td class="text">生日</td>
            <td class="text">{{ getBirthday(personalData.birthday) }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {get} from '@/api/request.js'
import {ElMessage, ElDrawer, ElMessageBox} from "element-plus";
import {takeUsername} from '@/api/request.js'
import {base64ToUrl, strToDate} from '@/utils'
import {Edit, Location} from "@element-plus/icons-vue";

// 图片数据
const viewImgData = ref('')
// 用户数据
const personalData = ref([])

// 获取当前登录者数据
get('/api/account?username=' + takeUsername(), (data) => {
  viewImgData.value = base64ToUrl(data.picData)
  console.log(new Date(data.birthday).getFullYear())
  personalData.value = data
  console.log(data)
}, (err) => {
  ElMessage.error(err)
})

// 性别
const getSex = (sexNum) => {
  if (sexNum === null)
    return '未知'
  return sexNum === 1 ? '男' : '女'
}

// 登录者年龄
const getAge = (dateStr) => {
  if (dateStr === null)
    return '未知'
  return new Date().getFullYear() - strToDate(dateStr).getFullYear()
}

// 登录者生日
const getBirthday = (dateStr) => {
  if (dateStr === null)
    return '未知'
  let date = strToDate(dateStr);
  return date.getMonth() + 1 + '月' + date.getDate() + '日'
}

// 抽屉大小
const drWidth = '40%'
// 表单label大小
const formLabelWidth = '80px'
// 关闭抽屉动画时间
let timer

// 修改资料抽屉
const modifyDr = ref(false)
const loading = ref(false)
// 详细资料抽屉
const detailsDr = ref(false)
// 在详细里点修改资料
const dToM = () => {
  detailsDr.value = false
  modifyDr.value = true
}

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const modifyRef = ref([])
const onClick = () => {
}

const handleClose = (done) => {
  if (loading.value) {
    return
  }
  ElMessageBox.confirm('你想要提交吗?')
      .then(() => {
        loading.value = true
        timer = setTimeout(() => {
          done()
          // 动画关闭需要一定的时间
          setTimeout(() => {
            loading.value = false
          }, 400)
        }, 2000)
      })
      .catch(() => {
        // catch error
      })
}

const cancelForm = () => {
  loading.value = false
  modifyDr.value = false
  clearTimeout(timer)
}

</script>

<style>
.title {
  height: 100px;
  background-color: #333;
}

.main {
  height: 100px;
  display: flex;
  margin: 0 76px;
  padding: 0 72px;
}

.PRoC {
  margin: 0 76px;
  padding: 0 72px;
}

.o_table tbody tr td {
  padding: 2px 50px;
}

.o_table tbody tr td:first-child {
  font-weight: bold;
}
</style>
