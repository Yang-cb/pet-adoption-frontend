<template>
  <div>
    <!--  封面  -->
    <div class="title"></div>

    <!--  主体  -->
    <div class="main">
      <!-- 头像 -->
      <div>
        <el-avatar shape="circle" :size="120" :fit=fill
                   v-bind:src="personalData.picName"
                   alt="无法显示" style="transform:translateY(-20px) "/>
      </div>
      <!-- 资料-->
      <div style="padding: 24px 0; flex: 1 1 0;">
        <!-- 昵称 编辑-->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 30px">
          <h1>{{ personalData.nikeName }}</h1>
          <el-button :icon="Edit" @click="openEdit(personalData.accountId)">编辑个人资料</el-button>
        </div>
        <!-- 签名 -->
        <div style="padding-left: 28px; font-size: 15px">{{ personalData.signature }}</div>
      </div>
    </div>
    <div style="margin: 15px 0 0 76px; padding-left: 220px;">
      <!-- 个人简介 -->
      <div>
        <el-text>{{ getLocation(personalData.location) }}</el-text>
      </div>
      <!-- 个人信息 -->
      <div class="">
        <el-link :underline="false" @click="detailsDr = true">查看个人资料</el-link>
      </div>
    </div>

    <!--    发帖 收藏-->
    <el-menu
        :default-active="$route.path"
        style="margin: 50px 76px; padding: 0 72px;"
        router
        mode="horizontal"
    >
      <el-menu-item index="post">发帖</el-menu-item>
      <el-menu-item index="collect">收藏</el-menu-item>
    </el-menu>
    <div class="PRoC">
      <router-view></router-view>
    </div>

  </div>

  <!-- 修改 -->
  <!-- direction抽屉出现位置 -->
  <el-drawer
      v-model="modifyDr"
      title="编辑个人资料"
      :before-close="handleClose"
      direction="rtl"
      :size="drWidth"
  >
    <div>
      <el-form :model="form" ref="modifyRef" :rules="rules" label-width="100px">
        <el-form-item label="昵称" prop="nikeName">
          <el-input minlength="2" maxlength="8" v-model="form.nikeName"/>
        </el-form-item>
        <el-form-item label="个性签名" prop="signature">
          <el-input maxlength="20" v-model="form.signature" placeholder="什么都没有留下..."/>
        </el-form-item>
        <div style="position: relative">
          <el-form-item label="居住地" prop="location">
            <el-input readonly v-model="form.location" placeholder="请输入详细地址，右侧可快速选择"/>
          </el-form-item>
          <el-cascader placeholder="请选择"
                       style="width: 0; position: absolute; top: 0; right: 44px;"
                       :options="options"
                       v-model="form.locationArr"
                       @change="locHandleChange(form.locationArr)">
          </el-cascader>
        </div>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio-button label="1">男</el-radio-button>
            <el-radio-button label="0">女</el-radio-button>
            <el-radio-button label="2">未知</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker v-model="form.birthday" type="date" placeholder="" style="width: 100%"/>
        </el-form-item>
      </el-form>
      <div style="margin-left: 50px">
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" :loading="loading"
                   @click="submitForm">{{ loading ? '提交中 ...' : '提交' }}
        </el-button>
      </div>
    </div>
  </el-drawer>

  <!-- 详细资料 -->
  <el-drawer v-model="detailsDr" :with-header="false"
             :size="drWidth" direction="ltr">
    <div class="title" style="margin: 0; padding: 0"></div>
    <div style="display: flex; justify-content: center; text-align: center; height: 220px">
      <!-- 头像，编辑资料 -->
      <div style="position: relative">
        <el-avatar shape="circle" :size="120" :fit=fill
                   v-bind:src="personalData.picName"
                   alt="无法显示" style="transform:translateY(-20px) "/>
        <!-- 修改头像 -->
        <el-button :icon="Edit" circle
                   style="position: absolute; bottom: 120px; right: 0"
                   @click="setAccPic = true"
        />
        <h4 style="margin: 10px 0">{{ personalData.nikeName }}</h4>
        <el-button @click="dToM">编辑个人资料</el-button>
      </div>
    </div>

    <div style="text-align:center;">
      <!-- 签名 -->
      <div style="margin-bottom: 25px">{{ personalData.signature }}</div>
      <!-- 地址 -->
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 40px">
        <el-icon>
          <Location/>
        </el-icon>
        <span style="margin-left: 2px">{{ getLocation(personalData.location) }}</span>
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
  <!-- 修改界面点击空白显示的对话框 -->
  <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="30%"
  >
    <span>你有未保存的变更</span>
    <template #footer>
      <span>
        <el-button @click="exitWithoutSave">不保存并关闭页面</el-button>
        <el-button type="primary" @click="saveAndExit">保存并关闭页面</el-button>
        <el-button @click="dialogVisible = false">返回编辑</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 修改头像对话框 -->
  <el-dialog v-model="setAccPic" title="修改头像" style="width: 500px;">
    <el-form :model="form">
      <el-form-item>
        <el-upload
            :limit="1"
            list-type="picture-card"
            :auto-upload="false"
            :action="''"
            show-file-list
            :on-exceed="handleExceed"
            :on-change="change"
        >
          <i class="el-icon-plus">+</i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="accPic" alt="">
        </el-dialog>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitAccPic">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref} from 'vue'
import {get, post} from '@/api/request.js'
import {ElMessage, ElDrawer} from "element-plus";
import {takeAccId} from '@/api/request.js'
import {strToDate, options, handleChange, getAccImageUrl} from '@/utils'
import {Edit, Location} from "@element-plus/icons-vue";

// 修改界面对话框
const openEdit = (accountId) => {
  get('/api/account?id=' + accountId, (data) => {
    form.value = data
    console.log(form.value)
  }, (err) => {
    ElMessage.error(err)
  })
  modifyDr.value = true
}

// 修改头像对话框是否显示
const setAccPic = ref(false)
// 回显图片
const accPic = ref('')
// 添加的图片
const dataList = ref('')

// 取消提交
const cancelSubmit = () => {
  dataList.value = null
  setAccPic.value = false
}

// 提交头像
const submitAccPic = () => {
  // formData格式
  const formData = new FormData();
  if (dataList.value.length === 0 || !dataList.value) {
    ElMessage.error('请上传图片');
    return false;
  }
  formData.append('file', dataList.value[0]);
  formData.append("id", takeAccId());
  formData.append("type", "acc")
  post('/api/account/updateAccPic', formData, (res) => {
    ElMessage.success('上传成功');
    // 返回值为图片对象
    accPic.value = getAccImageUrl(res.picName)
    location.reload();
  })
}

// 超出limit时触发的方法
const handleExceed = () => {
  ElMessage.warning('只能上传一个文件')
}

// 选中文件触发的change事件
const change = (file, fileList) => {
  // 限制文件后缀名
  const isJPG = file.raw.type === 'image/jpeg'
  const isPNG = file.raw.type === 'image/png'
  // 限制上传文件的大小
  const isLt3M = file.raw.size / 1024 / 1024 < 3
  if (!isPNG && !isJPG) {
    ElMessage.error('图片只能是 JPG/PNG 格式')
    return false
  } else if (!isLt3M) {
    ElMessage.error('图片应在3MB以内')
    return false
  } else {
    let arr = [];
    fileList.forEach((item) => {
      arr.push(item.raw);
    });
    dataList.value = arr;
    console.log(arr);
  }
}


const dialogVisible = ref(false)
// 修改界面点击空白显示对话框
const handleClose = () => {
  if (loading.value) {
    return
  }
  dialogVisible.value = true
}

// 保存并退出
const saveAndExit = () => {
  submitForm()
  dialogVisible.value = false
}

// 不保存并退出
const exitWithoutSave = () => {
  dialogVisible.value = false
  modifyDr.value = false
}

// 表单选择地址
const locHandleChange = (locArr) => {
  form.value.location = handleChange(locArr);
}

// 用户数据
const personalData = ref([])

// 获取当前登录者数据
const getAccount = () => {
  get('/api/account?id=' + takeAccId(), (data) => {
    data.picName = getAccImageUrl(data.picName)
    personalData.value = data
    console.log(personalData.value)
  }, (err) => {
    ElMessage.error(err)
  })
}
getAccount()

// 地区
const getLocation = (locationStr) => {
  if (locationStr === null || '')
    return '未知'
  return locationStr
}

// 性别
const getSex = (sexNum) => {
  if (sexNum === 2)
    return '未知'
  return sexNum === 1 ? '男' : '女'
}

// 登录者年龄
const getAge = (dateStr) => {
  if (dateStr === null || '')
    return '未知'
  return new Date().getFullYear() - strToDate(dateStr).getFullYear()
}

// 登录者生日
const getBirthday = (dateStr) => {
  if (dateStr === null || '')
    return '未知'
  let date = strToDate(dateStr);
  return date.getMonth() + 1 + '月' + date.getDate() + '日'
}

// 抽屉大小
const drWidth = '40%'
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

const form = ref({
  nikeName: '', // 昵称
  signature: '', // 签名
  locationArr: [], // 地址数组
  location: '', //地区
  sex: '', // 性别
  birthday: '' // 出生日期
})

const modifyRef = ref()

const rules = {
  nikeName: [
    {required: true, message: '请输入昵称', trigger: 'change'},
    {min: 2, max: 8, message: '昵称应在2-8个字符之间', trigger: 'blur'},
    {
      pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,8}$/,
      message: '昵称只能是由2-8位中文、英文、数字或下划线组成',
      trigger: 'blur'
    }
  ],
  signature: [
    {max: 20, message: '签名应在20个字符以内', trigger: 'blur'}
  ],
  sex: [
    {required: true, message: '请选择性别', trigger: 'change'},
    {pattern: /^[0-2]$/, message: '请选择正确的性别', trigger: 'change'}
  ],
  birthdate: [
    {type: 'date', message: '请输入正确的出生日期', trigger: 'change'}
  ],
  location: [
    {required: true, message: '请输入详细地址', trigger: 'change'},
    {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'blur'}
  ],
}

const submitForm = async () => {
  await modifyRef.value.validate((valid) => {
        if (valid) {
          loading.value = true
          timer = setTimeout(() => {
            // 动画关闭需要一定的时间
            setTimeout(() => {
              loading.value = false
            }, 400)
          }, 2000)
          post('/api/account/updateAccountById', {
            id: takeAccId(),
            nikeName: form.value.nikeName,
            signature: form.value.signature === '' ? '什么都没有留下...' : form.value.signature,
            location: form.value.location === '' ? '未知' : form.value.location,
            sex: form.value.sex,
            birthday: form.value.birthday
          }, () => {
            ElMessage.success('修改成功')
            modifyDr.value = false
            getAccount()
          }, (msg) => {
            ElMessage.error(msg)
          })
        }
      }
  )
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
